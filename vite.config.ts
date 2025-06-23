
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - MAXIMUM AGGRESSIVE Radix elimination with zero tolerance');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // MAXIMUM AGGRESSIVE plugin to eliminate ALL Radix references
    {
      name: 'maximum-aggressive-radix-eliminator',
      resolveId(id: string) {
        // Block ANY mention of Radix anywhere
        if (id.includes('@radix-ui/') || 
            id.includes('radix') || 
            id.includes('TooltipProvider') ||
            id.includes('react-tooltip') ||
            id.includes('react-scroll-area') ||
            id.includes('react-portal')) {
          console.log('🚫 MAXIMUM BLOCKING:', id);
          return '\0virtual:eliminated-radix';
        }
        return null;
      },
      load(id: string) {
        if (id === '\0virtual:eliminated-radix') {
          // Return completely inert exports
          return `
            console.log('🛡️ Eliminated Radix virtual module - COMPLETELY INERT');
            export const TooltipProvider = ({ children }) => children;
            export const Tooltip = ({ children }) => children;
            export const TooltipTrigger = ({ children }) => children;
            export const TooltipContent = () => null;
            export const Provider = ({ children }) => children;
            export const Root = ({ children }) => children;
            export const Trigger = ({ children }) => children;
            export const Content = () => null;
            export const Portal = ({ children }) => children;
            export const Viewport = ({ children }) => children;
            export const ScrollAreaScrollbar = () => null;
            export const ScrollAreaThumb = () => null;
            export const Corner = () => null;
            export default { 
              TooltipProvider: ({ children }) => children,
              Tooltip: ({ children }) => children,
              TooltipTrigger: ({ children }) => children,
              TooltipContent: () => null,
              Provider: ({ children }) => children,
              Root: ({ children }) => children
            };
          `;
        }
        return null;
      },
      transform(code: string, id: string) {
        // Replace any remaining Radix imports in the code
        if (code.includes('@radix-ui/')) {
          console.log('🔄 Transforming Radix imports in:', id);
          return code
            .replace(/import\s+.*from\s+['"]@radix-ui\/.*['"];?/g, '// Radix import eliminated')
            .replace(/from\s+['"]@radix-ui\/.*['"]/g, 'from "/src/components/ui/tooltip"');
        }
        return null;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force absolute single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // MAXIMUM blocking of ALL Radix packages
      "@radix-ui/react-tooltip": '\0virtual:eliminated-radix',
      "@radix-ui/react-scroll-area": '\0virtual:eliminated-radix',
      "@radix-ui/react-portal": '\0virtual:eliminated-radix',
      "@radix-ui/react-primitive": '\0virtual:eliminated-radix',
      "@radix-ui/react-use-callback-ref": '\0virtual:eliminated-radix',
      "@radix-ui/react-use-layout-effect": '\0virtual:eliminated-radix',
      "@radix-ui/react-slot": '\0virtual:eliminated-radix',
      "@radix-ui/react-tabs": '\0virtual:eliminated-radix',
      "@radix-ui/react-dialog": '\0virtual:eliminated-radix',
      "@radix-ui/react-dropdown-menu": '\0virtual:eliminated-radix',
      "@radix-ui/react-popover": '\0virtual:eliminated-radix',
      "@radix-ui/react-select": '\0virtual:eliminated-radix',
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
      // Exclude ALL Radix packages
      "@radix-ui/react-tooltip",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-portal",
      "@radix-ui/react-primitive",
      "@radix-ui/react-use-callback-ref",
      "@radix-ui/react-use-layout-effect",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select"
    ],
    force: true,
  },
  build: {
    rollupOptions: {
      external: (id: string) => {
        // Block any Radix-related imports during build
        if (id.includes('@radix-ui/')) {
          console.log('🚫 Build: Maximum blocking Radix import:', id);
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
    // Eliminate any Radix references
    'global.RadixUI': 'undefined',
    'window.RadixUI': 'undefined',
  },
}));
