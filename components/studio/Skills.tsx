'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, skillCategories, type Skill } from '@/lib/content/portfolio';
import { EASE, SectionHeading } from './fx';
import SkillConstellation from './SkillConstellation';

const HUES = ['#2dd4bf', '#38bdf8', '#34d399', '#d4a574', '#94a3b8', '#5eead4', '#e8c49a'];

export default function Skills() {
  const [cat, setCat] = useState(0);
  const [view, setView] = useState<'cards' | 'map'>('cards');
  const category = skillCategories[cat];
  const hue = HUES[cat % HUES.length];

  return (
    <>
      <SectionHeading
        kicker="Capabilities"
        title="Skill Stack"
        aside={
          <p className="max-w-xs text-sm text-mist">
            Hover or tap a skill to see where it shows up in projects and certifications.
          </p>
        }
      />

      <div className="gutter grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
        <div
          data-lenis-prevent
          className="rail fade-x-end -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
          role="tablist"
          aria-label="Skill categories"
        >
          {skillCategories.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === cat}
              onClick={() => setCat(i)}
              className={`group relative shrink-0 rounded-lg px-4 py-3 text-left transition lg:px-5 ${i === cat ? 'text-bone' : 'text-smoke hover:text-bone'}`}
            >
              {i === cat && <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/10" transition={{ duration: 0.45, ease: EASE }} />}
              {i === cat && <motion.span layoutId="skill-bar" className="absolute bottom-2 left-0 top-2 hidden w-[3px] rounded lg:block" style={{ background: hue }} />}
              <span className="relative block font-display text-2xl tracking-wide lg:text-3xl">{c.title}</span>
              <span className="relative hidden text-xs text-smoke lg:block">
                {c.skills.length} skills · {c.subtitle}
              </span>
            </button>
          ))}
        </div>

        <div className="min-h-[300px] lg:min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div key={category.id} initial="hidden" animate="show" exit="exit" transition={{ staggerChildren: 0.05 }}>
              <motion.div className="mb-5 flex flex-wrap items-center justify-between gap-3" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}>
                <p className="text-sm text-mist">
                  <span className="font-semibold text-bone">{category.title}</span> — {category.subtitle}
                </p>
                <div role="group" aria-label="Skill view" className="inline-flex rounded-full border border-white/12 bg-white/[0.04] p-0.5 text-[11px] font-semibold uppercase tracking-[0.16em]">
                  {(['cards', 'map'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={view === v}
                      onClick={() => setView(v)}
                      className={`min-h-9 rounded-full px-3.5 transition ${view === v ? 'bg-bone text-ink' : 'text-mist hover:text-bone'}`}
                    >
                      {v === 'cards' ? 'Cards' : 'Constellation'}
                    </button>
                  ))}
                </div>
              </motion.div>
              {view === 'cards' ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {category.skills.map((s) => (
                    <SkillCard key={s.name} skill={s} hue={hue} />
                  ))}
                </div>
              ) : (
                <SkillConstellation skills={category.skills} hue={hue} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function SkillCard({ skill, hue }: { skill: Skill; hue: string }) {
  const [open, setOpen] = useState(false);
  const titleOf = (id: string) => projects.find((p) => p.id === id)?.title.replace(/ (Platform|Library)$/, '') ?? 'This portfolio';
  const lines = skill.uses.length ? skill.uses.map((u) => ({ k: titleOf(u.project), v: u.how })) : skill.evidence ? [{ k: '', v: skill.evidence }] : [];

  return (
    <motion.button
      type="button"
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.94, filter: 'blur(6px)' },
        show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
        exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
      }}
      whileHover={{ y: -6 }}
      className="spot group relative flex min-h-[148px] flex-col overflow-hidden rounded-xl bg-ink-2 p-4 text-left ring-1 ring-white/10 transition-shadow duration-500 hover:ring-white/20"
      style={{ boxShadow: open ? `0 18px 50px -12px ${hue}55, 0 0 0 1px ${hue}66` : undefined }}
    >
      <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition duration-500 group-hover:opacity-60" style={{ background: hue }} />
      <motion.span
        className="relative flex h-12 w-12 items-center justify-center rounded-lg font-display text-2xl tracking-wide"
        style={{ background: `${hue}1f`, color: hue, boxShadow: `inset 0 0 0 1px ${hue}55` }}
        animate={open ? { rotate: [0, -8, 8, 0], scale: 1.08 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        aria-hidden
      >
        {skill.mono}
      </motion.span>
      <span className="relative mt-4 flex items-center gap-2 text-[15px] font-semibold text-bone">
        {skill.name}
        {skill.level && (
          <span className="rounded px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-ink" style={{ background: hue }}>
            {skill.level}
          </span>
        )}
      </span>
      <AnimatePresence initial={false}>
        {open && lines.length > 0 && (
          <motion.span
            className="relative mt-2 block space-y-1.5 text-[11px] leading-snug text-mist"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {lines.map((l) => (
              <span key={l.k + l.v} className="block">
                {l.k && <span className="font-semibold text-bone">{l.k} — </span>}
                {l.v}
              </span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
