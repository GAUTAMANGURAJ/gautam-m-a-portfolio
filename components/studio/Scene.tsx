'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTrackProgress } from '@/hooks/sectionProgress';
import { useFinePointer, useReducedMotionPref } from '@/hooks/useMedia';

/**
 * Portfolio section shell — scroll-linked fade on desktop;
 * lighter transforms on touch / reduced-motion for performance.
 */
export default function Scene({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useTrackProgress(id, ref);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const lightMotion = !fine || reduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.5'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [lightMotion ? 0.82 : 0.55, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [lightMotion ? 1 : 0.985, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [lightMotion ? 8 : 22, 0]);
  // Curtain wipe: the section's top edge lifts open as it enters (overscan at the end so nothing clips)
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(14% -5% -5% -5% round 28px)', 'inset(-5% -5% -5% -5% round 0px)'],
  );
  // Light leak: a thin teal line draws across the seam, then fades
  const leakScale = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const leakOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.section
      id={id}
      ref={ref}
      style={lightMotion ? { opacity } : { opacity, scale, y, clipPath }}
      className={`relative scroll-mt-[5.5rem] py-14 sm:scroll-mt-28 sm:py-20 lg:py-24 [content-visibility:auto] [contain-intrinsic-size:1px_720px] ${className}`}
    >
      {!lightMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] top-0 z-10 h-px origin-left bg-gradient-to-r from-transparent via-signal-2 to-transparent shadow-[0_0_18px_rgba(45,212,191,0.6)]"
          style={{ scaleX: leakScale, opacity: leakOpacity }}
        />
      )}
      {children}
    </motion.section>
  );
}
