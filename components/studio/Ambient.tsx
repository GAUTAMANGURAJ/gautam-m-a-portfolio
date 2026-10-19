'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Living background: slow aurora drift plus two depth layers that parallax against page scroll.
 * Transform-only motion, so it stays cheap on phones; CSS turns the drift off for reduced motion.
 */
export default function Ambient() {
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 6000], [0, -420]);
  const dotsY = useTransform(scrollY, [0, 6000], [0, -900]);
  return (
    <div className="atmosphere" aria-hidden>
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />
      <motion.div className="ambient-dots" style={{ y: dotsY }} />
      <motion.div
        className="absolute inset-x-0 -inset-y-[20%] opacity-[0.05]"
        style={{
          y: gridY,
          backgroundImage:
            'linear-gradient(rgba(232,238,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,238,248,0.5) 1px, transparent 1px)',
          backgroundSize: '96px 96px',
          maskImage: 'radial-gradient(ellipse at center, black 15%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 15%, transparent 72%)',
        }}
      />
    </div>
  );
}
