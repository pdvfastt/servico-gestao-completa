
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

console.log('🔧 vite.config.ts - AGGRESSIVE React resolution');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    react({
      jsxImportSource: 'react'
    })
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
        // AGGRESSIVE: Force all React-related packages to use the same instance
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
        "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
      },
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: [
        "react", 
        "react-dom", 
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query"
      ],
      force: true,
    },
    define: {
      'global': 'globalThis',
      // Ensure React is available globally
      '__REACT__': 'React',
    },
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    },
  };
});
