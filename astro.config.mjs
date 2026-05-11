import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR' },
      },
    }),
  ],
});
