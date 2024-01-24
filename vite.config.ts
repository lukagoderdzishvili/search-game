// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // ... other config options
  optimizeDeps: {
    include: ['phaser'],
  },
  resolve: {
    alias: {
      phaser: resolve(__dirname, 'node_modules/phaser'),
    },
  },
});
