
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - Completely blocking tooltip dependencies with proper types');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Custom plugin to completely block tooltip imports with proper typing
    {
      name: 'block-tooltip-completely',
      resolveId(id: string) {
        if (id.includes('@radix-ui/react-tooltip') || id.includes('tooltip')) {
          console.log('🚫 BLOCKING tooltip import completely:', id);
          // Return a virtual module that exports safe defaults
          return '\0virtual:safe-tooltip';
        }
        return null;
      },
      load(id: string) {
        if (id === '\0virtual:safe-tooltip') {
          // Return safe, non-functional tooltip components
          return `
            console.log('🛡️ Safe tooltip virtual module loaded');
            export const TooltipProvider = ({ children }) => children;
            export const Tooltip = ({ children }) => children;
            export const TooltipTrigger = ({ children }) => children;
            export const TooltipContent = () => null;
            export default {
              Provider: ({ children }) => children,
              Root: ({ children }) => children,
              Trigger: ({ children }) => children,
              Content: () => null
            };
          `;
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
      // Completely block tooltip
      "@radix-ui/react-tooltip": '\0virtual:safe-tooltip',
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
      external: (id: string) => {
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
