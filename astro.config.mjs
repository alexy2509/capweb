import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://capweb.fr',
  output: 'static',
  compressHTML: true,
  server: {
    host: true,
  },
  build: {
    assets: 'assets',
  },
});
