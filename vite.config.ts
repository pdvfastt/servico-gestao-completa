
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - ULTRA AGGRESSIVE Radix blocking with complete React isolation');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // ULTRA AGGRESSIVE plugin to block ALL Radix imports
    {
      name: 'ultra-block-all-radix',
      resolveId(id: string) {
        // Block ANY Radix package
        if (id.includes('@radix-ui/') || id.includes('radix')) {
          console.log('🚫 ULTRA BLOCKING Radix import:', id);
          return '\0virtual:safe-radix';
        }
        return null;
      },
      load(id: string) {
        if (id === '\0virtual:safe-radix') {
          // Return completely safe, non-functional exports for any Radix component
          return `
            console.log('🛡️ Safe Radix virtual module loaded');
            export const Root = ({ children }) => children;
            export const Provider = ({ children }) => children;
            export const Trigger = ({ children }) => children;
            export const Content = () => null;
            export const Portal = ({ children }) => children;
            export const Viewport = ({ children }) => children;
            export const ScrollAreaScrollbar = () => null;
            export const ScrollAreaThumb = () => null;
            export const Corner = () => null;
            export const TooltipProvider = ({ children }) => children;
            export const Tooltip = ({ children }) => children;
            export const TooltipTrigger = ({ children }) => children;
            export const TooltipContent = () => null;
            export default {
              Root: ({ children }) => children,
              Provider: ({ children }) => children,
              Trigger: ({ children }) => children,
              Content: () => null,
              Portal: ({ children }) => children,
              Viewport: ({ children }) => children
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
      // Force single React instance with absolute paths
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // Block ALL Radix packages
      "@radix-ui/react-tooltip": '\0virtual:safe-radix',
      "@radix-ui/react-scroll-area": '\0virtual:safe-radix',
      "@radix-ui/react-portal": '\0virtual:safe-radix',
      "@radix-ui/react-primitive": '\0virtual:safe-radix',
      "@radix-ui/react-use-callback-ref": '\0virtual:safe-radix',
      "@radix-ui/react-use-layout-effect": '\0virtual:safe-radix',
    },
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom",
      "react/jsx-runtime",
      "@tanstack/react-query"
    ],
    exclude: [
      "@radix-ui/react-tooltip",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-portal",
      "@radix-ui/react-primitive",
      "@radix-ui/react-use-callback-ref",
      "@radix-ui/react-use-layout-effect"
    ],
    force: true,
  },
  build: {
    rollupOptions: {
      external: (id: string) => {
        // Block any Radix-related imports during build
        if (id.includes('@radix-ui/')) {
          console.log('🚫 Build: Blocking Radix import:', id);
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
  define: {
    // Ensure React is always available globally
    'global.React': 'React',
    'window.React': 'React',
  },
}));
