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

export const ZONE_WIDTH = 1500;
const SPEED = 260;
const GRAVITY = 2100;
const JUMP_V = 680;
const PLAYER_W = 26;
const PLAYER_H = 52;
const BOSS_RANGE = 170;

const TREE_COLORS: Record<SkillTree, string> = {
  dev: '#38bdf8',
  mgmt: '#f59e0b',
  biz: '#34d399',
};

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

function lerpHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

interface Orb {
  x: number;
  tree: SkillTree;
  collected: boolean;
}

export class CareerQuestEngine {
  paused = true;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private zones: EngineZone[];
  private palettes: ZonePalette[];
  private cb: EngineCallbacks;

  private raf = 0;
  private last = 0;
  private t = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private groundY = 0;
  private worldW: number;

  private player = { x: 140, yOff: 0, vy: 0, dir: 1 as 1 | -1, move: 0 as -1 | 0 | 1, onGround: true };
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
    this.zones = zones;
    this.palettes = palettes;
    this.cb = cb;
    this.worldW = zones.length * ZONE_WIDTH;

    zones.forEach((z, zi) => {
      const n = z.skillTrees.length;
      const span = ZONE_WIDTH - 760;
      const orbs: Orb[] = z.skillTrees.map((tree, i) => ({
        x: zi * ZONE_WIDTH + 340 + (n > 1 ? (span / (n - 1)) * i : span / 2),
        tree,
        collected: false,
      }));
      this.orbs.push(orbs);
      this.bossX.push(zi * ZONE_WIDTH + ZONE_WIDTH - 250);
      this.defeated.push(!z.hasBoss);
      this.bossFade.push(z.hasBoss ? 1 : 0);
    });

    if (typeof window !== 'undefined') {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (this.player.onGround && !this.paused) {
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
  }

  restoreState(collected: Set<string>, defeated: Set<number>) {
    this.orbs.forEach((zone, zi) =>
      zone.forEach((o, si) => {
        if (collected.has(`${zi}:${si}`)) o.collected = true;
      })
    );
    defeated.forEach((z) => {
      this.defeated[z] = true;
      this.bossFade[z] = 0;
    });
  }

  teleport(zone: number) {
    this.player.x = zone * ZONE_WIDTH + 150;
    this.player.yOff = 0;
    this.player.vy = 0;
    this.player.onGround = true;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.paused) return;
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
    this.groundY = this.h - 58;
  }

  private loop = (ts: number) => {
    if (this.destroyed) return;
    const dt = Math.min((ts - this.last) / 1000, 0.033);
    this.last = ts;
    if (!this.paused) {
      this.t += dt;
      this.update(dt);
    }
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const p = this.player;

    p.x += p.move * SPEED * dt;
    p.x = Math.max(60, Math.min(p.x, this.worldW - 80));

    // Boss blocks forward progress until defeated
    const zi = Math.floor(p.x / ZONE_WIDTH);
    if (this.zones[zi]?.hasBoss && !this.defeated[zi]) {
      const limit = this.bossX[zi] - 84;
      if (p.x > limit) p.x = limit;
    }

    // Jump physics
    if (!p.onGround) {
      p.vy += GRAVITY * dt;
      p.yOff += p.vy * dt;
      if (p.yOff >= 0) {
        p.yOff = 0;
        p.vy = 0;
        p.onGround = true;
      }
    }

    // Zone change
    if (zi !== this.curZone && zi >= 0 && zi < this.zones.length) {
      this.curZone = zi;
      this.cb.onZoneChange(zi);
    }

    // Orb collection
    const zoneOrbs = this.orbs[zi] ?? [];
    zoneOrbs.forEach((o, si) => {
      if (!o.collected && Math.abs(p.x - o.x) < 30 && p.yOff > -80) {
        o.collected = true;
        this.cb.onSkillTouch(zi, si);
      }
    });

    // Boss proximity
    let rangeZone = -1;
    if (this.zones[zi]?.hasBoss && !this.defeated[zi] && this.bossX[zi] - p.x < BOSS_RANGE) {
      rangeZone = zi;
    }
    if (rangeZone !== this.bossRangeZone) {
      if (this.bossRangeZone >= 0) this.cb.onBossRange(this.bossRangeZone, false);
      if (rangeZone >= 0) this.cb.onBossRange(rangeZone, true);
      this.bossRangeZone = rangeZone;
    }

    // Boss fade-out after defeat
    this.zones.forEach((z, i) => {
      if (z.hasBoss && this.defeated[i] && this.bossFade[i] > 0) {
        this.bossFade[i] = Math.max(0, this.bossFade[i] - dt * 1.6);
      }
    });

    // Finish
    if (!this.finished && p.x > this.worldW - 220) {
      this.finished = true;
      this.cb.onFinish();
    }
  }

