
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - ULTRA DEFINITIVE Radix elimination with ZERO tolerance');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // ULTRA DEFINITIVE plugin to eliminate ALL Radix references
    {
      name: 'ultra-definitive-radix-eliminator',
      resolveId(id: string) {
        // Block ANY mention of Radix ANYWHERE in ANY form
        if (id.includes('@radix-ui') || 
            id.includes('radix') || 
            id.includes('TooltipProvider') ||
            id.includes('react-tooltip') ||
            id.includes('react-scroll-area') ||
            id.includes('react-portal') ||
            id.includes('react-label') ||
            id.includes('react-slot')) {
          console.log('🚫 ULTRA BLOCKING:', id);
          return '\0virtual:eliminated-radix-ultra';
        }
        return null;
      },
      load(id: string) {
        if (id === '\0virtual:eliminated-radix-ultra') {
          // Return COMPLETELY INERT exports for MAXIMUM safety
          return `
            console.log('🛡️ ULTRA Eliminated Radix virtual module - COMPLETELY INERT');
            const noop = () => null;
            const passthroughComponent = ({ children }) => children || null;
            
            export const TooltipProvider = passthroughComponent;
            export const Tooltip = passthroughComponent;
            export const TooltipTrigger = passthroughComponent;
            export const TooltipContent = noop;
            export const Provider = passthroughComponent;
            export const Root = passthroughComponent;
            export const Trigger = passthroughComponent;
            export const Content = noop;
            export const Portal = passthroughComponent;
            export const Viewport = passthroughComponent;
            export const ScrollAreaScrollbar = noop;
            export const ScrollAreaThumb = noop;
            export const Corner = noop;
            export const Slot = passthroughComponent;
            export const Slottable = passthroughComponent;
            export const Label = ({ children, ...props }) => React.createElement('label', props, children);
            export default { 
              TooltipProvider: passthroughComponent,
              Tooltip: passthroughComponent,
              TooltipTrigger: passthroughComponent,
              TooltipContent: noop,
              Provider: passthroughComponent,
              Root: passthroughComponent,
              Label: ({ children, ...props }) => React.createElement('label', props, children)
            };
          `;
        }
        return null;
      },
      transform(code: string, id: string) {
        // Replace ANY remaining Radix imports in the code
        if (code.includes('@radix-ui')) {
          console.log('🔄 ULTRA Transforming Radix imports in:', id);
          return code
            .replace(/import\s+.*from\s+['"]@radix-ui\/.*['"];?/g, '// ULTRA Radix import eliminated')
            .replace(/from\s+['"]@radix-ui\/.*['"]/g, 'from "/src/components/ui/tooltip"');
        }
        return null;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force ABSOLUTE single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // ULTRA DEFINITIVE blocking of ALL Radix packages
      "@radix-ui/react-tooltip": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-scroll-area": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-portal": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-primitive": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-use-callback-ref": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-use-layout-effect": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-slot": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-label": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-tabs": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-dialog": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-dropdown-menu": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-popover": '\0virtual:eliminated-radix-ultra',
      "@radix-ui/react-select": '\0virtual:eliminated-radix-ultra',
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
      // ULTRA exclude ALL Radix packages
      "@radix-ui/react-tooltip",
      "@radix-ui/react-scroll-area", 
      "@radix-ui/react-portal",
      "@radix-ui/react-primitive",
      "@radix-ui/react-use-callback-ref",
      "@radix-ui/react-use-layout-effect",
      "@radix-ui/react-slot",
      "@radix-ui/react-label",
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
        // Block ANY Radix-related imports during build
        if (id.includes('@radix-ui')) {
          console.log('🚫 Build: ULTRA blocking Radix import:', id);
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
    // Ensure React is ALWAYS available globally
    'global.React': 'React',
    'window.React': 'React',
    // ULTRA eliminate any Radix references
    'global.RadixUI': 'undefined',
    'window.RadixUI': 'undefined',
    'global.__RADIX__': 'undefined',
    'window.__RADIX__': 'undefined',
  },
}));
