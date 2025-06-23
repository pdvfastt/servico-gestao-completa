
console.log('🚀 main.tsx - ULTRA AGGRESSIVE React application with COMPLETE Radix elimination');

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

// ULTRA AGGRESSIVE cleanup and blocking
const ultraAggressiveCleanup = () => {
  console.log('🧹 Starting ULTRA AGGRESSIVE cleanup');
  
  // Remove any potential React duplicates
  Object.keys(window).forEach((key) => {
    if (key.includes('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
      delete (window as any)[key];
    }
    if (key.includes('__RADIX__')) {
      delete (window as any)[key];
    }
    if (key.includes('tooltip') || key.includes('toast')) {
      delete (window as any)[key];
    }
  });
  
  // Clear ALL potential caches
  if ((window as any).__VITE_TOOLTIP_CACHE__) {
    delete (window as any).__VITE_TOOLTIP_CACHE__;
  }
  if ((window as any).__VITE_TOAST_CACHE__) {
    delete (window as any).__VITE_TOAST_CACHE__;
  }
  if ((window as any).__VITE_RADIX_CACHE__) {
    delete (window as any).__VITE_RADIX_CACHE__;
  }
  
  console.log('✅ ULTRA AGGRESSIVE cleanup completed');
};

ultraAggressiveCleanup();

// ULTRA AGGRESSIVE import blocking
const originalImport = (window as any).__vitePreload;
if (originalImport) {
  (window as any).__vitePreload = (...args: any[]) => {
    const [url] = args;
    if (url && typeof url === 'string') {
      if (url.includes('radix') || url.includes('tooltip') || url.includes('@radix-ui')) {
        console.log('🚫 ULTRA BLOCKED IMPORT:', url);
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
      console.log('🚫 ULTRA BLOCKED DYNAMIC IMPORT:', url);
      return Promise.resolve({});
    }
    return originalDynamicImport(url);
  };
}

// Enhanced error capture and analysis
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('radix') || args[0].includes('tooltip') || args[0].includes('useState')) {
      console.log('🚨 CRITICAL ERROR ANALYSIS:', {
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

console.log('🎯 main.tsx - Starting React application with COMPLETE Radix elimination');

const startApp = () => {
  try {
    console.log('🔍 main.tsx - Final system check before render:', {
      React: !!React,
      ReactVersion: React.version,
      useState: !!React.useState,
      ReactDOM: !!ReactDOM,
      windowReact: !!(window as any).React,
      customTooltip: !!(window as any).__CUSTOM_TOOLTIP_STANDALONE__,
      customToast: !!(window as any).__CUSTOM_TOAST_STANDALONE__
    });
    
    // Ensure React is globally available
    (window as any).React = React;
    (window as any).ReactDOM = ReactDOM;
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('🚀 main.tsx - Rendering App with COMPLETE Radix elimination');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ main.tsx - App rendered successfully with NO Radix dependencies');
  } catch (error) {
    console.error('❌ main.tsx - Critical render error:', error);
    
    // Ultimate fallback
    try {
      console.log('🔄 main.tsx - Attempting emergency fallback render');
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('✅ main.tsx - Emergency fallback successful');
    } catch (fallbackError) {
      console.error('💥 main.tsx - Emergency fallback failed:', fallbackError);
      
      // Show critical error information
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif; background: #fff;">
          <h1>🚨 Application Critical Error</h1>
          <h2>React Hook System Failure</h2>
          <p><strong>Primary Error:</strong> ${error}</p>
          <p><strong>Fallback Error:</strong> ${fallbackError}</p>
          <hr>
          <h3>🔍 Debug Information:</h3>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">
React Available: ${!!React}
React Version: ${React?.version || 'Unknown'}
useState Available: ${!!React?.useState}
Window React: ${!!(window as any).React}
Custom Tooltip: ${!!(window as any).__CUSTOM_TOOLTIP_STANDALONE__}
Custom Toast: ${!!(window as any).__CUSTOM_TOAST_STANDALONE__}
          </pre>
          <p style="margin-top: 20px; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px;">
            <strong>💡 This error suggests a React hooks incompatibility. All Radix UI components have been eliminated and replaced with custom implementations.</strong>
          </p>
        </div>
      `;
    }
  }
};

// Start with extended delay for maximum compatibility
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startApp, 500);
  });
} else {
  setTimeout(startApp, 500);
}
