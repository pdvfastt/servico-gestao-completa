
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

console.log('🔧 vite.config.ts - NUCLEAR React resolution v2');

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
        // NUCLEAR: Force ALL React-related packages to use the same instance
        "react": path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
        "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
        // NUCLEAR: Force React Query to use our React instance
        "@tanstack/react-query": path.resolve(__dirname, "./node_modules/@tanstack/react-query"),
        // NUCLEAR: Replace ALL problematic Radix components
        "@radix-ui/react-tooltip": path.resolve(__dirname, "./src/components/ui/tooltip.tsx"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
    },
    optimizeDeps: {
      include: [
        "react", 
        "react-dom", 
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query"
      ],
      exclude: [
        "@radix-ui/react-tooltip"
      ],
      force: true,
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    define: {
      'global': 'globalThis',
      // NUCLEAR: Ensure React is available everywhere
      '__REACT__': 'React',
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      define: {
        global: 'globalThis',
      },
    },
    build: {
      rollupOptions: {
        external: [],
        output: {
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          }
        }
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    }
  };
});
