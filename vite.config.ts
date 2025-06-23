
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - ULTRA AGGRESSIVE Radix blocking configuration');

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
      // ULTRA AGGRESSIVE React deduplication
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // COMPLETELY BLOCK ALL RADIX COMPONENTS
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-toast": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-use-controllable-state": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-use-layout-effect": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-dismissible-layer": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-focus-scope": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-portal": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-presence": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-primitive": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-use-escape-keydown": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      "@radix-ui/react-visually-hidden": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
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
      "@radix-ui/react-tooltip",
      "@radix-ui/react-toast",
      "@radix-ui/react-use-controllable-state",
      "@radix-ui/react-use-layout-effect",
      "@radix-ui/react-dismissible-layer",
      "@radix-ui/react-focus-scope",
      "@radix-ui/react-portal",
      "@radix-ui/react-presence",
      "@radix-ui/react-primitive",
      "@radix-ui/react-use-escape-keydown",
      "@radix-ui/react-visually-hidden"
    ],
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
        // ULTRA AGGRESSIVE blocking of any radix imports
        if (id.includes('@radix-ui')) {
          console.log('🚫 BLOCKING ALL RADIX IMPORTS:', id);
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
  },
  // ULTRA AGGRESSIVE cache clearing with current timestamp
  cacheDir: path.resolve(__dirname, '.vite-emergency-clear-' + Date.now()),
}));
