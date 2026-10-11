import { execSync } from 'node:child_process';

// Build provenance for the footer: the commit comes from GitHub Actions or local git.
function headCommit(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

export const commit = headCommit();
export const shortCommit = commit.slice(0, 7);
export const builtOn = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Europe/Zurich'
}).format(new Date());
