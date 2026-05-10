import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://capweb.fr',
  integrations: [],
  output: 'hybrid',
  adapter: netlify(),
  compressHTML: true,
  server: {
    host: true,
    port: 4321,
  },
  build: {
    assets: 'assets',
  },
});
