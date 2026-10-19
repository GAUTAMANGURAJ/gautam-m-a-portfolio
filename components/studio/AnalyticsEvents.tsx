'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/** One delegated listener for outbound and download links, so no individual component needs wiring. */
export default function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (/\.pdf($|\?)/i.test(href)) track('resume_download');
      else if (href.startsWith('mailto:')) track('email_click');
      else if (/linkedin\.com/i.test(href)) track('outbound_linkedin');
      else if (/github\.com/i.test(href)) track('outbound_github');
      else if (/cal\.com|calendly\.com/i.test(href)) track('booking_click');
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
