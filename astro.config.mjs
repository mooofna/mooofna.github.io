import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mooofna.github.io',
  integrations: [sitemap()],
  build: { format: 'directory' },
  devToolbar: { enabled: false }
});
