import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });

// Selected work. The Markdown body is the long description on /work/.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      // Meta column: what it is, where it appeared, and an optional distinction.
      kind: z.string(),
      context: z.string(),
      award: z.string().optional(),
      summary: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      // Figures with a white background sit on a light plate in both themes.
      plate: z.boolean().default(false),
      links: z.array(link),
      // Optional live numbers read from a demo's published JSON (see src/scripts/live.ts).
      live: z.enum(['singapore-urban-heat']).optional()
    })
});

// One line per entry, newest first on the page.
const news = defineCollection({
  loader: file('src/data/news.yaml'),
  schema: z.object({
    date: z.coerce.date(),
    text: z.string(),
    link: link.optional()
  })
});

const publications = defineCollection({
  loader: file('src/data/publications.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    me: z.string(),
    equal: z.array(z.string()).default([]),
    venue: z.string(),
    year: z.number(),
    note: z.string().optional(),
    links: z.array(link)
  })
});

const month = z.string().regex(/^\d{4}-\d{2}$/);

const cv = defineCollection({
  loader: file('src/data/cv.yaml'),
  schema: z.object({
    section: z.enum(['education', 'experience', 'honors']),
    start: month,
    end: z.union([month, z.string().regex(/^\d{4} \(expected\)$/)]).optional(),
    title: z.string(),
    org: z.string(),
    place: z.string().optional(),
    note: z.string().optional()
  })
});

export const collections = { projects, news, publications, cv };
