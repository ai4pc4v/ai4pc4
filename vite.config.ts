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
      '/api/airtable': {
        target: 'https://api.airtable.com/v0',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/airtable/, ''),
        headers: {
          'Authorization': `Bearer patM04rhUWe1qOOgY.ee040692d361bfd89bd5a2c3a9fc63788989a109ed03bf37c30ced0dd9c04937`
        }
      }
    }
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
}));
