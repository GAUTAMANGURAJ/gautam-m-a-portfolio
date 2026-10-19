'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { profile, sectionMeta, viewerProfiles, type ProfileId, type SectionId } from '@/lib/content/portfolio';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock, useSmoothScroll } from '@/hooks/smoothScroll';
import { ProfileAvatar } from './ProfileSelector';
import { StudioMark } from './Poster';
import { EASE } from './fx';

type ThemeId = 'interface' | 'ember';

const THEME_KEY = 'gautam-portfolio-theme';

function readStoredTheme(): ThemeId {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'interface' || t === 'ember') return t;
  } catch {
    /* ignore */
  }
  return 'interface';
}

const menuItem = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
};

export default function Navbar({
  order,
  profileId,
  onSwitch,
}: {
  order: SectionId[];
  profileId: ProfileId;
  onSwitch: (id: ProfileId) => void;
}) {
  const { scrollTo } = useSmoothScroll();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathOpen, setPathOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [kbd, setKbd] = useState('Ctrl K');
  const [theme, setTheme] = useState<ThemeId>('interface');
  const pathRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = viewerProfiles.find((p) => p.id === profileId)!;
  useScrollLock(menuOpen);
  useFocusTrap(menuOpen, menuRef);

  useEffect(() => {
    setTheme(readStoredTheme());
    setMounted(true);
    setKbd(/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K');
  }, []);

  // The command palette can flip the accent theme without owning its state
  useEffect(() => {
    const toggle = () => setTheme((t) => (t === 'interface' ? 'ember' : 'interface'));
    window.addEventListener('portfolio:toggle-theme', toggle);
    return () => window.removeEventListener('portfolio:toggle-theme', toggle);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme, mounted]);

  useEffect(() => {
    let prev = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > prev + 8) setPathOpen(false);
      prev = y;
      // Contact is the last section but isn't part of `order`, so include it explicitly
      for (const id of [...order, 'contact'].reverse()) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('lenis-scroll', onScroll as EventListener);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('lenis-scroll', onScroll as EventListener);
    };
  }, [order]);

  useEffect(() => {
    if (!pathOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!pathRef.current?.contains(e.target as Node)) setPathOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPathOpen(false);
    };
    window.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [pathOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const ui = (
    <>
      <header
        className={`gutter pointer-events-none fixed inset-x-0 top-0 pt-[env(safe-area-inset-top)] ${
          menuOpen ? 'z-[100]' : 'z-[80]'
        }`}
      >
        <div
          className={`nav-surface pointer-events-auto relative mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl border px-2.5 backdrop-blur-xl transition-[height,margin,border-color,box-shadow] duration-500 ease-cine xs:gap-3 sm:px-4 ${
            scrolled || menuOpen
              ? 'mt-1.5 h-[3.25rem] border-signal/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_18px_48px_rgba(0,0,0,0.65),0_0_0_1px_rgba(45,212,191,0.06)] sm:mt-2 sm:h-14'
              : 'mt-2.5 h-14 border-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_36px_rgba(0,0,0,0.5)] sm:mt-3 sm:h-[3.75rem]'
          }`}
        >
          <span
            aria-hidden
            className="nav-sheen pointer-events-none absolute inset-x-5 top-0 h-px"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />

          <button
            type="button"
            onClick={() => scrollTo('#top', { offset: 0 })}
            className="group flex min-w-0 items-center gap-2.5 font-display text-lg font-bold tracking-tight text-bone"
            data-cursor="link"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-signal/25 bg-ink-2 shadow-[0_0_20px_rgba(45,212,191,0.12)] transition group-hover:border-signal/50">
              <StudioMark className="!gap-0 [&_span]:hidden [&_svg]:h-5 [&_svg]:w-5" />
            </span>
            <span className="flex min-w-0 flex-col items-start leading-none">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-smoke transition group-hover:text-mist">
                Studio
              </span>
              <span className="truncate text-sm tracking-wide xs:text-[15px]">{profile.firstName}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {order.map((id) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(`#${id}`)}
                  data-cursor="link"
                  className={`relative rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                    isActive ? 'text-bone' : 'text-mist hover:text-bone'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-signal/30 bg-signal/10"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                  <span className="relative z-10">{sectionMeta[id].nav}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => scrollTo('#contact')}
              data-cursor="link"
              className={`relative rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                active === 'contact' ? 'text-bone' : 'text-mist hover:text-bone'
              }`}
            >
              {active === 'contact' && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full border border-signal/30 bg-signal/10"
                  transition={{ duration: 0.4, ease: EASE }}
                />
              )}
              <span className="relative z-10">Contact</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('portfolio:open-palette'))}
              className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist transition hover:border-signal/35 hover:bg-signal/10 hover:text-bone lg:inline-flex"
              aria-label="Search and jump to anything"
              title="Search and jump"
              data-cursor="link"
            >
              <span aria-hidden>⌕</span>
              <kbd className="font-sans normal-case tracking-normal text-smoke">{kbd}</kbd>
            </button>

            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'interface' ? 'ember' : 'interface'))}
              className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-mist transition hover:border-signal/35 hover:bg-signal/10 hover:text-bone sm:inline-flex"
              title="Toggle accent theme"
              data-cursor="link"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: theme === 'interface' ? '#2dd4bf' : '#e8a45c', boxShadow: `0 0 8px ${theme === 'interface' ? '#2dd4bf' : '#e8a45c'}` }}
              />
              {theme === 'interface' ? 'Teal' : 'Ember'}
            </button>

            <div ref={pathRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setPathOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={pathOpen}
                aria-label="Switch viewing path"
                data-cursor="link"
                className={`group flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 transition duration-300 ${
                  pathOpen
                    ? 'border-signal/40 bg-ink-2 shadow-[0_0_24px_rgba(45,212,191,0.12)]'
                    : 'border-white/12 bg-white/[0.03] hover:border-white/25 hover:bg-ink-2'
                }`}
              >
                <ProfileAvatar id={profileId} size="sm" />
                <span className="flex min-w-[5.5rem] flex-col items-start text-left leading-none">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-smoke">Path</span>
                  <span className="mt-1 text-xs font-semibold text-bone">{current.name}</span>
                </span>
                <motion.span
                  animate={{ rotate: pathOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="text-[10px] text-mist"
                  aria-hidden
                >
                  ▾
                </motion.span>
              </button>

              <AnimatePresence>
                {pathOpen && (
                  <motion.div
                    role="listbox"
                    aria-label="Viewing paths"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[17.5rem] overflow-hidden rounded-2xl border border-white/14 p-1.5 shadow-[0_28px_64px_rgba(0,0,0,0.72)]"
                    style={{
                      // Solid panel — glass chrome without letting the hero portrait show through
                      background:
                        'linear-gradient(165deg, rgba(21,28,46,0.98) 0%, rgba(12,18,32,1) 42%, rgba(6,9,16,1) 100%)',
                      isolation: 'isolate',
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-signal/45 to-transparent"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-signal/10 blur-2xl"
                    />
                    <div className="relative mb-1.5 flex items-center justify-between px-2.5 pt-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-smoke">Choose path</p>
                      <span className="rounded-full bg-signal/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-signal">
                        Live
                      </span>
                    </div>
                    <ul className="relative space-y-0.5">
                      {viewerProfiles.map((p) => {
                        const selected = p.id === profileId;
                        return (
                          <li key={p.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => {
                                onSwitch(p.id);
                                setPathOpen(false);
                              }}
                              data-cursor="link"
                              className={`group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition duration-200 ${
                                selected
                                  ? 'bg-signal/15 ring-1 ring-signal/35'
                                  : 'hover:bg-white/[0.06]'
                              }`}
                            >
                              <span
                                className="relative shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 transition group-hover:ring-white/25"
                                style={{ boxShadow: selected ? `0 0 16px ${p.color}44` : undefined }}
                              >
                                <ProfileAvatar id={p.id} size="sm" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-bone">{p.name}</span>
                                  {selected && (
                                    <span className="rounded-full bg-signal/20 px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-signal">
                                      Active
                                    </span>
                                  )}
                                </span>
                                <span className="mt-0.5 block truncate text-[11px] text-smoke">{p.blurb}</span>
                              </span>
                              <span
                                className={`text-sm transition ${selected ? 'text-signal opacity-100' : 'text-mist opacity-0 group-hover:opacity-60'}`}
                                aria-hidden
                              >
                                {selected ? '✓' : '→'}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              className={`relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border text-bone transition-colors duration-300 lg:hidden ${
                menuOpen
                  ? 'border-signal/45 bg-signal/15 shadow-[0_0_22px_rgba(45,212,191,0.25)]'
                  : 'border-white/14 bg-white/[0.05] hover:border-white/28 hover:bg-white/[0.09]'
              }`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((v) => !v);
                setPathOpen(false);
              }}
            >
              <span className="relative block h-3.5 w-[18px]" aria-hidden>
                <span
                  className={`absolute left-0 h-[1.5px] rounded-full bg-current transition-all duration-500 ease-cine ${
                    menuOpen ? 'top-[6px] w-full rotate-45' : 'top-0 w-full'
                  }`}
                />
                <span
                  className={`absolute left-0 top-[6px] h-[1.5px] rounded-full bg-current transition-all duration-300 ease-cine ${
                    menuOpen ? 'w-0 opacity-0' : 'w-3/4 opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] rounded-full bg-current transition-all duration-500 ease-cine ${
                    menuOpen ? 'top-[6px] w-full -rotate-45' : 'top-[12px] w-1/2'
                  }`}
                />
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[90] flex flex-col overflow-hidden lg:hidden"
            style={{
              background:
                'radial-gradient(90% 55% at 85% 0%, rgba(45,212,191,0.14), transparent 60%), radial-gradient(70% 45% at 0% 100%, rgba(212,165,116,0.10), transparent 60%), linear-gradient(180deg, #0a101d 0%, #060910 100%)',
            }}
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Leave room for the fixed header + hamburger */}
            <div className="shrink-0" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 4.5rem)' }} aria-hidden />

            {/* This is the only scrollable region — must stay independent of body lock */}
            <div
              data-lenis-prevent
              className="sheet-scroll gutter mx-auto min-h-0 w-full max-w-lg flex-1 overflow-y-auto overscroll-y-contain pb-[max(2.5rem,env(safe-area-inset-bottom))]"
            >
              <motion.div
                className="flex flex-col gap-5"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.18 } } }}
              >
                <motion.div variants={menuItem}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke">Path</p>
                  <ul className="grid grid-cols-1 gap-2 xs:grid-cols-2">
                    {viewerProfiles.map((p) => {
                      const selected = p.id === profileId;
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSwitch(p.id);
                              setMenuOpen(false);
                            }}
                            className={`flex min-h-12 w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${
                              selected
                                ? 'border-signal/40 bg-signal/10'
                                : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                            }`}
                          >
                            <ProfileAvatar id={p.id} size="sm" />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-bone">{p.name}</span>
                              <span className="block truncate text-[11px] text-smoke">{p.blurb}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>

                <nav className="flex flex-col gap-2" aria-label="Mobile">
                  {order.map((id, i) => {
                    const isActive = active === id;
                    return (
                      <motion.button
                        key={id}
                        type="button"
                        variants={menuItem}
                        whileTap={{ scale: 0.98 }}
                        aria-current={isActive ? 'true' : undefined}
                        className={`group relative flex min-h-14 items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors ${
                          isActive
                            ? 'border-signal/40 bg-signal/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-signal/30 hover:bg-white/[0.06]'
                        }`}
                        onClick={() => {
                          setMenuOpen(false);
                          // Defer so unlock restores scroll position before Lenis/native jump
                          window.setTimeout(() => scrollTo(`#${id}`), 40);
                        }}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-y-2 left-0 w-[3px] rounded-r bg-signal transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                        />
                        <span className="w-6 shrink-0 font-display text-sm tracking-wider text-smoke">{String(i + 1).padStart(2, '0')}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-semibold text-bone">{sectionMeta[id].nav}</span>
                          <span className="mt-0.5 block truncate text-xs text-smoke">{sectionMeta[id].meta}</span>
                        </span>
                        <span aria-hidden className="text-sm text-mist transition group-hover:translate-x-0.5 group-hover:text-signal">→</span>
                      </motion.button>
                    );
                  })}
                  <motion.button
                    type="button"
                    variants={menuItem}
                    whileTap={{ scale: 0.98 }}
                    aria-current={active === 'contact' ? 'true' : undefined}
                    className={`min-h-14 rounded-xl border px-4 py-3 text-left transition hover:border-signal/60 hover:bg-signal/15 ${
                      active === 'contact' ? 'border-signal/70 bg-signal/20' : 'border-signal/40 bg-signal/10'
                    }`}
                    onClick={() => {
                      setMenuOpen(false);
                      window.setTimeout(() => scrollTo('#contact'), 40);
                    }}
                  >
                    <span className="text-base font-semibold text-bone">Contact</span>
                    <span className="mt-0.5 block text-xs text-smoke">Message · LinkedIn · email</span>
                  </motion.button>
                </nav>

                <motion.button
                  type="button"
                  variants={menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    window.setTimeout(() => window.dispatchEvent(new CustomEvent('portfolio:open-palette')), 120);
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-mist"
                >
                  ⌕ Search &amp; jump
                </motion.button>

                <motion.button
                  type="button"
                  variants={menuItem}
                  onClick={() => setTheme((t) => (t === 'interface' ? 'ember' : 'interface'))}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-mist"
                >
                  Accent · {theme === 'interface' ? 'Teal' : 'Ember'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (!mounted) return null;
  return createPortal(ui, document.body);
}
