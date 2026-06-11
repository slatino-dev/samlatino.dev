// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import shikiTheme from './src/lib/shiki-theme.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://samlatino.dev',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap(), mdx()],
  markdown: {
    // Custom Shiki theme bound to the site tokens — see src/lib/shiki-theme.mjs.
    shikiConfig: {
      theme: shikiTheme,
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
