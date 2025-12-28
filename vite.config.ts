import path from 'path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { ecsstatic } from '@acab/ecsstatic/vite';

export default defineConfig({
  plugins: [ecsstatic(), solid()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        '@sledge/anvil',
        '@sledge/core',
        '@sledge/theme',
      ],
    },
  },
});
