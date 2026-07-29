'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameDictionary, SkillTree } from '@/content/game';
import { zonePalettes } from '@/content/game';
import { CareerQuestEngine, type EngineZone } from './engine';

type Overlay =
  | { kind: 'skill'; z: number; s: number }
  | { kind: 'boss'; z: number; phase: 'intro' | 'wrong' | 'result' }
  | { kind: 'badge'; z: number }
  | { kind: 'cv' }
  | { kind: 'map' }
  | { kind: 'final' };

const TREE_BADGE_CLASS: Record<SkillTree, string> = {
  dev: 'bg-sky-500/15 text-sky-500',
  mgmt: 'bg-amber-500/15 text-amber-500',
  biz: 'bg-emerald-500/15 text-emerald-500',
};

export default function CareerQuest({
  dict,
  locale,
  linkedinUrl,
}: {
  dict: GameDictionary;
  locale: 'en' | 'pt';
  linkedinUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CareerQuestEngine | null>(null);

  const [started, setStarted] = useState(false);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [zone, setZone] = useState(0);
  const [xp, setXp] = useState(0);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [defeated, setDefeated] = useState<Set<number>>(new Set());
  const [badges, setBadges] = useState<string[]>([]);
  const [bossPromptZone, setBossPromptZone] = useState<number>(-1);
  const finishedRef = useRef(false);

  const totalSkills = useMemo(
    () => dict.zones.reduce((acc, z) => acc + z.skills.length, 0),
    [dict.zones]
  );
  const totalBadges = useMemo(() => dict.zones.filter((z) => z.badge).length, [dict.zones]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engineZones: EngineZone[] = dict.zones.map((z) => ({
      year: z.year,
      company: z.company,
      skillTrees: z.skills.map((s) => s.tree),
      hasBoss: Boolean(z.boss),
      bossName: z.boss?.name ?? '',
    }));

    const engine = new CareerQuestEngine(canvas, engineZones, zonePalettes, {
      onSkillTouch: (z, s) => {
        setCollected((prev) => new Set(prev).add(`${z}:${s}`));
        setXp((prev) => prev + 10);
        setOverlay({ kind: 'skill', z, s });
      },
      onBossRange: (z, inRange) => setBossPromptZone(inRange ? z : -1),
      onBossInteract: (z) => setOverlay({ kind: 'boss', z, phase: 'intro' }),
      onZoneChange: (z) => setZone(z),
      onFinish: () => {
        if (!finishedRef.current) {
          finishedRef.current = true;
          setOverlay({ kind: 'final' });
        }
      },
    });
    engineRef.current = engine;
    engine.start();
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dict]);

  useEffect(() => {
    const engine = engineRef.current;
    if (engine) engine.paused = !started || overlay !== null;
  }, [started, overlay]);

  const closeOverlay = useCallback(() => setOverlay(null), []);

  const answerBoss = (z: number, i: number) => {
    const boss = dict.zones[z].boss;
    if (!boss) return;
    if (i === boss.correct) {
      engineRef.current?.markBossDefeated(z);
      setDefeated((prev) => new Set(prev).add(z));
      setXp((prev) => prev + 25);
      setOverlay({ kind: 'boss', z, phase: 'result' });
    } else {
      setOverlay({ kind: 'boss', z, phase: 'wrong' });
    }
  };

  const afterBossResult = (z: number) => {
    const badge = dict.zones[z].badge;
    if (badge && !badges.includes(badge.id)) {
      setBadges((prev) => [...prev, badge.id]);
      setOverlay({ kind: 'badge', z });
    } else {
      closeOverlay();
    }
  };

  const travel = (z: number) => {
    engineRef.current?.teleport(z);
    setZone(z);
    setStarted(true);
    closeOverlay();
  };

  const zoneData = dict.zones[zone] ?? dict.zones[0];
  const earnedBadges = dict.zones.filter((z) => z.badge && badges.includes(z.badge.id));

  const btnPrimary =
    'rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover';
  const btnSecondary =
    'rounded-lg border border-line/15 px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-primary hover:text-primary';

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-line/10 bg-[#0b1120]">
      {/* Stage */}
      <div className="relative h-[420px] w-full md:h-[500px]" aria-label={dict.ui.startTitle}>
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* HUD */}
        {started && (
          <>
            <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/55 px-3 py-2 font-mono text-xs text-white backdrop-blur-sm">
              <div className="font-bold">{zoneData.year}</div>
              <div className="opacity-80">{zoneData.company}</div>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <div className="pointer-events-none rounded-lg bg-black/55 px-3 py-2 font-mono text-xs text-white backdrop-blur-sm">
                {dict.ui.hudXp} {xp} · {dict.ui.hudSkills} {collected.size}/{totalSkills}
                {earnedBadges.length > 0 && (
                  <span className="ml-1">
                    {earnedBadges.map((z) => (
                      <span key={z.badge!.id} title={z.badge!.name}>
                        {z.badge!.icon}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOverlay({ kind: 'map' })}
                className="rounded-lg bg-black/55 px-3 py-2 font-mono text-xs font-bold text-white backdrop-blur-sm transition hover:bg-black/75"
              >
                {dict.ui.hudMap}
              </button>
              <button
                onClick={() => setOverlay({ kind: 'cv' })}
                className="rounded-lg bg-black/55 px-3 py-2 font-mono text-xs font-bold text-white backdrop-blur-sm transition hover:bg-black/75"
              >
                {dict.ui.hudCv}
              </button>
            </div>

            {/* Boss prompt */}
            {bossPromptZone >= 0 && overlay === null && (
              <button
                onClick={() => engineRef.current?.interact()}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-pulse rounded-lg bg-red-600/90 px-4 py-2 font-mono text-sm font-bold text-white shadow-lg transition hover:bg-red-500 md:bottom-16"
              >
                ⚔ {dict.zones[bossPromptZone].boss?.name} — {dict.ui.bossPrompt}
              </button>
            )}

            {/* Touch controls */}
            <div className="absolute inset-x-0 bottom-3 flex items-end justify-between px-4 md:hidden">
              <div className="flex gap-2">
                <TouchBtn label="◀" aria={dict.ui.touchLeft} onDown={() => engineRef.current?.setMove(-1)} onUp={() => engineRef.current?.setMove(0)} />
                <TouchBtn label="▶" aria={dict.ui.touchRight} onDown={() => engineRef.current?.setMove(1)} onUp={() => engineRef.current?.setMove(0)} />
              </div>
              <div className="flex gap-2">
                <TouchBtn label="⤒" aria={dict.ui.touchJump} onDown={() => engineRef.current?.jump()} />
                <TouchBtn label="E" aria={dict.ui.touchAction} onDown={() => engineRef.current?.interact()} />
              </div>
            </div>
          </>
        )}

        {/* Title screen */}
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 px-6 text-center backdrop-blur-[2px]">
            <h2 className="font-mono text-3xl font-black tracking-widest text-white md:text-5xl">
              {dict.ui.startTitle}
            </h2>
            <p className="max-w-xl text-sm text-white/85 md:text-base">{dict.ui.tagline}</p>
            <div className="max-w-md rounded-xl bg-black/45 p-4 text-left">
              <div className="mb-2 font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                {dict.ui.howTitle}
              </div>
              <ul className="space-y-1 text-xs leading-relaxed text-white/80 md:text-sm">
                {dict.ui.how.map((h) => (
                  <li key={h}>· {h}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => setStarted(true)} className={`${btnPrimary} animate-pulse font-mono`}>
                ▶ {dict.ui.startBtn}
              </button>
              <button
                onClick={() => {
                  setStarted(true);
                  setOverlay({ kind: 'map' });
                }}
                className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/60"
              >
                {dict.ui.openMapBtn}
              </button>
            </div>
            <p className="max-w-md text-xs text-white/60">{dict.ui.recruiterNote}</p>
          </div>
        )}

        {/* Overlays */}
        {overlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]">
            <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl border border-line/10 bg-bg p-6 shadow-2xl">
              {overlay.kind === 'skill' && (() => {
                const skill = dict.zones[overlay.z].skills[overlay.s];
                return (
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-widest text-primary">
                      {dict.ui.skillUnlocked} · +10 {dict.ui.hudXp}
                    </div>
                    <div className="mt-3 text-2xl font-black text-fg">{skill.name}</div>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${TREE_BADGE_CLASS[skill.tree]}`}>
                      {dict.ui.trees[skill.tree]}
                    </span>
                    <p className="mt-3 text-sm text-muted">{skill.evidence}</p>
                    <button onClick={closeOverlay} className={`${btnPrimary} mt-5`}>
                      {dict.ui.continueBtn}
                    </button>
                  </div>
                );
              })()}

              {overlay.kind === 'boss' && (() => {
                const boss = dict.zones[overlay.z].boss!;
                return (
                  <div>
                    <div className="text-center text-xs font-bold uppercase tracking-widest text-red-500">
                      {dict.ui.bossChallenge}
                    </div>
                    <div className="mt-2 text-center font-mono text-xl font-black text-fg md:text-2xl">
                      {boss.name}
                    </div>
                    {overlay.phase === 'intro' && (
                      <>
                        <p className="mt-3 text-sm italic text-muted">{boss.intro}</p>
                        <p className="mt-4 text-sm font-semibold text-fg">{boss.question}</p>
                        <div className="mt-4 space-y-2">
                          {boss.options.map((opt, i) => (
                            <button
                              key={opt}
                              onClick={() => answerBoss(overlay.z, i)}
                              className="w-full rounded-lg border border-line/15 px-4 py-3 text-left text-sm text-fg transition hover:border-primary hover:text-primary"
                            >
                              {String.fromCharCode(65 + i)}. {opt}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    {overlay.phase === 'wrong' && (
                      <div className="mt-4 text-center">
                        <div className="text-lg font-bold text-fg">{dict.ui.wrongTitle}</div>
                        <p className="mt-2 text-sm text-muted">💡 {boss.hint}</p>
                        <button
                          onClick={() => setOverlay({ kind: 'boss', z: overlay.z, phase: 'intro' })}
                          className={`${btnPrimary} mt-5`}
                        >
                          {dict.ui.tryAgain}
                        </button>
                      </div>
                    )}
                    {overlay.phase === 'result' && (
                      <div className="mt-4 text-center">
                        <div className="text-lg font-bold text-primary">
                          ✓ {dict.ui.victoryTitle} · +25 {dict.ui.hudXp}
                        </div>
                        <p className="mt-3 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm font-medium text-fg">
                          {boss.result}
                        </p>
                        <button onClick={() => afterBossResult(overlay.z)} className={`${btnPrimary} mt-5`}>
                          {dict.ui.continueBtn}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {overlay.kind === 'badge' && (() => {
                const badge = dict.zones[overlay.z].badge!;
                return (
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-widest text-amber-500">
                      {dict.ui.badgeEarned}
                    </div>
                    <div className="mt-3 text-5xl">{badge.icon}</div>
                    <div className="mt-2 text-2xl font-black text-fg">{badge.name}</div>
                    <p className="mt-3 text-sm text-muted">{badge.desc}</p>
                    <button onClick={closeOverlay} className={`${btnPrimary} mt-5`}>
                      {dict.ui.continueBtn}
                    </button>
                  </div>
                );
              })()}

              {overlay.kind === 'cv' && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary">
                    {dict.ui.cvTitle} · {zoneData.year}
                  </div>
                  <div className="mt-2 text-xl font-black text-fg">{zoneData.company}</div>
                  <div className="text-sm font-medium text-muted">{zoneData.role}</div>
                  <ul className="mt-4 space-y-2">
                    {zoneData.miniCv.map((b) => (
                      <li key={b} className="flex gap-2 text-sm leading-relaxed text-muted">
                        <span className="text-primary">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button onClick={closeOverlay} className={`${btnSecondary} mt-5`}>
                    {dict.ui.closeBtn}
                  </button>
                </div>
              )}

              {overlay.kind === 'map' && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary">
                    {dict.ui.mapTitle}
                  </div>
                  <p className="mt-1 text-xs text-muted">{dict.ui.mapHint}</p>
                  <div className="mt-4 space-y-1.5">
                    {dict.zones.map((z, i) => (
                      <button
                        key={z.id}
                        onClick={() => travel(i)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition hover:border-primary ${
                          i === zone ? 'border-primary/50 bg-primary/5' : 'border-line/10'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-fg">
                            {z.company}
                            {z.badge && badges.includes(z.badge.id) && (
                              <span className="ml-1">{z.badge.icon}</span>
                            )}
                          </div>
                          <div className="truncate text-xs text-muted">{z.role}</div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="font-mono text-xs font-bold text-muted">{z.year}</div>
                          <div className="text-xs font-semibold text-primary">
                            {dict.ui.travelBtn} →
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button onClick={closeOverlay} className={`${btnSecondary} mt-4`}>
                    {dict.ui.closeBtn}
                  </button>
                </div>
              )}

              {overlay.kind === 'final' && (
                <div className="text-center">
                  <div className="text-4xl">🏁</div>
                  <div className="mt-2 text-2xl font-black text-fg">{dict.final.title}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{dict.final.body}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <Stat label={dict.final.statsXp} value={String(xp)} />
                    <Stat label={dict.final.statsSkills} value={`${collected.size}/${totalSkills}`} />
                    <Stat label={dict.final.statsBadges} value={`${badges.length}/${totalBadges}`} />
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <a href={`/${locale}/contact/`} className={btnPrimary}>
                      {dict.final.ctaContact}
                    </a>
                    <a
                      href={`/resume/philip-scheer-cv-${locale}.pdf`}
                      download
                      className={btnSecondary}
                    >
                      {dict.final.ctaResume}
                    </a>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                      {dict.final.ctaLinkedin}
                    </a>
                    <button
                      onClick={() => {
                        finishedRef.current = false;
                        travel(0);
                      }}
                      className="mt-1 text-xs font-semibold text-muted transition hover:text-primary"
                    >
                      ↻ {dict.final.replay}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line/10 p-3">
      <div className="font-mono text-lg font-black text-primary">{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
    </div>
  );
}

function TouchBtn({
  label,
  aria,
  onDown,
  onUp,
}: {
  label: string;
  aria: string;
  onDown: () => void;
  onUp?: () => void;
}) {
  return (
    <button
      aria-label={aria}
      className="h-14 w-14 select-none rounded-full bg-white/15 font-mono text-xl font-bold text-white backdrop-blur-sm active:bg-white/30"
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerCancel={onUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  );
}
