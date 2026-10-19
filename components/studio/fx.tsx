'use client';

import { useEffect, useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer, useReducedMotionPref } from '@/hooks/useMedia';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Feeds pointer position to every `.spot` card as --mx / --my (one delegated listener). */
export function useSpotlight(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('.spot') as HTMLElement | null;
      if (!el) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [enabled]);
}

/** Wraps a control so it drifts toward the pointer — desktop only. */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  const active = fine && !reduced;

  const onMove = (e: RPointerEvent<HTMLSpanElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className={`inline-flex ${className}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

/** Subtle 3D tilt that follows the pointer by a few degrees. Flat on touch devices. */
export function Tilt({
  children,
  max = 6,
  className = '',
  glare = true,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  glare?: boolean;
}) {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const active = fine && !reduced;
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useTransform([gx, gy], ([a, b]) => `radial-gradient(circle at ${a} ${b}, rgba(255,255,255,0.16), transparent 55%)`);

  return (
    <motion.div
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={active ? { rotateX: rx, rotateY: ry, transformPerspective: 1000 } : undefined}
      onPointerMove={(e) => {
        if (!active) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
      {active && glare && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-overlay" style={{ background: glareBg }} />
      )}
    </motion.div>
  );
}

/**
 * Kinetic headline — each letter rises out of a mask with a slight tilt and a
 * one-off teal flash as it lands. Words stay unbroken so wrapping is unchanged.
 */
export function RevealText({
  text,
  className = '',
  delay = 0,
  as = 'span',
  id,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: 'span' | 'h2' | 'h3' | 'p';
  id?: string;
}) {
  const Tag = motion[as];
  const words = text.split(' ');
  // Keep total stagger bounded so long titles don't feel slow
  const perChar = Math.min(0.03, 0.55 / Math.max(text.length, 1));
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-4% 0px' }}
      transition={{ staggerChildren: perChar, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap align-bottom">
          {Array.from(w).map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className="inline-block origin-bottom-left"
                variants={{
                  hidden: { y: '110%', rotate: 7, opacity: 0, filter: 'blur(6px)' },
                  show: {
                    y: '0%',
                    rotate: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    color: ['#5eead4', '#e8eef8'],
                    transition: {
                      duration: 0.85,
                      ease: EASE,
                      color: { duration: 1.1, times: [0, 1] },
                    },
                  },
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}

/** Counts the first number inside `value` up from zero once it scrolls into view. */
export function CountUp({ value, className = '', duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const reduced = useReducedMotionPref();
  const match = value.match(/\d[\d,]*(?:\.\d+)?/);
  const target = match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  const decimals = match ? (match[0].split('.')[1] || '').length : 0;
  const commas = match ? match[0].includes(',') : false;
  const counts = Boolean(match) && target >= 2 && !reduced;
  const fmt = (n: number) => {
    const t = n.toFixed(decimals);
    return commas ? Number(t).toLocaleString('en-US', { minimumFractionDigits: decimals }) : t;
  };
  const [shown, setShown] = useState(() => (counts && match ? value.replace(match[0], fmt(0)) : value));

  useEffect(() => {
    if (!counts || !match) {
      setShown(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setShown(value.replace(match[0], fmt(v))),
      onComplete: () => setShown(value),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, counts, value, target, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/** Small kicker + big title used at the top of every section. */
export function SectionHeading({ kicker, title, aside }: { kicker: string; title: string; aside?: ReactNode }) {
  return (
    <div className="gutter mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-9">
      <div>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-2 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-signal"
        >
          <span className="h-px w-8 bg-signal" />
          {kicker}
        </motion.div>
        <RevealText as="h2" text={title} className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] tracking-wide text-bone" />
      </div>
      {aside}
    </div>
  );
}

/** Lightweight drifting dust particles on a canvas — pauses when off screen. */
export function Particles({ count = 46, color = '45,212,191', className = '' }: { count?: number; color?: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionPref();
  const fine = useFinePointer();
  const dotsCount = fine ? count : Math.min(count, 14);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const dots = Array.from({ length: dotsCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: -Math.random() * 0.00028 - 0.00006,
      a: Math.random() * 0.6 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let running = false;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.tw += dt * 0.002;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
        if (d.x < -0.02) d.x = 1.02;
        if (d.x > 1.02) d.x = -0.02;
        const alpha = d.a * (0.6 + 0.4 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [dotsCount, color, reduced]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
