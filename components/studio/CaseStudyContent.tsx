'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { projects, type Project } from '@/lib/content/portfolio';
import { CountUp, EASE, Magnetic } from './fx';
import { ProjectPoster, SystemBlueprint } from './Poster';
import ArchitectureDiagram from './ArchitectureDiagram';

const block = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

/** Open-in-page and copy-link controls shared by the modal and the standalone page. */
function ShareActions({ project, fullPage, onAsk }: { project: Project; fullPage: boolean; onAsk?: (p: Project) => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/work/${project.id}/`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this link', url);
    }
  };
  return (
    <>
      {fullPage && (
        <Magnetic>
          <Link
            href={`/work/${project.id}`}
            data-cursor="link"
            className="flex min-h-12 items-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
          >
            Open full page ↗
          </Link>
        </Magnetic>
      )}
      {onAsk ? (
        <button
          type="button"
          onClick={() => onAsk(project)}
          data-cursor="link"
          className="flex min-h-12 items-center gap-2 rounded-md border border-signal/40 bg-signal/10 px-5 text-[15px] font-semibold text-bone transition hover:border-signal/70 hover:bg-signal/15"
        >
          ✉ Ask about this project
        </button>
      ) : (
        <Link
          href={`/?ask=${project.id}#contact`}
          data-cursor="link"
          className="flex min-h-12 items-center gap-2 rounded-md border border-signal/40 bg-signal/10 px-5 text-[15px] font-semibold text-bone transition hover:border-signal/70 hover:bg-signal/15"
        >
          ✉ Ask about this project
        </Link>
      )}
      <button
        type="button"
        onClick={copy}
        data-cursor="link"
        className="glass flex min-h-12 items-center gap-2 rounded-md px-5 text-[15px] font-semibold text-bone transition hover:bg-white/15"
      >
        {copied ? '✓ Link copied' : '⧉ Copy link'}
      </button>
    </>
  );
}

