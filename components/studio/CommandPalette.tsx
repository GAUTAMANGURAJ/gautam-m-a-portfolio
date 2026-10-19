'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { profile, projects, sectionMeta, viewerProfiles, type ProfileId, type Project, type SectionId } from '@/lib/content/portfolio';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock, useSmoothScroll } from '@/hooks/smoothScroll';
import { EASE } from './fx';
import { track } from '@/lib/analytics';

type Item = {
  id: string;
  group: 'Jump to' | 'Case studies' | 'Actions' | 'Switch path' | 'Links';
  label: string;
  hint?: string;
  keywords?: string;
  glyph: string;
  run: () => void;
  /** Alternative action on Cmd/Ctrl + Enter. */
  alt?: { label: string; run: () => void };
};

type Props = {
  order: SectionId[];
  profileId: ProfileId;
  onSwitch: (id: ProfileId) => void;
  onReplay: () => void;
  onPlay: () => void;
  onResume: () => void;
  onOpenProject: (p: Project) => void;
};

const GROUP_ORDER: Item['group'][] = ['Jump to', 'Case studies', 'Actions', 'Switch path', 'Links'];

function score(item: Item, q: string): number {
  const label = item.label.toLowerCase();
  const hay = `${label} ${item.hint ?? ''} ${item.keywords ?? ''}`.toLowerCase();
  if (label.startsWith(q)) return 4;
  if (label.split(/\s+/).some((w) => w.startsWith(q))) return 3;
  if (label.includes(q)) return 2;
  if (hay.includes(q)) return 1;
  return 0;
}

/**
 * Cmd/Ctrl + K palette: jump to any section, open a case study, switch path, copy the email, and more.
 * Opens from the keyboard, from the navbar button, or via the `portfolio:open-palette` event.
 */
