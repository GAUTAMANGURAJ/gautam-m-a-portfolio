import Link from 'next/link';
import { projects } from '@/lib/content/portfolio';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.4em] text-signal">Error 404</p>
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] tracking-wide text-bone">Off the map</h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-mist">
        That page doesn&apos;t exist — but the work does. Head back to the portfolio, or jump straight into a case study.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="flex min-h-12 items-center rounded-full bg-signal px-7 text-sm font-bold tracking-[0.12em] text-ink transition hover:bg-signal-2">
          Back to portfolio
        </Link>
        <Link href="/#contact" className="glass flex min-h-12 items-center rounded-full px-6 text-sm font-semibold text-bone transition hover:bg-white/15">
          Contact
        </Link>
      </div>
      <ul className="mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/work/${p.id}`} className="inline-flex min-h-10 items-center rounded-full border border-white/12 px-4 text-xs font-semibold text-mist transition hover:border-signal/40 hover:text-bone">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
