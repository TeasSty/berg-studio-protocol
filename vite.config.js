import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/berg-studio-protocol/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        404: resolve(__dirname, '404.html'),
      },
    },
  },
});
