import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Both the dev server and `npm run preview` run on port 5102.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5102, strictPort: true },
  preview: { port: 5102, strictPort: true },
});