/** The full case-study body — rendered inside the modal and on /work/[slug]. */
export default function CaseStudyContent({
  project,
  onSwitch,
  onAsk,
  className = '',
}: {
  project: Project;
  /** Provided by the modal; when absent, "More work" links to pages instead. */
  onSwitch?: (p: Project) => void;
  /** Provided by the modal: closes it and pre-fills the contact form. */
  onAsk?: (p: Project) => void;
  className?: string;
}) {
  const more = projects.filter((p) => p.id !== project.id);
  return (
          <motion.div className={`px-5 pb-12 sm:px-10 ${className}`} initial="hidden" animate="show" transition={{ staggerChildren: 0.08, delayChildren: 0.25 }}>
            <motion.div variants={block} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-mist">
              <span className="font-semibold text-signal-2">{project.year}</span>
              <span className="h-1 w-1 rounded-full bg-smoke" />
              <span>{project.genre}</span>
              <span className="h-1 w-1 rounded-full bg-smoke" />
              <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold" style={{ borderColor: `${project.palette.accent}66`, color: project.palette.accent }}>
                {project.ownership}
              </span>
            </motion.div>

            <motion.p variants={block} className="mt-4 max-w-3xl text-lg leading-relaxed text-bone sm:text-xl">
              {project.logline}
            </motion.p>

            {(
              <motion.div variants={block} className="mt-6 flex flex-wrap items-center gap-3">
                <ShareActions project={project} fullPage={Boolean(onSwitch)} onAsk={onAsk} />
                {project.github && (
                  <Magnetic>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="flex min-h-12 items-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
                    >
                      GitHub ↗
                    </a>
                  </Magnetic>
                )}
                {project.live && (
                  <Magnetic>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="link"
                      className="glass flex min-h-12 items-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
                    >
                      Live ↗
                    </a>
                  </Magnetic>
                )}
                {project.accessNote && (
                  <p className="rounded-xl border border-white/10 bg-ink/50 px-4 py-3 text-sm text-mist">
                    {project.accessNote}
                  </p>
                )}
              </motion.div>
            )}

            <motion.section variants={block} className="mt-10">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-signal">Case study</h2>
              <p
                className="mb-4 rounded-xl border px-4 py-3 text-sm font-semibold tracking-wide"
                style={{
                  borderColor: `${project.palette.accent}55`,
                  color: project.palette.accent,
                  background: `${project.palette.accent}12`,
                }}
              >
                {project.caseStudy.proof}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { k: 'Problem', v: project.caseStudy.problem },
                    { k: 'My role', v: project.caseStudy.role },
                    { k: 'Outcome', v: project.caseStudy.outcome },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.k}
                    className="rounded-2xl border border-white/10 bg-ink/40 p-4 sm:p-5"
                    style={{ boxShadow: `inset 0 0 0 1px ${project.palette.accent}18` }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-smoke">{item.k}</p>
                    <p className="mt-2 text-sm leading-relaxed text-bone/90">{item.v}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={block} className="mt-8">
              {project.architecture ? (
                <ArchitectureDiagram arch={project.architecture} accent={project.palette.accent} />
              ) : (
                <SystemBlueprint stages={project.systemFlow} accent={project.palette.accent} />
              )}
            </motion.section>

            <motion.section variants={block} className="mt-12">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-signal">Result / Impact</h2>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
                {project.metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    className="bg-ink p-4 sm:p-5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease: EASE }}
                  >
                    <p className="font-display text-4xl leading-none text-bone sm:text-5xl" style={{ color: i === 0 ? project.palette.accent : undefined }}>
                      <CountUp value={m.value} />
                    </p>
                    <p className="mt-2 text-xs leading-snug text-mist">{m.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {project.deepDives && project.deepDives.length > 0 && (
              <motion.section variants={block} className="mt-12">
                <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-signal">Module deep-dives</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {project.deepDives.map((d) => (
                    <div key={d.title} className="spot relative rounded-2xl border border-white/10 bg-ink/40 p-5">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-2xl tracking-wide text-bone">{d.title}</h3>
                        {d.scope && (
                          <span
                            className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]"
                            style={{ borderColor: `${project.palette.accent}55`, color: project.palette.accent }}
                          >
                            {d.scope}
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-sm font-medium text-bone/90">{d.summary}</p>
                      <ul className="space-y-2">
                        {d.points.map((pt) => (
                          <li key={pt} className="flex gap-2.5 text-[13px] leading-relaxed text-mist">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: project.palette.accent }} />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr]">
              <motion.section variants={block}>
                <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-signal">My Contribution</h2>
                <ul className="space-y-4">
                  {project.build.map((b) => (
                    <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-bone/85">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: project.palette.accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.section>
              <div className="space-y-10">
                <motion.section variants={block}>
                  <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-signal">Tech Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <span key={t} className="glass rounded-full px-3 py-1.5 text-sm font-medium text-bone">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.section>
                <motion.section variants={block}>
                  <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-signal">Key Features</h2>
                  <ul className="space-y-2.5">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-bone/85">
                        <span className="text-signal">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              </div>
            </div>

            <motion.section variants={block} className="mt-14 border-t border-white/10 pt-8">
              <h2 className="mb-4 font-sans text-lg font-semibold text-bone">More Work</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {more.map((p) => {
                  const inner = (
                    <>
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                        <ProjectPoster project={p} />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-mist">{p.genre}</p>
                        <p className="font-display text-3xl leading-none tracking-wide text-bone">{p.title}</p>
                      </div>
                    </>
                  );
                  const cls = 'group relative aspect-video overflow-hidden rounded-xl text-left ring-1 ring-white/10 transition hover:ring-white/30';
                  return onSwitch ? (
                    <button key={p.id} type="button" data-cursor="view" onClick={() => onSwitch(p)} className={cls}>
                      {inner}
                    </button>
                  ) : (
                    <Link key={p.id} href={`/work/${p.id}`} data-cursor="view" className={cls}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          </motion.div>
  );
}
