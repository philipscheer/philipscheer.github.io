import type { SkillTree } from '@/content/game/types';
import type { ZonePalette } from '@/content/game';

export interface EngineZone {
  year: string;
  company: string;
  skillTrees: SkillTree[]; // one entry per collectible skill
  hasBoss: boolean;
  bossName: string;
}

export interface EngineCallbacks {
  onSkillTouch(zone: number, skill: number): void;
  onBossRange(zone: number, inRange: boolean): void;
  onBossInteract(zone: number): void;
  onZoneChange(zone: number): void;
  onFinish(): void;
}

/**
 * All world units are VIRTUAL pixels. The scene is drawn on a low-resolution
 * offscreen canvas and upscaled with nearest-neighbor for an authentic
 * pixel-art look; text is drawn on the main canvas at full resolution.
 */
export const ZONE_WIDTH = 512;
const PIX = 3; // screen pixels per virtual pixel
const SPEED = 92;
const GRAVITY = 780;
const JUMP_V = 255;
const BOSS_RANGE = 58;
const ORB_TOUCH = 12;

const TREE_COLORS: Record<SkillTree, { base: string; light: string; dark: string }> = {
  dev: { base: '#38bdf8', light: '#a5e3ff', dark: '#1873a8' },
  mgmt: { base: '#f59e0b', light: '#ffd47a', dark: '#a86408' },
  biz: { base: '#34d399', light: '#96f3cd', dark: '#1d8a63' },
};

