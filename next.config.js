/** Keep in sync with asset URLs in `lib/content/portfolio.ts` (NEXT_PUBLIC_BASE_PATH). */
const BASE_PATH = '/gautam-m-a-portfolio';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Each page exports as <route>/index.html so GitHub Pages serves /work/<slug>/ reliably
  trailingSlash: true,
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  // Lint + typecheck also run in CI / deploy workflows before build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
