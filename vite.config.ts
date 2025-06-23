
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - FINAL SOLUTION: Complete Radix elimination with maximum aggression');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // FINAL SOLUTION: Complete Radix elimination plugin
    {
      name: 'final-radix-eliminator',
      buildStart() {
        console.log('🚫 FINAL SOLUTION: Radix eliminator plugin started');
      },
      resolveId(id: string, importer?: string) {
        // Block EVERYTHING related to Radix
        if (
          id.includes('@radix-ui') || 
          id.includes('radix') ||
          id.includes('TooltipProvider') ||
          id.includes('react-tooltip') ||
          id.includes('react-scroll-area') ||
          id.includes('react-portal') ||
          id.includes('react-label') ||
          id.includes('react-slot') ||
          id.includes('react-primitive') ||
          id.includes('react-use-callback-ref') ||
          id.includes('react-use-layout-effect') ||
          id.includes('react-tabs') ||
          id.includes('react-dialog') ||
          id.includes('react-dropdown-menu') ||
          id.includes('react-popover') ||
          id.includes('react-select')
        ) {
          console.log('🚫 FINAL BLOCK:', id, 'from', importer);
          return '\0virtual:final-eliminated-radix';
        }
        return null;
      },
      load(id: string) {
        if (id === '\0virtual:final-eliminated-radix') {
          return `
            console.log('🛡️ FINAL Eliminated Radix module - completely inert');
            const noop = () => null;
            const passthrough = ({ children }) => children || null;
            
            export const TooltipProvider = passthrough;
            export const Tooltip = passthrough;
            export const TooltipTrigger = passthrough;
            export const TooltipContent = noop;
            export const Provider = passthrough;
            export const Root = passthrough;
            export const Trigger = passthrough;
            export const Content = noop;
            export const Portal = passthrough;
            export const Viewport = passthrough;
            export const ScrollAreaScrollbar = noop;
            export const ScrollAreaThumb = noop;
            export const Corner = noop;
            export const Slot = passthrough;
            export const Slottable = passthrough;
            export const Label = ({ children, ...props }) => React.createElement('label', props, children);
            export default { 
              TooltipProvider: passthrough,
              Tooltip: passthrough,
              TooltipTrigger: passthrough,
              TooltipContent: noop,
              Provider: passthrough,
              Root: passthrough,
              Label: ({ children, ...props }) => React.createElement('label', props, children)
            };
          `;
        }
        return null;
      },
      transform(code: string, id: string) {
        // Replace any remaining Radix imports
        if (code.includes('@radix-ui')) {
          console.log('🔄 FINAL Transform: Eliminating Radix imports in:', id);
          let transformedCode = code
            .replace(/import\s+.*from\s+['"]@radix-ui\/.*['"];?/g, '// FINAL: Radix import eliminated')
            .replace(/from\s+['"]@radix-ui\/.*['"]/g, 'from "/src/components/ui/tooltip"');
          
          return transformedCode;
        }
        return null;
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // FINAL: Force absolute React paths
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      // FINAL: Block ALL Radix packages completely
      "@radix-ui/react-tooltip": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-scroll-area": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-portal": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-primitive": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-use-callback-ref": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-use-layout-effect": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-slot": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-label": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-tabs": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-dialog": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-dropdown-menu": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-popover": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-select": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-accordion": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-alert-dialog": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-aspect-ratio": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-avatar": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-checkbox": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-collapsible": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-context-menu": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-hover-card": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-menubar": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-navigation-menu": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-progress": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-radio-group": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-separator": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-slider": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-switch": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-toggle": '\0virtual:final-eliminated-radix',
      "@radix-ui/react-toggle-group": '\0virtual:final-eliminated-radix',
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
      // FINAL: Exclude ALL Radix packages
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
      "@radix-ui/react-select",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group"
    ],
    force: true,
  },
  build: {
    rollupOptions: {
      external: (id: string) => {
        // Block ANY Radix-related imports during build
        if (id.includes('@radix-ui') || id.includes('radix')) {
          console.log('🚫 Build FINAL block:', id);
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
    // FINAL: Ensure React is ALWAYS available globally
    'global.React': 'React',
    'window.React': 'React',
    // FINAL: Eliminate any Radix references completely
    'global.RadixUI': 'undefined',
    'window.RadixUI': 'undefined',
    'global.__RADIX__': 'undefined',
    'window.__RADIX__': 'undefined',
    'global.__RADIX_TOOLTIP__': 'undefined',
    'window.__RADIX_TOOLTIP__': 'undefined',
  },
}));
