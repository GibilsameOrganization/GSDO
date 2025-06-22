import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          
          // Page chunks
          'page-index': ['./src/pages/Index'],
          'page-about': ['./src/pages/About'],
          'page-work': ['./src/pages/OurWork'],
          'page-involved': ['./src/pages/GetInvolved'],
          'page-news': ['./src/pages/News'],
          'page-admin': ['./src/pages/Admin'],
          
          // Component chunks
          'components-home': [
            './src/components/Hero',
            './src/components/WhoWeAre',
            './src/components/ImpactMetrics',
            './src/components/FocusAreas'
          ],
          'components-interactive': [
            './src/components/StoriesCarousel',
            './src/components/NewsSection',
            './src/components/GetInvolvedSection'
          ],
          'components-admin': [
            './src/components/admin/NewsManager',
            './src/components/admin/PhotoManager',
            './src/components/admin/StoriesManager'
          ]
        }
      }
    },
    // Enable chunk size warnings
    chunkSizeWarningLimit: 500,
  }
}));
