'use client';

import { motion } from 'framer-motion';
import { chapters, education, experience, profile, storyBlurb, workingPrinciples } from '@/lib/content/portfolio';
import { EASE, RevealText, SectionHeading, Tilt } from './fx';

export default function About() {
  const facts = [
    { k: 'Role', v: profile.role, s: `${experience[0].company} · ${experience[0].period}` },
    { k: 'Education', v: education[0].degree, s: `${education[0].school}, ${education[0].place}` },
    { k: 'Diploma', v: education[1].degree, s: `${education[1].school} · ${education[1].period}` },
    { k: 'Based in', v: profile.location, s: 'India' },
  ];

  return (
    <>
      <SectionHeading kicker="Background" title="About Me" />
      <div className="gutter grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <motion.div
          className="mx-auto w-full max-w-md lg:max-w-none"
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Tilt max={5} className="rounded-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,#0f766e,#042f2e_55%,#060910)]" />
              <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_28px)]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.portrait.src}
                srcSet={profile.portrait.srcSet}
                sizes={profile.portrait.sizes}
                width={profile.portrait.width}
                height={profile.portrait.height}
                alt={profile.portrait.alt}
                loading="lazy"
                decoding="async"
                className="absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-signal">SOFTWARE ENGINEER</p>
                  <p className="font-display text-3xl leading-none text-bone">{profile.displayName}</p>
                </div>
                <span className="rounded border border-white/30 px-1.5 text-[10px] font-bold text-bone">
                  {chapters.length} chapters
                </span>
              </div>
            </div>
          </Tilt>
        </motion.div>

        <div>
          <RevealText as="h3" text="In brief" className="font-display text-3xl tracking-wide text-bone sm:text-4xl" />
          <motion.p
            className="mt-5 font-serif text-[clamp(1.15rem,2.4vw,1.55rem)] italic leading-[1.35] text-bone"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          >
            “{storyBlurb}”
          </motion.p>
          <p className="mt-4 text-sm text-mist">— {profile.fullName}</p>

          <motion.ul
            className="mt-10 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.08 }}
          >
            {facts.map((f) => (
              <motion.li
                key={f.k}
                className="spot bg-ink-2 p-5"
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              >
                <Tilt max={4} glare={false} className="h-full">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">{f.k}</p>
                  <p className="mt-2 text-base font-semibold text-bone">{f.v}</p>
                  <p className="mt-0.5 text-xs text-mist">{f.s}</p>
                </Tilt>
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">Experience</p>
            <Tilt max={3} className="rounded-xl">
              <div className="spot rounded-xl bg-ink-2 p-5 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-bone">
                  {experience[0].role} · {experience[0].company}
                </p>
                <p className="mt-1 text-xs text-mist">
                  {experience[0].place} · {experience[0].period}
                </p>
                <ul className="mt-3 space-y-2">
                  {experience[0].points.slice(0, 3).map((p) => (
                    <li key={p} className="flex gap-2 text-xs leading-relaxed text-mist">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Tilt>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">How I work</p>
            <ul className="space-y-3">
              {workingPrinciples.map((p) => (
                <li key={p.title} className="spot rounded-xl border border-white/10 bg-ink-2/80 px-4 py-3">
                  <p className="text-sm font-semibold text-bone">{p.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-mist">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-smoke">Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="glass rounded-full px-3 py-1.5 text-xs font-medium text-bone">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
