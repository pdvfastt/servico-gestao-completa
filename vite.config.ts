
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

console.log('🔧 vite.config.ts - NUCLEAR BLOCKING of all Radix dependencies');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react()];
  
  // Add componentTagger only in development
  if (mode === 'development') {
    plugins.push(componentTagger());
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Force React paths and block Radix
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        // Block all Radix imports completely
        "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
        "@radix-ui/react-toast": path.resolve(__dirname, "./src/components/ui/toast.tsx"),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "@tanstack/react-query"],
      exclude: ["@radix-ui/react-tooltip", "@radix-ui/react-toast"],
      force: true,
    },
    build: {
      rollupOptions: {
        external: (id: string) => {
          // Nuclear block of ALL Radix modules
          if (id.includes('@radix-ui') || id.includes('radix')) {
            console.log('🚫 NUCLEAR BLOCK: Radix module rejected:', id);
            return true;
          }
          return false;
        },
      },
    },
    define: {
      'global.React': 'React',
      'window.React': 'React',
      // Block any global Radix references
      'global.RadixTooltip': 'undefined',
      'window.RadixTooltip': 'undefined',
    },
  };
});