const OUTLINE = '#10131a';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbStr(c: [number, number, number]) {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function shade(hex: string, f: number): string {
  const c = hexToRgb(hex);
  if (f >= 0) return rgbStr(lerpRgb(c, [255, 255, 255], f));
  return rgbStr(lerpRgb(c, [8, 10, 16], -f));
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

interface Orb {
  x: number;
  tree: SkillTree;
  collected: boolean;
}

interface BlendedPalette {
  skyTop: [number, number, number];
  skyBottom: [number, number, number];
  ground: string;
  groundTop: string;
  building: string;
}

export class CareerQuestEngine {
  private _paused = true;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private off: HTMLCanvasElement;
  private octx: CanvasRenderingContext2D;
  private zones: EngineZone[];
  private palettes: ZonePalette[];
  private cb: EngineCallbacks;

  private raf = 0;
  private last = 0;
  private t = 0;
  private w = 0; // main canvas CSS px
  private h = 0;
  private vw = 0; // virtual px
  private vh = 0;
  private dpr = 1;
  private groundY = 0; // virtual px
  private worldW: number;
  private dirty = true;

  private player = { x: 52, yOff: 0, vy: 0, dir: 1 as 1 | -1, move: 0 as -1 | 0 | 1, onGround: true };
  private orbs: Orb[][] = [];
  private bossX: number[] = [];
  private defeated: boolean[] = [];
  private bossFade: number[] = [];
  private curZone = -1;
  private bossRangeZone = -1;
  private finished = false;
  private reduced = false;
  private ro: ResizeObserver | null = null;
  private destroyed = false;

  constructor(
    canvas: HTMLCanvasElement,
    zones: EngineZone[],
    palettes: ZonePalette[],
    cb: EngineCallbacks
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;
    this.off = document.createElement('canvas');
    const octx = this.off.getContext('2d');
    if (!octx) throw new Error('Canvas 2D not supported');
    this.octx = octx;
    this.zones = zones;
    this.palettes = palettes;
    this.cb = cb;
    this.worldW = zones.length * ZONE_WIDTH;

    zones.forEach((z, zi) => {
      const n = z.skillTrees.length;
      const start = zi * ZONE_WIDTH + 118;
      const span = ZONE_WIDTH - 262;
      const orbs: Orb[] = z.skillTrees.map((tree, i) => ({
        x: start + (n > 1 ? (span / (n - 1)) * i : span / 2),
        tree,
        collected: false,
      }));
      this.orbs.push(orbs);
      this.bossX.push(zi * ZONE_WIDTH + ZONE_WIDTH - 86);
      this.defeated.push(!z.hasBoss);
      this.bossFade.push(z.hasBoss ? 1 : 0);
    });

    if (typeof window !== 'undefined') {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  get paused() {
    return this._paused;
  }

  set paused(v: boolean) {
    if (this._paused !== v) {
      this._paused = v;
      this.dirty = true;
    }
  }

  start() {
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.canvas.parentElement ?? this.canvas);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  setMove(dir: -1 | 0 | 1) {
    this.player.move = dir;
    if (dir !== 0) this.player.dir = dir;
  }

  jump() {
    if (this.player.onGround && !this._paused) {
      this.player.vy = -JUMP_V;
      this.player.onGround = false;
    }
  }

  interact() {
    if (this.bossRangeZone >= 0 && !this.defeated[this.bossRangeZone]) {
      this.cb.onBossInteract(this.bossRangeZone);
    }
  }

  markBossDefeated(zone: number) {
    this.defeated[zone] = true;
    if (this.bossRangeZone === zone) {
      this.bossRangeZone = -1;
      this.cb.onBossRange(zone, false);
    }
    this.dirty = true;
  }

  /** Re-apply saved progress (used for localStorage restore and dev remounts). */
  restoreState(collected: Set<string>, defeated: Set<number>) {
    this.orbs.forEach((zone, zi) =>
      zone.forEach((o, si) => {
        if (collected.has(`${zi}:${si}`)) o.collected = true;
      })
    );
    defeated.forEach((z) => {
      if (z >= 0 && z < this.defeated.length) {
        this.defeated[z] = true;
        this.bossFade[z] = 0;
      }
    });
    this.dirty = true;
  }

  teleport(zone: number) {
    this.player.x = zone * ZONE_WIDTH + 54;
    this.player.yOff = 0;
    this.player.vy = 0;
    this.player.onGround = true;
    if (zone < this.zones.length - 1) this.finished = false; // re-arm the finale
    this.dirty = true;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (this._paused) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(e.key)) e.preventDefault();
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.setMove(-1);
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.setMove(1);
    else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.jump();
    else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') this.interact();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key) && this.player.move === -1) this.setMove(0);
    if (['ArrowRight', 'd', 'D'].includes(e.key) && this.player.move === 1) this.setMove(0);
  };

  private resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(rect.width, 320);
    this.h = Math.max(rect.height, 260);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.vw = Math.ceil(this.w / PIX);
    this.vh = Math.ceil(this.h / PIX);
    this.off.width = this.vw;
    this.off.height = this.vh;
    this.groundY = this.vh - 22;
    this.dirty = true;
  }

  private loop = (ts: number) => {
    if (this.destroyed) return;
    const dt = Math.min((ts - this.last) / 1000, 0.033);
    this.last = ts;
    if (!this._paused) {
      this.t += dt;
      this.update(dt);
      this.render();
    } else if (this.dirty) {
      this.render();
      this.dirty = false;
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const p = this.player;

    p.x += p.move * SPEED * dt;
    p.x = Math.max(20, Math.min(p.x, this.worldW - 28));

    const zi = Math.floor(p.x / ZONE_WIDTH);
    if (this.zones[zi]?.hasBoss && !this.defeated[zi]) {
      const limit = this.bossX[zi] - 30;
      if (p.x > limit) p.x = limit;
    }

    if (!p.onGround) {
      p.vy += GRAVITY * dt;
      p.yOff += p.vy * dt;
      if (p.yOff >= 0) {
        p.yOff = 0;
        p.vy = 0;
        p.onGround = true;
      }
    }

    if (zi !== this.curZone && zi >= 0 && zi < this.zones.length) {
      this.curZone = zi;
      this.cb.onZoneChange(zi);
    }

    const zoneOrbs = this.orbs[zi] ?? [];
    zoneOrbs.forEach((o, si) => {
      if (!o.collected && Math.abs(p.x - o.x) < ORB_TOUCH && p.yOff > -30) {
        o.collected = true;
        this.cb.onSkillTouch(zi, si);
      }
    });

    let rangeZone = -1;
    if (this.zones[zi]?.hasBoss && !this.defeated[zi] && this.bossX[zi] - p.x < BOSS_RANGE) {
      rangeZone = zi;
    }
    if (rangeZone !== this.bossRangeZone) {
      if (this.bossRangeZone >= 0) this.cb.onBossRange(this.bossRangeZone, false);
      if (rangeZone >= 0) this.cb.onBossRange(rangeZone, true);
      this.bossRangeZone = rangeZone;
    }

    this.zones.forEach((z, i) => {
      if (z.hasBoss && this.defeated[i] && this.bossFade[i] > 0) {
        this.bossFade[i] = Math.max(0, this.bossFade[i] - dt * 1.6);
      }
    });

    if (!this.finished && p.x > this.worldW - 76) {
      this.finished = true;
      this.cb.onFinish();
    } else if (this.finished && p.x < this.worldW - 200) {
      this.finished = false; // walked away — allow the finale again
    }
  }

  private paletteAt(frac: number): BlendedPalette {
    const i = Math.max(0, Math.min(Math.floor(frac), this.palettes.length - 1));
    const j = Math.min(i + 1, this.palettes.length - 1);
    const t = Math.min(Math.max(frac - i, 0), 1);
    const a = this.palettes[i];
    const b = this.palettes[j];
    const mix = (ka: string, kb: string) => lerpRgb(hexToRgb(ka), hexToRgb(kb), t);
    return {
      skyTop: mix(a.skyTop, b.skyTop),
      skyBottom: mix(a.skyBottom, b.skyBottom),
      ground: rgbStr(mix(a.ground, b.ground)),
      groundTop: rgbStr(mix(a.groundTop, b.groundTop)),
      building: rgbStr(mix(a.building, b.building)),
    };
  }

  // ——— render ———————————————————————————————————————————————

  private render() {
    const o = this.octx;
    const { vw, vh } = this;
    o.setTransform(1, 0, 0, 1, 0, 0);
    o.imageSmoothingEnabled = false;

    const camX = Math.max(0, Math.min(this.player.x - vw * 0.42, this.worldW - vw));
    const pal = this.paletteAt((camX + vw / 2) / ZONE_WIDTH);
    const dark = luminance(rgbStr(pal.skyTop)) < 96;

    this.drawSky(pal, dark, camX);
    this.drawFarHills(pal, camX);
    this.drawBuildings(pal, camX, 0.35, 0.55, true);

    const zFirst = Math.max(0, Math.floor(camX / ZONE_WIDTH));
    const zLast = Math.min(this.zones.length - 1, Math.floor((camX + vw) / ZONE_WIDTH) + 1);
    const texts: { text: string; x: number; y: number; size: number; color: string; stroke?: boolean }[] = [];

    // Real-world landmark scenery per era (behind the ground props)
    for (let zi = zFirst; zi <= zLast; zi++) this.drawLandmarks(zi, camX, dark);

    this.drawGround(pal, camX);

    for (let zi = zFirst; zi <= zLast; zi++) {
      this.drawSign(zi, camX, texts);
      this.drawOrbs(zi, camX);
      if (this.zones[zi].hasBoss && this.bossFade[zi] > 0.01) this.drawBoss(zi, camX, texts);
    }
    this.drawDoor(camX, texts);
    this.drawPlayer(camX);

    // Upscale to the main canvas (nearest neighbor), then crisp text on top.
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, this.w, this.h);
    c.drawImage(this.off, 0, 0, this.vw, this.vh, 0, 0, this.vw * PIX, this.vh * PIX);

    c.textAlign = 'center';
    for (const tx of texts) {
      c.font = `bold ${tx.size}px ui-monospace, monospace`;
      if (tx.stroke) {
        c.lineWidth = 3;
        c.strokeStyle = 'rgba(6,8,14,0.75)';
        c.strokeText(tx.text, tx.x * PIX, tx.y * PIX);
      }
      c.fillStyle = tx.color;
      c.fillText(tx.text, tx.x * PIX, tx.y * PIX);
    }
  }

  private px(x: number, y: number, w: number, h: number, color: string) {
    this.octx.fillStyle = color;
    this.octx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  private drawSky(pal: BlendedPalette, dark: boolean, camX: number) {
    const o = this.octx;
    const bands = 9;
    const bh = Math.ceil(this.groundY / bands);
    for (let i = 0; i < bands; i++) {
      o.fillStyle = rgbStr(lerpRgb(pal.skyTop, pal.skyBottom, i / (bands - 1)));
      o.fillRect(0, i * bh, this.vw, bh);
    }

    if (dark) {
      // stars + moon
      const rnd = mulberry32(777);
      for (let i = 0; i < 46; i++) {
        const sx = Math.floor(rnd() * this.vw);
        const sy = Math.floor(rnd() * this.groundY * 0.7);
        const tw = this.reduced ? 1 : 0.6 + 0.4 * Math.sin(this.t * 2 + i);
        o.globalAlpha = 0.5 * tw + 0.2;
        this.px(sx, sy, 1, 1, '#e8ecff');
      }
      o.globalAlpha = 1;
      const mx = this.vw - 46 - ((camX * 0.04) % 20);
      this.px(mx, 16, 12, 12, '#e8ecff');
      this.px(mx + 1, 17, 10, 10, '#f8faff');
      this.px(mx + 6, 19, 4, 4, '#cdd4ea'); // crater
      this.px(mx + 2, 23, 3, 3, '#cdd4ea');
    } else {
      // sun with pixel halo
      const sx = this.vw - 52 - ((camX * 0.04) % 24);
      this.px(sx - 1, 15, 14, 14, 'rgba(255,244,200,0.45)');
      this.px(sx, 16, 12, 12, '#fff3c4');
      this.px(sx + 1, 17, 10, 10, '#ffe98f');
      // blocky clouds
      const rnd = mulberry32(4242);
      o.globalAlpha = 0.8;
      for (let i = 0; i < 4; i++) {
        const cx = ((i * 173 + rnd() * 60 - camX * 0.12) % (this.vw + 120)) - 60;
        const cy = 14 + rnd() * 34;
        const cw = 26 + rnd() * 22;
        this.px(cx, cy + 3, cw, 5, '#ffffff');
        this.px(cx + 5, cy, cw - 12, 4, '#ffffff');
        this.px(cx + 3, cy + 8, cw - 6, 3, '#e9edf5');
      }
      o.globalAlpha = 1;
    }
  }

  private drawFarHills(pal: BlendedPalette, camX: number) {
    // distant rolling band — adds depth between sky and skyline
    const y = this.groundY - 52;
    const color = shade(pal.building, 0.35);
    const rnd = mulberry32(99);
    const step = 46;
    const first = Math.floor((camX * 0.2) / step) - 1;
    for (let i = first; i < first + Math.ceil(this.vw / step) + 3; i++) {
      const r = mulberry32(i * 131 + 7)();
      const hx = i * step - camX * 0.2;
      const hh = 10 + r * 16;
      this.px(hx, y + (18 - hh), step + 1, hh + 40, color);
    }
    void rnd;
  }

  private drawBuildings(pal: BlendedPalette, camX: number, par: number, tone: number, far: boolean) {
    const o = this.octx;
    const step = far ? 44 : 62;
    const first = Math.floor((camX * par - step) / step);
    const count = Math.ceil(this.vw / step) + 3;
    const baseY = this.groundY - (far ? 12 : 0);

    for (let i = first; i < first + count; i++) {
      const rnd = mulberry32(i * 9973 + (far ? 17 : 51));
      const bw = far ? 18 + rnd() * 20 : 26 + rnd() * 26;
      const bh = far ? 26 + rnd() * 60 : 40 + rnd() * (this.groundY * 0.55);
      const bx = Math.round(i * step + rnd() * 12 - camX * par);
      if (bx > this.vw + 40 || bx + bw < -40) continue;

      const front = far ? shade(pal.building, 0.18) : shade(pal.building, tone - 0.9);
      const side = shade(front, -0.35);
      const top = shade(front, 0.3);
      const depth = far ? 3 : 5;

      // side face (fake 3D extrusion), front face, top face
      this.px(bx + bw, baseY - bh + depth, depth, bh - depth, side);
      this.px(bx, baseY - bh, bw, bh, front);
      this.px(bx, baseY - bh, bw + depth, depth, top);

      if (!far) {
        // lit windows
        const cols = Math.floor((bw - 6) / 7);
        const rows = Math.floor((bh - 10) / 10);
        for (let cx = 0; cx < cols; cx++) {
          for (let cy = 0; cy < rows; cy++) {
            if (rnd() > 0.5) {
              const lit = rnd() > 0.35;
              this.px(bx + 4 + cx * 7, baseY - bh + 7 + cy * 10, 3, 4, lit ? '#ffe9a8' : shade(front, -0.25));
            }
          }
        }
        if (rnd() > 0.6) this.px(bx + 3, baseY - bh - 6, 1, 6, side); // antenna
      }
    }
    void o;
  }

  private drawGround(pal: BlendedPalette, camX: number) {
    const gy = this.groundY;
    // top face (walkable) with dithered far edge, then front face below
    this.px(0, gy - 6, this.vw, 6, shade(pal.groundTop, 0.12));
    this.px(0, gy, this.vw, 3, pal.groundTop);
    this.px(0, gy + 3, this.vw, this.vh - gy - 3, pal.ground);
    this.px(0, gy + 3, this.vw, 1, shade(pal.ground, 0.25)); // edge highlight

    // dither between far edge and top face
    for (let x = 0; x < this.vw; x += 2) {
      const wx = Math.floor((x + camX) / 2);
      if (wx % 2 === 0) this.px(x, gy - 6, 1, 1, pal.groundTop);
    }
    // scattered pixel details on the top face (stones / tufts), world-locked
    const first = Math.floor(camX / 14);
    for (let i = first; i < first + Math.ceil(this.vw / 14) + 2; i++) {
      const r = mulberry32(i * 613 + 29)();
      const dx = i * 14 - camX + r * 8;
      if (r > 0.62) this.px(dx, gy - 2, 2, 2, shade(pal.groundTop, -0.28));
      else if (r < 0.2) this.px(dx, gy - 3, 1, 3, shade(pal.groundTop, 0.3));
    }
    // vertical grain on the front face
    for (let i = first; i < first + Math.ceil(this.vw / 14) + 2; i++) {
      const r = mulberry32(i * 389 + 3)();
      if (r > 0.5) this.px(i * 14 - camX + r * 6, gy + 5, 1, 6 + r * 8, shade(pal.ground, -0.18));
    }
  }

  // ——— landmark scenery (one real place per era) ——————————————

  private drawLandmarks(zi: number, camX: number, dark: boolean) {
    const s = zi * ZONE_WIDTH - camX; // zone origin on screen
    if (s > this.vw + 80 || s + ZONE_WIDTH < -80) return;
    const g = this.groundY - 6; // background floor line (behind walkable strip)
    const win = dark ? '#ffe9a8' : '#7e94ad';

    switch (zi) {
      case 0: this.lmSchool(s + 150, g); break;
      case 1: this.lmCopan(s + 130, g, win); break;
      case 2: this.lmBanespa(s + 170, g, win); break;
      case 3: this.lmPonteEstaiada(s + 170, g, win); break;
      case 4: this.lmFiesp(s + 160, g, win); break;
      case 5: // 99/DiDi world tour — the featured zone
        this.lmNewYork(s + 70, g, win);
        this.lmGoldenGate(s + 225, g);
        this.lmBeijing(s + 372, g);
        break;
      case 6: this.lmShops(s + 130, g, win); break;
      case 7: this.lmHomeOffice(s + 150, g); break;
      case 8: this.lmFactory(s + 150, g); break;
      case 9: this.lmPharma(s + 150, g); break;
      case 10: this.lmMasp(s + 150, g, win); break;
      case 11: this.lmStadium(s + 170, g); break;
      case 12: this.lmHorizon(s + 140, g); break;
    }
  }

  private winGrid(x: number, y: number, w: number, h: number, color: string, seed: number, sx = 5, sy = 7) {
    const rnd = mulberry32(seed);
    for (let cx = x + 2; cx < x + w - 3; cx += sx) {
      for (let cy = y + 3; cy < y + h - 4; cy += sy) {
        if (rnd() > 0.4) this.px(cx, cy, 2, 3, color);
      }
    }
  }

  /** Clovis Bevilacqua — schoolhouse with the Brazilian flag. */
  private lmSchool(x: number, g: number) {
    this.px(x, g - 34, 64, 34, '#c9a37a');
    this.px(x, g - 34, 64, 2, '#a57f56');
    this.px(x - 3, g - 40, 70, 6, '#8a4b32'); // roof
    this.px(x + 4, g - 46, 56, 6, '#8a4b32');
    this.px(x + 28, g - 14, 10, 14, '#5b3a24'); // door
    this.px(x + 6, g - 26, 8, 8, '#d7e6f2'); // windows
    this.px(x + 50, g - 26, 8, 8, '#d7e6f2');
    this.px(x + 30, g - 43, 6, 6, '#f2ecdc'); // clock
    this.px(x + 32, g - 41, 1, 2, '#3a3020');
    // flagpole + Brazil flag (waving 2-frame)
    const wave = this.reduced ? 0 : Math.floor(this.t * 2) % 2;
    this.px(x + 74, g - 52, 2, 52, '#8d99ae');
    this.px(x + 76, g - 50 + wave, 12, 8, '#159947');
    this.px(x + 79, g - 48 + wave, 6, 4, '#f6d31c');
    this.px(x + 81, g - 47 + wave, 2, 2, '#1b3fa0');
  }

  /** Datatex era — Copan curve + Edifício Itália, downtown São Paulo. */
  private lmCopan(x: number, g: number, win: string) {
    const off = [0, 3, 5, 6, 5, 3, 0, -2];
    for (let i = 0; i < 8; i++) {
      this.px(x + i * 9, g - 48 + off[i] * 0, 9, 48, i % 2 ? '#9aa7b5' : '#8b98a6');
      for (let y = g - 44; y < g - 4; y += 4) this.px(x + i * 9, y + off[i], 9, 1, '#6f7c8a');
    }
    // Edifício Itália
    this.px(x + 96, g - 66, 18, 66, '#b3a48e');
    this.px(x + 98, g - 70, 14, 4, '#9d8f7a');
    this.winGrid(x + 96, g - 64, 18, 60, win, 101, 4, 6);
  }

  /** BR part / Synchro — Altino Arantes (Banespão) skyline. */
  private lmBanespa(x: number, g: number, win: string) {
    this.px(x - 24, g - 40, 20, 40, '#7d8a99');
    this.winGrid(x - 24, g - 40, 20, 40, win, 33);
    this.px(x, g - 58, 26, 58, '#a89f8d');
    this.px(x + 3, g - 66, 20, 8, '#a89f8d');
    this.px(x + 6, g - 72, 14, 6, '#998f7d');
    this.px(x + 9, g - 78, 8, 6, '#8a8070'); // stepped crown
    this.px(x + 12, g - 84, 2, 6, '#6e6557'); // antenna
    this.winGrid(x, g - 56, 26, 52, win, 44, 5, 6);
    this.px(x + 34, g - 34, 18, 34, '#8b96a4');
    this.winGrid(x + 34, g - 34, 18, 34, win, 55);
  }

  /** IT Convergence — Ponte Estaiada, Berrini. */
  private lmPonteEstaiada(x: number, g: number, win: string) {
    // deck
    this.px(x - 80, g - 16, 170, 3, '#c9ced8');
    this.px(x - 80, g - 13, 170, 2, '#8d99ae');
    // X mast
    for (let i = 0; i < 26; i++) {
      this.px(x - 10 + i, g - 16 - i * 1.6, 3, 2, '#e3e7ee');
      this.px(x + 13 - i, g - 16 - i * 1.6, 3, 2, '#e3e7ee');
    }
    // cables from apex
    for (let c = 1; c <= 5; c++) {
      const tx = x + c * 13;
      const txm = x - c * 13;
      for (let i = 0; i < 12; i++) {
        this.px(x + 1 + ((tx - x - 1) * i) / 12, g - 56 + ((g - 16 - (g - 56)) * i) / 12, 1, 1, '#f2f4f8');
        this.px(x + 1 + ((txm - x - 1) * i) / 12, g - 56 + ((g - 16 - (g - 56)) * i) / 12, 1, 1, '#f2f4f8');
      }
    }
    // Berrini glass towers
    this.px(x + 110, g - 46, 20, 46, '#5f7d96');
    this.winGrid(x + 110, g - 46, 20, 46, win, 66, 4, 5);
    this.px(x + 134, g - 36, 16, 36, '#6d8aa2');
    this.winGrid(x + 134, g - 36, 16, 36, win, 77, 4, 5);
  }

  /** Synchro — FIESP pyramid + Paulista antenna. */
  private lmFiesp(x: number, g: number, win: string) {
    for (let i = 0; i < 12; i++) {
      const w = 48 - i * 4;
      this.px(x - w / 2, g - 5 - i * 5, w, 5, i % 2 ? '#9b93a8' : '#8f8799');
    }
    this.winGrid(x - 18, g - 44, 36, 40, win, 88, 6, 8);
    // antenna mast with blinking light
    this.px(x + 70, g - 70, 3, 70, '#7a7f8c');
    this.px(x + 66, g - 50, 11, 2, '#7a7f8c');
    this.px(x + 66, g - 32, 11, 2, '#7a7f8c');
    const blink = this.reduced ? 1 : Math.floor(this.t * 2) % 2;
    if (blink) this.px(x + 70, g - 73, 3, 3, '#ff4d5e');
  }

  /** 99/DiDi — New York: Statue of Liberty + Empire State. */
  private lmNewYork(x: number, g: number, win: string) {
    const cu = '#3d9b82'; // copper green
    const cuD = '#2c7a66';
    // pedestal
    this.px(x - 7, g - 12, 14, 12, '#b8a88f');
    this.px(x - 5, g - 16, 10, 4, '#a89878');
    // body / robe
    this.px(x - 4, g - 34, 8, 18, cu);
    this.px(x + 1, g - 34, 3, 18, cuD);
    // head + crown spikes
    this.px(x - 2, g - 40, 5, 6, cu);
    for (let i = -3; i <= 3; i += 2) this.px(x + i, g - 43, 1, 3, cuD);
    // torch arm (raised) with flame
    this.px(x + 4, g - 46, 2, 12, cu);
    const flame = this.reduced ? 0 : Math.floor(this.t * 4) % 2;
    this.px(x + 3, g - 50 + flame, 4, 4, '#ffd23e');
    this.px(x + 4, g - 51 + flame, 2, 2, '#fff3ae');
    // tablet arm
    this.px(x - 7, g - 30, 3, 6, cuD);
    // Empire State Building
    const ex = x + 42;
    this.px(ex, g - 46, 22, 46, '#9aa2b2');
    this.px(ex + 3, g - 60, 16, 14, '#8d95a5');
    this.px(ex + 6, g - 70, 10, 10, '#808898');
    this.px(ex + 9, g - 76, 4, 6, '#737b8b');
    this.px(ex + 10, g - 84, 2, 8, '#666e7e'); // spire
    this.winGrid(ex, g - 44, 22, 42, win, 111, 4, 5);
    this.winGrid(ex + 3, g - 58, 16, 12, win, 112, 4, 5);
    // Chrysler-ish neighbor
    this.px(ex + 30, g - 38, 14, 38, '#a7afbf');
    this.px(ex + 33, g - 44, 8, 6, '#99a1b1');
    this.px(ex + 36, g - 48, 2, 4, '#8b93a3');
    this.winGrid(ex + 30, g - 36, 14, 34, win, 113, 4, 5);
  }

  /** 99/DiDi — Silicon Valley: Golden Gate + rolling hills. */
  private lmGoldenGate(x: number, g: number) {
    const red = '#c0453a';
    const redD = '#93332a';
    // hills behind
    this.px(x - 30, g - 14, 40, 14, '#5e7355');
    this.px(x - 14, g - 20, 34, 20, '#54684c');
    this.px(x + 70, g - 16, 46, 16, '#5e7355');
    // deck
    this.px(x - 20, g - 18, 130, 3, red);
    this.px(x - 20, g - 15, 130, 1, redD);
    // towers (two portals)
    for (const tx of [x + 12, x + 74]) {
      this.px(tx, g - 52, 4, 34, red);
      this.px(tx + 10, g - 52, 4, 34, red);
      this.px(tx, g - 52, 14, 3, red);
      this.px(tx, g - 40, 14, 2, red);
      this.px(tx, g - 28, 14, 2, red);
      this.px(tx + 3, g - 49, 1, 31, redD);
      this.px(tx + 13, g - 49, 1, 31, redD);
    }
    // sagging main cable between towers + side spans
    const t1 = x + 19;
    const t2 = x + 81;
    for (let i = 0; i <= 20; i++) {
      const cx = t1 + ((t2 - t1) * i) / 20;
      const sagT = i / 20;
      const cy = g - 52 + Math.round(Math.sin(sagT * Math.PI) * 22);
      this.px(cx, cy, 1, 1, redD);
      if (i % 3 === 0 && cy < g - 18) this.px(cx, cy, 1, g - 18 - cy, 'rgba(147,51,42,0.55)');
    }
    for (let i = 0; i <= 8; i++) {
      this.px(t1 - 2 - i * 2, g - 52 + i * 4, 1, 1, redD);
      this.px(t2 + 2 + i * 2, g - 52 + i * 4, 1, 1, redD);
    }
  }

  /** 99/DiDi — Beijing: Temple of Heaven + Great Wall. */
  private lmBeijing(x: number, g: number) {
    const roof = '#2b5ea7';
    const roofD = '#1e4479';
    const body = '#a53030';
    // Temple of Heaven — three round tiers
    this.px(x - 4, g - 8, 40, 8, '#d8d2c2'); // marble base
    this.px(x, g - 16, 32, 8, body);
    this.px(x - 4, g - 20, 40, 4, roof);
    this.px(x - 2, g - 21, 36, 1, roofD);
    this.px(x + 4, g - 28, 24, 8, body);
    this.px(x, g - 32, 32, 4, roof);
    this.px(x + 2, g - 33, 28, 1, roofD);
    this.px(x + 9, g - 40, 14, 7, body);
    this.px(x + 5, g - 44, 22, 4, roof);
    this.px(x + 14, g - 48, 4, 4, roofD);
    this.px(x + 15, g - 50, 2, 2, '#f6d31c'); // gold finial
    // Great Wall snaking on a hill toward the boss
    const wx = x + 52;
    for (let i = 0; i < 14; i++) {
      const hx = wx + i * 6;
      const hy = g - 10 - Math.round(Math.sin(i * 0.55) * 6) - i;
      this.px(hx, hy, 6, g - hy, '#6b6353'); // rampart body
      this.px(hx, hy - 2, 6, 2, '#7d7565');
      if (i % 2 === 0) this.px(hx + 1, hy - 4, 2, 2, '#7d7565'); // crenellation
    }
    // watchtower
    const twx = wx + 60;
    const twy = g - 34;
    this.px(twx, twy, 12, 22, '#7d7565');
    this.px(twx - 2, twy - 4, 16, 4, '#8a8272');
    this.px(twx + 2, twy - 8, 8, 4, '#6b6353');
    this.px(twx + 5, twy + 6, 3, 4, '#3a3428'); // window
    // red lantern
    const sway = this.reduced ? 0 : Math.round(Math.sin(this.t * 2));
    this.px(x + 44 + sway, g - 36, 4, 5, '#e03131');
    this.px(x + 45 + sway, g - 31, 2, 2, '#f6d31c');
  }

  /** Restoque — fashion storefronts. */
  private lmShops(x: number, g: number, win: string) {
    const awn = ['#c94f6d', '#3f7fb5', '#4a9d6e'];
    for (let i = 0; i < 3; i++) {
      const sx = x + i * 46;
      this.px(sx, g - 30, 40, 30, '#b0a696');
      // striped awning
      for (let a = 0; a < 6; a++) {
        this.px(sx + 2 + a * 6, g - 22, 6, 4, a % 2 ? awn[i] : '#efe9dc');
      }
      this.px(sx + 4, g - 16, 14, 12, '#dfe8ef'); // display window
      this.px(sx + 7, g - 13, 3, 7, '#5a4a58'); // mannequin
      this.px(sx + 12, g - 12, 3, 6, '#7a5a68');
      this.px(sx + 24, g - 14, 10, 14, '#5b3a24'); // door
      this.px(sx + 6, g - 27, 28, 3, '#8f8577'); // sign board
    }
    void win;
  }

  /** Dell — remote work: suburban home office, wifi beaming to the world. */
  private lmHomeOffice(x: number, g: number) {
    // main house
    this.px(x, g - 24, 40, 24, '#b8a892');
    this.px(x - 3, g - 32, 46, 8, '#6e5a48'); // roof
    this.px(x + 4, g - 38, 8, 6, '#8a7460'); // chimney
    this.px(x + 6, g - 18, 10, 8, '#ffd98c'); // lit office window
    this.px(x + 8, g - 16, 2, 2, '#6b5334'); // person pixel at the desk
    this.px(x + 26, g - 14, 9, 14, '#5b3a24'); // door
    // antenna + wifi arcs (pulsing)
    this.px(x + 34, g - 44, 2, 12, '#8d99ae');
    const pulse = this.reduced ? 2 : Math.floor(this.t * 2.5) % 3;
    for (let r = 0; r <= pulse; r++) {
      const rr = 4 + r * 4;
      this.octx.globalAlpha = 0.7 - r * 0.2;
      this.px(x + 35 - rr, g - 46 - rr, rr * 2, 1, '#9ecbff');
      this.px(x + 35 - rr, g - 46 - rr, 1, rr, '#9ecbff');
      this.px(x + 35 + rr, g - 46 - rr, 1, rr, '#9ecbff');
      this.octx.globalAlpha = 1;
    }
    // neighbor house
    this.px(x + 66, g - 18, 30, 18, '#a89882');
    this.px(x + 63, g - 24, 36, 6, '#5e4a38');
    this.px(x + 72, g - 14, 7, 6, '#ffd98c');
  }

  /** Dexco — industrial plant with sawtooth roof. */
  private lmFactory(x: number, g: number) {
    this.px(x, g - 26, 66, 26, '#8d8478');
    // sawtooth roof
    for (let i = 0; i < 3; i++) {
      const sx = x + i * 22;
      for (let j = 0; j < 8; j++) this.px(sx + j * 2, g - 26 - j, 2, j + 1, '#6e665c');
      this.px(sx + 14, g - 34, 2, 8, '#aebdd0'); // skylight glass
    }
    this.px(x + 8, g - 18, 8, 8, '#5c554b');
    this.px(x + 30, g - 18, 8, 8, '#5c554b');
    this.px(x + 50, g - 14, 10, 14, '#4a4238'); // gate
    // chimney with drifting smoke
    this.px(x + 74, g - 44, 8, 44, '#7a7264');
    this.px(x + 73, g - 46, 10, 3, '#655e52');
    if (!this.reduced) {
      const dr = (this.t * 6) % 12;
      this.octx.globalAlpha = 0.5;
      this.px(x + 76 + dr * 0.6, g - 50 - dr, 4, 3, '#cfd4dc');
      this.px(x + 79 + dr * 0.8, g - 56 - dr, 5, 3, '#dde1e8');
      this.octx.globalAlpha = 1;
    }
    // lumber stack (Duratex wood)
    this.px(x + 92, g - 6, 18, 3, '#9a6b3f');
    this.px(x + 94, g - 9, 14, 3, '#8a5c32');
    this.px(x + 96, g - 12, 10, 3, '#7a4e28');
  }

  /** EMS — pharma plant: clean building, green cross, silos. */
  private lmPharma(x: number, g: number) {
    this.px(x, g - 30, 46, 30, '#e3e9f1');
    this.px(x, g - 30, 46, 2, '#c3ccd8');
    this.px(x + 5, g - 22, 8, 6, '#b8d2e8');
    this.px(x + 33, g - 22, 8, 6, '#b8d2e8');
    this.px(x + 19, g - 14, 9, 14, '#9fb3c8'); // glass door
    // green cross
    this.px(x + 19, g - 27, 9, 3, '#1faa59');
    this.px(x + 22, g - 30, 3, 9, '#1faa59');
    // silo tanks + pipe
    for (const tx of [x + 58, x + 74]) {
      this.px(tx, g - 26, 12, 26, '#c2cbd6');
      this.px(tx + 1, g - 29, 10, 3, '#aab4c0');
      this.px(tx + 2, g - 24, 2, 20, '#dbe2ea'); // highlight
    }
    this.px(x + 46, g - 20, 12, 2, '#8d99ae'); // pipe to building
    this.px(x + 70, g - 16, 4, 2, '#8d99ae');
  }

  /** Crefisa — Av. Paulista: MASP + bank towers. */
  private lmMasp(x: number, g: number, win: string) {
    const red = '#c22b2b';
    // suspended box on two red pillars
    this.px(x, g - 14, 5, 14, red);
    this.px(x + 65, g - 14, 5, 14, red);
    this.px(x - 4, g - 30, 78, 14, '#9aa4b2'); // glass volume
    this.px(x - 4, g - 30, 78, 2, red); // top beam
    this.px(x - 4, g - 18, 78, 2, red); // bottom beam
    for (let i = 0; i < 12; i++) this.px(x + i * 6, g - 27, 1, 8, '#7c8694'); // mullions
    // bank towers
    this.px(x + 92, g - 52, 20, 52, '#5f6d80');
    this.winGrid(x + 92, g - 52, 20, 52, win, 220, 4, 5);
    this.px(x + 116, g - 42, 16, 42, '#6d7b8e');
    this.winGrid(x + 116, g - 42, 16, 42, win, 221, 4, 5);
  }

  /** R10 — stadium under floodlights. */
  private lmStadium(x: number, g: number) {
    // bowl
    this.px(x - 10, g - 20, 120, 20, '#5a6272');
    this.px(x - 16, g - 14, 132, 14, '#4c5464');
    this.px(x - 4, g - 24, 108, 4, '#6a7284'); // rim
    for (let i = 0; i < 13; i++) this.px(x - 6 + i * 9, g - 20, 2, 6, '#3c4454'); // gates
    this.px(x + 20, g - 18, 60, 3, '#7ec97e'); // pitch glimpse
    // floodlight masts
    const glow = this.reduced ? 0.8 : 0.6 + Math.sin(this.t * 3) * 0.25;
    for (const mx of [x - 22, x + 116]) {
      this.px(mx, g - 54, 2, 54, '#8d99ae');
      this.px(mx - 5, g - 58, 12, 5, '#3c4454');
      this.octx.globalAlpha = glow;
      for (let i = 0; i < 4; i++) this.px(mx - 4 + i * 3, g - 57, 2, 3, '#fff3ae');
      this.octx.globalAlpha = 0.12 * glow;
      // light cone
      for (let i = 0; i < 18; i++) this.px(mx - 4 - i, g - 54 + i * 2.6, 12 + i * 2, 3, '#fff3ae');
      this.octx.globalAlpha = 1;
    }
  }

  /** Epilogue — open horizon. */
  private lmHorizon(x: number, g: number) {
    this.px(x - 40, g - 12, 70, 12, '#3d3968');
    this.px(x + 10, g - 18, 90, 18, '#343060');
    this.px(x + 80, g - 10, 70, 10, '#3d3968');
    // birds
    if (!this.reduced) {
      const fl = Math.floor(this.t * 3) % 2;
      for (const [bx, by] of [[x + 30, g - 66], [x + 44, g - 72], [x + 58, g - 62]] as const) {
        this.px(bx, by + fl, 2, 1, '#1c1a38');
        this.px(bx + 3, by + fl, 2, 1, '#1c1a38');
      }
    }
  }

  private drawSign(zi: number, camX: number, texts: { text: string; x: number; y: number; size: number; color: string; stroke?: boolean }[]) {
    const x = zi * ZONE_WIDTH + 34 - camX;
    if (x < -80 || x > this.vw + 80) return;
    const z = this.zones[zi];
    const gy = this.groundY;

    // post with side shading
    this.px(x - 1, gy - 26, 4, 26, '#7a5a34');
    this.px(x + 2, gy - 26, 1, 26, '#5b3f21');
    // board: front + 3D bottom/right edges + outline
    const bw = 64;
    const bh = 18;
    const by = gy - 44;
    this.px(x - bw / 2 - 1, by - 1, bw + 2, bh + 2, OUTLINE);
    this.px(x - bw / 2, by, bw, bh, '#e8dcc3');
    this.px(x - bw / 2 + 2, by + bh, bw, 2, '#8c7550'); // bottom edge
    this.px(x + bw / 2, by + 2, 2, bh, '#a08a61'); // right edge
    this.px(x - bw / 2 + 2, by + 2, bw - 4, 1, '#f7efdd'); // top highlight
    // nails
    this.px(x - bw / 2 + 3, by + 3, 1, 1, '#6b5334');
    this.px(x + bw / 2 - 4, by + 3, 1, 1, '#6b5334');

    const label = z.company.length > 24 ? z.company.slice(0, 23) + '…' : z.company;
    texts.push({ text: z.year, x, y: by + 8, size: 11, color: '#26201a' });
    texts.push({ text: label, x, y: by + 16, size: 9, color: '#4a3d2e' });
  }

  private drawOrbs(zi: number, camX: number) {
    this.orbs[zi].forEach((o) => {
      if (o.collected) return;
      const x = Math.round(o.x - camX);
      if (x < -20 || x > this.vw + 20) return;
      const bob = this.reduced ? 0 : Math.sin(this.t * 2.6 + o.x * 0.15) * 2.5;
      const y = Math.round(this.groundY - 20 + bob);
      const c = TREE_COLORS[o.tree];

      // drop shadow on the ground (3D cue)
      this.octx.globalAlpha = 0.28;
      this.px(x - 3, this.groundY - 2, 7, 2, OUTLINE);
      this.octx.globalAlpha = 1;

      // faceted gem: outline, light/base/dark facets, sparkle
      this.px(x - 1, y - 5, 3, 1, OUTLINE);
      this.px(x - 3, y - 4, 7, 1, OUTLINE);
      this.px(x - 4, y - 3, 9, 4, OUTLINE);
      this.px(x - 3, y + 1, 7, 2, OUTLINE);
      this.px(x - 1, y + 3, 3, 2, OUTLINE);

      this.px(x - 1, y - 4, 3, 1, c.light);
      this.px(x - 3, y - 3, 4, 3, c.light);
      this.px(x + 1, y - 3, 3, 3, c.base);
      this.px(x - 2, y, 3, 2, c.base);
      this.px(x + 1, y, 2, 2, c.dark);
      this.px(x - 1, y + 2, 2, 2, c.dark);
      this.px(x - 2, y - 3, 1, 1, '#ffffff'); // sparkle
    });
  }

  private drawBoss(zi: number, camX: number, texts: { text: string; x: number; y: number; size: number; color: string; stroke?: boolean }[]) {
    const x = Math.round(this.bossX[zi] - camX);
    if (x < -60 || x > this.vw + 60) return;
    const fade = this.bossFade[zi];
    const defeatedNow = this.defeated[zi];
    const bob = this.reduced || defeatedNow ? 0 : Math.round(Math.sin(this.t * 2) * 2);
    const bw = 32;
    const bh = 38;
    const gy = this.groundY;
    const y = gy - bh + bob + (defeatedNow ? Math.round((1 - fade) * 12) : 0);
    const o = this.octx;

    o.globalAlpha = fade;

    // shadow
    o.globalAlpha = fade * 0.3;
    this.px(x - bw / 2 - 2, gy - 2, bw + 4, 2, OUTLINE);
    o.globalAlpha = fade;

    const body = '#3a2a5e';
    const bodyL = '#4f3a80';
    const bodyD = '#241a3d';

    // outline
    this.px(x - bw / 2 - 1, y - 1, bw + 2, bh + 1, OUTLINE);
    // body with two-tone vertical shading (left lit, right dark)
    this.px(x - bw / 2, y, bw, bh, body);
    this.px(x - bw / 2, y, 10, bh, bodyL);
    this.px(x + bw / 2 - 8, y, 8, bh, bodyD);
    this.px(x - bw / 2, y, bw, 5, shade(bodyL, 0.15)); // crown light
    // horns
    this.px(x - bw / 2 - 4, y - 6, 6, 8, bodyD);
    this.px(x - bw / 2 - 3, y - 8, 3, 3, bodyD);
    this.px(x + bw / 2 - 2, y - 6, 6, 8, bodyD);
    this.px(x + bw / 2, y - 8, 3, 3, bodyD);
    // belly plate
    this.px(x - 8, y + 22, 16, 12, shade(body, 0.12));

    // eyes tracking the player
    const look = Math.max(-2, Math.min(2, Math.round((this.player.x - this.bossX[zi]) * 0.04)));
    this.px(x - 10, y + 10, 7, 5, '#ffffff');
    this.px(x + 3, y + 10, 7, 5, '#ffffff');
    this.px(x - 8 + look, y + 11, 3, 3, '#e11d48');
    this.px(x + 5 + look, y + 11, 3, 3, '#e11d48');
    // brow
    this.px(x - 11, y + 8, 8, 2, bodyD);
    this.px(x + 3, y + 8, 8, 2, bodyD);
    // mouth with teeth
    this.px(x - 7, y + 19, 14, 3, '#12091f');
    this.px(x - 6, y + 19, 2, 1, '#e8ecff');
    this.px(x - 1, y + 19, 2, 1, '#e8ecff');
    this.px(x + 4, y + 19, 2, 1, '#e8ecff');

    o.globalAlpha = 1;

    if (fade > 0.5) {
      texts.push({ text: this.zones[zi].bossName, x, y: y - 12, size: 11, color: '#ffe9a8', stroke: true });
    }

    if (!defeatedNow && this.bossRangeZone === zi) {
      const byy = y - 24 + (this.reduced ? 0 : Math.round(Math.sin(this.t * 5)));
      this.px(x - 5, byy - 5, 10, 10, '#ffffff');
      this.px(x - 5, byy - 5, 10, 1, '#c8ccda');
      this.px(x - 5, byy + 4, 10, 1, '#8a8fa3');
      texts.push({ text: 'E', x, y: byy + 3, size: 12, color: '#26201a' });
    }
  }

  private drawDoor(camX: number, texts: { text: string; x: number; y: number; size: number; color: string; stroke?: boolean }[]) {
    const x = Math.round(this.worldW - 56 - camX);
    if (x < -50 || x > this.vw + 50) return;
    const dw = 24;
    const dh = 40;
    const gy = this.groundY;
    const y = gy - dh;
    const pulse = this.reduced ? 0.5 : 0.35 + Math.sin(this.t * 2) * 0.2;

    // glow
    this.octx.globalAlpha = pulse;
    this.px(x - dw / 2 - 4, y - 4, dw + 8, dh + 4, '#ffd76a');
    this.octx.globalAlpha = 1;
    // frame with 3D edge
    this.px(x - dw / 2 - 2, y - 2, dw + 4, dh + 2, OUTLINE);
    this.px(x - dw / 2, y, dw, dh, '#c98a1b');
    this.px(x - dw / 2 + 2, y + 2, dw - 4, dh - 2, '#8a5c10');
    this.px(x - dw / 2 + 2, y + 2, 2, dh - 2, '#e3a52e'); // inner light edge
    this.px(x + dw / 2 - 2, y, 2, dh, shade('#c98a1b', -0.35)); // side face
    // knob
    this.px(x + dw / 2 - 6, y + 22, 2, 2, '#ffe9a8');

    texts.push({ text: '?', x, y: y + 24, size: 20, color: '#fff3c4', stroke: true });
  }

  private drawPlayer(camX: number) {
    const p = this.player;
    const x = Math.round(p.x - camX);
    const gy = this.groundY;
    const yb = Math.round(gy + p.yOff); // feet baseline
    const zi = Math.min(Math.max(this.curZone, 0), this.zones.length - 1);
    const o = this.octx;

    // Outfit evolves with the career
    let top = '#0e7490'; // student hoodie
    let topL = shade('#0e7490', 0.25);
    let pants = '#334155';
    let shirt: string | null = null;
    let tie: string | null = null;
    let hood = true;
    if (zi >= 2 && zi <= 4) {
      top = '#8fa3bb';
      topL = shade(top, 0.25);
      hood = false;
    }
    if (zi === 5) {
      top = '#0f766e';
      topL = shade(top, 0.25);
      hood = false;
    }
    if (zi >= 6) {
      top = '#1f2a3d';
      topL = shade(top, 0.3);
      shirt = '#f5f7fb';
      tie = '#d61f45';
      pants = '#2a3648';
      hood = false;
    }

    const walking = p.move !== 0 && p.onGround;
    const phase = this.reduced ? 0 : Math.floor(this.t * 9) % 4;
    const legA = walking ? [0, 2, 0, -2][phase] : 0;
    const armA = walking ? [1, -1, -1, 1][phase] : 0;
    const idle = !walking && p.onGround && !this.reduced ? Math.round(Math.sin(this.t * 2)) : 0;
    const jumpTuck = p.onGround ? 0 : 2;

    // drop shadow scales with jump height
    const air = Math.min(1, -p.yOff / 60);
    o.globalAlpha = 0.3 * (1 - air * 0.6);
    const shw = Math.round(10 - air * 4);
    this.px(x - shw / 2, gy - 1, shw, 2, OUTLINE);
    o.globalAlpha = 1;

    o.save();
    o.translate(x, yb);
    if (p.dir === -1) o.scale(-1, 1);

    const P = (px: number, py: number, w: number, h: number, c: string) => {
      o.fillStyle = c;
      o.fillRect(Math.round(px), Math.round(py), Math.round(w), Math.round(h));
    };

    const skin = '#e8b98c';
    const skinD = '#c99a6e';
    const hair = '#38302c';
    const shoe = '#181c26';

    // legs (4-phase walk)
    P(-4 + legA, -8 + jumpTuck, 3, 8 - jumpTuck, pants);
    P(1 - legA, -8 + jumpTuck, 3, 8 - jumpTuck, shade(pants, -0.22));
    // shoes
    P(-4 + legA, -2 + jumpTuck, 4, 2, shoe);
    P(1 - legA, -2 + jumpTuck, 4, 2, shoe);

    // torso with outline + lit front / shaded back
    P(-6, -19 + idle, 12, 12, OUTLINE);
    P(-5, -18 + idle, 10, 10, top);
    P(-5, -18 + idle, 4, 10, topL);
    if (shirt) {
      P(-2, -18 + idle, 4, 6, shirt);
      if (tie) P(-1, -18 + idle, 2, 5, tie);
      P(-5, -18 + idle, 10, 1, shade(top, 0.15)); // collar
    }
    if (hood) {
      P(-5, -19 + idle, 10, 2, shade(top, -0.25)); // hood roll
    }

    // arms swing (far arm darker)
    P(4, -17 + idle + armA, 2, 8, shade(top, -0.3));
    P(-7, -17 + idle - armA, 2, 8, topL);
    P(4, -10 + idle + armA, 2, 2, skin);
    P(-7, -10 + idle - armA, 2, 2, skin);

    // head with outline, hair, face shading
    P(-5, -28 + idle, 10, 10, OUTLINE);
    P(-4, -27 + idle, 8, 8, skin);
    P(2, -27 + idle, 2, 8, skinD); // back-of-head shade
    P(-4, -28 + idle, 8, 3, hair);
    P(-4, -25 + idle, 2, 3, hair); // sideburn
    P(2, -28 + idle, 2, 4, shade(hair, -0.3));
    // face: eye + mouth pixel
    P(1, -24 + idle, 2, 2, '#20242e');
    P(0, -21 + idle, 2, 1, skinD);

    o.restore();
  }
}
