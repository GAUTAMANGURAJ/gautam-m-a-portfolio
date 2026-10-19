/**
 * Central portfolio data — Gautam M A.
 * Every fact on the site should come from this file.
 * Client product names stay anonymized (privacy-safe).
 */

export type Palette = { from: string; via: string; to: string; accent: string };

/** Injected from `next.config.js` `env.NEXT_PUBLIC_BASE_PATH` (GitHub Pages project URL). */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/gautam-m-a-portfolio';

export const profile = {
  fullName: 'Gautam M A',
  displayName: 'Gautam M A',
  firstName: 'GAUTAM',
  studioTag: 'FRONTEND SYSTEMS',
  /** Label used in opening / studio moments. */
  originalLabel: 'BLUEPRINT → REALITY',
  role: 'Software Engineer · Frontend',
  tagline: ['Software Engineer · Frontend', 'Enterprise systems', 'React · TypeScript'],
  intro:
    'Software Engineer · Frontend at Pirai Infotech — sole frontend owner for a robotics scanning platform (backoffice + client), enterprise ESG modules with measurable quality outcomes, and reusable frontend standards that raise team delivery.',
  location: 'Coimbatore / Pollachi, India',
  email: 'gautamanguraj16@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/gautam-ma/',
    github: 'https://github.com/GAUTAMANGURAJ',
    /** Optional scheduling link (Cal.com, Calendly…). Set NEXT_PUBLIC_BOOKING_URL; the channel is hidden when empty. */
    booking: process.env.NEXT_PUBLIC_BOOKING_URL || '',
  },
  resumePdf: `${BASE_PATH}/assets/resume/Gautam_MA_Resume.pdf`,
  portrait: {
    src: `${BASE_PATH}/assets/portrait-hero.jpg`,
    srcSet: [
      `${BASE_PATH}/assets/portrait-hero-480.jpg 480w`,
      `${BASE_PATH}/assets/portrait-hero-640.jpg 640w`,
      `${BASE_PATH}/assets/portrait-hero.jpg 819w`,
    ].join(', '),
    sizes: '(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 54vw',
    width: 819,
    height: 905,
    alt: 'Portrait of Gautam M A, software engineer',
  },
  interests: [
    'Frontend architecture',
    'Auth · RBAC · sessions',
    'Reusable design systems',
    'Full-stack growth',
  ],
};

export const education = [
  {
    school: 'Institute of Road and Transport Technology',
    place: 'Erode',
    degree: 'B.E. Computer Science and Engineering',
    period: '2022 – 2025',
    score: undefined as string | undefined,
  },
  {
    school: 'Nachimuthu Polytechnic College',
    place: 'Pollachi',
    degree: 'Diploma in Automobile Engineering',
    period: '2019 – 2022',
    score: undefined as string | undefined,
  },
];

export const experience = [
  {
    company: 'Pirai Infotech Private Limited',
    role: 'Software Engineer · Frontend',
    place: 'Pollachi, India',
    period: 'April 2025 – Present',
    points: [
      'Sole frontend owner of a robotics scanning platform — an internal backoffice and a client portal — delivered to plan and stable in production.',
      'Designed the access and session layer: permission-gated navigation and actions, token-protected routes, silent session renewal with an idle warning, cross-tab identity safety, and light/dark/system theming across both apps.',
      'Owned core modules of an enterprise ESG platform — authentication, indicator repository, materiality assessment, report configuration and templates — and led high-severity defect resolution and a client change-request phase through UAT, walkthrough and documentation.',
      'Independently shipped a contract-management module (create, review, multi-level approval, role-based access) and a Next.js financial-accounts website.',
      'Delivered admin and storefront flows for an apparel-commerce product under compressed timelines, and standardized an inherited codebase (structure, state, forms, routing).',
      'Majority contributor to an internal frontend standards library and a requirements-to-implementation workflow that raise delivery consistency across the team.',
      'Reviews teammates’ pull requests, writes module documentation, and helps newer developers ramp onto current frontend practices.',
      'Recognized as Budding Star of the Year 2025–2026 for ownership, quality, and delivery impact.',
    ],
  },
];

/** How I work — short principles for About + resume. */
export const workingPrinciples: { title: string; detail: string }[] = [
  {
    title: 'Own the surface area',
    detail:
      'Prefer end-to-end frontend ownership — routes, permissions, API contracts, edge cases, and post-launch support — over fragmented ticket work.',
  },
  {
    title: 'Ship with proof',
    detail:
      'Optimize for release discipline: reviewed delivery, defect backlogs driven down, stable go-lives, and reusable patterns the next feature can inherit.',
  },
  {
    title: 'Standards before shortcuts',
    detail:
      'Invest in shared form, state and routing primitives and in theme/access patterns, so teams move faster without reinventing the same bugs.',
  },
  {
    title: 'Privacy by default',
    detail:
      'Client product UI and internal delivery data stay private. Case studies stay at problem → role → outcome, with architecture-level overviews only.',
  },
];

export type Metric = { value: string; label: string };

/** Privacy-safe case study — no product screenshots, client UI, or internal delivery figures. */
export type CaseStudy = {
  problem: string;
  role: string;
  outcome: string;
  /** One-line qualitative proof for cards / resume. No internal counts. */
  proof: string;
};

export type ProjectId =
  | 'robotics-scanning'
  | 'esg-platform'
  | 'frontend-standards'
  | 'apparel-commerce'
  | 'contract-management'
  | 'financial-accounts'
  | 'portfolio';

/** A module-level overview inside a larger case study. Architecture-level only. */
export type DeepDive = { title: string; summary: string; points: string[]; scope?: 'Owned' | 'Contributed' };

/** Abstract, privacy-safe architecture: layers left→right, nodes inside a layer, edges between nodes. */
export type ArchNode = { id: string; label: string; layer: number; detail: string };
export type Architecture = { layers: string[]; nodes: ArchNode[]; edges: [string, string][] };

export type Project = {
  id: ProjectId;
  title: string;
  year: string;
  genre: string;
  /** How I was involved — shown as a badge. */
  ownership: string;
  logline: string;
  /** Recruiter-facing narrative (problem → role → outcome). */
  caseStudy: CaseStudy;
  /** Abstract system stages for blueprint diagram (never real product UI). */
  systemFlow: string[];
  /** Derived from `skillCategories[].skills[].uses` — never hand-edited. */
  stack: string[];
  build: string[];
  features: string[];
  deepDives?: DeepDive[];
  architecture?: Architecture;
  metrics: Metric[];
  github?: string;
  live?: string;
  /** Shown when work is client/enterprise and has no public demo. */
  accessNote?: string;
  palette: Palette;
  motif: 'orbit' | 'matrix' | 'stamp' | 'static' | 'pipeline' | 'blueprint';
};

