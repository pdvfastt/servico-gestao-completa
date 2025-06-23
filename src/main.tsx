
console.log('🚀 main.tsx - React application starting with COMPLETE tooltip protection');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// COMPLETE protection - block any tooltip imports at runtime
const originalImport = (window as any).__vitePreload;
if (originalImport) {
  (window as any).__vitePreload = (...args: any[]) => {
    const [url] = args;
    if (url && (url.includes('tooltip') || url.includes('@radix-ui/react-tooltip') || url.includes('radix') && url.includes('tooltip'))) {
      console.log('🚫 COMPLETE RUNTIME BLOCK - tooltip import:', url);
      return Promise.resolve({});
    }
    return originalImport(...args);
  };
}

// Block any dynamic imports of tooltip
const originalDynamicImport = (window as any).__dynamicImportHandler;
if (typeof window !== 'undefined') {
  (window as any).__dynamicImportHandler = (specifier: string) => {
    if (specifier.includes('tooltip') || specifier.includes('@radix-ui/react-tooltip') || (specifier.includes('radix') && specifier.includes('tooltip'))) {
      console.log('🚫 COMPLETE DYNAMIC IMPORT BLOCK - tooltip:', specifier);
      return Promise.resolve({
        TooltipProvider: () => null,
        Tooltip: () => null,
        TooltipTrigger: () => null,
        TooltipContent: () => null
      });
    }
    return originalDynamicImport ? originalDynamicImport(specifier) : import(specifier);
  };
}

// Block any CommonJS requires
if (typeof window !== 'undefined') {
  const originalRequire = (window as any).require;
  if (originalRequire) {
    (window as any).require = (id: string) => {
      if (id.includes('tooltip') || id.includes('@radix-ui/react-tooltip') || (id.includes('radix') && id.includes('tooltip'))) {
        console.log('🚫 COMPLETE REQUIRE BLOCK - tooltip:', id);
        return {
          TooltipProvider: () => null,
          Tooltip: () => null,
          TooltipTrigger: () => null,
          TooltipContent: () => null
        };
      }
      return originalRequire(id);
    };
  }
}

console.log('🔍 main.tsx - React system check:', {
  React: !!React,
  ReactVersion: React.version,
  useState: !!React.useState,
  ReactDOM: !!ReactDOM,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🎯 main.tsx - Starting React application with COMPLETE tooltip protection');

const startApp = () => {
  try {
    console.log('🔍 main.tsx - System check before render:', {
      React: !!React,
      ReactVersion: React.version,
      useState: !!React.useState,
      ReactDOM: !!ReactDOM,
      tooltipBlocked: !!(window as any).__RADIX_TOOLTIP_BLOCKED__,
      completeProtection: !!(window as any).__NO_RADIX_TOOLTIP__,
    });
    
    // Ensure React is available
    if (!React || !React.useState) {
      throw new Error('React or useState not available');
    }
    
    // Additional React environment validation
    if (typeof React.createElement !== 'function') {
      throw new Error('React.createElement not available');
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('🚀 main.tsx - Rendering App with COMPLETE tooltip protection');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ main.tsx - App rendered successfully with COMPLETE tooltip protection');
  } catch (error) {
    console.error('❌ main.tsx - Render error:', error);
    
    // Simple fallback without StrictMode
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('✅ main.tsx - Fallback successful');
    } catch (fallbackError) {
      console.error('💥 main.tsx - Fallback failed:', fallbackError);
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif; background: #fff;">
          <h1>Application Error</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Fallback Error:</strong> ${fallbackError}</p>
          <p>React: ${!!React} | useState: ${!!React?.useState}</p>
          <p>Tooltip Blocked: ${!!(window as any).__RADIX_TOOLTIP_BLOCKED__}</p>
          <p>Complete Protection: ${!!(window as any).__NO_RADIX_TOOLTIP__}</p>
        </div>
      `;
    }
  }
};

// Start immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
