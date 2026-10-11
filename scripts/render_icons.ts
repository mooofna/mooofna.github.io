// Renders PNG versions of public/favicon.svg for browsers and devices that do not use SVG icons.
//   node scripts/render_icons.ts   writes public/favicon-32.png, public/apple-touch-icon.png
//                                  and public/icon-512.png, which scripts/make_ico.py packs into favicon.ico
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const svg = readFileSync('public/favicon.svg', 'utf8');
// Apple touch icons must be opaque squares; iOS rounds the corners itself.
const square = svg.replace(/ rx="\d+"/, '');

const browser = await chromium.launch();
async function render(source: string, size: number, out: string) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const src = `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`;
  await page.setContent(
    `<html><body style="margin:0;background:transparent"><img src="${src}" width="${size}" height="${size}" style="display:block"></body></html>`
  );
  await page.screenshot({ path: out, omitBackground: true });
  await page.close();
  console.log(`wrote ${out}`);
}
await render(svg, 32, 'public/favicon-32.png');
await render(square, 180, 'public/apple-touch-icon.png');
await render(svg, 512, 'public/icon-512.png');
await browser.close();
