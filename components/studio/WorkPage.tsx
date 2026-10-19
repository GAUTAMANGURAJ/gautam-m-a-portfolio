'use client';

import Link from 'next/link';
import { motion, MotionConfig } from 'framer-motion';
import { profile, projects, type Project } from '@/lib/content/portfolio';
import { SmoothScrollProvider } from '@/hooks/smoothScroll';
import { useFinePointer } from '@/hooks/useMedia';
import Ambient from './Ambient';
import ScrollProgress from './ScrollProgress';
import CaseStudyContent from './CaseStudyContent';
import { EASE, Magnetic, useSpotlight } from './fx';
import { ProjectPoster, StudioMark } from './Poster';

/** Standalone, shareable case-study page. */
export default function WorkPage({ project }: { project: Project }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <Page project={project} />
      </SmoothScrollProvider>
    </MotionConfig>
  );
}

function Page({ project }: { project: Project }) {
  const fine = useFinePointer();
  useSpotlight(fine);
  const i = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <Ambient />
      <ScrollProgress />

      <header className="gutter pointer-events-none fixed inset-x-0 top-0 z-[80] pt-[env(safe-area-inset-top)]">
        <div className="nav-surface pointer-events-auto mx-auto mt-2.5 flex h-14 max-w-6xl items-center justify-between gap-3 rounded-2xl border border-white/14 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-4">
          <Link href="/#originals" className="group flex min-h-11 items-center gap-2.5 text-sm font-semibold text-bone" data-cursor="link">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-signal/25 bg-ink-2 transition group-hover:border-signal/50">
              <StudioMark className="!gap-0 [&_span]:hidden [&_svg]:h-4 [&_svg]:w-4" />
            </span>
            <span className="hidden text-mist transition group-hover:text-bone xs:inline">← Back to portfolio</span>
            <span className="text-mist transition group-hover:text-bone xs:hidden">← Back</span>
          </Link>
          <p className="hidden min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-smoke sm:block">{project.title}</p>
          <Link
            href="/#contact"
            data-cursor="link"
            className="inline-flex min-h-10 items-center rounded-full border border-signal/40 bg-signal/10 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-bone transition hover:border-signal/70 hover:bg-signal/15"
          >
            Contact
          </Link>
        </div>
      </header>

      <main id="main" className="relative z-10">
        <section className="relative h-[min(58svh,560px)] min-h-[380px] overflow-hidden">
          <div className="absolute inset-0">
            <ProjectPoster project={project} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="gutter absolute inset-x-0 bottom-0 mx-auto max-w-5xl pb-8 sm:pb-10">
            <motion.p
              className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.34em] text-bone/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-display text-xl tracking-normal text-signal">●</span> CASE STUDY
            </motion.p>
            <motion.h1
              className="font-display text-[clamp(2.8rem,8vw,6rem)] leading-[0.86] tracking-wide text-bone"
              initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {project.title}
            </motion.h1>
          </div>
        </section>

        <div className="mx-auto max-w-5xl">
          <CaseStudyContent project={project} className="pt-8" />

          <nav aria-label="More case studies" className="gutter grid gap-3 pb-16 sm:grid-cols-2">
            {[
              { p: prev, label: '← Previous' },
              { p: next, label: 'Next →' },
            ].map(({ p, label }) => (
              <Link
                key={label}
                href={`/work/${p.id}`}
                data-cursor="link"
                className="spot group relative rounded-2xl border border-white/10 bg-ink-2/70 p-5 transition hover:border-signal/40"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke">{label}</span>
                <span className="mt-1 block font-display text-3xl leading-none tracking-wide text-bone">{p.title}</span>
                <span className="mt-1 block truncate text-xs text-mist">{p.caseStudy.proof}</span>
              </Link>
            ))}
          </nav>

          <section className="gutter pb-24">
            <div className="rounded-3xl border border-signal/25 bg-signal/[0.06] p-6 sm:p-10">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-signal">Want the walkthrough?</p>
              <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-wide text-bone">
                Private systems, so the detail is a conversation away.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist sm:text-base">
                Client product screens and internal delivery data stay private. I’m happy to walk through the architecture and decisions live.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Magnetic>
                  <Link
                    href={`/?ask=${project.id}#contact`}
                    data-cursor="link"
                    className="flex min-h-12 items-center rounded-full bg-signal px-7 text-sm font-bold tracking-[0.12em] text-ink transition hover:bg-signal-2"
                  >
                    Ask about this project
                  </Link>
                </Magnetic>
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent(`About: ${project.title}`)}`}
                  data-cursor="link"
                  className="glass flex min-h-12 items-center rounded-full px-6 text-sm font-semibold text-bone transition hover:bg-white/15"
                >
                  Email about this project
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
