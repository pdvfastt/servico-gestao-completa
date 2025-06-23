
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - Aggressive tooltip blocking configuration');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Custom plugin to block tooltip imports
    {
      name: 'block-tooltip-imports',
      resolveId(id) {
        if (id.includes('@radix-ui/react-tooltip')) {
          console.log('🚫 Blocking tooltip import:', id);
          return path.resolve(__dirname, './src/components/ui/tooltip.tsx');
        }
        return null;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      // Block any tooltip imports
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
    },
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom",
      "@tanstack/react-query"
    ],
    exclude: [
      "@radix-ui/react-tooltip"
    ],
    force: true,
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Block any tooltip-related imports during build
        if (id.includes('@radix-ui/react-tooltip')) {
          console.log('🚫 Build: Blocking tooltip import:', id);
          return true;
        }
        return false;
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
}));
