'use client';

import { useEffect, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { viewerProfiles, type ProfileId, type Project, type SectionId } from '@/lib/content/portfolio';
import { resolveHashTarget } from '@/lib/hashTargets';
import { useSmoothScroll } from '@/hooks/smoothScroll';
import Navbar from './Navbar';
import CommandPalette from './CommandPalette';
import Hero from './Hero';
import ExploreRail from './ExploreRail';
import Scene from './Scene';

/** Below-fold sections — code-split so the hero path stays lean. */
const About = dynamic(() => import('./About'));
const Journey = dynamic(() => import('./Journey'));
const SelectedWork = dynamic(() => import('./SelectedWork'));
const TopPicks = dynamic(() => import('./TopPicks'));
const Skills = dynamic(() => import('./Skills'));
const Achievements = dynamic(() => import('./Achievements'));
const ResumeViewer = dynamic(() => import('./ResumeViewer'));
const FinalCTA = dynamic(() => import('./FinalCTA'));

type Props = {
  profileId: ProfileId;
  onSwitch: (id: ProfileId) => void;
  onReplay: () => void;
  onPlay: () => void;
  onResume: () => void;
  onOpenProject: (p: Project) => void;
};

export default function PortfolioHome({
  profileId,
  onSwitch,
  onReplay,
  onPlay,
  onResume,
  onOpenProject,
}: Props) {
  const order = viewerProfiles.find((p) => p.id === profileId)!.order;
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const target = resolveHashTarget(window.location.hash);
    if (!target) return;
    // Sections are code-split, so the page keeps growing for a moment after first paint.
    // Wait for the height to settle, scroll, then correct once if layout still shifted.
    let cancelled = false;
    let timer = 0;
    let lastHeight = -1;
    let stable = 0;
    let tries = 0;
    const cancel = () => {
      cancelled = true;
    };
    const aim = (duration: number) => scrollTo(`#${target}`, { duration });
    // Lazily-rendered sections change height as they near the viewport, so re-aim a few times.
    let corrections = 0;
    const verify = () => {
      if (cancelled) return;
      const el = document.getElementById(target);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (Math.abs(top - 72) > 60 && !(atBottom && top > 0) && corrections < 6) {
        corrections += 1;
        aim(0.5);
        timer = window.setTimeout(verify, 900);
      }
    };
    const tick = () => {
      if (cancelled) return;
      const h = document.documentElement.scrollHeight;
      stable = h === lastHeight ? stable + 1 : 0;
      lastHeight = h;
      tries += 1;
      if (stable >= 3 || tries > 25) {
        aim(1.15);
        timer = window.setTimeout(verify, 1600);
        return;
      }
      timer = window.setTimeout(tick, 200);
    };
    const events = ['wheel', 'touchstart', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, cancel, { passive: true, once: true }));
    timer = window.setTimeout(tick, 480);
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, cancel));
    };
  }, [scrollTo, profileId]);

  useEffect(() => {
    const onHash = () => {
      const target = resolveHashTarget(window.location.hash);
      if (target) scrollTo(`#${target}`, { duration: 1.05 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [scrollTo]);

  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    journey: <Journey />,
    originals: <SelectedWork onOpen={onOpenProject} />,
    picks: <TopPicks />,
    skills: <Skills />,
    moments: <Achievements />,
    story: <ResumeViewer onView={onResume} />,
  };

  return (
    <>
      <Navbar order={order} profileId={profileId} onSwitch={onSwitch} />
      <CommandPalette
        order={order}
        profileId={profileId}
        onSwitch={onSwitch}
        onReplay={onReplay}
        onPlay={onPlay}
        onResume={onResume}
        onOpenProject={onOpenProject}
      />
      <main id="main">
        <Hero key={`hero-${profileId}`} onPlay={onPlay} onResume={onResume} profileId={profileId} />
        <ExploreRail order={order} />
        {order.map((id) => (
          <Scene key={id} id={id} className={id === 'originals' ? '!py-0 sm:!py-0' : ''}>
            {sections[id]}
          </Scene>
        ))}
        <FinalCTA onReplay={onReplay} order={order} />
      </main>
    </>
  );
}
