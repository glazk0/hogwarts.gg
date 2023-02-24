import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        controller: 'controller.html',
        index: 'index.html',
        authDiscord: 'auth-discord.html',
        authGitHub: 'auth-github.html',
      },
    },
  },
  server: {
    port: 3031,
  },
});
