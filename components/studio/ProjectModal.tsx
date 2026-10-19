'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/content/portfolio';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/smoothScroll';
import { EASE } from './fx';
import { ProjectPoster } from './Poster';
import CaseStudyContent from './CaseStudyContent';

export default function ProjectModal({
  project,
  onClose,
  onSwitch,
  onAsk,
}: {
  project: Project;
  onClose: () => void;
  onSwitch: (p: Project) => void;
  onAsk?: (p: Project) => void;
}) {
  useScrollLock(true);
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useFocusTrap(true, root);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project.id]);

  return (
    <motion.div
      ref={root}
      className="fixed inset-0 z-[140]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`title-${project.id}-modal`}
    >
      <motion.div
        className="absolute inset-0 bg-black/85"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(14px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: EASE }}
        onClick={onClose}
      />
      <div ref={scroller} data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain" onClick={onClose}>
        <motion.div
          className="relative mx-auto min-h-full max-w-5xl bg-ink-2 shadow-2xl sm:my-10 sm:min-h-0 sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
          // Opacity-only: a transformed ancestor would distort the shared-element (layoutId) handoff
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <div className="relative h-[52svh] min-h-[340px] overflow-hidden sm:rounded-t-2xl">
            <motion.div
              layoutId={`art-${project.id}`}
              className="absolute inset-0"
              initial={{ filter: 'blur(12px) brightness(1.5)' }}
              animate={{ filter: 'blur(0px) brightness(1)' }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <ProjectPoster project={project} />
            </motion.div>
            {/* Accent burst as the card opens into the case study */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
              style={{ background: `radial-gradient(closest-side, ${project.palette.accent}66, transparent 70%)` }}
              initial={{ scale: 0.3, opacity: 0.9 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.2, ease: EASE }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/30 to-transparent" />
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              data-cursor="close"
              aria-label="Close project"
              className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-lg text-bone backdrop-blur transition hover:bg-black"
            >
              ✕
            </button>
            <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-10">
              <motion.p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.34em] text-bone/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <span className="font-display text-xl tracking-normal text-signal">●</span> SELECTED WORK
              </motion.p>
              <motion.h2
                id={`title-${project.id}-modal`}
                layoutId={`title-${project.id}`}
                className="font-display text-[clamp(2.8rem,8vw,6rem)] leading-[0.86] tracking-wide text-bone"
                transition={{ duration: 0.7, ease: EASE }}
              >
                {project.title}
              </motion.h2>
            </div>
          </div>

          <CaseStudyContent project={project} onSwitch={onSwitch} onAsk={onAsk} />
        </motion.div>
      </div>
    </motion.div>
  );
}
