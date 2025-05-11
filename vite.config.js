import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'eee5-165-50-188-176.ngrok-free.app',
      'localhost',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // ton backend Node/Express
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
