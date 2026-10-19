import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/content/portfolio';
import WorkPage from '@/components/studio/WorkPage';
import JsonLd from '@/components/studio/JsonLd';
import { SITE_URL, projectJsonLd } from '@/lib/seo';

// Static export: only the slugs returned below are generated.
// (Don't set `dynamicParams = false` — Next's dev server rejects it together with `output: 'export'`.)
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find((p) => p.id === params.slug);
  if (!project) return {};
  const url = `${SITE_URL}/work/${project.id}/`;
  return {
    title: project.title,
    description: project.logline,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} · Gautam M A`,
      description: project.caseStudy.proof,
      type: 'article',
      url,
      images: [{ url: `${SITE_URL}/og/${project.id}.png`, width: 1200, height: 630, alt: `${project.title} — case study` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} · Gautam M A`,
      description: project.caseStudy.proof,
      images: [`${SITE_URL}/og/${project.id}.png`],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.id === params.slug);
  if (!project) notFound();
  return (
    <>
      <WorkPage project={project} />
      <JsonLd data={projectJsonLd(project)} />
    </>
  );
}
