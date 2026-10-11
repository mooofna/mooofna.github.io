// Renders the images the site and its README use.
//   node scripts/screenshots.ts demo   card image of the live Singapore demo
//   node scripts/screenshots.ts site   README screenshots and the Open Graph image
//                                      (needs `npm run build && npm run preview` running)
import { chromium, type Page } from '@playwright/test';

const mode = process.argv[2] ?? 'site';
const site = process.env.BASE_URL ?? 'http://localhost:4321';
const demo = 'https://mooofna.github.io/singapore-urban-heat/';

interface Shot {
  url: string;
  out: string;
  width: number;
  height: number;
  theme?: 'light' | 'dark';
  wait?: number;
  fullPage?: boolean;
  prepare?: (page: Page) => Promise<void>;
}

const browser = await chromium.launch();

async function shot({
  url,
  out,
  width,
  height,
  theme = 'dark',
  wait = 1500,
  fullPage,
  prepare
}: Shot) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: theme,
    reducedMotion: 'reduce'
  });
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {}
  }, theme);
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  if (prepare) await prepare(page);
  await page.waitForTimeout(wait);
  await page.screenshot({ path: out, fullPage });
  await page.close();
  console.log(`wrote ${out}`);
}

if (mode === 'demo') {
  await shot({
    url: demo,
    out: 'src/assets/projects/singapore-urban-heat.png',
    width: 1280,
    height: 720,
    wait: 6000,
    prepare: async (page) => {
      // Show the map without the control panel; the attribution stays visible.
      await page.getByRole('button', { name: 'Hide' }).click();
    }
  });
} else {
  await shot({ url: `${site}/`, out: 'docs/home-dark.png', width: 1440, height: 900 });
  await shot({
    url: `${site}/`,
    out: 'docs/home-light.png',
    width: 1440,
    height: 900,
    theme: 'light'
  });
  await shot({ url: `${site}/`, out: 'docs/home-mobile.png', width: 390, height: 844 });
  // Open Graph image: 1200 x 630 at 1x.
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    reducedMotion: 'reduce'
  });
  await page.goto(`${site}/`);
  await page.waitForLoadState('networkidle');
  // The intro block only (name, lede, facts and portrait), centred in the frame.
  await page.addStyleTag({
    content: [
      '.site-header, .site-footer, main > :not(.intro) { display: none !important; }',
      '.intro { min-height: 630px; align-content: center; padding-block: 48px !important; border-bottom: 0 !important; }'
    ].join(' ')
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'public/og.png' });
  await page.close();
  console.log('wrote public/og.png');
}

await browser.close();
