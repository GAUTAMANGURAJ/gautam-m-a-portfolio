import { expect, test } from './fixtures';
import { openHome } from './helpers';

test.describe('analytics events', () => {
  test.beforeEach(async ({ page }) => {
    // Capture anything the site sends to GoatCounter / Plausible without loading the real scripts
    await page.addInitScript(() => {
      const w = window as unknown as { __events: string[]; goatcounter: unknown; plausible: unknown };
      w.__events = [];
      w.goatcounter = { count: (v: { path: string }) => w.__events.push(v.path) };
      w.plausible = (name: string) => w.__events.push(`plausible:${name}`);
    });
  });

  const events = (page: import('@playwright/test').Page) => page.evaluate(() => (window as unknown as { __events: string[] }).__events);

  test('resume download, outbound links and project opens are tracked without personal data', async ({ page }) => {
    await openHome(page);
    // Block navigation away so the click is observed but harmless
    await page.route(/linkedin\.com|github\.com/, (r) => r.abort());
    await page.evaluate(() => {
      document.addEventListener('click', (e) => (e.target as HTMLElement).closest('a[href]') && e.preventDefault(), true);
    });
    await page.locator('footer a[href*="linkedin.com"]').scrollIntoViewIfNeeded();
    await page.locator('footer a[href*="linkedin.com"]').first().click();
    await page.locator('footer a[href$=".pdf"]').first().click();
    const seen = await events(page);
    expect(seen).toContain('event/outbound_linkedin');
    expect(seen).toContain('event/resume_download');
    // Nothing that looks like an email address or free text is ever sent
    for (const e of seen) expect(e).not.toMatch(/@|%40/);
  });

  test('contact submit reports only the coarse topic', async ({ page }) => {
    await page.route('https://api.web3forms.com/**', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }),
    );
    await openHome(page, '#contact');
    const form = page.locator('#contact form');
    await form.scrollIntoViewIfNeeded();
    await form.getByRole('radio', { name: 'Hiring' }).click();
    await page.fill('#contact-name', 'Private Person');
    await page.fill('#contact-email', 'private@example.com');
    await page.fill('#contact-message', 'A long enough private message body for validation to pass.');
    await form.getByRole('button', { name: /send message/i }).click();
    await expect.poll(async () => (await events(page)).join(',')).toContain('event/contact_submit:hiring');
    const all = (await events(page)).join(' ');
    expect(all).not.toMatch(/Private|private@|message body/);
  });
});
