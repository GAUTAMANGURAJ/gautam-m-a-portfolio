'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { profile, sectionMeta, viewerProfiles, type ProfileId } from '@/lib/content/portfolio';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useFinePointer, useReducedMotionPref } from '@/hooks/useMedia';
import { EASE, Magnetic } from './fx';

export function ProfileAvatar({ id, size = 'lg' }: { id: ProfileId; size?: 'sm' | 'lg' }) {
  const p = viewerProfiles.find((v) => v.id === id)!;
  const box = size === 'lg' ? 'h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-2xl' : 'h-8 w-8 rounded-lg';
  if (id === 'gautam') {
    return (
      <span
        className={`relative block overflow-hidden ${box}`}
        style={{ background: 'radial-gradient(circle at 50% 30%, #134e4a, #060910)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.portrait.src}
          srcSet={profile.portrait.srcSet}
          sizes="144px"
          width={profile.portrait.width}
          height={profile.portrait.height}
          alt=""
          decoding="async"
          className="absolute inset-x-0 bottom-0 mx-auto h-[115%] w-auto max-w-none object-cover object-top"
        />
      </span>
    );
  }
  const glyph = { recruiter: 'R', developer: '</>', creative: '◇' }[id];
  return (
    <span
      className={`relative flex items-center justify-center overflow-hidden font-display font-bold text-bone ${box}`}
      style={{ background: `linear-gradient(145deg, ${p.color}, #060910 125%)` }}
    >
      <span className={size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-sm'}>{glyph}</span>
    </span>
  );
}

export default function ProfileSelector({ onPick }: { onPick: (id: ProfileId) => void }) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const root = useRef<HTMLDivElement>(null);
  useFocusTrap(true, root);
  const [locked, setLocked] = useState<ProfileId | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !locked) onPick('gautam');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPick, locked]);

  const select = (id: ProfileId) => {
    if (locked) return;
    setLocked(id);
    window.setTimeout(() => onPick(id), reduced ? 120 : 520);
  };

  return (
    <motion.div
      ref={root}
      data-lenis-prevent
      className="sheet-scroll fixed inset-0 z-[110] flex flex-col items-center overflow-y-auto before:flex-1 before:content-[''] after:flex-1 after:content-[''] overscroll-y-contain bg-ink px-4 py-16"
      initial={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.75, ease: EASE }}
      role="dialog"
      aria-modal="true"
      aria-label="Choose how to enter the portfolio"
      aria-busy={locked ? true : undefined}
    >
      {/* Blueprint handoff atmosphere */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        style={{
          background:
            'radial-gradient(55% 40% at 50% 0%, rgba(45,212,191,0.14), transparent 70%), radial-gradient(40% 35% at 80% 80%, rgba(212,165,116,0.08), transparent 60%)',
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(45,212,191,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      />

      <motion.p
        className="relative mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        Frontend systems
      </motion.p>
      <motion.h2
        className="relative mb-3 text-center font-display text-4xl font-bold tracking-tight text-bone sm:text-5xl"
        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
      >
        Choose your path
      </motion.h2>
      <motion.p
        className="relative mb-10 max-w-sm text-center text-sm text-mist"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        Same proof — pick the shortest path for you. Recruiters: start with Resume.
      </motion.p>

      <motion.ul
        className="relative grid grid-cols-2 gap-5 sm:flex sm:gap-8"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1, delayChildren: 0.22 } },
        }}
      >
        {viewerProfiles.map((p) => {
          const startsAt = sectionMeta[p.order[0]].nav;
          const isLocked = locked === p.id;
          const dimmed = locked !== null && !isLocked;

          return (
            <motion.li
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 28, scale: 0.92, filter: 'blur(8px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: { duration: 0.65, ease: EASE },
                },
              }}
              animate={
                isLocked
                  ? { scale: 1.06, opacity: 1 }
                  : dimmed
                    ? { opacity: 0.28, scale: 0.96, filter: 'blur(2px)' }
                    : undefined
              }
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Magnetic strength={fine && !reduced ? 0.22 : 0}>
                <button
                  type="button"
                  onClick={() => select(p.id)}
                  disabled={locked !== null}
                  data-cursor="play"
                  className="group flex min-h-[44px] flex-col items-center gap-3 text-center disabled:cursor-default"
                  aria-label={`${p.name}. ${p.blurb}. Starts at ${startsAt}.`}
                >
                  <motion.span
                    className="relative rounded-2xl ring-2 ring-transparent transition duration-300 group-hover:ring-signal/70 group-focus-visible:ring-signal group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink"
                    whileHover={fine && !locked ? { scale: 1.05, y: -4 } : undefined}
                    whileTap={!locked ? { scale: 0.97 } : undefined}
                    animate={
                      isLocked
                        ? {
                            scale: [1, 1.08, 1.04],
                            boxShadow: [
                              '0 0 0 0 rgba(45,212,191,0)',
                              '0 0 36px 4px rgba(45,212,191,0.35)',
                              '0 0 28px 2px rgba(45,212,191,0.25)',
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <ProfileAvatar id={p.id} />
                    {p.badge && (
                      <span
                        className={`absolute -right-2 -top-2 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-ink ${
                          p.id === 'recruiter' ? 'bg-signal' : 'bg-gold'
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                    {isLocked && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-2xl border-2 border-signal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </motion.span>
                  <span className="font-sans text-sm font-medium text-mist transition group-hover:text-bone sm:text-base">
                    {p.name}
                  </span>
                  <span className="max-w-[9.5rem] text-[11px] leading-snug text-smoke">{p.blurb}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-signal/80">
                    Starts at {startsAt}
                  </span>
                </button>
              </Magnetic>
            </motion.li>
          );
        })}
      </motion.ul>

      <motion.p
        className="relative mt-12 max-w-md text-center text-xs leading-relaxed text-smoke"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: locked ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        Same portfolio of {profile.displayName} — each path only changes what comes first.
      </motion.p>
    </motion.div>
  );
}
