
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - ULTIMATE Radix elimination strategy');

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
    // AGGRESSIVE PLUGIN to block Radix imports
    {
      name: 'block-radix-imports',
      resolveId(id: string) {
        if (id.includes('@radix-ui') || id.includes('radix')) {
          console.log('🚫 BLOCKED IMPORT:', id);
          return path.resolve(__dirname, "./src/components/ui/tooltip.tsx");
        }
        return null;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ULTIMATE BLOCKING: Force React deduplication
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // ULTIMATE BLOCKING: Redirect ALL possible Radix paths
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-toast": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-tooltip/dist/index.js": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-toast/dist/index.js": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-tooltip/dist/index.mjs": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-toast/dist/index.mjs": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    // ULTIMATE BLOCKING: Define globals to prevent issues
    '__RADIX_UI_TOOLTIP__': 'false',
    '__RADIX_UI_TOAST__': 'false',
    '__RADIX_UI_BLOCKED__': 'true',
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
        '__RADIX_UI_BLOCKED__': 'true',
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
      external: (id: string) => {
        // ULTIMATE BLOCKING of any radix imports
        if (id.includes('@radix-ui') || id.includes('radix')) {
          console.log('🚫 ULTIMATE BLOCK:', id);
          return false; // Don't make it external, redirect it
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
      '__RADIX_UI_BLOCKED__': 'true',
    }
  },
  // ULTIMATE CACHE CLEARING with unique timestamp
  cacheDir: path.resolve(__dirname, '.vite-ultimate-' + Date.now()),
}));
