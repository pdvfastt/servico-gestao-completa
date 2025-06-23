
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from "vite";

console.log('🔧 vite.config.ts - NUCLEAR OPTION: Complete Radix elimination');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' ? componentTagger() : false,
    // NUCLEAR OPTION: Block all Radix at the module resolution level
    {
      name: 'nuclear-radix-eliminator',
      enforce: 'pre' as const,
      resolveId(id: string, importer?: string) {
        // Block ANY module that contains radix
        if (id.includes('radix') || id.includes('@radix-ui')) {
          console.log('🚫 NUCLEAR BLOCK:', id, 'from', importer);
          return '\0virtual:eliminated-radix';
        }
        return null;
      },
      load(id: string) {
        if (id === '\0virtual:eliminated-radix') {
          return `
            console.log('🛡️ NUCLEAR: Eliminated Radix module');
            export default {};
            export const TooltipProvider = ({ children }) => children;
            export const Tooltip = ({ children }) => children;
            export const TooltipTrigger = ({ children }) => children;
            export const TooltipContent = () => null;
          `;
        }
        return null;
      },
      transform(code: string, id: string) {
        // Replace any import statements for radix
        if (code.includes('@radix-ui')) {
          console.log('🔄 NUCLEAR Transform: Eliminating Radix imports in:', id);
          return code.replace(/import.*from\s+['"]@radix-ui\/.*['"];?\n?/g, '');
        }
        return null;
      }
    } as Plugin
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force React paths
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      // NUCLEAR: Block all possible Radix entries
      "@radix-ui/react-tooltip": '\0virtual:eliminated-radix',
      "@radix-ui/react-scroll-area": '\0virtual:eliminated-radix',
      "@radix-ui/react-portal": '\0virtual:eliminated-radix',
      "@radix-ui/react-primitive": '\0virtual:eliminated-radix',
      "@radix-ui/react-use-callback-ref": '\0virtual:eliminated-radix',
      "@radix-ui/react-use-layout-effect": '\0virtual:eliminated-radix',
      "@radix-ui/react-slot": '\0virtual:eliminated-radix',
      "@radix-ui/react-label": '\0virtual:eliminated-radix',
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-query"],
    exclude: [
      "@radix-ui/react-tooltip",
      "@radix-ui/react-scroll-area", 
      "@radix-ui/react-portal",
      "@radix-ui/react-primitive",
      "@radix-ui/react-use-callback-ref",
      "@radix-ui/react-use-layout-effect",
      "@radix-ui/react-slot",
      "@radix-ui/react-label",
    ],
    force: true,
  },
  build: {
    rollupOptions: {
      external: (id: string) => {
        if (id.includes('@radix-ui') || id.includes('radix')) {
          console.log('🚫 Build NUCLEAR block:', id);
          return true;
        }
        return false;
      },
    },
  },
  define: {
    'global.React': 'React',
    'window.React': 'React',
  },
}));
