
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Force restart on config changes
    watch: {
      ignored: ['!**/node_modules/.vite/**']
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
      // Aggressive React deduplication
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // BLOCK ALL RADIX TOOLTIP COMPLETELY
      "@radix-ui/react-tooltip": false,
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query"
    ],
    exclude: [
      "@radix-ui/react-tooltip"
    ],
    // Force complete rebuild with new timestamp
    force: true,
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
      external: (id) => {
        // Completely block any radix tooltip imports
        if (id.includes('@radix-ui/react-tooltip')) {
          console.log('🚫 BLOCKING RADIX TOOLTIP:', id);
          return true; // Externalize = block it
        }
        return false;
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    jsx: 'automatic',
    target: 'esnext',
  },
  // Force complete cache clearing with unique directory
  cacheDir: path.resolve(__dirname, '.vite-emergency-clean-' + Date.now()),
}));
