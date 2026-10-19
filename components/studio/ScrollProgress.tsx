'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/** Top-of-page progress bar driven by Lenis scroll progress. */
export default function ScrollProgress() {
  const [p, setP] = useState(0);
  const scaleX = useSpring(p, { stiffness: 120, damping: 28, mass: 0.35 });

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    const onLenis = (e: Event) => {
      const detail = (e as CustomEvent<{ progress: number }>).detail;
      if (typeof detail?.progress === 'number') setP(detail.progress);
      else update();
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('lenis-scroll', onLenis as EventListener);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('lenis-scroll', onLenis as EventListener);
    };
  }, []);

  useEffect(() => {
    scaleX.set(p);
  }, [p, scaleX]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-white/5">
      <motion.div className="h-full origin-left bg-gradient-to-r from-signal via-signal-2 to-gold" style={{ scaleX }} />
    </div>
  );
}
