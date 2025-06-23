
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - MAXIMUM DEFENSE tooltip elimination');

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
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force React deduplication - this is crucial
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // COMPLETELY BLOCK RADIX TOOLTIP
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
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
    // MAXIMUM DEFENSE - exclude all tooltip packages
    exclude: [
      "@radix-ui/react-tooltip",
      "@radix-ui/react-use-controllable-state",
      "@radix-ui/react-use-layout-effect",
      "@radix-ui/react-portal",
      "@radix-ui/react-presence",
      "@radix-ui/react-primitive",
      "@radix-ui/react-slot",
      "@radix-ui/react-visually-hidden",
    ],
    force: true,
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      // MAXIMUM DEFENSE - block all tooltip-related packages
      external: (id) => {
        const isTooltipRelated = 
          id.includes('@radix-ui/react-tooltip') ||
          id.includes('radix') && id.includes('tooltip') ||
          id.includes('use-controllable-state') ||
          id.includes('use-layout-effect') ||
          id.includes('react-portal') ||
          id.includes('react-presence');
        
        if (isTooltipRelated) {
          console.log('🚫 MAXIMUM DEFENSE EXTERNAL BLOCK:', id);
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
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    jsx: 'automatic',
    target: 'esnext',
  },
}));
