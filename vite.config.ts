
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

console.log('🔧 vite.config.ts - Clean configuration without Radix dependencies');

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
        // Force React paths
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "@tanstack/react-query"],
      force: true,
    },
    build: {
      rollupOptions: {
        external: (id: string) => {
          // Block any remaining radix modules at build time
          if (id.includes('@radix-ui') || id.includes('radix')) {
            console.log('🚫 Build blocking Radix module:', id);
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
  };
});
