import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/wordle-clone/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/wordle-clone/',
      },
    },
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
