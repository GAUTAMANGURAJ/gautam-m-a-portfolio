'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { chapters } from '@/lib/content/portfolio';
import { EASE, SectionHeading } from './fx';
import MilestoneCard from './MilestoneCard';
import { RailButtons } from './Rail';

export default function Journey() {
  const [active, setActive] = useState(Math.max(0, chapters.length - 2));
  const chapter = chapters[active];
  const rail = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectChapter = useCallback((i: number) => {
    setActive(i);
    rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
    tabRefs.current[i]?.focus({ preventScroll: true });
  }, []);

  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const last = chapters.length - 1;
    if (e.key === 'Home') selectChapter(0);
    else if (e.key === 'End') selectChapter(last);
    else if (e.key === 'ArrowRight') selectChapter(Math.min(last, active + 1));
    else selectChapter(Math.max(0, active - 1));
  };

  return (
    <>
      <SectionHeading
        kicker={`${chapters.length} chapters`}
        title="My Journey"
        aside={
          <p className="max-w-xs text-sm text-mist">
            Every stage of the career as a chapter — select one to explore its milestones.
          </p>
        }
      />

      <div
        data-lenis-prevent
        className="rail fade-x-end gutter mb-6 flex gap-2 overflow-x-auto sm:mb-8"
        role="tablist"
        aria-label="Journey chapters"
        onKeyDown={onTabKeyDown}
      >
        {chapters.map((s, i) => (
          <motion.button
            key={s.number}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`journey-tab-${s.number}`}
            role="tab"
            aria-selected={i === active}
            aria-controls={`journey-panel-${s.number}`}
            tabIndex={i === active ? 0 : -1}
            type="button"
            onClick={() => selectChapter(i)}
            className={`relative shrink-0 rounded-full px-4 py-2.5 text-left transition ${i === active ? 'text-ink' : 'text-mist hover:text-bone'}`}
            whileTap={{ scale: 0.97 }}
          >
            {i === active && (
              <motion.span layoutId="chapter-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease: EASE }} />
            )}
            <span className="relative block text-[10px] font-bold tracking-[0.24em]">
              CHAPTER {String(s.number).padStart(2, '0')}
            </span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{s.title}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={chapter.number}
          id={`journey-panel-${chapter.number}`}
          role="tabpanel"
          aria-labelledby={`journey-tab-${chapter.number}`}
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="gutter mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-3xl tracking-wide text-bone xs:text-4xl sm:text-5xl">
              <span aria-hidden className="outline-label mr-3" data-text={`CH${String(chapter.number).padStart(2, '0')}`} />
              {chapter.title}
            </h3>
            <span className="text-sm text-mist">
              {chapter.period} · {chapter.milestones.length}{' '}
              {chapter.milestones.length === 1 ? 'milestone' : 'milestones'}
            </span>
          </div>
          <motion.p
            className="gutter max-w-3xl text-[15px] leading-relaxed text-bone/75"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
          >
            {chapter.synopsis}
          </motion.p>

          <div className="group/rail relative">
            <div
              ref={rail}
              data-lenis-prevent
              role="region"
              aria-label="Milestones — scroll sideways"
              tabIndex={0}
              className="rail gutter flex gap-4 overflow-x-auto py-6 sm:py-8 [perspective:1200px]"
            >
              {chapter.milestones.map((m, i) => (
                <MilestoneCard key={m.code} milestone={m} index={i} />
              ))}
            </div>
            <RailButtons rail={rail} />
          </div>
          <MilestoneTimeline rail={rail} codes={chapter.milestones.map((m) => m.code)} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/** Timeline under the cards: the line draws as the rail scrolls and each milestone dot ignites in turn. */
function MilestoneTimeline({ rail, codes }: { rail: RefObject<HTMLDivElement | null>; codes: string[] }) {
  const n = codes.length;
  const [p, setP] = useState(0);
  const raw = useMotionValue(0);
  const fill = useSpring(raw, { stiffness: 120, damping: 26, mass: 0.4 });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const v = max > 1 ? el.scrollLeft / max : 1;
      setP(v);
      raw.set(v);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [rail, raw, n]);

  const goTo = (i: number) => {
    const el = rail.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || '0'), behavior: 'smooth' });
  };

  if (n < 2) return null;
  return (
    <div className="gutter pb-2" aria-label="Milestone timeline">
      <div className="relative mx-2 h-10">
        <div className="absolute inset-x-0 top-[11px] h-px bg-white/12" />
        <motion.div
          className="absolute inset-x-0 top-[10px] h-[2px] origin-left rounded bg-gradient-to-r from-signal to-signal-2 shadow-[0_0_12px_rgba(45,212,191,0.6)]"
          style={{ scaleX: fill }}
        />
        {codes.map((code, i) => {
          const lit = p >= i / (n - 1) - 0.001;
          return (
            <button
              key={code}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to milestone ${code}`}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1.5"
              style={{ left: `${(i / (n - 1)) * 100}%` }}
            >
              <motion.span
                className="block h-[22px] w-[22px] rounded-full border"
                animate={{
                  scale: lit ? 1 : 0.55,
                  backgroundColor: lit ? 'var(--color-signal)' : 'rgba(255,255,255,0.06)',
                  borderColor: lit ? 'var(--color-signal-2)' : 'rgba(255,255,255,0.2)',
                  boxShadow: lit ? '0 0 16px var(--glow-signal)' : '0 0 0 rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.45, ease: EASE }}
              />
              <span className={`hidden text-[10px] font-bold tracking-[0.16em] transition-colors duration-300 sm:block ${lit ? 'text-signal-2' : 'text-smoke'}`}>
                {code.split(" ").pop()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
