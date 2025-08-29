import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    integrations: [
        tailwind({
            nesting: true,
        })
    ],
    site: 'https://discount-bath.com',
    compressHTML: true,
    build: {
        assets: '_assets'
    },
    vite: {
        build: {
            cssMinify: true
        },
        ssr: {
            noExternal: ['path-to-regexp']
        }
    }
});