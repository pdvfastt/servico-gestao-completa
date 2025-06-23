
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log('🔧 vite.config.ts - Clean configuration without Radix dependencies');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react()];
  
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
    define: {
      'global.React': 'React',
      'window.React': 'React',
    },
  };
});
