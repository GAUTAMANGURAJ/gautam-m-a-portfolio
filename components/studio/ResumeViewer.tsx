'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  achievements,
  certifications,
  education,
  experience,
  profile,
  projects,
  skillCategories,
  workingPrinciples,
} from '@/lib/content/portfolio';
import { CountUp, EASE, Magnetic, SectionHeading } from './fx';

/** Resume preview plus view / download / print actions. */
export default function ResumeViewer({ onView }: { onView: () => void }) {
  const printResume = () => {
    document.getElementById('resume-print')?.classList.add('resume-print-ready');
    window.setTimeout(() => {
      window.print();
      document.getElementById('resume-print')?.classList.remove('resume-print-ready');
    }, 50);
  };

  return (
    <>
      <SectionHeading kicker="Curriculum vitae" title="Resume" />
      <div className="gutter grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ transformPerspective: 1600 }}
        >
          <CollapsibleSheet />
        </motion.div>

        <div className="no-print lg:sticky lg:top-28 lg:self-start">
          <p className="font-serif text-3xl italic leading-tight text-bone">One page. Proof first.</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Same narrative as the case studies — metrics, ownership, and {certifications.length} certification
            {certifications.length === 1 ? '' : 's'}. Preview here, download PDF, or print.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Magnetic className="w-full">
              <button
                type="button"
                data-cursor="view"
                onClick={onView}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
              >
                View Resume
              </button>
            </Magnetic>
            <Magnetic className="w-full">
              <a
                href={profile.resumePdf}
                download="Gautam_MA_Resume.pdf"
                data-cursor="link"
                className="glass flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
              >
                ⤓ Download Resume
              </a>
            </Magnetic>
            <Magnetic className="w-full">
              <button
                type="button"
                data-cursor="link"
                onClick={printResume}
                className="glass flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
              >
                ⎙ Print resume
              </button>
            </Magnetic>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 text-center">
            {[
              { v: String(projects.length), k: 'Projects' },
              { v: String(achievements.length), k: 'Moments' },
              { v: String(certifications.length), k: 'Certs' },
            ].map((s) => (
              <div key={s.k} className="flex flex-col-reverse bg-ink-2 px-2 py-4">
                <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">{s.k}</dt>
                <dd className="font-display text-3xl leading-none text-bone"><CountUp value={s.v} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}

/** On phones the sheet starts as a teaser so the page keeps its pace; desktop shows it in full. */
function CollapsibleSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div
        className={`overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-cine)] md:max-h-none print:max-h-none ${
          open ? 'max-h-[4000px]' : 'max-h-[560px]'
        }`}
      >
        <ResumeSheet />
      </div>
      {!open && (
        <div className="no-print absolute inset-x-0 bottom-0 flex h-48 items-end justify-center rounded-b-2xl bg-gradient-to-t from-ink via-ink/85 to-transparent pb-4 md:hidden">
          <button type="button" onClick={() => setOpen(true)} className="glass min-h-11 rounded-full px-5 text-sm font-semibold text-bone">
            Expand resume ↓
          </button>
        </div>
      )}
    </div>
  );
}

function H({ children }: { children: string }) {
  return <h4 className="mb-3 mt-7 border-b border-white/10 pb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-signal first:mt-0">{children}</h4>;
}

export function ResumeSheet() {
  return (
    <article
      id="resume-print"
      className="resume-sheet relative overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#0c1220,#060910)] p-6 ring-1 ring-white/10 sm:p-10"
    >
      <div aria-hidden className="no-print absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent" />
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.34em] text-smoke">PROFILE</p>
          <h3 className="mt-1 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[0.9] tracking-wide text-bone">{profile.fullName}</h3>
          <p className="mt-1 text-xs text-mist">{profile.role}</p>
        </div>
        <div className="text-xs leading-relaxed text-mist sm:text-right">
          <a href={`mailto:${profile.email}`} className="flex min-h-7 items-center hover:text-bone sm:justify-end">
            {profile.email}
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-7 items-center px-1.5 hover:text-bone">
            LinkedIn ↗
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="inline-flex min-h-7 items-center px-1.5 hover:text-bone">
            GitHub ↗
          </a>
        </div>
      </header>

      <p className="mb-6 text-xs leading-relaxed text-mist sm:text-[13px]">{profile.intro}</p>

      <div className="grid gap-x-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <H>Education</H>
          {education.map((e) => (
            <div key={e.school} className="mb-4">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {e.school}, {e.place}
                </p>
                <p className="text-xs text-smoke">{e.period}</p>
              </div>
              <p className="text-xs text-mist">
                {e.degree}
                {e.score ? (
                  <>
                    {' '}
                    · <span className="text-bone/80">{e.score}</span>
                  </>
                ) : null}
              </p>
            </div>
          ))}

          <H>Work Experience</H>
          {experience.map((x) => (
            <div key={x.company}>
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {x.company} — {x.role}
                </p>
                <p className="text-xs text-smoke">{x.period}</p>
              </div>
              <p className="mt-0.5 text-[11px] text-smoke">
                {x.place}
              </p>
              <ul className="mt-2 space-y-1.5">
                {x.points.map((p) => (
                  <li key={p} className="flex gap-2 text-xs leading-relaxed text-mist">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <H>Selected work</H>
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">{p.title}</p>
                <p className="text-xs text-smoke">{p.year}</p>
              </div>
              <p className="text-[11px] font-semibold text-signal-2">{p.caseStudy.proof}</p>
              <p className="text-xs text-mist">{p.stack.join(', ')}</p>
            </div>
          ))}
        </div>

        <div>
          <H>How I work</H>
          <ul className="mb-1 space-y-2">
            {workingPrinciples.map((p) => (
              <li key={p.title} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">{p.title}.</span> {p.detail}
              </li>
            ))}
          </ul>

          <H>Skills</H>
          <div className="space-y-2">
            {skillCategories.map((c) => (
              <p key={c.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">{c.title}: </span>
                {c.skills.map((s) => s.name).join(', ')}
              </p>
            ))}
          </div>

          <H>Achievements</H>
          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">
                  {a.title} — {a.org}.
                </span>{' '}
                {a.detail}
              </li>
            ))}
          </ul>

          <H>Certifications</H>
          <p className="text-xs leading-relaxed text-mist">
            {Array.from(new Set(certifications.map((c) => c.issuer)))
              .map((iss) => `${iss}: ${certifications.filter((c) => c.issuer === iss).map((c) => c.name).join(', ')}`)
              .join(' · ')}
          </p>
        </div>
      </div>
    </article>
  );
}
