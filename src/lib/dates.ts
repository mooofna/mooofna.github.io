const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
});

/** "Oct 2026" */
export const formatMonth = (d: Date) => monthYear.format(d);

/** "2026-05" to "May 2026"; other strings (such as "2028 (expected)") pass through. */
export function formatYm(ym: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  return m ? formatMonth(new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 1))) : ym;
}
