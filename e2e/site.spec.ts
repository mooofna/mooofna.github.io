import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const pages = ['/', '/work/', '/cv/', '/news/'];

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|singapore-urban-heat/.test(m.text())) {
      errors.push(m.text());
    }
  });
  return errors;
}

async function seriousA11yViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  return result.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

for (const theme of ['dark', 'light'] as const) {
  for (const path of pages) {
    test(`${path} in ${theme} theme renders cleanly and passes axe`, async ({ page }) => {
      const errors = collectErrors(page);
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      if (theme === 'light')
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, 'no horizontal scroll').toBeLessThanOrEqual(0);
      expect(await seriousA11yViolations(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test('the theme follows the system until the toggle overrides it', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(await background()).toBe('rgb(14, 14, 14)');
  await page.getByRole('button', { name: 'Switch to the light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await background()).toBe('rgb(255, 255, 255)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to the dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await context.close();
});

test('the Singapore card shows live numbers from the demo JSON', async ({ page }) => {
  await page.route('**/singapore-urban-heat/data/manifest.json', (route) =>
    route.fulfill({ json: { schema_version: 1, sgheat_version: '9.9.9' } })
  );
  await page.route('**/singapore-urban-heat/data/summary.json', (route) =>
    route.fulfill({ json: { scenes: { accepted: 1234, first: '2013-04-24', last: '2026-10-05' } } })
  );
  await page.goto('/');
  const live = page.locator('[data-live="singapore-urban-heat"]');
  await expect(live).toBeVisible();
  await expect(live).toContainText('1,234 clear Landsat scenes, 24 Apr 2013 to 5 Oct 2026, v9.9.9');
});

test('the Singapore card stays static when the demo JSON is missing or unexpected', async ({
  page
}) => {
  await page.route('**/singapore-urban-heat/data/manifest.json', (route) =>
    route.fulfill({ json: { schema_version: 2, sgheat_version: '2.0.0' } })
  );
  await page.route('**/singapore-urban-heat/data/summary.json', (route) =>
    route.fulfill({ status: 404, body: 'not found' })
  );
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Singapore Urban Heat' })).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.locator('[data-live="singapore-urban-heat"]')).toBeHidden();
});

test('links to the demo, the CV PDF and profiles are in place', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Open the map' }).first()).toHaveAttribute(
    'href',
    '/singapore-urban-heat/'
  );
  const cv = await request.get('/cv/Maurice_Heide_CV.pdf');
  expect(cv.status()).toBe(200);
  expect(cv.headers()['content-type']).toContain('pdf');
  for (const name of ['GitHub', 'LinkedIn', 'Google Scholar']) {
    await expect(page.locator('#contact').getByRole('link', { name })).toBeVisible();
  }
});

test('unknown paths get the 404 page', async ({ request }) => {
  const res = await request.get('/does-not-exist/');
  expect(res.status()).toBe(404);
  expect(await res.text()).toContain('Page not found');
});
