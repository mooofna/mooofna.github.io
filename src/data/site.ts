// Identity and profile links used across the site.
export const site = {
  name: 'Maurice Heide',
  url: 'https://mooofna.github.io',
  description:
    'Maurice Heide, MSc student in Data Science at ETH Zurich. Machine learning and statistics, from research to production. Previously Harvard Medical School and MGH.',
  email: 'mheide@student.ethz.ch',
  profiles: [
    { label: 'GitHub', href: 'https://github.com/mooofna' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maurice-heide' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=x6GTx8kAAAAJ' }
  ],
  cv: '/cv/Maurice_Heide_CV.pdf',
  source: 'https://github.com/mooofna/mooofna.github.io'
} as const;

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'CV', href: '/cv/' },
  { label: 'News', href: '/news/' }
] as const;
