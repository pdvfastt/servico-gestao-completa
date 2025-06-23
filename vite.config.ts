
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - BULLETPROOF: Complete Radix elimination');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
      // BULLETPROOF: Force React deduplication
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // BULLETPROOF BLOCKING: Redirect ALL Radix imports to our custom components
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-toast": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      // BULLETPROOF: Block individual exports too
      "@radix-ui/react-tooltip/dist/index.js": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-toast/dist/index.js": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    // BULLETPROOF: Define globals to prevent issues
    '__RADIX_UI_TOOLTIP__': 'false',
    '__RADIX_UI_TOAST__': 'false',
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
      "@radix-ui/react-tooltip",
      "@radix-ui/react-toast",
      "@radix-ui/*",
    ],
    force: true,
    esbuildOptions: {
      target: 'esnext',
      define: {
        '__RADIX_UI_TOOLTIP__': 'false',
        '__RADIX_UI_TOAST__': 'false',
      }
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
        // BULLETPROOF BLOCKING of any radix imports
        if (id.includes('@radix-ui') || id.includes('radix')) {
          console.log('🚫 BULLETPROOF BLOCK:', id);
          return true;
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
    define: {
      '__RADIX_UI_TOOLTIP__': 'false',
      '__RADIX_UI_TOAST__': 'false',
    }
  },
  // BULLETPROOF CACHE CLEARING with timestamp
  cacheDir: path.resolve(__dirname, '.vite-bulletproof-' + Date.now()),
}));
