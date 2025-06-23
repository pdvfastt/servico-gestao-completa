
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

console.log('🔧 vite.config.ts - Clean configuration');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    react()
  ];
  
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
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "@tanstack/react-query"],
      force: true,
    },
    define: {
      'global': 'globalThis',
    },
  };
});
