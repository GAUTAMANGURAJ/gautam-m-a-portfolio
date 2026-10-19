'use client';

import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { viewerProfiles, type ProfileId, type Project } from '@/lib/content/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from '@/hooks/smoothScroll';
import { useFinePointer } from '@/hooks/useMedia';
import Ambient from './Ambient';
import OpeningSequence from './OpeningSequence';
import PortfolioHome from './PortfolioHome';
import { EASE, useSpotlight } from './fx';
import { track } from '@/lib/analytics';

const ProfileSelector = lazy(() => import('./ProfileSelector'));
const ScrollProgress = lazy(() => import('./ScrollProgress'));
const CustomCursor = lazy(() => import('./CustomCursor'));
const HighlightsReel = lazy(() => import('./HighlightsReel'));
const ProjectModal = lazy(() => import('./ProjectModal'));
const ResumeModal = lazy(() => import('./ResumeModal'));

type Cut = { id: ProfileId };

type Stage = 'opening' | 'profiles' | 'home';

const STORAGE_KEY = 'gautam-portfolio-path';
const LEGACY_STORAGE_KEY = 'gautam-interface-originals-profile';

function readStoredProfile(): ProfileId | null {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(LEGACY_STORAGE_KEY);
    return viewerProfiles.some((p) => p.id === v) ? (v as ProfileId) : null;
  } catch {
    return null;
  }
}

export default function PortfolioApp() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <StudioShell />
      </SmoothScrollProvider>
    </MotionConfig>
  );
}

function StudioShell() {
  const fine = useFinePointer();
  useSpotlight(fine);
  const [stage, setStage] = useState<Stage>('opening');
  const [profileId, setProfileId] = useState<ProfileId>('gautam');
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [cut, setCut] = useState<Cut | null>(null);
  const { scrollTo, lock, unlock } = useSmoothScroll();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const quick = params.get('quick') === '1';
    const hasHash = Boolean(window.location.hash.replace(/^#/, ''));
    const pathParam = params.get('path') as ProfileId | null;
    const stored = readStoredProfile();
    const pathOk = pathParam && viewerProfiles.some((p) => p.id === pathParam) ? pathParam : null;

    if (pathOk) setProfileId(pathOk);
    else if (stored) setProfileId(stored);

    // Recruiters / deep links: skip opening + path picker
    if (quick || pathOk || stored || hasHash) {
      setStage('home');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock, hydrated]);

  const pickProfile = useCallback(
    (id: ProfileId) => {
      if (stage !== 'home') setProfileId(id);
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* ignore */
      }
      if (stage !== 'home') {
        window.scrollTo(0, 0);
        setStage('home');
      } else {
        // Cinematic cut: letterbox bars close, content swaps unseen, bars open
        track('path_switch', { id });
        setCut({ id });
      }
    },
    [stage],
  );

  const coverSwap = useCallback(() => {
    if (!cut) return;
    setProfileId(cut.id);
    scrollTo(0, { offset: 0, immediate: true });
  }, [cut, scrollTo]);

  const finishCut = useCallback(() => {
    if (cut) {
      const p = viewerProfiles.find((v) => v.id === cut.id)!;
      setToast(`Viewing as ${p.name} — ${p.blurb.toLowerCase()}`);
    }
    setCut(null);
  }, [cut]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const closeIntro = useCallback(() => setPlaying(false), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  // "Ask about this project": close the case study, pre-fill the form, then glide to Contact
  const askAbout = useCallback(
    (p: Project) => {
      setProject(null);
      track('project_ask', { id: p.id });
      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('portfolio:contact-prefill', { detail: { reason: 'question', subject: `About: ${p.title}` } }),
        );
        // The modal's scroll lock is released after its exit animation; scrolling while locked is ignored
        let tries = 0;
        const go = () => {
          if (document.documentElement.classList.contains('lenis-stopped') && tries++ < 30) {
            window.setTimeout(go, 100);
            return;
          }
          scrollTo('#contact');
        };
        go();
      }, 450);
    },
    [scrollTo],
  );

  if (!hydrated) {
    return <div className="min-h-[100svh] bg-ink" aria-hidden />;
  }

  return (
    <LayoutGroup>
      <Ambient />
      {fine && <div className="grain" aria-hidden />}
      {fine && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}
      {stage === 'home' && (
        <Suspense fallback={null}>
          <ScrollProgress />
        </Suspense>
      )}

      <AnimatePresence>
        {stage === 'opening' && (
          <OpeningSequence key="opening" onDone={() => setStage('profiles')} />
        )}
        {stage === 'profiles' && (
          <Suspense fallback={null}>
            <ProfileSelector key="profiles" onPick={pickProfile} />
          </Suspense>
        )}
      </AnimatePresence>

      {stage === 'home' && (
        // Opacity-only: scale/filter on this wrapper breaks position:fixed for the navbar
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <PortfolioHome
            profileId={profileId}
            onSwitch={pickProfile}
            onPlay={() => setPlaying(true)}
            onResume={() => {
              track('resume_view');
              setResumeOpen(true);
            }}
            onOpenProject={(p) => {
              track('project_open', { id: p.id });
              setProject(p);
            }}
            onReplay={() => {
              try {
                sessionStorage.removeItem(STORAGE_KEY);
                sessionStorage.removeItem(LEGACY_STORAGE_KEY);
              } catch {
                /* ignore */
              }
              setStage('opening');
            }}
          />
        </motion.div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence>{playing && <HighlightsReel key="intro" onClose={closeIntro} />}</AnimatePresence>
        <AnimatePresence>
          {project && (
            <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={setProject} onAsk={askAbout} />
          )}
        </AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {cut && (
          <PathCut
            key="cut"
            name={viewerProfiles.find((v) => v.id === cut.id)!.name}
            onCovered={coverSwap}
            onDone={finishCut}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm text-bone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

/** Letterbox cut used when the viewer switches path. */
function PathCut({ name, onCovered, onDone }: { name: string; onCovered: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const covered = phase === 'in';
  const bar = { duration: 0.5, ease: EASE };
  return (
    <motion.div className="fixed inset-0 z-[125]" aria-hidden>
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        initial={{ y: '-100%' }}
        animate={{ y: covered ? '0%' : '-100%' }}
        transition={bar}
        onAnimationComplete={() => {
          if (covered) {
            onCovered();
            window.setTimeout(() => setPhase('out'), 650);
          } else {
            onDone();
          }
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        initial={{ y: '100%' }}
        animate={{ y: covered ? '0%' : '100%' }}
        transition={bar}
      />
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px origin-center bg-gradient-to-r from-transparent via-signal-2 to-transparent shadow-[0_0_20px_rgba(45,212,191,0.8)]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={covered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: covered ? 0.3 : 0 }}
      />
      <motion.p
        className="absolute inset-x-0 top-1/2 -translate-y-[170%] px-4 text-center font-display text-3xl tracking-wide text-bone sm:text-5xl"
        initial={{ opacity: 0, y: 12 }}
        animate={covered ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: EASE, delay: covered ? 0.35 : 0 }}
      >
        {name}
      </motion.p>
    </motion.div>
  );
}