  private paletteAt(frac: number): ZonePalette {
    const i = Math.min(Math.floor(frac), this.palettes.length - 1);
    const j = Math.min(i + 1, this.palettes.length - 1);
    const t = Math.min(Math.max(frac - i, 0), 1);
    const a = this.palettes[i];
    const b = this.palettes[j];
    return {
      skyTop: lerpHex(a.skyTop, b.skyTop, t),
      skyBottom: lerpHex(a.skyBottom, b.skyBottom, t),
      ground: lerpHex(a.ground, b.ground, t),
      groundTop: lerpHex(a.groundTop, b.groundTop, t),
      building: lerpHex(a.building, b.building, t),
    };
  }

  private render() {
    const { ctx, w, h, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const camX = Math.max(0, Math.min(this.player.x - w * 0.42, this.worldW - w));
    // Blend palette by the middle of the visible area for smooth transitions
    const pal = this.paletteAt((camX + w / 2) / ZONE_WIDTH - 0.5 + 0.5);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, this.groundY);
    sky.addColorStop(0, pal.skyTop);
    sky.addColorStop(1, pal.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, this.groundY);

    // Parallax skyline
    const par = 0.45;
    const step = 130;
    const first = Math.floor((camX * par - step) / step);
    const count = Math.ceil(w / step) + 3;
    ctx.fillStyle = pal.building;
    for (let i = first; i < first + count; i++) {
      const rnd = mulberry32(i * 9973 + 17);
      const bw = 60 + rnd() * 70;
      const bh = 50 + rnd() * (this.groundY * 0.42);
      const bx = i * step + rnd() * 30 - camX * par;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(bx, this.groundY - bh, bw, bh);
      // windows
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#ffe9a8';
      const cols = Math.floor(bw / 18);
      const rows = Math.floor(bh / 26);
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          if (rnd() > 0.55) ctx.fillRect(bx + 6 + cx * 18, this.groundY - bh + 8 + cy * 26, 7, 10);
        }
      }
      ctx.fillStyle = pal.building;
      ctx.globalAlpha = 1;
    }

    // Ground
    ctx.fillStyle = pal.ground;
    ctx.fillRect(0, this.groundY, w, h - this.groundY);
    ctx.fillStyle = pal.groundTop;
    ctx.fillRect(0, this.groundY, w, 10);

    // Zone signs
    const zFirst = Math.max(0, Math.floor(camX / ZONE_WIDTH));
    const zLast = Math.min(this.zones.length - 1, Math.floor((camX + w) / ZONE_WIDTH) + 1);
    for (let zi = zFirst; zi <= zLast; zi++) {
      this.drawSign(zi, camX);
      this.drawOrbs(zi, camX);
      if (this.zones[zi].hasBoss && this.bossFade[zi] > 0.01) this.drawBoss(zi, camX);
    }

    // Epilogue door
    this.drawDoor(camX);

    // Player
    this.drawPlayer(camX);
  }

  private drawSign(zi: number, camX: number) {
    const { ctx } = this;
    const x = zi * ZONE_WIDTH + 100 - camX;
    if (x < -220 || x > this.w + 220) return;
    const z = this.zones[zi];
    ctx.fillStyle = '#6b4f2e';
    ctx.fillRect(x - 3, this.groundY - 78, 6, 78);
    const bw = 196;
    ctx.fillStyle = '#f6efe2';
    ctx.strokeStyle = '#3f3428';
    ctx.lineWidth = 2;
    ctx.fillRect(x - bw / 2, this.groundY - 122, bw, 48);
    ctx.strokeRect(x - bw / 2, this.groundY - 122, bw, 48);
    ctx.fillStyle = '#26201a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px ui-monospace, monospace';
    ctx.fillText(z.year, x, this.groundY - 103);
    ctx.font = 'bold 11px ui-monospace, monospace';
    const label = z.company.length > 26 ? z.company.slice(0, 25) + '…' : z.company;
    ctx.fillText(label, x, this.groundY - 86);
  }

  private drawOrbs(zi: number, camX: number) {
    const { ctx } = this;
    this.orbs[zi].forEach((o, si) => {
      if (o.collected) return;
      const x = o.x - camX;
      if (x < -40 || x > this.w + 40) return;
      const bob = this.reduced ? 0 : Math.sin(this.t * 2.6 + o.x * 0.05) * 6;
      const y = this.groundY - 46 + bob;
      const c = TREE_COLORS[o.tree];
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.shadowColor = c;
      ctx.shadowBlur = 14;
      ctx.fillStyle = c;
      ctx.fillRect(-9, -9, 18, 18);
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillRect(-9, -9, 8, 8);
      ctx.restore();
      void si;
    });
  }

  private drawBoss(zi: number, camX: number) {
    const { ctx } = this;
    const x = this.bossX[zi] - camX;
    if (x < -160 || x > this.w + 160) return;
    const fade = this.bossFade[zi];
    const defeatedNow = this.defeated[zi];
    const bob = this.reduced || defeatedNow ? 0 : Math.sin(this.t * 2) * 5;
    const bw = 88;
    const bh = 104;
    const y = this.groundY - bh + bob - (defeatedNow ? (1 - fade) * 30 : 0);

    ctx.save();
    ctx.globalAlpha = fade;
    // body
    ctx.fillStyle = '#2d1f47';
    ctx.fillRect(x - bw / 2, y, bw, bh);
    ctx.fillStyle = '#43306b';
    ctx.fillRect(x - bw / 2, y, bw, 16);
    // horns
    ctx.fillStyle = '#1c1330';
    ctx.fillRect(x - bw / 2 - 6, y - 14, 14, 20);
    ctx.fillRect(x + bw / 2 - 8, y - 14, 14, 20);
    // eyes tracking player
    const look = Math.max(-4, Math.min(4, (this.player.x - this.bossX[zi]) * 0.05));
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 26, y + 30, 18, 14);
    ctx.fillRect(x + 8, y + 30, 18, 14);
    ctx.fillStyle = '#e11d48';
    ctx.fillRect(x - 21 + look, y + 33, 8, 8);
    ctx.fillRect(x + 13 + look, y + 33, 8, 8);
    // mouth
    ctx.fillStyle = '#12091f';
    ctx.fillRect(x - 18, y + 64, 36, 8);

    // name plate
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px ui-monospace, monospace';
    const name = this.zones[zi].bossName;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,0,0,0.65)';
    ctx.strokeText(name, x, y - 26);
    ctx.fillStyle = '#ffe9a8';
    ctx.fillText(name, x, y - 26);

    // interact bubble
    if (!defeatedNow && this.bossRangeZone === zi) {
      const by = y - 58 + (this.reduced ? 0 : Math.sin(this.t * 5) * 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 13, by - 13, 26, 26);
      ctx.strokeStyle = '#26201a';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 13, by - 13, 26, 26);
      ctx.fillStyle = '#26201a';
      ctx.font = 'bold 15px ui-monospace, monospace';
      ctx.fillText('E', x, by + 5);
    }
    ctx.restore();
  }

  private drawDoor(camX: number) {
    const { ctx } = this;
    const x = this.worldW - 160 - camX;
    if (x < -120 || x > this.w + 120) return;
    const dw = 66;
    const dh = 112;
    const y = this.groundY - dh;
    const glow = this.reduced ? 0.5 : 0.4 + Math.sin(this.t * 2) * 0.15;
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 30 * glow * 2;
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - dw / 2, y, dw, dh);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - dw / 2 + 6, y + 6, dw - 12, dh - 6);
    ctx.fillStyle = '#fff7e0';
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px ui-monospace, monospace';
    ctx.fillText('?', x, y + dh / 2 + 10);
    ctx.restore();
  }

  private drawPlayer(camX: number) {
    const { ctx } = this;
    const p = this.player;
    const x = p.x - camX;
    const yBase = this.groundY + p.yOff;
    const zi = Math.min(Math.max(this.curZone, 0), this.zones.length - 1);

    // Outfit evolves with the career
    let top = '#0e7490'; // student hoodie
    let pants = '#334155';
    let shirt: string | null = null;
    let tie: string | null = null;
    if (zi >= 2 && zi <= 4) top = '#94a3b8'; // dev shirt
    if (zi === 5) top = '#0f766e'; // senior polo
    if (zi >= 6) {
      top = '#1e293b'; // leader blazer
      shirt = '#f8fafc';
      tie = '#e11d48';
    }

    const walking = p.move !== 0 && p.onGround;
    const leg = walking && !this.reduced ? Math.sin(this.t * 11) * 5 : 0;

    ctx.save();
    ctx.translate(x, yBase);
    ctx.scale(p.dir, 1);

    // legs
    ctx.fillStyle = pants;
    ctx.fillRect(-9 + leg, -20, 8, 20);
    ctx.fillRect(1 - leg, -20, 8, 20);
    // shoes
    ctx.fillStyle = '#111827';
    ctx.fillRect(-9 + leg, -4, 10, 4);
    ctx.fillRect(1 - leg, -4, 10, 4);
    // torso
    ctx.fillStyle = top;
    ctx.fillRect(-11, -42, 22, 24);
    if (shirt) {
      ctx.fillStyle = shirt;
      ctx.fillRect(-4, -42, 8, 14);
      if (tie) {
        ctx.fillStyle = tie;
        ctx.fillRect(-1.5, -42, 3, 12);
      }
    }
    // arms
    ctx.fillStyle = top;
    ctx.fillRect(-14, -40, 4, 18);
    ctx.fillRect(10, -40, 4, 18);
    // head
    ctx.fillStyle = '#e8b98c';
    ctx.fillRect(-8, -58, 16, 16);
    // hair
    ctx.fillStyle = '#3b2f2f';
    ctx.fillRect(-8, -60, 16, 6);
    ctx.fillRect(-8, -58, 3, 8);
    // eye
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(3, -52, 3, 3);
    ctx.restore();
    void PLAYER_W;
    void PLAYER_H;
  }
}
