import { ImageResponse } from 'next/og';
import { profile, projects } from '@/lib/content/portfolio';

// Exported as real files — /og/home.png and /og/<project>.png — so GitHub Pages serves a proper
// image/png content type (the extensionless opengraph-image convention would not get one).
export const dynamic = 'force-static';

const SIZE = { width: 1200, height: 630 };

export function generateStaticParams() {
  return [{ name: 'home.png' }, ...projects.map((p) => ({ name: `${p.id}.png` }))];
}

export function GET(_req: Request, { params }: { params: { name: string } }) {
  const slug = params.name.replace(/\.png$/, '');
  const project = projects.find((p) => p.id === slug);
  return project ? projectCard(project) : homeCard();
}

function homeCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(80% 90% at 85% 0%, #0f766e 0%, #060910 62%)',
          color: '#e8eef8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, letterSpacing: 8, color: '#2dd4bf', fontWeight: 700 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: '#2dd4bf' }} />
          FRONTEND SYSTEMS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>{profile.fullName}</div>
          <div style={{ marginTop: 22, fontSize: 40, color: '#b4bdcf' }}>Software Engineer · Enterprise frontends</div>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 24, color: '#a9b3c5' }}>
          {['React', 'TypeScript', 'Workflow engines', 'Access & sessions'].map((t) => (
            <div key={t} style={{ display: 'flex', border: '1px solid #334155', borderRadius: 999, padding: '10px 22px' }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    SIZE,
  );
}

function projectCard(p: (typeof projects)[number]) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 80px',
          background: `linear-gradient(150deg, ${p.palette.via} 0%, ${p.palette.from} 45%, #060910 100%)`,
          color: '#e8eef8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, letterSpacing: 6, fontWeight: 700 }}>
          <div style={{ display: 'flex', color: p.palette.accent }}>CASE STUDY</div>
          <div style={{ display: 'flex', color: '#b4bdcf' }}>GAUTAM M A</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -1.5 }}>{p.title}</div>
          <div style={{ display: 'flex', marginTop: 26, fontSize: 34, color: p.palette.accent, fontWeight: 600 }}>{p.caseStudy.proof}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#b4bdcf' }}>
          {p.ownership} · {p.genre.split('·')[0].trim()}
        </div>
      </div>
    ),
    SIZE,
  );
}
