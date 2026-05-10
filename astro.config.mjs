import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://capweb.fr',
  output: 'static',
  compressHTML: true,
  server: {
    host: true,
    port: 4321,
  },
  build: {
    assets: 'assets',
  },
});
