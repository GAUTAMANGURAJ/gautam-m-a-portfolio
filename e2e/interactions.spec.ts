import { expect, test } from './fixtures';
import { openHome, trackErrors } from './helpers';

test.describe('deep links', () => {
  for (const hash of ['originals', 'skills', 'resume', 'contact']) {
    test(`/#${hash} lands on its section on a fresh load`, async ({ page }) => {
      await page.goto(`./#${hash}`);
      const id = hash === 'resume' ? 'story' : hash;
      await expect
        .poll(async () => Math.round((await page.locator(`#${id}`).boundingBox())?.y ?? 9999), { timeout: 20_000 })
        .toBeLessThan(260);
    });
  }
});

test.describe('command palette', () => {
  test('opens, searches, opens a case study, and closes with Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard shortcut is a desktop feature');
    await openHome(page);
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog', { name: 'Search and jump' });
    await expect(dialog).toBeVisible();
    await page.keyboard.type('materiality');
    await expect(page.getByRole('option').first()).toContainText(/ESG/);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

test.describe('contact form', () => {
  test('validates, accepts a message, shows the success state, and clears the draft', async ({ page }) => {
    const errors = trackErrors(page);
    // Never hit the real form endpoint from tests
    await page.route('https://api.web3forms.com/**', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }),
    );
    await openHome(page, '#contact');
    const form = page.locator('#contact form');
    await form.scrollIntoViewIfNeeded();

    await form.getByRole('button', { name: /send message/i }).click();
    await expect(page.locator('#contact-name-error, #contact-email-error').first()).toBeVisible();

    await form.getByRole('radio', { name: 'Hiring' }).click();
    await expect(page.locator('#contact-subject')).toHaveValue('Role opportunity');
    await page.fill('#contact-name', 'Test Visitor');
    await page.fill('#contact-email', 'visitor@example.com');
    await page.fill('#contact-message', 'Hello — this is an automated test message for the contact flow.');
    await form.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/Thank you, Test|Send it from your mail app/)).toBeVisible();
    await page.getByRole('button', { name: 'Send another' }).click();
    await expect(page.locator('#contact-name')).toHaveValue('');
    expect(errors).toEqual([]);
  });
});

test.describe('case study pages', () => {
  test('architecture diagram is interactive and the page links back to Work', async ({ page, isMobile }) => {
    await page.goto('work/robotics-scanning/');
    const node = page.locator('svg g[role=button]').first();
    await node.scrollIntoViewIfNeeded();
    if (!isMobile) await node.hover();
    else await node.click();
    await expect(page.getByText(/Connects to:/)).toBeVisible();
    await page.getByRole('link', { name: /back/i }).first().click();
    await expect(page).toHaveURL(/#originals/);
  });
});
