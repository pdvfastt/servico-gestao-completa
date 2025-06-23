
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

console.log('🔧 vite.config.ts - ULTIMATE React resolution v3');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [
    react({
      // Force React to be imported from our exact instance
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
        // ULTIMATE: Force ALL React-related packages to use the same instance
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
        "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
        // ULTIMATE: Force React Query to use our React instance
        "@tanstack/react-query": path.resolve(__dirname, "./node_modules/@tanstack/react-query"),
      },
      // ULTIMATE: Dedupe all React-related packages
      dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
    },
    optimizeDeps: {
      // ULTIMATE: Include all React packages in optimization
      include: [
        "react", 
        "react-dom", 
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query"
      ],
      // ULTIMATE: Force optimization
      force: true,
      esbuildOptions: {
        // ULTIMATE: Ensure global is available
        define: {
          global: 'globalThis',
        },
        // ULTIMATE: Set JSX configuration
        jsx: 'automatic',
        jsxDev: mode === 'development',
      },
    },
    define: {
      // ULTIMATE: Define globals
      'global': 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    esbuild: {
      // ULTIMATE: JSX configuration
      jsx: 'automatic',
      jsxDev: mode === 'development',
      define: {
        global: 'globalThis',
      },
    },
    build: {
      // ULTIMATE: Rollup configuration for consistent React usage
      rollupOptions: {
        external: [],
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          }
        }
      },
      // ULTIMATE: CommonJS options
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    }
  };
});
