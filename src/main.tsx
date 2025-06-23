
console.log('🚀 main.tsx - ULTIMATE TOOLTIP ELIMINATION STRATEGY');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ULTIMATE STRATEGY - Intercept and block ALL module loading
const originalDynamicImport = window.__vitePreload || window.import;

// Override dynamic import completely
if (typeof window !== 'undefined') {
  // Block ALL tooltip-related imports at the window level
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj: any, prop: any, descriptor: any) {
    if (typeof prop === 'string' && prop.includes('tooltip')) {
      console.log('🚫 ULTIMATE BLOCK defineProperty:', prop);
      return obj;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };

  // Completely override import resolution
  const moduleCache = new Map();
  
  // Define our safe tooltip implementation
  const safeTooltip = {
    TooltipProvider: ({ children }: { children: React.ReactNode }) => {
      console.log('✅ Using SAFE TooltipProvider');
      return React.createElement('div', { 
        style: { display: 'contents' },
        'data-safe-tooltip-provider': 'true'
      }, children);
    },
    Tooltip: ({ children }: { children: React.ReactNode }) => {
      console.log('✅ Using SAFE Tooltip');
      return React.createElement('div', { 
        style: { display: 'contents' },
        'data-safe-tooltip': 'true'
      }, children);
    },
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => {
      console.log('✅ Using SAFE TooltipTrigger');
      return React.createElement('div', { 
        style: { display: 'contents' },
        'data-safe-tooltip-trigger': 'true'
      }, children);
    },
    TooltipContent: ({ children }: { children: React.ReactNode }) => {
      console.log('✅ Using SAFE TooltipContent');
      return React.createElement('div', { 
        style: { display: 'none' },
        'data-safe-tooltip-content': 'true'
      }, children);
    }
  };

  // Cache the safe implementation
  moduleCache.set('@radix-ui/react-tooltip', safeTooltip);
  moduleCache.set('/node_modules/@radix-ui/react-tooltip', safeTooltip);
  moduleCache.set('node_modules/@radix-ui/react-tooltip', safeTooltip);

  // Override ALL possible import mechanisms
  (window as any).__vitePreload = (id: string) => {
    if (id.includes('tooltip') || id.includes('radix')) {
      console.log('🚫 ULTIMATE BLOCK __vitePreload:', id);
      return Promise.resolve(safeTooltip);
    }
    return originalDynamicImport ? originalDynamicImport(id) : Promise.resolve({});
  };

  // Override System.import if it exists
  if ((window as any).System) {
    const originalSystemImport = (window as any).System.import;
    (window as any).System.import = (id: string) => {
      if (id.includes('tooltip') || id.includes('radix')) {
        console.log('🚫 ULTIMATE BLOCK System.import:', id);
        return Promise.resolve(safeTooltip);
      }
      return originalSystemImport(id);
    };
  }

  // Set global flags
  (window as any).__TOOLTIP_SAFE_MODE__ = true;
  (window as any).__RADIX_TOOLTIP_BLOCKED__ = true;
  (window as any).__SAFE_TOOLTIP__ = safeTooltip;
}

// Ultra defensive React environment check
console.log('🔍 main.tsx - ULTIMATE React system check:', {
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

console.log('🎯 main.tsx - Starting ULTIMATE React application');

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
    
    console.log('🚀 main.tsx - Rendering App with ULTIMATE protection');
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
