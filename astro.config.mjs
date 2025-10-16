// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    integrations: [mdx(), sitemap(), sanity({
         projectId: '4hfzjbz1',
      dataset: 'production',
      // Set useCdn to false if you're building statically.
      useCdn: false,
    //   apiVersion: '2025-16-10'
    }), react()],
    
});