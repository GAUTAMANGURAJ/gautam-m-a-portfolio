import { test as base, expect } from '@playwright/test';

/**
 * Every test runs with third-party hosts stubbed: analytics scripts return empty JS instantly, so a slow
 * or blocked network can never stall the page's `load` event, and tests never send real analytics hits.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/gc\.zgo\.at|goatcounter\.com|plausible\.io/, (route) =>
      route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
    );
    await use(page);
  },
});

export { expect };
