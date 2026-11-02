import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = typeof import.meta.dirname === 'string'
  ? import.meta.dirname
  : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, '.'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    hmr: false,
    watch: null,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
  },
});
