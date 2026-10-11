// Fail if a built page links to a same-site path that does not exist in dist/.
// Paths below /singapore-urban-heat/ belong to another repository and are skipped.
// Usage: node scripts/check_links.mjs dist
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? 'dist';
const external = ['/singapore-urban-heat/'];

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith('.html')) yield p;
  }
}

function exists(path) {
  const clean = decodeURIComponent(path.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return existsSync(join(root, 'index.html'));
  const target = join(root, clean);
  return (
    (existsSync(target) && statSync(target).isFile()) ||
    existsSync(join(target, 'index.html')) ||
    existsSync(`${target}.html`)
  );
}

const broken = [];
let checked = 0;
for (const file of htmlFiles(root)) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    if (external.some((e) => url.startsWith(e))) continue;
    checked++;
    if (!exists(url)) broken.push(`${file}: ${url}`);
  }
}
for (const b of broken) console.error(`broken link ${b}`);
console.log(`${checked} internal links checked, ${broken.length} broken`);
process.exit(broken.length ? 1 : 0);
