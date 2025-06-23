
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - ULTIMATE TOOLTIP ELIMINATION');

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
    // Custom plugin to intercept and block tooltip imports
    {
      name: 'ultimate-tooltip-blocker',
      resolveId(id: string) {
        if (id.includes('@radix-ui/react-tooltip') || 
            (id.includes('radix') && id.includes('tooltip'))) {
          console.log('🚫 ULTIMATE PLUGIN BLOCK:', id);
          return path.resolve(__dirname, './src/components/ui/tooltip.tsx');
        }
        return null;
      },
      load(id: string) {
        if (id.includes('@radix-ui/react-tooltip') || 
            (id.includes('radix') && id.includes('tooltip'))) {
          console.log('🚫 ULTIMATE PLUGIN LOAD BLOCK:', id);
          return `
            export const TooltipProvider = ({ children }) => children;
            export const Tooltip = ({ children }) => children;
            export const TooltipTrigger = ({ children }) => children;
            export const TooltipContent = ({ children }) => null;
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
      // ULTIMATE BLOCKING - Block ALL Radix tooltip packages and variations
      "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-tooltip/dist": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-tooltip/dist/index.js": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      "@radix-ui/react-tooltip/dist/index.mjs": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query"
    ],
    // ULTIMATE BLOCKING - exclude ALL tooltip packages and dependencies
    exclude: [
      "@radix-ui/react-tooltip",
      "radix-tooltip",
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
      // Additional blocking at esbuild level
      plugins: [{
        name: 'ultimate-tooltip-esbuild-blocker',
        setup(build) {
          build.onResolve({ filter: /.*tooltip.*/ }, (args) => {
            console.log('🚫 ULTIMATE ESBUILD BLOCK:', args.path);
            return {
              path: path.resolve(__dirname, './src/components/ui/tooltip.tsx'),
              namespace: 'ultimate-safe'
            };
          });
        }
      }]
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      // ULTIMATE BLOCKING - block ALL tooltip-related packages at rollup level
      external: (id) => {
        const isTooltipRelated = 
          id.includes('@radix-ui/react-tooltip') ||
          (id.includes('radix') && id.includes('tooltip')) ||
          id.includes('use-controllable-state') ||
          id.includes('use-layout-effect') ||
          id.includes('react-portal') ||
          id.includes('react-presence');
        
        if (isTooltipRelated) {
          console.log('🚫 ULTIMATE ROLLUP BLOCK:', id);
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
