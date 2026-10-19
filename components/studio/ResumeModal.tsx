'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '@/lib/content/portfolio';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/smoothScroll';
import { useMedia } from '@/hooks/useMedia';
import { EASE } from './fx';
import { ResumeSheet } from './ResumeViewer';

/** Full-screen PDF viewer. On phones (where inline PDFs are unreliable) it offers open/download instead. */
export default function ResumeModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);
  const small = useMedia('(max-width: 767px)');
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useFocusTrap(true, root);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div
      ref={root}
      className="fixed inset-0 z-[140] flex flex-col bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
    >
      <div className="gutter flex h-16 shrink-0 items-center justify-between gap-3 pt-[env(safe-area-inset-top)]">
        <p className="truncate font-display text-2xl tracking-wide text-bone">Resume</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden rounded-md border border-white/20 px-4 py-2 text-xs font-semibold text-bone hover:bg-white/10 sm:inline-flex"
          >
            ⎙ Print
          </button>
          <a href={profile.resumePdf} download="Gautam_MA_Resume.pdf" className="rounded-md bg-bone px-3 py-2.5 text-xs font-bold text-ink xs:px-4">
            ⤓ Download
          </a>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close resume"
            data-cursor="close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-bone hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      </div>
      <motion.div
        className="gutter flex-1 pb-6"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {small ? (
          <div data-lenis-prevent className="h-full overflow-y-auto">
            <ResumeSheet />
            <a
              href={profile.resumePdf}
              target="_blank"
              rel="noreferrer"
              className="glass mt-4 flex min-h-12 items-center justify-center rounded-md text-sm font-semibold text-bone"
            >
              Open original PDF ↗
            </a>
          </div>
        ) : (
          <iframe title="Gautam M A resume (PDF)" src={`${profile.resumePdf}#view=FitH`} className="h-full w-full rounded-xl bg-white" />
        )}
      </motion.div>
    </motion.div>
  );
}