export default function CommandPalette({ order, profileId, onSwitch, onReplay, onPlay, onResume, onOpenProject }: Props) {
  const router = useRouter();
  const { scrollTo } = useSmoothScroll();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useScrollLock(open);
  useFocusTrap(open, panel);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => lastFocus.current?.focus?.({ preventScroll: true }), 30);
  }, []);

  const openPalette = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setCursor(0);
    setNote(null);
    setOpen(true);
    track('palette_open');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            lastFocus.current = document.activeElement as HTMLElement | null;
            setQuery('');
            setCursor(0);
            setNote(null);
          }
          return !o;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('portfolio:open-palette', openPalette);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('portfolio:open-palette', openPalette);
    };
  }, [openPalette]);

  useEffect(() => {
    if (open) window.setTimeout(() => input.current?.focus({ preventScroll: true }), 40);
  }, [open]);

  const go = useCallback(
    (fn: () => void) => {
      setOpen(false);
      // Let the scroll lock release first, exactly like the mobile menu does
      window.setTimeout(fn, 70);
    },
    [],
  );

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];
    for (const id of order) {
      list.push({
        id: `sec-${id}`,
        group: 'Jump to',
        label: sectionMeta[id].nav,
        hint: sectionMeta[id].meta,
        glyph: '→',
        run: () => go(() => scrollTo(`#${id}`)),
      });
    }
    list.push({ id: 'sec-contact', group: 'Jump to', label: 'Contact', hint: 'Message · LinkedIn · email', keywords: 'hire reach talk', glyph: '→', run: () => go(() => scrollTo('#contact')) });

    for (const p of projects) {
      list.push({
        id: `proj-${p.id}`,
        group: 'Case studies',
        label: p.title,
        hint: p.ownership,
        keywords: `${p.genre} ${p.stack.join(' ')} ${(p.deepDives ?? []).map((d) => d.title).join(' ')}`,
        glyph: '◆',
        run: () => go(() => onOpenProject(p)),
        alt: { label: 'Open full page', run: () => go(() => router.push(`/work/${p.id}/`)) },
      });
    }

    list.push(
      { id: 'act-resume', group: 'Actions', label: 'View resume', hint: 'One-page overview', keywords: 'cv', glyph: '⎙', run: () => go(onResume) },
      {
        id: 'act-download',
        group: 'Actions',
        label: 'Download resume (PDF)',
        keywords: 'cv pdf save',
        glyph: '↓',
        run: () =>
          go(() => {
            const a = document.createElement('a');
            a.href = profile.resumePdf;
            a.download = 'Gautam_MA_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
          }),
      },
      { id: 'act-play', group: 'Actions', label: 'Play highlights', hint: 'Short intro reel', glyph: '▶', run: () => go(onPlay) },
      {
        id: 'act-copy',
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.email,
        glyph: '⧉',
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            track('email_copy');
            setNote('Email copied to clipboard');
            window.setTimeout(close, 900);
          } catch {
            go(() => {
              window.location.href = `mailto:${profile.email}`;
            });
          }
        },
      },
      { id: 'act-theme', group: 'Actions', label: 'Toggle accent theme', hint: 'Teal ↔ Ember', glyph: '◐', run: () => go(() => window.dispatchEvent(new CustomEvent('portfolio:toggle-theme'))) },
      { id: 'act-replay', group: 'Actions', label: 'Replay intro', glyph: '↺', run: () => go(onReplay) },
    );

    for (const v of viewerProfiles) {
      if (v.id === profileId) continue;
      list.push({ id: `path-${v.id}`, group: 'Switch path', label: `View as ${v.name}`, hint: v.blurb, keywords: 'path audience', glyph: '⇄', run: () => go(() => onSwitch(v.id)) });
    }

    list.push(
      { id: 'lnk-linkedin', group: 'Links', label: 'LinkedIn', hint: 'Professional profile', glyph: '↗', run: () => go(() => window.open(profile.links.linkedin, '_blank', 'noopener')) },
      { id: 'lnk-github', group: 'Links', label: 'GitHub', hint: 'Code & experiments', glyph: '↗', run: () => go(() => window.open(profile.links.github, '_blank', 'noopener')) },
      { id: 'lnk-email', group: 'Links', label: 'Email me', hint: profile.email, glyph: '↗', run: () => go(() => (window.location.href = `mailto:${profile.email}`)) },
    );
    if (profile.links.booking) {
      list.push({ id: 'lnk-call', group: 'Links', label: 'Book a 20-min call', glyph: '↗', run: () => go(() => window.open(profile.links.booking, '_blank', 'noopener')) });
    }
    return list;
  }, [order, profileId, onOpenProject, onPlay, onReplay, onResume, onSwitch, scrollTo, router, go, close]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? items
          .map((it) => ({ it, s: score(it, q) }))
          .filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s)
          .map((x) => x.it)
      : items;
    // Group while keeping score order within a group
    return GROUP_ORDER.flatMap((g) => base.filter((i) => i.group === g));
  }, [items, query]);

  useEffect(() => setCursor(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = results[cursor];
      if (!it) return;
      if ((e.metaKey || e.ctrlKey) && it.alt) it.alt.run();
      else it.run();
    }
  };

  if (typeof document === 'undefined') return null;

  let lastGroup = '';
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[160] flex items-start justify-center px-4 pt-[12svh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div aria-hidden className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Search and jump"
            onKeyDown={onKeyDown}
            className="nav-surface relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/14 shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <span aria-hidden className="nav-sheen pointer-events-none absolute inset-x-6 top-0 h-px" />
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <span aria-hidden className="text-lg text-smoke">
                ⌕
              </span>
              <input
                ref={input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[cursor] ? `palette-${results[cursor].id}` : undefined}
                aria-autocomplete="list"
                placeholder="Search sections, case studies, actions…"
                className="h-14 w-full bg-transparent text-[15px] text-bone outline-none placeholder:text-smoke focus-visible:outline-none"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="hidden rounded-md border border-white/12 px-1.5 py-0.5 text-[10px] font-semibold text-smoke sm:block">ESC</kbd>
            </div>

            <ul id="palette-list" ref={listRef} role="listbox" data-lenis-prevent className="sheet-scroll max-h-[52svh] overflow-y-auto overscroll-contain p-2">
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-mist" role="presentation">
                  Nothing matches “{query}”. Try “resume”, “contact”, or a project name.
                </li>
              )}
              {results.map((it, i) => {
                const header = it.group !== lastGroup ? it.group : null;
                lastGroup = it.group;
                const on = i === cursor;
                return (
                  <li key={it.id} role="presentation">
                    {header && <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.26em] text-smoke">{header}</p>}
                    <button
                      type="button"
                      role="option"
                      id={`palette-${it.id}`}
                      aria-selected={on}
                      data-idx={i}
                      tabIndex={-1}
                      onMouseMove={() => setCursor(i)}
                      onClick={() => it.run()}
                      className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition ${on ? 'bg-signal/12 ring-1 ring-signal/30' : 'hover:bg-white/[0.04]'}`}
                    >
                      <span aria-hidden className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm ${on ? 'border-signal/40 text-signal' : 'border-white/10 text-mist'}`}>
                        {it.glyph}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-bone">{it.label}</span>
                        {it.hint && <span className="block truncate text-xs text-smoke">{it.hint}</span>}
                      </span>
                      {on && <span aria-hidden className="text-xs text-smoke">↵</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5 text-[11px] text-smoke" aria-live="polite">
              <span>{note ?? '↑↓ navigate · ↵ select'}</span>
              {results[cursor]?.alt && <span>⌘/Ctrl ↵ {results[cursor].alt?.label.toLowerCase()}</span>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
