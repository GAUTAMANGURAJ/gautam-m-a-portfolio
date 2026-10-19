import { expect, test } from './fixtures';
import { PROJECT_SLUGS, loadAllSections, openHome, trackErrors } from './helpers';

test.describe('site health', () => {
  test('home renders without console or runtime errors', async ({ page }) => {
    const errors = trackErrors(page);
    await openHome(page);
    await loadAllSections(page);
    await expect(page.locator('h1').first()).toContainText('GAUTAM');
    expect(errors).toEqual([]);
  });

  for (const slug of PROJECT_SLUGS) {
    test(`case study page /work/${slug}/ renders`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(`work/${slug}/`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByText('Architecture overview')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('unknown routes get the branded 404', async ({ page }) => {
    const res = await page.goto('work/does-not-exist/');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('link', { name: /back to portfolio|home/i }).first()).toBeVisible();
  });

  test('sitemap and robots list every public page', async ({ request }) => {
    const sitemap = await (await request.get('sitemap.xml')).text();
    for (const slug of PROJECT_SLUGS) expect(sitemap).toContain(`/work/${slug}/`);
    const robots = await (await request.get('robots.txt')).text();
    expect(robots).toContain('Sitemap:');
  });
});

test.describe('metadata', () => {
  test('home has title, description, canonical, social tags and Person structured data', async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveTitle(/Gautam M A/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{60,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = ld.flatMap((t) => JSON.parse(t)['@graph']?.map((n: { '@type': string }) => n['@type']) ?? [JSON.parse(t)['@type']]);
    expect(types).toContain('Person');
    expect(types).toContain('WebSite');
  });

  for (const slug of PROJECT_SLUGS) {
    test(`/work/${slug}/ has its own metadata and breadcrumb data`, async ({ page }) => {
      await page.goto(`work/${slug}/`);
      const title = await page.title();
      expect(title).toMatch(/Gautam M A/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`/work/${slug}/`));
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(' ');
      expect(ld).toContain('BreadcrumbList');
    });
  }
});

test.describe('privacy guard', () => {
  // Internal delivery data must never reach the public site (appraisal, Jira and Git figures).
  const FORBIDDEN: [string, RegExp][] = [
    ['defect tally', /\b87\s*\/\s*90\b/],
    ['file count', /\b216\b/],
    ['rejected PR claim', /rejected (pull requests|PRs)/i],
    ['incident count', /\b0 (post-launch )?incidents\b/i],
    ['review score', /\b4\.33\b/],
    ['Jira', /\bjira\b/i],
    ['commit counts', /\b1,?260\b|\b552,?796\b|\b624\b/],
    ['internal product names', /\b(Zice|Robolab|MiniBee|Dyne)\b/],
  ];

  async function assertClean(page: import('@playwright/test').Page, label: string) {
    const text = (await page.locator('body').innerText()) + ' ' + (await page.content());
    for (const [name, re] of FORBIDDEN) expect(text, `${label}: ${name}`).not.toMatch(re);
  }

  test('home is free of internal figures and product names', async ({ page }) => {
    await openHome(page);
    await loadAllSections(page);
    await assertClean(page, 'home');
  });

  for (const slug of PROJECT_SLUGS) {
    test(`/work/${slug}/ is free of internal figures and product names`, async ({ page }) => {
      await page.goto(`work/${slug}/`);
      await assertClean(page, slug);
    });
  }
});
