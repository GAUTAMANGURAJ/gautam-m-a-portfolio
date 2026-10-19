'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { achievements, certifications } from '@/lib/content/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';
import { RailButtons } from './Rail';

function Laurel({ side }: { side: 'l' | 'r' }) {
  return (
    <svg viewBox="0 0 30 64" className={`h-14 w-auto text-gold ${side === 'r' ? '-scale-x-100' : ''}`} aria-hidden>
      <path d="M26 62C10 52 4 36 8 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {[10, 18, 26, 34, 42, 50].map((y, i) => (
        <ellipse key={y} cx={i < 2 ? 9 : 8 + i * 1.6} cy={y} rx="5" ry="2.2" fill="currentColor" opacity="0.85" transform={`rotate(-40 ${8 + i * 1.6} ${y})`} />
      ))}
    </svg>
  );
}

export default function Achievements() {
  const rail = useRef<HTMLDivElement>(null);
  const issuers = Array.from(new Set(certifications.map((c) => c.issuer)));

  return (
    <>
      <SectionHeading kicker="Recognition" title="Impact" />

      <div className="gutter grid gap-4 md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2 lg:grid-cols-3 lg:[&>*:last-child:nth-child(odd)]:col-span-1 [perspective:1400px]">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 50, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
          >
            <Tilt max={8} className="group h-full rounded-2xl">
              <article className="spot relative flex h-full min-h-[340px] flex-col items-center overflow-hidden rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#2a1f10,#0d0b08_60%,#060910)] px-5 pb-6 pt-8 text-center ring-1 ring-gold/20 transition duration-500 group-hover:ring-gold/60">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
                <div aria-hidden className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl transition duration-700 group-hover:bg-gold/25" />
                <div className="relative flex items-center gap-1">
                  <Laurel side="l" />
                  <div className="px-1">
                    <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.24em] text-gold">{a.laurel}</p>
                  </div>
                  <Laurel side="r" />
                </div>
                <h3 className="relative mt-6 font-display text-[2.1rem] leading-[0.92] tracking-wide text-bone">{a.title}</h3>
                <p className="relative mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{a.org}</p>
                <p className="relative mt-4 text-[13px] leading-relaxed text-bone/70">{a.detail}</p>
              </article>
            </Tilt>
          </motion.div>
        ))}
      </div>

      <div className="mt-16">
        <div className="gutter mb-2 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-sans text-lg font-semibold text-bone sm:text-2xl">
            Certified <span className="text-mist">· {certifications.length} credentials</span>
          </h3>
          <p className="text-xs text-smoke">{issuers.join(' · ')}</p>
        </div>
        <div className="group/rail relative">
          <div ref={rail} data-lenis-prevent className="rail gutter flex gap-3 overflow-x-auto py-5">
            {certifications.map((c, i) => (
              <motion.div
                key={c.name}
                className="spot group relative flex w-[min(230px,72vw)] shrink-0 snap-start flex-col justify-between rounded-xl bg-ink-2 p-4 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-white/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: EASE }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-signal">{c.issuer}</span>
                  {c.link ? (
                    <a href={c.link} target="_blank" rel="noreferrer" data-cursor="link" className="text-sm text-smoke transition hover:text-bone">
                      ↗
                    </a>
                  ) : null}
                </div>
                <p className="mt-6 text-sm font-medium leading-snug text-bone">{c.name}</p>
                {c.credentialId && <p className="mt-2 text-[10px] text-smoke">ID · {c.credentialId.slice(0, 8)}…</p>}
              </motion.div>
            ))}
          </div>
          <RailButtons rail={rail} />
        </div>
      </div>
    </>
  );
}