const signal: Palette = { from: '#042f2e', via: '#0f766e', to: '#060910', accent: '#2dd4bf' };
const amber: Palette = { from: '#1c1208', via: '#9a6b2f', to: '#0a0806', accent: '#d4a574' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#38bdf8' };
const violet: Palette = { from: '#0f172a', via: '#334155', to: '#060910', accent: '#94a3b8' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#34d399' };

const PRIVATE_NOTE = 'Enterprise · private systems · no product screenshots · walkthrough on request';

type ProjectDraft = Omit<Project, 'stack'>;

const projectDrafts: ProjectDraft[] = [
  {
    id: 'robotics-scanning',
    title: 'Robotics Scanning Platform',
    year: '2026',
    genre: 'SaaS · Robotics scanning · Backoffice & Client Portal',
    ownership: 'Sole frontend owner',
    logline:
      'Sole frontend ownership of a two-application robotics scanning platform — a client portal that runs fleets and inspections, and an internal backoffice that runs the business around it.',
    caseStudy: {
      problem:
        'Operations needed two aligned surfaces — client-facing fleet and inspection control, and internal tenant, release and approval tooling — without duplicating UI logic or weakening access control.',
      role:
        'Sole frontend owner across both apps: the access and session layer, guided fleet and inspection workflows, shared component and API modules, theming, and the documentation that let others take over.',
      outcome:
        'Both applications shipped to plan with senior-reviewed code and a stable production release.',
      proof: 'Two connected apps · sole frontend owner · stable launch',
    },
    systemFlow: ['Auth & RBAC', 'Session lifecycle', 'Fleet & scan workflows', 'Platform operations', 'Shared UI/API'],
    build: [
      'Sole frontend developer for the client portal and the internal backoffice — no parallel frontend resource.',
      'Built a permission-aware shell where menus, tabs, actions and even list scope follow the signed-in user’s role.',
      'Implemented secure sign-in (password and one-time code), silent session renewal, an idle-expiry warning and cross-tab identity protection.',
      'Delivered guided multi-step workflows for fleet commissioning and inspection scheduling, with drafts, resumable steps and URL-driven state.',
      'Created a shared component layer, charting and calendar views, and a server-synced light/dark/system theme.',
      'Wrote module-level technical documentation for both applications.',
    ],
    features: [
      'Permission-gated menus, tabs and actions',
      'Password + one-time-code sign-in, silent renewal',
      'Guided fleet commissioning with approval lifecycle',
      'Recurring inspection schedules on a calendar',
      'Live job monitoring, reports and exports',
      'Light / dark / system theme, server-synced',
    ],
    deepDives: [
      {
        title: 'Access & session layer',
        scope: 'Owned',
        summary: 'Security that users never notice — until it matters.',
        points: [
          'Permissions hydrate before first paint, so navigation never flashes the wrong state.',
          'Route, module and action-level gates; list scope narrows for assigned-only roles.',
          'Silent token renewal while active; an idle warning before expiry; forced sign-out handled in one place.',
          'A different user signed in on another tab is detected and the stale tab is closed out.',
        ],
      },
      {
        title: 'Fleet commissioning',
        scope: 'Owned',
        summary: 'Guided setup for physical equipment, with an approval lifecycle.',
        points: [
          'Three-step setup — unit, robot arm and sensor, home pose — each step saved independently as a draft.',
          'Joint-space or cartesian pose definition, validated against limits that depend on the selected arm.',
          'Edit guards that keep configuration consistent; decommission requires a recorded reason.',
          'Operational view with health, telemetry and maintenance schedule.',
        ],
      },
      {
        title: 'Inspection scheduling & live monitoring',
        scope: 'Owned',
        summary: 'From a part and a plan to a monitored run and a report.',
        points: [
          'Three-step job wizard: part details with file upload, execution parameters, review and confirm.',
          'Recurring schedules with scoped edits — one occurrence, this and future, or the whole series.',
          'Calendar in the organisation’s own time zone; day, week and month views.',
          'Live loop and alert monitoring, then a job record with report and archive downloads.',
        ],
      },
      {
        title: 'Platform operations (backoffice)',
        scope: 'Owned',
        summary: 'The internal tools that run clients, plans and releases.',
        points: [
          'Client onboarding by invite or manual entry, tied to licence plans.',
          'Client drill-down with the ability to restrict a fleet, and an approval queue for new fleets.',
          'Release management for edge software — repositories, tags, approval and deployment.',
          'Alert rules, announcements with scheduling, and a support inbox.',
        ],
      },
      {
        title: 'Design system & theming',
        scope: 'Owned',
        summary: 'One consistent, theme-safe interface across two apps.',
        points: [
          'A tokenised palette with light, dark and system modes; the preference syncs to the server and rolls back on failure.',
          'A thin component layer over a component library, so screens stay uniform.',
          'Charts and calendar views follow the active theme.',
          'An i18n-ready shell with every string externalised.',
        ],
      },
    ],
    architecture: {
      layers: ['Experience', 'Application shell', 'Workflows', 'Data layer'],
      nodes: [
        { id: 'client', label: 'Client portal', layer: 0, detail: 'Where customers run fleets, schedule inspections and review results.' },
        { id: 'backoffice', label: 'Backoffice', layer: 0, detail: 'Where the business runs clients, plans, approvals and software releases.' },
        { id: 'access', label: 'Access & permissions', layer: 1, detail: 'Route, module and action gates; list scope narrows for assigned-only roles; permissions hydrate before first paint.' },
        { id: 'session', label: 'Session lifecycle', layer: 1, detail: 'Silent renewal while active, an idle warning before expiry, and a guard against a different user on another tab.' },
        { id: 'theme', label: 'Theme & i18n', layer: 1, detail: 'Light, dark and system themes synced to the server with rollback; every string externalised.' },
        { id: 'ui', label: 'Shared component layer', layer: 1, detail: 'A thin wrapper over a component library so every screen stays uniform across both apps.' },
        { id: 'fleet', label: 'Fleet commissioning', layer: 2, detail: 'Guided three-step setup with drafts, an approval lifecycle and edit guards.' },
        { id: 'inspect', label: 'Inspection scheduling', layer: 2, detail: 'Three-step job wizard, recurring schedules with scoped edits, calendar in the organisation’s time zone.' },
        { id: 'monitor', label: 'Live monitoring & reports', layer: 2, detail: 'Loop and alert monitoring, then a job record with report and archive downloads.' },
        { id: 'ops', label: 'Platform operations', layer: 2, detail: 'Client onboarding, licence plans, fleet approvals and restrictions, release management, announcements.' },
        { id: 'cache', label: 'Server-state cache', layer: 3, detail: 'Targeted invalidation, polling where it matters, and a persisted permission snapshot.' },
        { id: 'api', label: 'API client', layer: 3, detail: 'One client that adds identity, handles uploads and downloads, and runs forced sign-out in one place.' },
        { id: 'backend', label: 'Backend services', layer: 3, detail: 'Private — intentionally not part of this case study.' },
      ],
      edges: [
        ['client', 'access'], ['client', 'session'], ['client', 'theme'], ['client', 'ui'],
        ['backoffice', 'access'], ['backoffice', 'session'], ['backoffice', 'theme'], ['backoffice', 'ui'],
        ['access', 'fleet'], ['access', 'inspect'], ['access', 'monitor'], ['access', 'ops'],
        ['ui', 'fleet'], ['ui', 'inspect'], ['ui', 'ops'], ['theme', 'monitor'],
        ['fleet', 'cache'], ['inspect', 'cache'], ['monitor', 'cache'], ['ops', 'cache'],
        ['session', 'api'], ['ops', 'api'], ['inspect', 'api'],
      ],
    },
    metrics: [
      { value: '2', label: 'connected applications' },
      { value: 'Sole', label: 'frontend owner' },
      { value: 'RBAC', label: 'permission-aware at every layer' },
      { value: 'L/D/S', label: 'server-synced theme modes' },
    ],
    accessNote: PRIVATE_NOTE,
    palette: signal,
    motif: 'orbit',
  },
  {
    id: 'esg-platform',
    title: 'ESG Intelligence Platform',
    year: '2025 – 2026',
    genre: 'Enterprise SaaS · ESG configuration, assessment & reporting',
    ownership: 'Module owner · frontend',
    logline:
      'Frontend ownership across core modules of an enterprise ESG platform — a governed indicator hierarchy, a materiality assessment engine, and report configuration — plus a client change-request phase delivered through UAT.',
    caseStudy: {
      problem:
        'ESG configuration and reporting needs strict structure — a hierarchy of indicators, several ways to assess what matters, and reports built from reusable templates — and it must stay consistent as requirements change.',
      role:
        'Frontend owner for core modules: sign-in and session flows, the indicator repository, the materiality assessment engine, report configuration and templates. Led high-severity defect resolution and the change-request phase through UAT, walkthrough and user documentation.',
      outcome:
        'A stable, extensible enterprise surface: structured workflows that resume where users left off, and a quality bar that held through release and client acceptance.',
      proof: 'Indicator, assessment & reporting engines · change-request phase delivered',
    },
    systemFlow: ['Auth & sessions', 'Indicator hierarchy', 'Materiality engine', 'Report config', 'Templates'],
    build: [
      'Owned the frontend of sign-in with one-time codes and token refresh, the indicator repository, materiality assessment, report configuration and template workflows.',
      'Built a chatbot surface and a subscription surface from requirements when full design references were not available.',
      'Ran a formal state-management evaluation comparing a client store with a server-state cache, and recommended the server-state approach.',
      'Led resolution of the high-severity defect backlog and set up the unit-testing infrastructure.',
      'Delivered a change-request phase end to end: implementation, UAT support, a client walkthrough and a user guide — ahead of the agreed date.',
    ],
    features: [
      'One-time-code sign-in and token refresh',
      'Six-level ESG indicator hierarchy',
      'Three-strategy materiality assessment',
      'Template-driven report configuration',
      'Resumable, URL-driven workflows',
      'UAT support · walkthrough · documentation',
    ],
    deepDives: [
      {
        title: 'Indicator Repository',
        scope: 'Owned',
        summary: 'A governed hierarchy from pillars down to data points and dimensions.',
        points: [
          'Pillar → topic → disclosure → metric → data point → dimensions; every level requires a valid parent.',
          'Active/inactive lifecycle — inactive items stay visible for governance but cannot be extended.',
          'Clone, bulk import with a template and history, and a tree view for navigating context.',
          'Every screen deep-links; list filters and return paths survive navigation.',
        ],
      },
      {
        title: 'Materiality Assessment Engine',
        scope: 'Owned',
        summary: 'Three assessment strategies running on one URL-driven stepper.',
        points: [
          'Manual ranking on two axes, or survey-based with weighting per stakeholder or per stakeholder type.',
          'Drag-and-drop ranking, then a priority heatmap and ranked results.',
          'Stakeholders respond through a secure, link-based survey with no account needed.',
          'Ranked topics lock; editing rules change as an assessment moves from draft to completed.',
        ],
      },
      {
        title: 'Report configuration & templates',
        scope: 'Owned',
        summary: 'Reports assembled from reusable templates instead of one-off builds.',
        points: [
          'Templates managed centrally and propagated to each organisation’s workspace.',
          'Report structure built from the chosen template, with data-entry against datapoint placeholders.',
          'Generation flow from the configured structure; client-facing user guide delivered.',
        ],
      },
      {
        title: 'Onboarding & subscription workflows',
        scope: 'Contributed',
        summary: 'Guided onboarding from organisation to plan to review.',
        points: [
          'Four-step flow — organisation, plan, payment, review — controlled by the URL.',
          'Secure invite and session-token verification before sensitive steps.',
          'Plan pricing computed live; country-aware address validation.',
        ],
      },
    ],
    architecture: {
      layers: ['Entry', 'Workflow engine', 'Domain modules', 'Data layer'],
      nodes: [
        { id: 'workspace', label: 'Organisation workspace', layer: 0, detail: 'Where teams configure indicators, run assessments and build reports.' },
        { id: 'survey', label: 'Stakeholder survey link', layer: 0, detail: 'A secure, link-based survey so stakeholders can respond without an account.' },
        { id: 'stepper', label: 'URL-driven stepper', layer: 1, detail: 'Every step and context lives in the URL — resumable, deep-linkable, and safe on reload.' },
        { id: 'rules', label: 'Access & status rules', layer: 1, detail: 'Permission-aware actions; editing rules change as work moves from draft to completed.' },
        { id: 'hierarchy', label: 'Indicator hierarchy', layer: 2, detail: 'Pillar → topic → disclosure → metric → data point → dimensions, with lifecycle and bulk import.' },
        { id: 'materiality', label: 'Materiality engine', layer: 2, detail: 'Three assessment strategies, drag-and-drop ranking, heatmap and ranked results.' },
        { id: 'reporting', label: 'Report configuration', layer: 2, detail: 'Reports assembled from reusable templates, with data entry against datapoint placeholders.' },
        { id: 'onboarding', label: 'Onboarding & subscription', layer: 2, detail: 'Guided organisation → plan → payment → review flow (contributed).' },
        { id: 'cache', label: 'Server-state cache', layer: 3, detail: 'Chosen after a state-management evaluation; mutations invalidate exactly what they touch.' },
        { id: 'api', label: 'Module API layer', layer: 3, detail: 'Hooks per module with consistent loading, success and error handling.' },
      ],
      edges: [
        ['workspace', 'stepper'], ['workspace', 'rules'], ['survey', 'materiality'],
        ['stepper', 'hierarchy'], ['stepper', 'materiality'], ['stepper', 'reporting'], ['stepper', 'onboarding'],
        ['rules', 'hierarchy'], ['rules', 'materiality'],
        ['hierarchy', 'cache'], ['materiality', 'cache'], ['reporting', 'cache'], ['onboarding', 'cache'],
        ['hierarchy', 'api'], ['materiality', 'api'], ['reporting', 'api'],
      ],
    },
    metrics: [
      { value: '6', label: 'levels in the indicator hierarchy' },
      { value: '3', label: 'materiality assessment strategies' },
      { value: 'CR', label: 'change-request phase delivered' },
      { value: 'UAT', label: 'walkthrough & user guide' },
    ],
    accessNote: PRIVATE_NOTE,
    palette: ocean,
    motif: 'matrix',
  },
  {
    id: 'frontend-standards',
    title: 'Frontend Standards Library',
    year: '2026',
    genre: 'Internal platform · Engineering standards',
    ownership: 'Majority contributor',
    logline:
      'A reusable frontend standards library and a requirements-to-implementation workflow — built to raise delivery consistency across the team.',
    caseStudy: {
      problem:
        'Teams reinvented components, state, forms and routing on every feature — slowing reviews and creating uneven quality.',
      role:
        'Majority contributor: authored the reusable library and helped shape a high-level path from requirements to consistent implementation, while shipping product work in parallel.',
      outcome:
        'The library was applied to a live product’s standardization work — fewer one-off patterns and a clearer baseline for the team.',
      proof: 'Reusable frontend kit · delivery workflow · applied on live work',
    },
    systemFlow: ['Requirements intake', 'Architecture baseline', 'Reusable primitives', 'Validation patterns', 'Team adoption'],
    build: [
      'Built a reusable frontend standards library covering components, state, forms, routing and UI primitives.',
      'Contributed a requirements-to-implementation workflow so delivery follows one consistent path — shown here as an overview only.',
      'Applied the standards while standardizing an inherited commerce codebase, to prove real-world adoption.',
      'Led the initiative while delivering product work alongside it.',
    ],
    features: [
      'Reusable component and pattern library',
      'Shared state, forms and routing modules',
      'Requirements-to-implementation workflow',
      'Applied on live product standardization',
      'A clearer baseline for new developers',
    ],
    architecture: {
      layers: ['Input', 'Standards kit', 'Adoption'],
      nodes: [
        { id: 'req', label: 'Requirements', layer: 0, detail: 'The starting point of any feature, whatever the product.' },
        { id: 'baseline', label: 'Architecture baseline', layer: 1, detail: 'The agreed structure every feature starts from.' },
        { id: 'components', label: 'Components & primitives', layer: 1, detail: 'Reusable UI building blocks with consistent behaviour.' },
        { id: 'state', label: 'State & forms', layer: 1, detail: 'Shared patterns for server state, form handling and validation.' },
        { id: 'routing', label: 'Routing & structure', layer: 1, detail: 'A consistent approach to routes, navigation and folder layout.' },
        { id: 'workflow', label: 'Delivery workflow', layer: 2, detail: 'A high-level path from requirements to consistent implementation.' },
        { id: 'live', label: 'Live product adoption', layer: 2, detail: 'Applied while standardizing a real commerce codebase.' },
      ],
      edges: [
        ['req', 'baseline'], ['baseline', 'components'], ['baseline', 'state'], ['baseline', 'routing'],
        ['components', 'workflow'], ['state', 'workflow'], ['routing', 'workflow'],
        ['components', 'live'], ['state', 'live'], ['routing', 'live'],
      ],
    },
    metrics: [
      { value: 'Kit', label: 'components · state · forms · routing' },
      { value: 'Flow', label: 'requirements → implementation' },
      { value: 'Live', label: 'applied on product work' },
    ],
    accessNote: 'Internal tooling · private · abstract overview only · details on request',
    palette: violet,
    motif: 'pipeline',
  },
  {
    id: 'apparel-commerce',
    title: 'Apparel Commerce Platform',
    year: '2026',
    genre: 'E-commerce · Admin + storefront',
    ownership: 'Frontend owner · admin & storefront',
    logline:
      'Admin operations and a customer purchase journey, delivered under compressed timelines while an inherited frontend codebase was brought up to standard.',
    caseStudy: {
      problem:
        'An apparel commerce stack needed dependable admin operations and a storefront journey, while the inherited frontend needed structure, validation and shared patterns.',
      role:
        'Owned product and order management admin and the storefront purchase flows; led standardization of structure, components, state, forms and routing.',
      outcome:
        'A clean internal demo, fewer repeat bugs, and a faster ramp-up for the developers who inherit the code.',
      proof: 'Admin + storefront · compressed delivery · codebase standardized',
    },
    systemFlow: ['Admin catalogue & orders', 'Storefront journey', 'Auth & session', 'Validation layer', 'Standards refactor'],
    build: [
      'Delivered product and order management, including manual-order and validation-heavy paths.',
      'Built the customer journey from catalogue to product page, cart, checkout, sign-in and wishlist.',
      'Standardized structure, reusable components, state and data handling, form validation and routing on an inherited codebase.',
      'Supported demo readiness and continued enhancement and bug-fix ownership afterwards.',
    ],
    features: [
      'Product and order administration',
      'Storefront purchase journey',
      'Sign-in and session continuity',
      'Form-validation standardization',
      'Reusable component adoption',
    ],
    architecture: {
      layers: ['Surfaces', 'Shared layers', 'Integration'],
      nodes: [
        { id: 'admin', label: 'Admin operations', layer: 0, detail: 'Product and order management, including manual-order and validation-heavy paths.' },
        { id: 'store', label: 'Storefront journey', layer: 0, detail: 'Catalogue to product page, cart, checkout, sign-in and wishlist.' },
        { id: 'auth', label: 'Auth & session', layer: 1, detail: 'Sign-in and session continuity across the storefront.' },
        { id: 'validation', label: 'Validation layer', layer: 1, detail: 'One standardized approach to form validation and handling.' },
        { id: 'standards', label: 'Reusable components', layer: 1, detail: 'Adopted from the standards library during refactoring.' },
        { id: 'api', label: 'API integration', layer: 2, detail: 'Consistent data handling and state across both surfaces.' },
      ],
      edges: [
        ['admin', 'validation'], ['admin', 'standards'], ['store', 'auth'], ['store', 'validation'], ['store', 'standards'],
        ['auth', 'api'], ['validation', 'api'], ['standards', 'api'],
      ],
    },
    metrics: [
      { value: '2', label: 'surfaces — admin and storefront' },
      { value: 'Demo', label: 'delivered cleanly' },
      { value: 'Std', label: 'inherited codebase refactored' },
    ],
    accessNote: 'Client engagement · private systems · no product screenshots · walkthrough on request',
    palette: amber,
    motif: 'stamp',
  },
  {
    id: 'contract-management',
    title: 'Contract Management System',
    year: '2025',
    genre: 'Enterprise · First production module',
    ownership: 'Independent delivery',
    logline:
      'My first end-to-end enterprise module — organisational contracts from creation through review and multi-level approval, with role-based access.',
    caseStudy: {
      problem:
        'The business needed a production-ready contract module: create, review, multi-level approval, and access that follows each person’s role.',
      role: 'Independent frontend delivery — UI, API integration, CRUD, approval workflows and role-based access.',
      outcome:
        'The first enterprise module I shipped end to end, and the CRUD-plus-approval template that later modules reused.',
      proof: 'First independent enterprise module · CRUD, approvals and RBAC',
    },
    systemFlow: ['Create', 'Review', 'Multi-level approval', 'RBAC', 'Records'],
    build: [
      'First end-to-end frontend delivery in an enterprise setting at Pirai Infotech.',
      'Covered UI development, API integration, CRUD, approval workflows and role-based access control.',
      'Established patterns — forms, permissions, review states — that later modules reused.',
    ],
    features: [
      'Contract create and review flows',
      'Multi-level approval workflow',
      'Role-based access control',
      'A reusable CRUD template',
    ],
    architecture: {
      layers: ['Actions', 'Rules', 'Records'],
      nodes: [
        { id: 'create', label: 'Create contract', layer: 0, detail: 'Guided creation with validation.' },
        { id: 'review', label: 'Review', layer: 0, detail: 'Reviewers inspect and comment before approval.' },
        { id: 'approval', label: 'Multi-level approval', layer: 1, detail: 'Contracts move through several approval levels in order.' },
        { id: 'rbac', label: 'Role-based access', layer: 1, detail: 'What each person can see and do follows their role.' },
        { id: 'records', label: 'Contract records', layer: 2, detail: 'Searchable CRUD records — the template later modules reused.' },
      ],
      edges: [['create', 'approval'], ['review', 'approval'], ['create', 'rbac'], ['review', 'rbac'], ['approval', 'records'], ['rbac', 'records']],
    },
    metrics: [
      { value: '1st', label: 'independent enterprise module' },
      { value: 'RBAC', label: 'permission-aware flows' },
      { value: 'CRUD', label: 'template reused later' },
    ],
    accessNote: PRIVATE_NOTE,
    palette: amber,
    motif: 'stamp',
  },
  {
    id: 'financial-accounts',
    title: 'Financial Accounts Website',
    year: '2025',
    genre: 'Website · Next.js · Financial accounts',
    ownership: 'Independent delivery',
    logline:
      'A responsive Next.js website for a financial-accounts product — self-taught on the job, built from reusable components and delivered on timeline.',
    caseStudy: {
      problem: 'A financial-accounts product needed a clean, responsive web presence delivered on a firm timeline.',
      role: 'Independent Next.js implementation with reusable components and consistent layout patterns.',
      outcome:
        'Shipped on time with written stakeholder appreciation — proof that I can learn a new framework and deliver under real constraints.',
      proof: 'Next.js learned and shipped · on timeline · stakeholder-appreciated',
    },
    systemFlow: ['Content model', 'Reusable UI', 'Responsive pages', 'Static export', 'Handoff'],
    build: [
      'Independently delivered a complete website for the product’s financial-accounts messaging.',
      'Taught myself Next.js for the job and applied clean structure, responsive behaviour and reusable components.',
    ],
    features: [
      'Responsive pages',
      'Reusable component structure',
      'Delivered on timeline',
      'Stakeholder appreciation',
    ],
    architecture: {
      layers: ['Content', 'Build', 'Delivery'],
      nodes: [
        { id: 'content', label: 'Content model', layer: 0, detail: 'Product messaging organised before any page was built.' },
        { id: 'ui', label: 'Reusable UI', layer: 1, detail: 'A small set of consistent components.' },
        { id: 'pages', label: 'Responsive pages', layer: 1, detail: 'Layouts that adapt cleanly from phone to desktop.' },
        { id: 'export', label: 'Static export', layer: 2, detail: 'Fast, simple hosting.' },
        { id: 'handoff', label: 'Handoff', layer: 2, detail: 'Delivered on timeline with stakeholder appreciation.' },
      ],
      edges: [['content', 'ui'], ['content', 'pages'], ['ui', 'export'], ['pages', 'export'], ['pages', 'handoff']],
    },
    metrics: [
      { value: 'Next.js', label: 'learned and shipped' },
      { value: 'On time', label: 'stakeholder delivery' },
      { value: 'Static', label: 'product website' },
    ],
    accessNote: 'Client engagement · public URL available on request · no confidential UI shown',
    palette: jade,
    motif: 'static',
  },
];

export type SkillLevel = 'Primary' | 'Strong' | 'Working' | 'Growing';
export type SkillUse = { project: ProjectId; how: string };
export type Skill = {
  name: string;
  mono: string;
  level?: SkillLevel;
  /** Where this skill was applied — single source of truth for project stacks and the skill map. */
  uses: SkillUse[];
  /** Fallback line for skills with no project yet. */
  evidence?: string;
};
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

const R = 'robotics-scanning' as const;
const E = 'esg-platform' as const;
const S = 'frontend-standards' as const;
const A = 'apparel-commerce' as const;
const C = 'contract-management' as const;
const F = 'financial-accounts' as const;
const P = 'portfolio' as const;

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    subtitle: 'Interfaces & the web platform',
    skills: [
      {
        name: 'React',
        mono: 'Re',
        level: 'Primary',
        uses: [
          { project: R, how: 'Both portals — permission-aware, workflow-heavy UI' },
          { project: E, how: 'Indicator, assessment and reporting modules' },
          { project: A, how: 'Admin and storefront' },
          { project: C, how: 'CRUD and approval interface' },
          { project: S, how: 'Reusable component primitives' },
        ],
      },
      {
        name: 'TypeScript',
        mono: 'Ts',
        level: 'Primary',
        uses: [
          { project: R, how: 'Typed routes, search params and API contracts' },
          { project: E, how: 'Typed hierarchy and workflow state' },
          { project: A, how: 'Typed forms and data layer' },
          { project: S, how: 'Typed shared patterns' },
        ],
      },
      {
        name: 'Next.js',
        mono: 'Nx',
        level: 'Strong',
        uses: [
          { project: F, how: 'Self-taught for the job — responsive static site' },
          { project: P, how: 'This portfolio — static export, App Router' },
        ],
      },
      {
        name: 'Tailwind CSS',
        mono: 'Tw',
        level: 'Strong',
        uses: [
          { project: R, how: 'Tokenised, theme-aware design system across both apps' },
          { project: P, how: 'Design tokens and responsive layout' },
        ],
      },
      {
        name: 'Component systems',
        mono: 'Cs',
        level: 'Strong',
        uses: [
          { project: R, how: 'A thin wrapper layer keeps every screen uniform' },
          { project: S, how: 'The reusable component and pattern library' },
          { project: F, how: 'Reusable component structure' },
          { project: A, how: 'Adopted during standardization' },
        ],
      },
      {
        name: 'Responsive & adaptive UI',
        mono: 'Rs',
        level: 'Strong',
        uses: [
          { project: R, how: 'Mobile navigation and bottom-sheet dialogs' },
          { project: F, how: 'Responsive pages' },
          { project: P, how: 'Mobile-first layouts and motion budgets' },
        ],
      },
    ],
  },
  {
    id: 'ui-state',
    title: 'UI, Data & Forms',
    subtitle: 'Client architecture in production apps',
    skills: [
      {
        name: 'TanStack Query',
        mono: 'Tq',
        level: 'Strong',
        uses: [
          { project: R, how: 'Server-state cache, polling, targeted invalidation, persisted permissions' },
          { project: E, how: 'Chosen after a state-management evaluation' },
        ],
      },
      {
        name: 'TanStack Router',
        mono: 'Tr',
        level: 'Strong',
        uses: [
          { project: R, how: 'File-based routes with typed, URL-held state' },
          { project: E, how: 'URL-driven steppers and deep-linkable hierarchy' },
        ],
      },
      {
        name: 'React Hook Form',
        mono: 'Rh',
        level: 'Strong',
        uses: [
          { project: R, how: 'Multi-step wizards with per-step validation' },
          { project: E, how: 'Hierarchy, setup and onboarding forms' },
          { project: A, how: 'Validation-heavy admin forms' },
          { project: C, how: 'Multi-step contract forms' },
        ],
      },
      {
        name: 'Zod',
        mono: 'Zd',
        level: 'Strong',
        uses: [
          { project: R, how: 'Schemas for every form and limit' },
          { project: E, how: 'Form and workflow validation' },
          { project: A, how: 'Standardized validation layer' },
        ],
      },
      {
        name: 'Axios',
        mono: 'Ax',
        level: 'Strong',
        uses: [
          { project: R, how: 'One client with interceptors for identity and forced sign-out' },
          { project: E, how: 'Module API layer' },
        ],
      },
      {
        name: 'PrimeReact',
        mono: 'Pr',
        level: 'Working',
        uses: [{ project: R, how: 'Tables, dialogs and inputs behind a custom wrapper layer' }],
      },
      {
        name: 'Recharts',
        mono: 'Rc',
        level: 'Working',
        uses: [{ project: R, how: 'Theme-aware operational and analytics charts' }],
      },
      {
        name: 'FullCalendar',
        mono: 'Fc',
        level: 'Working',
        uses: [{ project: R, how: 'Scheduling calendar with recurring-event expansion' }],
      },
      {
        name: 'Framer Motion',
        mono: 'Fm',
        level: 'Strong',
        uses: [{ project: P, how: 'Scroll-linked and cinematic motion system' }],
      },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture & Access',
    subtitle: 'Enterprise delivery patterns',
    skills: [
      {
        name: 'REST API integration',
        mono: 'Ap',
        level: 'Strong',
        uses: [
          { project: R, how: 'Multipart uploads, blob downloads, optimistic updates' },
          { project: E, how: 'Module hooks with consistent loading and error handling' },
          { project: C, how: 'API integration and CRUD' },
          { project: A, how: 'Admin and storefront integration' },
        ],
      },
      {
        name: 'RBAC',
        mono: 'Rb',
        level: 'Strong',
        uses: [
          { project: R, how: 'Menus, tabs, actions and list scope follow permissions' },
          { project: E, how: 'Permission-aware create, clone and status actions' },
          { project: C, how: 'Role-based access to contract actions' },
        ],
      },
      {
        name: 'Auth & sessions',
        mono: 'Au',
        level: 'Strong',
        uses: [
          { project: R, how: 'One-time-code sign-in, silent renewal, idle warning, cross-tab guard' },
          { project: E, how: 'One-time-code sign-in and token refresh' },
          { project: A, how: 'Storefront sign-in and session continuity' },
        ],
      },
      {
        name: 'Workflow engines',
        mono: 'Wf',
        level: 'Strong',
        uses: [
          { project: E, how: 'Materiality stepper running three assessment strategies' },
          { project: R, how: 'Resumable fleet and inspection wizards' },
          { project: C, how: 'Multi-level approval workflow' },
        ],
      },
      {
        name: 'i18n',
        mono: 'I18',
        level: 'Working',
        uses: [{ project: R, how: 'Externalised strings across both apps, ready for more languages' }],
      },
      {
        name: 'Theme systems',
        mono: 'Th',
        level: 'Strong',
        uses: [
          { project: R, how: 'Light, dark and system modes with server sync and rollback' },
          { project: P, how: 'Accent themes and design tokens' },
        ],
      },
    ],
  },
  {
    id: 'quality',
    title: 'Quality & Delivery',
    subtitle: 'Ship clean, stay consistent',
    skills: [
      {
        name: 'Vitest / RTL',
        mono: 'Vt',
        level: 'Growing',
        uses: [{ project: E, how: 'Set up the unit-testing infrastructure' }],
      },
      {
        name: 'Code quality standards',
        mono: 'Cq',
        level: 'Strong',
        uses: [
          { project: S, how: 'Lint, structure and review standards' },
          { project: A, how: 'Applied during standardization' },
        ],
      },
      {
        name: 'Vite',
        mono: 'Vi',
        level: 'Working',
        uses: [{ project: R, how: 'Build tooling for both portals' }],
      },
      {
        name: 'Code review & documentation',
        mono: 'Cd',
        level: 'Strong',
        uses: [
          { project: R, how: 'Module-level technical documentation for both apps' },
          { project: E, how: 'Client user guide and handover documentation' },
          { project: S, how: 'Review standards shared with the team' },
        ],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend (Growing)',
    subtitle: 'Full-stack direction',
    skills: [
      { name: 'Python', mono: 'Py', level: 'Growing', uses: [], evidence: 'Certified (Cisco Python Essentials 1) · hands-on practice' },
      { name: 'FastAPI', mono: 'Fa', level: 'Growing', uses: [], evidence: 'Current full-stack direction' },
      { name: 'PostgreSQL', mono: 'Pg', level: 'Growing', uses: [], evidence: 'Hands-on practice' },
      { name: 'SQLAlchemy', mono: 'Sq', level: 'Growing', uses: [], evidence: 'Hands-on practice' },
      { name: 'Pydantic', mono: 'Pd', level: 'Growing', uses: [], evidence: 'Hands-on practice' },
    ],
  },
];

/** Showcase projects, with stacks derived from the skill map so the two can never disagree. */
export const projects: Project[] = projectDrafts.map((d) => ({
  ...d,
  stack: skillCategories.flatMap((c) => c.skills.filter((s) => s.uses.some((u) => u.project === d.id)).map((s) => s.name)),
}));

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
};

export const achievements: Achievement[] = [
  {
    id: 'budding-star',
    title: 'Budding Star of the Year',
    org: 'Pirai Infotech',
    detail:
      'Leadership-selected recognition for frontend ownership, release discipline, and delivery impact across enterprise products in 2025–2026.',
    laurel: '2025 – 2026',
  },
  {
    id: 'robotics-launch',
    title: 'Platform Launch',
    org: 'Robotics Scanning Platform',
    detail: 'Sole frontend owner of a two-app platform — delivered to plan and stable in production.',
    laurel: 'Production',
  },
  {
    id: 'quality-arc',
    title: 'Quality Ownership',
    org: 'Enterprise ESG Platform',
    detail: 'Led resolution of the high-severity defect backlog while owning core modules through change requests, UAT and documentation.',
    laurel: 'Quality',
  },
  {
    id: 'standards-library',
    title: 'Team Multiplier',
    org: 'Frontend Standards Library',
    detail: 'Majority contributor to a reusable frontend library and delivery workflow, applied on live product work.',
    laurel: 'Standards',
  },
];

export type Certification = { issuer: string; name: string; link?: string; credentialId?: string };

export const certifications: Certification[] = [
  {
    issuer: 'Cisco Networking Academy',
    name: 'Python Essentials 1',
    credentialId: '003037dc-c2af-4726-9ae8-e4407dfb8326',
    link: 'https://www.credly.com/badges/003037dc-c2af-4726-9ae8-e4407dfb8326',
  },
];

export type Milestone = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Chapter = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  milestones: Milestone[];
};

export const chapters: Chapter[] = [
  {
    number: 1,
    title: 'Building the Foundation',
    period: '2019 – 2025',
    synopsis:
      'From diploma foundations in Pollachi to Computer Science at IRTT — discovering frontend development and practical software.',
    milestones: [
      {
        code: 'CH01 M01',
        title: 'The Diploma',
        description:
          'Diploma in Automobile Engineering at Nachimuthu Polytechnic College, Pollachi — discipline, systems thinking, and a path into tech.',
        tags: ['Diploma', 'Pollachi'],
        runtime: '2019 – 2022',
        palette: amber,
      },
      {
        code: 'CH01 M02',
        title: 'Enter CSE',
        description:
          'B.E. Computer Science and Engineering at IRTT, Erode — HTML, CSS, JavaScript, React, and modern web foundations.',
        tags: ['B.E. CSE', 'React', 'IRTT'],
        runtime: '2022 – 2025',
        palette: violet,
      },
      {
        code: 'CH01 M03',
        title: 'The Builder',
        description:
          'Turned fundamentals into practical web applications and prepared for production frontend engineering.',
        tags: ['Frontend', 'Web'],
        runtime: 'College years',
        palette: ocean,
      },
    ],
  },
  {
    number: 2,
    title: 'Independent Ownership',
    period: '2025 – 2026',
    synopsis:
      'Joined Pirai Infotech and grew from supervised delivery to owning core modules of an enterprise ESG platform.',
    milestones: [
      {
        code: 'CH02 M01',
        title: 'First Module',
        description:
          'Independently delivered Contract Management — UI, API integration, CRUD, multi-level approvals and role-based access.',
        tags: ['CRUD', 'RBAC', 'Approvals'],
        runtime: '2025',
        palette: amber,
      },
      {
        code: 'CH02 M02',
        title: 'Static, Shipped',
        description:
          'Self-taught Next.js and delivered a responsive financial-accounts website on timeline, with stakeholder appreciation.',
        tags: ['Next.js', 'Responsive'],
        runtime: '2025',
        palette: jade,
      },
      {
        code: 'CH02 M03',
        title: 'ESG Ownership',
        description:
          'Frontend ownership across sign-in, the indicator repository, materiality assessment and report configuration.',
        tags: ['ESG', 'Workflow engines', 'Enterprise'],
        runtime: '2025 – 2026',
        palette: ocean,
      },
      {
        code: 'CH02 M04',
        title: 'Quality Arc',
        description:
          'Led resolution of the high-severity defect backlog and set up unit-testing infrastructure.',
        tags: ['Quality', 'Testing'],
        runtime: 'ESG',
        palette: signal,
      },
      {
        code: 'CH02 M05',
        title: 'Client-facing Delivery',
        description:
          'Carried a change-request phase through UAT, a client walkthrough and a user guide — ahead of the agreed date.',
        tags: ['UAT', 'Walkthrough', 'Docs'],
        runtime: '2026',
        palette: jade,
      },
    ],
  },
  {
    number: 3,
    title: 'Complete Frontend Ownership',
    period: '2026',
    synopsis:
      'Sole frontend developer for a robotics scanning platform — a client portal and an internal backoffice, built for production.',
    milestones: [
      {
        code: 'CH03 M01',
        title: 'Two Applications',
        description:
          'Owned both apps — the access and session layer, fleet and inspection workflows, platform operations, shared modules and theming.',
        tags: ['Robotics scanning', 'RBAC', 'Theme'],
        runtime: '2026',
        palette: signal,
      },
      {
        code: 'CH03 M02',
        title: 'Stable Launch',
        description: 'Delivered to plan with senior-reviewed code and a stable production release.',
        tags: ['Production', 'Reviewed delivery'],
        runtime: 'Launch',
        palette: jade,
      },
    ],
  },
  {
    number: 4,
    title: 'Standards & Compressed Delivery',
    period: '2026',
    synopsis:
      'Raised the team baseline with a reusable frontend standards library, then applied it under compressed commerce delivery.',
    milestones: [
      {
        code: 'CH04 M01',
        title: 'Standards Library',
        description:
          'Majority contributor to a reusable library covering components, state, forms and routing, plus a requirements-to-implementation workflow.',
        tags: ['Standards', 'Team multiplier'],
        runtime: '2026',
        palette: violet,
      },
      {
        code: 'CH04 M02',
        title: 'Commerce Sprint',
        description:
          'Admin and storefront delivery under time pressure; standardized an inherited codebase and supported a clean internal demo.',
        tags: ['E-commerce', 'Refactor'],
        runtime: '2026',
        palette: amber,
      },
    ],
  },
  {
    number: 5,
    title: 'Full-Stack Horizon',
    period: '2026 – Present',
    synopsis:
      'Deepening frontend systems craft while growing into Python, FastAPI, and AI-assisted engineering workflows.',
    milestones: [
      {
        code: 'CH05 M01',
        title: 'Backend Growth',
        description:
          'Expanding with Python, FastAPI, SQLAlchemy, Pydantic, PostgreSQL, and authentication concepts through practical implementation.',
        tags: ['Python', 'FastAPI', 'PostgreSQL'],
        runtime: 'In progress',
        palette: ocean,
      },
      {
        code: 'CH05 M02',
        title: 'Product Engineer',
        description:
          'Working toward full-stack product engineering — requirements, systems design, reliable apps, and lifecycle ownership.',
        tags: ['Full-stack', 'AI-assisted'],
        runtime: 'Now',
        palette: violet,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Primary craft', title: 'React + TypeScript', detail: 'Enterprise frontend ownership', palette: signal },
  { label: 'Flagship work', title: 'Robotics Scanning', detail: 'Two connected apps · sole frontend owner', palette: ocean },
  { label: 'Enterprise depth', title: 'ESG Platform', detail: 'Hierarchy, assessment & reporting engines', palette: amber },
  { label: 'Team multiplier', title: 'Standards Library', detail: 'Reusable kit & delivery workflow', palette: violet },
  { label: 'Recognition', title: 'Budding Star', detail: 'Pirai Infotech 2025–2026', palette: jade },
  { label: 'Commerce sprint', title: 'Apparel Platform', detail: 'Admin + storefront · standardized', palette: amber },
  { label: 'Access systems', title: 'RBAC + Sessions', detail: 'Permission-gated apps · session lifecycle', palette: signal },
  { label: 'Theme systems', title: 'Light / Dark / System', detail: 'Preference + OS sync + server sync', palette: ocean },
  { label: 'Workflow engines', title: 'Resumable Steppers', detail: 'URL-driven multi-step flows', palette: amber },
  { label: 'Current mission', title: 'Product Engineer', detail: 'Frontend systems → full lifecycle', palette: violet },
];

export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Role',
    title: 'Software Engineer · Frontend',
    lines: ['Pirai Infotech · frontend systems ownership', 'React · TypeScript · enterprise delivery'],
    chips: ['Available for thoughtful product work'],
  },
  {
    kicker: 'Work',
    title: 'Robotics Scanning',
    lines: ['Sole frontend owner · backoffice + client portal', 'Delivered to plan · stable in production'],
    chips: ['RBAC', 'Sessions', 'Theme L/D/S'],
  },
  {
    kicker: 'Work',
    title: 'ESG Platform',
    lines: ['Indicator, assessment & reporting engines', 'Change-request delivery · UAT · documentation'],
    chips: ['Workflow engines', 'TanStack Query'],
  },
  {
    kicker: 'Recognition',
    title: 'Budding Star',
    lines: ['Pirai Infotech · 2025–2026', 'From first module to platform ownership'],
  },
  {
    kicker: 'Systems',
    title: 'Standards Library',
    lines: ['Reusable frontend kit & delivery workflow', 'Raised the team baseline on live product work'],
  },
  {
    kicker: 'Next',
    title: 'Full-stack horizon',
    lines: ['Python · FastAPI · PostgreSQL', 'Product engineer across the lifecycle'],
  },
];

export type ProfileId = 'gautam' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
  /** Optional path-picker badge (e.g. HIRE). */
  badge?: string;
}[] = [
  {
    id: 'gautam',
    name: 'Gautam',
    blurb: 'Full story — about → work → resume',
    color: '#2dd4bf',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
    badge: 'FULL',
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Hire-ready: resume → impact → work',
    color: '#38bdf8',
    order: ['story', 'moments', 'originals', 'skills', 'about', 'journey', 'picks'],
    badge: 'HIRE',
  },
  {
    id: 'developer',
    name: 'Developer',
    blurb: 'Projects, stack & systems first',
    color: '#34d399',
    order: ['originals', 'skills', 'journey', 'moments', 'about', 'picks', 'story'],
  },
  {
    id: 'creative',
    name: 'Creative',
    blurb: 'Journey & highlights first',
    color: '#d4a574',
    order: ['journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'],
  },
];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'Story · how I work', palette: violet },
  journey: {
    nav: 'Journey',
    card: 'My Journey',
    meta: `${chapters.length} chapters · ${chapters.reduce((n, s) => n + s.milestones.length, 0)} milestones`,
    palette: amber,
  },
  originals: { nav: 'Work', card: 'Selected Work', meta: `${projects.length} case studies`, palette: signal },
  picks: { nav: 'Highlights', card: 'Highlights', meta: 'Top signals from the work', palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: `${skillCategories.length} Categories`, palette: ocean },
  moments: {
    nav: 'Impact',
    card: 'Achievements',
    meta: `${achievements.length} achievements · ${certifications.length} certifications`,
    palette: amber,
  },
  story: { nav: 'Resume', card: 'Resume', meta: 'One page · role & outcomes', palette: violet },
};

export const storyBlurb =
  'I started with fundamentals in college, then turned them into production frontend ownership at Pirai Infotech — sole owner of a two-app robotics scanning platform, owner of core modules on an enterprise ESG platform, and a majority contributor to the frontend standards that raise the whole team. The work grew from shipping features to owning access systems, themes, workflow engines and reusable architecture. I am extending that foundation toward full-stack product engineering with Python, FastAPI, and AI-assisted workflows.';
