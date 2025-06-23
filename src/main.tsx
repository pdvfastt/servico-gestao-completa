
console.log('🚀 main.tsx - NUCLEAR OPTION - Complete tooltip elimination');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// NUCLEAR OPTION - Completely block and replace any tooltip imports
const originalRequire = (window as any).require;
const originalImport = (window as any).import;

// Block require calls
if (originalRequire) {
  (window as any).require = (...args: any[]) => {
    const [specifier] = args;
    if (specifier && specifier.includes('tooltip')) {
      console.log('🚫 NUCLEAR BLOCK require:', specifier);
      return {
        TooltipProvider: () => null,
        Tooltip: () => null,
        TooltipTrigger: () => null,
        TooltipContent: () => null,
        default: {}
      };
    }
    return originalRequire(...args);
  };
}

// Block dynamic imports
if (originalImport) {
  (window as any).import = (...args: any[]) => {
    const [specifier] = args;
    if (specifier && specifier.includes('tooltip')) {
      console.log('🚫 NUCLEAR BLOCK import:', specifier);
      return Promise.resolve({
        TooltipProvider: () => null,
        Tooltip: () => null,
        TooltipTrigger: () => null,
        TooltipContent: () => null,
        default: {}
      });
    }
    return originalImport(...args);
  };
}

// NUCLEAR OPTION - Override module resolution
const originalResolveModule = (window as any).__vite_resolve_module__;
if (originalResolveModule) {
  (window as any).__vite_resolve_module__ = (id: string) => {
    if (id.includes('tooltip')) {
      console.log('🚫 NUCLEAR BLOCK module resolve:', id);
      return Promise.resolve({
        TooltipProvider: () => null,
        Tooltip: () => null,
        TooltipTrigger: () => null,
        TooltipContent: () => null,
        default: {}
      });
    }
    return originalResolveModule(id);
  };
}

// NUCLEAR OPTION - Clear Vite cache and force reload
if (typeof window !== 'undefined') {
  // Clear any cached tooltip modules
  const viteCache = (window as any).__vite__;
  if (viteCache && viteCache.moduleCache) {
    Object.keys(viteCache.moduleCache).forEach(key => {
      if (key.includes('tooltip')) {
        console.log('🗑️ NUCLEAR CLEAR cache:', key);
        delete viteCache.moduleCache[key];
      }
    });
  }
  
  // Set custom tooltip flag
  (window as any).__CUSTOM_TOOLTIP__ = {
    TooltipProvider: ({ children }: { children: React.ReactNode }) => React.createElement('div', { style: { display: 'contents' } }, children),
    Tooltip: ({ children }: { children: React.ReactNode }) => React.createElement('div', { style: { display: 'contents' } }, children),
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => React.createElement('div', { style: { display: 'contents' } }, children),
    TooltipContent: ({ children }: { children: React.ReactNode }) => React.createElement('div', { style: { display: 'none' } }, children),
  };
}

// Ultra defensive React environment check
console.log('🔍 main.tsx - NUCLEAR React system check:', {
  React: !!React,
  ReactVersion: React?.version,
  useState: !!React?.useState,
  ReactDOM: !!ReactDOM,
  ReactDOMClient: !!ReactDOM?.createRoot,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🎯 main.tsx - Starting NUCLEAR React application');

const startApp = () => {
  try {
    // Ensure React is properly loaded
    if (!React || !React.useState || !React.createElement) {
      throw new Error('React not properly loaded');
    }
    
    if (!ReactDOM || !ReactDOM.createRoot) {
      throw new Error('ReactDOM not properly loaded');
    }
    
    console.log('✅ main.tsx - React environment validated');
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('🚀 main.tsx - Rendering App with NUCLEAR protection');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ main.tsx - App rendered successfully');
  } catch (error) {
    console.error('❌ main.tsx - Render error:', error);
    
    // Ultra defensive fallback
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('✅ main.tsx - Fallback render successful');
    } catch (fallbackError) {
      console.error('💥 main.tsx - All renders failed:', fallbackError);
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
          <h1>Application Error</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Fallback Error:</strong> ${fallbackError}</p>
          <p>React Available: ${!!React}</p>
          <p>React Version: ${React?.version || 'Unknown'}</p>
          <p>useState Available: ${!!React?.useState}</p>
          <p>ReactDOM Available: ${!!ReactDOM}</p>
        </div>
      `;
    }
  }
};

// Start app when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
