import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';
import { loadAllSections, openHome } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function scan(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = results.violations.map((v) => `${v.impact} · ${v.id} · ${v.nodes.length} node(s) · ${v.nodes[0]?.target.join(' ')}`);
  expect(summary, `${label}\n${summary.join('\n')}`).toEqual([]);
}

test.describe('accessibility (axe, WCAG 2.2 AA)', () => {
  // Sections fade in as they approach the viewport, so each is scanned while actually in view —
  // scanning the whole page at once would measure colours mid-fade and report false contrast failures.
  test('home page, section by section', async ({ page }) => {
    test.setTimeout(240_000);
    await openHome(page);
    await loadAllSections(page);
    const found: string[] = [];
    for (const target of ['header', '#top', '#about', '#journey', '#originals', '#picks', '#skills', '#moments', '#story', '#contact']) {
      await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'center' }), target);
      await page.waitForTimeout(1600);
      const results = await new AxeBuilder({ page }).withTags(TAGS).include(target).analyze();
      for (const v of results.violations) found.push(`${target} · ${v.impact} · ${v.id} · ${v.nodes.length} node(s) · ${v.nodes[0]?.target.join(' ')}`);
    }
    expect(found, found.join('\n')).toEqual([]);
  });

  test('case study page', async ({ page }) => {
    await page.goto('work/esg-platform/');
    await page.getByText('Architecture overview').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
    await scan(page, 'work page');
  });

  test('command palette dialog', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut is a desktop feature');
    await openHome(page);
    await page.keyboard.press('Control+k');
    await page.getByRole('dialog', { name: 'Search and jump' }).waitFor();
    await page.waitForTimeout(600);
    await scan(page, 'palette');
  });

  test('project modal', async ({ page }) => {
    await openHome(page);
    await loadAllSections(page);
    await page.locator('[aria-label^="Open Robotics"]').first().scrollIntoViewIfNeeded();
    await page.locator('[aria-label^="Open Robotics"]').first().click({ force: true });
    await page.getByRole('dialog').waitFor();
    await page.waitForTimeout(2500);
    await scan(page, 'modal');
  });

  test('mobile menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await openHome(page);
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('dialog', { name: 'Navigation menu' }).waitFor();
    await page.waitForTimeout(1200);
    await scan(page, 'mobile menu');
  });
});
