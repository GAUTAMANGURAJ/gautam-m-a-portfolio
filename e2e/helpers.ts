import type { Page } from '@playwright/test';

export const PROJECT_SLUGS = [
  'robotics-scanning',
  'esg-platform',
  'frontend-standards',
  'apparel-commerce',
  'contract-management',
  'financial-accounts',
] as const;

/** Console noise that is environment-related, not a site bug. */
const IGNORABLE = [/goatcounter/i, /favicon/i, /Failed to load resource.*(gc\.zgo\.at|goatcounter)/i];

export function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !IGNORABLE.some((re) => re.test(m.text()))) errors.push(`console: ${m.text()}`);
  });
  return errors;
}

/** Home with the intro and path picker skipped. */
export async function openHome(page: Page, hash = '') {
  await page.goto(`./?quick=1${hash}`, { waitUntil: 'load' });
  await page.locator('h1').first().waitFor();
}

/** Scroll the whole page once so every code-split / lazily rendered section mounts. */
export async function loadAllSections(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}
