import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
    server: {
      port: 3000,
      // Same-origin /api in dev avoids CORS; production uses VITE_API_BASE_URL.
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'https://aqid.subcodeco.com/api',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api/, ''),
        },
      },
    },
    test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.js'] },
  };
});
