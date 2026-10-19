import { education, experience, profile, projects, skillCategories, type Project } from '@/lib/content/portfolio';

export const SITE_URL = 'https://gautamanguraj.github.io/gautam-m-a-portfolio';
export const SITE_NAME = 'Gautam M A';

const personId = `${SITE_URL}/#person`;

/** Person + WebSite graph for the home page. Public facts only — no email, no internal data. */
export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: profile.fullName,
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/assets/portrait-hero.jpg`,
        jobTitle: 'Software Engineer (Frontend)',
        description: profile.intro,
        worksFor: { '@type': 'Organization', name: experience[0].company },
        address: { '@type': 'PostalAddress', addressLocality: 'Coimbatore', addressCountry: 'IN' },
        alumniOf: education.map((e) => ({ '@type': 'EducationalOrganization', name: e.school })),
        knowsAbout: skillCategories
          .flatMap((c) => c.skills)
          .filter((s) => s.level === 'Primary' || s.level === 'Strong')
          .map((s) => s.name),
        sameAs: [profile.links.linkedin, profile.links.github],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: `${SITE_NAME} — Software Engineer`,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
    ],
  };
}

/** Breadcrumb + CreativeWork for one case study page. */
export function projectJsonLd(project: Project) {
  const url = `${SITE_URL}/work/${project.id}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Portfolio', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/#originals` },
          { '@type': 'ListItem', position: 3, name: project.title, item: url },
        ],
      },
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: project.title,
        headline: project.title,
        description: project.logline,
        abstract: project.caseStudy.proof,
        url,
        genre: project.genre,
        keywords: project.stack.join(', '),
        creator: { '@id': personId },
        inLanguage: 'en',
      },
    ],
  };
}

export const allProjectSlugs = () => projects.map((p) => p.id);
