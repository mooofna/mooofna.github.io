// Live numbers for project cards, read from the demo's published JSON.
//
// The Singapore demo is served from the same origin (/singapore-urban-heat/), so
// production fetches are same-origin. Local dev and preview servers read the deployed
// copy, which GitHub Pages serves with access-control-allow-origin: *. If anything is
// missing or has an unexpected shape, the line stays hidden and the card keeps its
// static text.

const LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const ORIGIN = LOCAL ? 'https://mooofna.github.io' : '';
const DATA = `${ORIGIN}/singapore-urban-heat/data`;

interface Manifest {
  schema_version: number;
  sgheat_version: string;
}

interface Summary {
  scenes: { accepted: number; first: string; last: string };
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return (await res.json()) as T;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function describeSingapore(manifest: Manifest, summary: Summary): string | null {
  if (manifest.schema_version !== 1) return null;
  const { accepted, first, last } = summary.scenes ?? {};
  if (!Number.isInteger(accepted) || accepted <= 0) return null;
  if (!isoDate.test(first) || !isoDate.test(last)) return null;
  const version = /^\d+\.\d+\.\d+$/.test(manifest.sgheat_version)
    ? `, v${manifest.sgheat_version}`
    : '';
  return `${accepted.toLocaleString('en-US')} clear Landsat scenes, ${formatDate(first)} to ${formatDate(last)}${version}`;
}

async function fillSingapore(el: HTMLElement): Promise<void> {
  const [manifest, summary] = await Promise.all([
    getJson<Manifest>(`${DATA}/manifest.json`),
    getJson<Summary>(`${DATA}/summary.json`)
  ]);
  const text = describeSingapore(manifest, summary);
  const target = el.querySelector<HTMLElement>('[data-live-text]');
  if (!text || !target) return;
  target.textContent = text;
  el.hidden = false;
}

for (const el of document.querySelectorAll<HTMLElement>('[data-live="singapore-urban-heat"]')) {
  fillSingapore(el).catch(() => {
    // Offline, blocked or changed format: keep the static card.
  });
}
