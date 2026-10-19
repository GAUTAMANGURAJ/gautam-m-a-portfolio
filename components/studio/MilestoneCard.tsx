'use client';

import { motion } from 'framer-motion';
import type { Milestone } from '@/lib/content/portfolio';
import { EASE, Tilt } from './fx';
import { PosterBackdrop } from './Poster';

export default function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const parts = milestone.code.split(' ');
  const chapter = parts[0] ?? 'CH';
  const mark = parts[1]?.replace(/^M/, '') ?? String(index + 1);

  return (
    <motion.article
      className="w-[78vw] max-w-[20rem] shrink-0 snap-start sm:w-[52vw] sm:max-w-none md:w-[38vw] lg:w-[30vw] xl:w-[26vw]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.24), ease: EASE }}
    >
      <Tilt max={7} className="group h-full rounded-xl">
        <div className="spot flex h-full flex-col overflow-hidden rounded-xl bg-ink-2 ring-1 ring-white/10 transition duration-500 group-hover:ring-signal/60 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <div className="relative aspect-video overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-cine)] group-hover:scale-110">
              <PosterBackdrop palette={milestone.palette}>
                <span className="absolute -bottom-6 right-2 font-display text-[7.5rem] leading-none text-white/[0.09]">
                  {mark}
                </span>
              </PosterBackdrop>
            </div>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 mix-blend-screen group-hover:opacity-100"
              initial={false}
              whileHover={{ x: ['-40%', '120%'] }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-bone backdrop-blur">
                {chapter}
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-bone/80">
                MILESTONE {mark}
              </span>
            </div>
            <h4 className="absolute bottom-4 left-4 right-4 font-display text-3xl leading-none tracking-wide text-bone [transform:translateZ(30px)] sm:text-4xl">
              {milestone.title}
            </h4>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex items-center justify-between text-[11px] text-smoke">
              <span className="font-semibold text-mist">{milestone.runtime}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-[10px] text-bone transition group-hover:border-signal group-hover:bg-signal group-hover:text-ink">
                →
              </span>
            </div>
            <p className="text-sm leading-relaxed text-bone/80">{milestone.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {milestone.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-mist">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
