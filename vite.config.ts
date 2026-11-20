import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: false,
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          skills: path.resolve(__dirname, 'skills.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          services: path.resolve(__dirname, 'services.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
