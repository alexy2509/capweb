import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://capweb.pro',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'never',
  server: {
    host: true,
  },
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
});
