import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
<<<<<<< HEAD
      // Proxy API requests to local backend during development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
=======
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
>>>>>>> 1faa9c98a8ddcd33764333a9d95f0f55409a9aab
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Make environment variables available
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}));
