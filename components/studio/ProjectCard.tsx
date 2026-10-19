'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMedia';
import type { Project } from '@/lib/content/portfolio';
import { EASE, Tilt } from './fx';
import { ProjectPoster } from './Poster';

export default function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const fine = useFinePointer();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 18 });
  const smy = useSpring(my, { stiffness: 90, damping: 18 });
  // Poster drifts against the pointer for a parallax "live preview" feel
  const px = useTransform(smx, [-1, 1], [16, -16]);
  const py = useTransform(smy, [-1, 1], [10, -10]);
  return (
    <motion.article
      className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-[62vw] sm:max-w-none lg:w-[46vw] xl:w-[42vw]"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px -8% 0px 0px', amount: 0.2 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.2), ease: EASE }}
    >
      <Tilt max={5} className="group rounded-2xl">
        <div
          role="button"
          tabIndex={0}
          data-cursor="view"
          onClick={onOpen}
          onPointerMove={(e) => {
            if (!fine) return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
            my.set(((e.clientY - r.top) / r.height) * 2 - 1);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
          aria-label={`Open ${project.title}`}
          className="spot focus-ring relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] group-hover:ring-white/25 sm:aspect-[16/12] lg:aspect-auto lg:h-[66svh]"
        >
          <motion.div layoutId={`art-${project.id}`} className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.div className="absolute -inset-[4%]" style={fine ? { x: px, y: py } : undefined}>
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-cine)] group-hover:scale-[1.07]">
                <div className="kenburns absolute inset-0">
                  <ProjectPoster project={project} />
                </div>
              </div>
            </motion.div>
            <span aria-hidden className="preview-sweep" />
          </motion.div>

          <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-7 sm:top-7">
            <span className="rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/90 backdrop-blur">
              Case study
            </span>
            <span className="hidden rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-mist backdrop-blur sm:inline">
              {project.ownership}
            </span>
          </div>
          <span className="absolute right-5 top-5 rounded border border-white/30 px-1.5 py-px text-[10px] font-bold text-bone sm:right-7 sm:top-7">{project.year}</span>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 [transform:translateZ(40px)]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">{project.genre}</p>
            <motion.h3 layoutId={`title-${project.id}`} className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.88] tracking-wide text-bone">
              {project.title}
            </motion.h3>
            <p className="mt-3 max-w-md text-sm font-semibold leading-relaxed text-signal-2 sm:text-[15px]">
              {project.caseStudy.proof}
            </p>
            <p className="mt-1.5 hidden max-w-md text-sm leading-relaxed text-bone/75 sm:block sm:text-[14px]">{project.caseStudy.outcome}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((t, ti) => (
                <span key={t} className={`${ti > 2 ? 'hidden xs:inline' : ''} rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-bone/90 backdrop-blur`}>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className="relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full border px-6 py-2.5 text-sm font-semibold tracking-wide text-bone backdrop-blur-md transition duration-500 group-hover:translate-y-[-1px]"
                style={{
                  borderColor: `${project.palette.accent}66`,
                  background: `linear-gradient(135deg, ${project.palette.accent}22, rgba(6,9,16,0.55) 55%, ${project.palette.accent}14)`,
                  boxShadow: `0 0 0 1px ${project.palette.accent}18 inset, 0 10px 28px ${project.palette.accent}18`,
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition duration-700 group-hover:translate-x-full group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(115deg, transparent 15%, ${project.palette.accent}33 50%, transparent 85%)`,
                  }}
                />
                <span
                  className="relative flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-ink transition duration-500 group-hover:scale-110"
                  style={{
                    background: project.palette.accent,
                    boxShadow: `0 0 16px ${project.palette.accent}66`,
                  }}
                >
                  →
                </span>
                <span className="relative">View case study</span>
              </span>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
