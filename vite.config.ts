
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - NUCLEAR tooltip elimination strategy');

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
    // NUCLEAR PLUGIN - completely eliminate ANY tooltip references
    {
      name: 'nuclear-tooltip-eliminator',
      enforce: 'pre',
      resolveId(id: string, importer?: string) {
        console.log('🔍 RESOLVE CHECK:', { id, importer });
        
        // Block ANY tooltip-related imports completely
        if (id.includes('tooltip') || id.includes('@radix-ui/react-tooltip')) {
          console.log('🚫 NUCLEAR BLOCK - TOOLTIP IMPORT:', id);
          return path.resolve(__dirname, "./src/components/ui/tooltip.tsx");
        }
        return null;
      },
      load(id: string) {
        console.log('🔍 LOAD CHECK:', id);
        
        if (id.includes('tooltip') && !id.includes('src/components/ui/tooltip.tsx')) {
          console.log('🚫 NUCLEAR BLOCK - TOOLTIP LOAD:', id);
          // Return our custom tooltip implementation
          return `
            console.log('🛡️ NUCLEAR REDIRECT - Loading custom tooltip');
            export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "${path.resolve(__dirname, "./src/components/ui/tooltip.tsx")}";
            export default { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
          `;
        }
        return null;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force React deduplication
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
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
    ],
    force: true,
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['@radix-ui/react-tooltip'],
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
