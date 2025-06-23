
console.log('🚀 main.tsx - NUCLEAR React application with COMPLETE Radix elimination');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🔍 main.tsx - React system check:', {
  React: !!React,
  ReactVersion: React.version,
  useState: !!React.useState,
  ReactDOM: !!ReactDOM,
  windowReact: !!(window as any).React
});

// NUCLEAR cleanup and blocking
const nuclearCleanup = () => {
  console.log('☢️ Starting NUCLEAR cleanup');
  
  // Ensure React is globally available BEFORE anything else
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  
  // Remove any potential React duplicates
  Object.keys(window).forEach((key) => {
    if (key.includes('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
      delete (window as any)[key];
    }
    if (key.includes('__RADIX__') || key.includes('radix')) {
      delete (window as any)[key];
    }
    if (key.includes('tooltip') || key.includes('toast')) {
      delete (window as any)[key];
    }
  });
  
  // Clear ALL potential caches
  const cacheKeys = [
    '__VITE_TOOLTIP_CACHE__',
    '__VITE_TOAST_CACHE__',
    '__VITE_RADIX_CACHE__',
    '__webpack_require__',
    '__vite_preload__'
  ];
  
  cacheKeys.forEach(key => {
    if ((window as any)[key]) {
      delete (window as any)[key];
    }
  });
  
  console.log('✅ NUCLEAR cleanup completed');
};

nuclearCleanup();

// NUCLEAR import blocking
const originalImport = (window as any).__vitePreload;
if (originalImport) {
  (window as any).__vitePreload = (...args: any[]) => {
    const [url] = args;
    if (url && typeof url === 'string') {
      if (url.includes('radix') || url.includes('tooltip') || url.includes('@radix-ui')) {
        console.log('🚫 NUCLEAR BLOCKED IMPORT:', url);
        return Promise.resolve({});
      }
    }
    return originalImport.apply(window, args);
  };
}

// Block dynamic imports completely
const originalDynamicImport = (window as any).import;
if (originalDynamicImport) {
  (window as any).import = (url: string) => {
    if (url.includes('radix') || url.includes('tooltip') || url.includes('@radix-ui')) {
      console.log('🚫 NUCLEAR BLOCKED DYNAMIC IMPORT:', url);
      return Promise.resolve({});
    }
    return originalDynamicImport(url);
  };
}

// NUCLEAR error capture and analysis
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('radix') || args[0].includes('tooltip') || args[0].includes('useState')) {
      console.log('🚨 NUCLEAR ERROR ANALYSIS:', {
        error: args[0],
        isRadixError: args[0].includes('radix'),
        isTooltipError: args[0].includes('tooltip'),
        isHookError: args[0].includes('useState'),
        reactState: {
          available: !!React,
          version: React?.version,
          hooks: !!React?.useState,
          windowReact: !!(window as any).React
        }
      });
    }
  }
  originalConsoleError.apply(console, args);
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🎯 main.tsx - Starting React application with NUCLEAR Radix elimination');

const startApp = () => {
  try {
    console.log('🔍 main.tsx - NUCLEAR system check before render:', {
      React: !!React,
      ReactVersion: React.version,
      useState: !!React.useState,
      ReactDOM: !!ReactDOM,
      windowReact: !!(window as any).React,
      customTooltip: !!(window as any).__CUSTOM_TOOLTIP_STANDALONE__,
      customToast: !!(window as any).__CUSTOM_TOAST_STANDALONE__
    });
    
    // TRIPLE ensure React is globally available
    if (!React || !React.useState) {
      throw new Error('React or useState not available');
    }
    
    (window as any).React = React;
    (window as any).ReactDOM = ReactDOM;
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('🚀 main.tsx - Rendering App with NUCLEAR Radix elimination');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ main.tsx - App rendered successfully with NUCLEAR elimination');
  } catch (error) {
    console.error('❌ main.tsx - NUCLEAR render error:', error);
    
    // NUCLEAR fallback
    try {
      console.log('🔄 main.tsx - Attempting NUCLEAR emergency fallback render');
      
      // Force React availability
      if (!React) {
        throw new Error('React not available for fallback');
      }
      
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('✅ main.tsx - NUCLEAR emergency fallback successful');
    } catch (fallbackError) {
      console.error('💥 main.tsx - NUCLEAR emergency fallback failed:', fallbackError);
      
      // Show NUCLEAR error information
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif; background: #fff;">
          <h1>☢️ NUCLEAR Application Error</h1>
          <h2>React Hook System Complete Failure</h2>
          <p><strong>Primary Error:</strong> ${error}</p>
          <p><strong>Fallback Error:</strong> ${fallbackError}</p>
          <hr>
          <h3>🔍 NUCLEAR Debug Information:</h3>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">
React Available: ${!!React}
React Version: ${React?.version || 'Unknown'}
useState Available: ${!!React?.useState}
Window React: ${!!(window as any).React}
Custom Tooltip: ${!!(window as any).__CUSTOM_TOOLTIP_STANDALONE__}
Custom Toast: ${!!(window as any).__CUSTOM_TOAST_STANDALONE__}
          </pre>
          <p style="margin-top: 20px; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
            <strong>☢️ NUCLEAR OPTION: All Radix UI components have been completely eliminated. This should have resolved all React hooks conflicts.</strong>
          </p>
        </div>
      `;
    }
  }
};

// Start with maximum delay for NUCLEAR compatibility
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startApp, 1000);
  });
} else {
  setTimeout(startApp, 1000);
}
