import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT || 4173);

/**
 * End-to-end + accessibility tests run against the real static export (`npm run build` first).
 * Locally, set PW_CHANNEL=chrome to reuse the installed Chrome; CI installs Playwright's Chromium.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/gautam-m-a-portfolio/`,
    channel: process.env.PW_CHANNEL || undefined,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined, viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.PW_CHANNEL || undefined } },
  ],
  webServer: {
    command: 'node scripts/serve-export.mjs',
    url: `http://localhost:${PORT}/gautam-m-a-portfolio/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(PORT) },
  },
});
