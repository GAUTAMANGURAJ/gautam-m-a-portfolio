'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { profile, sectionMeta, skillCategories, type SectionId } from '@/lib/content/portfolio';
import { useSmoothScroll } from '@/hooks/smoothScroll';
import { useIstClock } from '@/hooks/useIstClock';
import { track } from '@/lib/analytics';
import { EASE, Magnetic } from './fx';
import { StudioMark } from './Poster';

const STACK = Array.from(new Set(skillCategories.flatMap((c) => c.skills.map((s) => s.name))));

/** Premium closing footer: stack marquee, sign-off CTA, link columns, giant wordmark, scroll-progress top button. */
export default function SiteFooter({ order, onReplay }: { order: SectionId[]; onReplay: () => void }) {
  const { scrollTo } = useSmoothScroll();
  const time = useIstClock();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number>();

  const { scrollYProgress } = useScroll();
  const ring = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      track('email_copy');
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const navLinks = [...order.map((id) => ({ id: id as string, label: sectionMeta[id].nav })), { id: 'contact', label: 'Contact' }];

  return (
    <footer className="relative z-10 mt-16 w-screen max-w-none overflow-hidden border-t border-white/10 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:mt-24">
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow-signal),transparent)] opacity-40" />
      <span aria-hidden className="nav-sheen pointer-events-none absolute inset-x-0 top-0 h-px" />

      {/* stack marquee */}
      <div className="group relative border-b border-white/[0.07] py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-smoke group-hover:[animation-play-state:paused]">
          {[...STACK, ...STACK].map((name, i) => (
            <span key={i} className="flex items-center gap-8">
              {name}
              <span className="h-1 w-1 rounded-full bg-signal/70" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* sign-off */}
        <div className="flex flex-col gap-8 py-14 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-signal">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              Open to opportunities
            </p>
            <motion.h2
              className="font-display text-[clamp(2.2rem,6.5vw,5rem)] leading-[0.95] tracking-wide text-bone"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              Let&apos;s build something
              <br />
              <span className="bg-gradient-to-r from-signal via-signal-2 to-gold bg-clip-text text-transparent">remarkable.</span>
            </motion.h2>
          </div>

          <Magnetic strength={0.2} className="w-full sm:w-auto">
            <button
              type="button"
              onClick={copyEmail}
              data-cursor="link"
              className="group/btn relative flex min-h-14 w-full items-center justify-between gap-4 overflow-hidden rounded-full border border-signal/40 bg-signal/10 px-6 py-3 text-left transition hover:border-signal/70 hover:bg-signal/15 sm:w-auto"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition duration-700 group-hover/btn:translate-x-full"
              />
              <span className="relative min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke">{copied ? 'Copied to clipboard' : 'Click to copy email'}</span>
                <span className="block truncate text-sm font-semibold text-bone sm:text-base">{profile.email}</span>
              </span>
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal text-ink transition group-hover/btn:scale-110">
                {copied ? '✓' : '⧉'}
              </span>
            </button>
          </Magnetic>
        </div>

        {/* columns */}
        <div className="grid gap-10 border-t border-white/[0.07] py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <StudioMark />
              <span className="font-display text-xl tracking-wide text-bone">{profile.displayName}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              {profile.role}. Enterprise frontends, design systems and delivery with ownership.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-mist">
              <span aria-hidden>◷</span>
              {profile.location.split(' / ')[0]} · <span className="tabular-nums text-bone">{time ?? '--:--'}</span> IST
            </p>
          </div>

          <nav aria-label="Footer sections">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-smoke">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-1">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(`#${l.id}`)}
                    className="group/link flex min-h-9 items-center gap-2 text-sm text-mist transition hover:text-bone"
                  >
                    <span aria-hidden className="h-px w-3 bg-signal/60 transition-all duration-300 group-hover/link:w-6 group-hover/link:bg-signal" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-smoke">Connect</p>
            <ul className="space-y-1">
              {[
                { label: 'LinkedIn', href: profile.links.linkedin },
                { label: 'GitHub', href: profile.links.github },
                { label: 'Email', href: `mailto:${profile.email}` },
                { label: 'Resume (PDF)', href: profile.resumePdf },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') || l.href.endsWith('.pdf') ? '_blank' : undefined}
                    rel="noreferrer"
                    data-cursor="link"
                    className="group/link flex min-h-9 items-center justify-between gap-3 border-b border-white/[0.06] text-sm text-mist transition hover:border-signal/40 hover:text-bone"
                  >
                    {l.label}
                    <span aria-hidden className="text-smoke transition duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-signal">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* giant wordmark */}
      <motion.div
        aria-hidden
        className="pointer-events-none relative select-none overflow-hidden text-center"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <p
          className="font-display font-bold uppercase leading-[0.78] tracking-[0.02em] [mask-image:linear-gradient(to_bottom,#000_25%,transparent_92%)]"
          style={{
            fontSize: 'clamp(3rem, 17.5vw, 19rem)',
            color: 'transparent',
            backgroundImage:
              'linear-gradient(100deg, transparent 20%, rgba(94,234,212,0.4) 50%, transparent 80%), linear-gradient(180deg, rgba(232,238,248,0.24), rgba(232,238,248,0.03))',
            backgroundSize: '220% 100%, 100% 100%',
            backgroundRepeat: 'no-repeat',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            animation: 'nav-sheen 9s linear infinite',
          }}
        >
          {profile.firstName}
        </p>
      </motion.div>

      {/* bottom bar */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 border-t border-white/[0.07] px-5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="order-2 text-center text-[11px] leading-relaxed text-smoke sm:order-1 sm:text-left">
          © {new Date().getFullYear()} {profile.displayName}. Designed & built by Gautam.
        </p>
        <div className="order-1 flex items-center justify-center gap-3 sm:order-2">
          <button
            type="button"
            onClick={onReplay}
            className="min-h-10 rounded-full border border-white/12 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-mist transition hover:border-signal/50 hover:text-bone"
          >
            ↺ Replay intro
          </button>
          <button
            type="button"
            onClick={() => scrollTo(0, { offset: 0 })}
            aria-label="Back to top"
            data-cursor="link"
            className="group/top relative flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-bone transition hover:border-signal/50 hover:bg-signal/10"
          >
            <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
              <motion.circle cx="24" cy="24" r="22" fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" style={{ pathLength: ring }} />
            </svg>
            <span aria-hidden className="transition duration-300 group-hover/top:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
