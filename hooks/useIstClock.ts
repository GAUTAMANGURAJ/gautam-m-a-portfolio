'use client';

import { useEffect, useState } from 'react';

/** Live "10:42 pm" style time in IST. `null` until mounted, so it never mismatches on hydration. */
export function useIstClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date());
    setNow(fmt());
    const t = window.setInterval(() => setNow(fmt()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}
