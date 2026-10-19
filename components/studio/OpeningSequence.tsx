'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '@/lib/content/portfolio';
import { useReducedMotionPref } from '@/hooks/useMedia';
import { EASE, Magnetic } from './fx';

/**
 * Blueprint → Reality — wireframe systems assemble, then resolve into
 * portrait + name. Story: software engineer who owns frontend systems.
 */
const TIMELINE = [
  { at: 160, beat: 1 },
  { at: 1000, beat: 2 },
  { at: 1900, beat: 3 },
  { at: 2700, beat: 4 },
  { at: 3600, beat: 5 },
  { at: 4500, beat: 6 },
];

/** High-signal frontend chips — professional, impact-led. */
const CHIPS = [
  { label: 'Interface Architecture', x: '6%', y: '26%' },
  { label: 'Platform Ownership', x: '64%', y: '22%' },
  { label: 'React · Next.js', x: '8%', y: '66%' },
  { label: 'Production Frontend', x: '62%', y: '70%' },
];

export default function OpeningSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotionPref();
  const [beat, setBeat] = useState(reduced ? 6 : 0);

  useEffect(() => {
    if (reduced) return;
    const timers = TIMELINE.map(({ at, beat: b }) => window.setTimeout(() => setBeat(b), at));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-ink"
      exit={{ opacity: 0, filter: 'blur(16px)', scale: 1.02 }}
      transition={{ duration: 0.85, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label="Blueprint to reality opening"
    >
      {/* Blueprint field */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 1 ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background:
            'radial-gradient(55% 45% at 50% 50%, rgba(45,212,191,0.12), transparent 70%), radial-gradient(40% 35% at 80% 15%, rgba(212,165,116,0.08), transparent 55%)',
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{
          opacity: beat >= 1 && beat < 5 ? 0.55 : beat >= 5 ? 0.1 : 0,
          scale: beat >= 1 && beat < 5 ? 1 : 1.02,
        }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{
          backgroundImage:
            'linear-gradient(rgba(45,212,191,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.14) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 78%)',
        }}
      />

      {/* Horizontal scan — blueprint reading pass */}
      {beat >= 1 && beat < 5 && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-[1] h-px bg-gradient-to-r from-transparent via-signal to-transparent"
          initial={{ top: '12%', opacity: 0 }}
          animate={{ top: ['12%', '86%'], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 2.4, ease: 'linear', repeat: Infinity, repeatDelay: 0.35 }}
        />
      )}

      {/* Boot progress */}
      <motion.div
        aria-hidden
        className="absolute inset-x-[14%] top-7 z-30 h-px overflow-hidden bg-white/10 sm:inset-x-[24%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: beat >= 1 ? 1 : 0 }}
      >
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-signal via-signal-2 to-gold"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.min(beat / 6, 1) }}
          transition={{ duration: 0.65, ease: EASE }}
        />
      </motion.div>

      {/* Wireframe silhouette / system frame */}
      <motion.div
        className="absolute inset-0 z-[2] flex items-center justify-center"
        animate={beat >= 1 && beat < 5 ? { scale: [1, 1.012, 1] } : { scale: 1 }}
        transition={{ duration: 3.2, ease: 'easeInOut', repeat: beat >= 1 && beat < 5 ? Infinity : 0 }}
      >
        <BlueprintFrame active={beat >= 1} dissolving={beat >= 5} />
      </motion.div>

      {/* System chips snap in */}
      <AnimatePresence>
        {beat >= 2 &&
          beat < 5 &&
          CHIPS.map((chip, i) => (
            <motion.span
              key={chip.label}
              className="pointer-events-none absolute z-[3] rounded-md border border-signal/40 bg-ink/75 px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-signal-2 shadow-[0_0_24px_rgba(45,212,191,0.12)] backdrop-blur-sm sm:text-[11px] sm:tracking-[0.2em]"
              style={{ left: chip.x, top: chip.y }}
              initial={{ opacity: 0, scale: 0.65, y: 14, filter: 'blur(6px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -4, 0],
                filter: 'blur(0px)',
              }}
              exit={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
              transition={{
                opacity: { duration: 0.5, ease: EASE, delay: i * 0.1 },
                scale: { duration: 0.5, ease: EASE, delay: i * 0.1 },
                filter: { duration: 0.5, ease: EASE, delay: i * 0.1 },
                y: { duration: 2.8, ease: 'easeInOut', repeat: Infinity, delay: 0.6 + i * 0.12 },
              }}
            >
              {chip.label}
            </motion.span>
          ))}
      </AnimatePresence>

      {/* Portrait — reality resolve + light sweep */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-[4] mx-auto flex h-[72svh] max-w-[920px] items-end justify-center"
        initial={{ opacity: 0, scale: 1.08, filter: 'blur(22px) brightness(0.2) saturate(0.25)' }}
        animate={
          beat >= 5
            ? { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1) saturate(1)' }
            : {}
        }
        transition={{ duration: 1.55, ease: EASE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.portrait.src}
          srcSet={profile.portrait.srcSet}
          sizes={profile.portrait.sizes}
          width={profile.portrait.width}
          height={profile.portrait.height}
          alt={profile.portrait.alt}
          fetchPriority="high"
          decoding="async"
          className="h-full w-auto max-w-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_52%,transparent_98%)]"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-[10%] left-0 w-[30%] skew-x-[-14deg] bg-gradient-to-r from-transparent via-white/28 to-transparent mix-blend-screen"
          initial={{ x: '-50%', opacity: 0 }}
          animate={beat >= 5 ? { x: '170%', opacity: [0, 1, 0.5, 0] } : {}}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 z-[5] bg-[radial-gradient(65%_55%_at_50%_42%,transparent_28%,rgba(6,9,16,0.92)_100%)]"
      />

      {/* Typography */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <motion.p
          className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-signal sm:text-xs sm:tracking-[0.45em]"
          initial={{ opacity: 0, y: 8 }}
          animate={beat >= 3 ? { opacity: 1, y: beat >= 5 ? '-22svh' : 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          From blueprint
        </motion.p>

        <motion.h1
          className="font-display font-bold leading-[0.88] text-bone drop-shadow-[0_8px_40px_rgba(0,0,0,0.85)]"
          style={{ fontSize: 'clamp(3.6rem, 15vw, 10.5rem)' }}
          initial={{ opacity: 0, y: 40, filter: 'blur(18px)', letterSpacing: '0.12em' }}
          animate={
            beat >= 3
              ? {
                  opacity: 1,
                  y: beat >= 5 ? '-22svh' : 0,
                  filter: 'blur(0px)',
                  letterSpacing: '0em',
                }
              : {}
          }
          transition={{ duration: 1.1, ease: EASE }}
        >
          {profile.firstName}
        </motion.h1>

        <motion.p
          className="mt-3 font-sans text-[11px] font-semibold uppercase text-gold-2 [text-shadow:0_2px_20px_rgba(0,0,0,0.9)] sm:text-sm"
          initial={{ opacity: 0, letterSpacing: '0.85em' }}
          animate={
            beat >= 4
              ? {
                  opacity: 1,
                  letterSpacing: '0.28em',
                  y: beat >= 5 ? '-22svh' : 0,
                }
              : {}
          }
          transition={{ duration: 1, ease: EASE }}
        >
          To reality · frontend systems owned end to end
        </motion.p>
      </div>

      <div className="absolute inset-x-0 bottom-[8svh] z-20 flex flex-col items-center gap-5 px-4 text-center">
        <motion.p
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-bone/85 sm:text-sm sm:tracking-[0.3em]"
          initial={{ opacity: 0, y: 12 }}
          animate={beat >= 5 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {profile.tagline.join('  ·  ')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={beat >= 6 ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Magnetic>
            <button
              type="button"
              data-cursor="play"
              onClick={onDone}
              tabIndex={beat >= 6 ? 0 : -1}
              className="group flex items-center gap-3 rounded-full bg-signal px-9 py-4 font-sans text-base font-bold tracking-wide text-ink shadow-[0_0_50px_var(--glow-signal)] transition hover:bg-signal-2"
            >
              <span className="text-lg transition-transform group-hover:translate-x-0.5">→</span>
              EXPLORE WORK
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="absolute right-4 top-11 z-40 sm:top-5 rounded-full border border-white/15 px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.2em] text-mist transition hover:border-signal/50 hover:text-bone"
      >
        SKIP
      </button>
    </motion.div>
  );
}

function BlueprintFrame({ active, dissolving }: { active: boolean; dissolving: boolean }) {
  return (
    <svg
      viewBox="0 0 320 420"
      className="h-[min(70svh,520px)] w-auto text-signal"
      fill="none"
      aria-hidden
    >
      <motion.rect
        x="40"
        y="36"
        width="240"
        height="348"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.45"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: dissolving ? 0 : 1 } : {}}
        transition={{ duration: dissolving ? 0.7 : 1.2, ease: EASE }}
      />
      {/* Inner layout guides — UI wireframe feel */}
      <motion.path
        d="M64 96 H256 M64 128 H200 M64 300 H256 M64 332 H180"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.28"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: dissolving ? 0 : 1 } : {}}
        transition={{ duration: dissolving ? 0.5 : 1, ease: EASE, delay: dissolving ? 0 : 0.35 }}
      />
      <motion.ellipse
        cx="160"
        cy="150"
        rx="52"
        ry="62"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.55"
        strokeDasharray="6 8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: dissolving ? 0 : 0.7 } : {}}
        transition={{ duration: dissolving ? 0.6 : 1.1, ease: EASE, delay: dissolving ? 0 : 0.2 }}
      />
      <motion.path
        d="M96 280 C110 220 210 220 224 280 L224 340 C224 360 200 372 160 372 C120 372 96 360 96 340 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.5"
        strokeDasharray="7 9"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: dissolving ? 0 : 0.65 } : {}}
        transition={{ duration: dissolving ? 0.6 : 1.25, ease: EASE, delay: dissolving ? 0 : 0.35 }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1="28"
          y1={80 + i * 80}
          x2="40"
          y2={80 + i * 80}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.4"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: dissolving ? 0 : 1 } : {}}
          transition={{ delay: dissolving ? 0 : 0.45 + i * 0.06, duration: 0.4 }}
        />
      ))}
      <motion.text
        x="160"
        y="400"
        textAnchor="middle"
        fill="currentColor"
        fillOpacity="0.55"
        style={{ fontSize: 9, letterSpacing: '0.35em', fontFamily: 'ui-sans-serif, system-ui' }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: dissolving ? 0 : 0.8 } : {}}
        transition={{ delay: dissolving ? 0 : 0.7, duration: 0.5 }}
      >
        INTERFACE SPEC
      </motion.text>
    </svg>
  );
}
