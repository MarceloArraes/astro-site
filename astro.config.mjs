// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    vite: {preview:{
      allowedHosts: ['astro.ordotech.space', '10.0.0.0/24']
    }},
    site: 'https://astro.ordotech.space',
    integrations: [mdx(), sitemap(), sanity({
         projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
      dataset: 'production',
      
      // Set useCdn to false if you're building statically.
      useCdn: false,
    //   apiVersion: '2025-16-10'
    }), react()],
    
});