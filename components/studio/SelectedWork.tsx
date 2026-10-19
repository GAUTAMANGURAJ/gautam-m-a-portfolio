'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { profile, projects, type Project } from '@/lib/content/portfolio';
import { useDesktop, useFinePointer, useReducedMotionPref } from '@/hooks/useMedia';
import { EASE, RevealText } from './fx';
import ProjectCard from './ProjectCard';

/**
 * WORK — desktop pins and scrolls sideways via scroll progress.
 * Mobile / reduced motion: native horizontal rail that does not trap vertical page scroll.
 */
export default function SelectedWork({ onOpen }: { onOpen: (p: Project) => void }) {
  const desktop = useDesktop();
  const reduced = useReducedMotionPref();
  const fine = useFinePointer();
  // Touch tablets (iPad landscape) get the native rail, not the long pinned scroll
  return desktop && fine && !reduced ? <PinnedWork onOpen={onOpen} /> : <RailWork onOpen={onOpen} />;
}

function Intro() {
  return (
    <div className="flex w-full shrink-0 flex-col justify-center lg:w-[34vw]">
      <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-signal">
        <span className="h-px w-8 bg-signal" /> {projects.length} projects · {projects[0].year}
      </p>
      <RevealText as="h2" text="SELECTED WORK" className="font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.88] text-bone" />
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mist">
        Enterprise platforms and shipped product work — robotics scanning, ESG, apparel commerce, standards library, and this public portfolio. Open any card for the full case study.
      </p>
      <p className="mt-6 hidden text-xs tracking-[0.24em] text-smoke lg:block">SCROLL TO BROWSE →</p>
      <p className="mt-4 text-xs tracking-[0.2em] text-smoke lg:hidden">Swipe sideways for projects · scroll page normally</p>
    </div>
  );
}

function Outro() {
  return (
    <a
      href={profile.links.github}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      className="group flex aspect-[3/4] w-[78vw] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/15 text-center transition hover:border-signal/60 sm:w-[44vw] lg:aspect-auto lg:h-[66svh] lg:w-[24vw]"
    >
      <motion.span
        className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 text-2xl text-bone transition group-hover:border-signal group-hover:text-signal"
        whileHover={{ scale: 1.1, rotate: -8 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        ↗
      </motion.span>
      <span className="font-display text-3xl tracking-wide text-bone">More on GitHub</span>
      <span className="text-xs text-mist">github.com/GAUTAMANGURAJ</span>
    </a>
  );
}

function PinnedWork({ onOpen }: { onOpen: (p: Project) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const distMV = useMotionValue(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      const d = Math.max(0, track.current.scrollWidth - window.innerWidth);
      setDist(d);
      distMV.set(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [distMV]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const raw = useTransform([scrollYProgress, distMV], ([p, d]: number[]) => -p * d);
  const x = useSpring(raw, { stiffness: 100, damping: 28, mass: 0.35 });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.16, 0.08]);

  return (
    <div ref={wrap} style={{ height: `calc(100svh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(50%_60%_at_70%_50%,rgba(45,212,191,0.14),transparent_70%)]"
          style={{ opacity: glow }}
        />
        <motion.div ref={track} style={{ x }} className="gutter relative flex items-center gap-8 pr-[12vw]" data-cursor="drag">
          <Intro />
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={() => onOpen(p)} />
          ))}
          <Outro />
        </motion.div>
        <div className="gutter absolute inset-x-0 bottom-8 flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-smoke">WORK</span>
          <div className="h-[2px] flex-1 overflow-hidden rounded bg-white/10">
            <motion.div className="h-full origin-left bg-signal" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RailWork({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <div className="py-4 sm:py-6">
      <div className="gutter mb-5 sm:mb-6">
        <Intro />
      </div>
      <div
        data-lenis-prevent
        className="rail gutter flex gap-3 overflow-x-auto pb-6 sm:gap-4 sm:pb-8"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {projects.map((p, i) => (
          <div key={p.id} className="snap-start">
            <ProjectCard project={p} index={i} onOpen={() => onOpen(p)} />
          </div>
        ))}
        <Outro />
      </div>
    </div>
  );
}
