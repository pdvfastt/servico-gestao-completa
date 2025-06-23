
console.log('main.tsx - Starting React application with COMPLETE tooltip isolation');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - React imported successfully:', {
  React: !!React,
  ReactVersion: React.version,
  useState: !!React.useState,
  ReactDOM: !!ReactDOM
});

// Aggressive cleanup function
const cleanup = () => {
  // Remove any potential duplicate React instances
  Object.keys(window).forEach((key) => {
    if (key.includes('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
      delete (window as any)[key];
    }
    if (key.includes('__RADIX__')) {
      delete (window as any)[key];
    }
  });
  
  // Clear any cached imports
  if ((window as any).__VITE_TOOLTIP_CACHE__) {
    delete (window as any).__VITE_TOOLTIP_CACHE__;
  }
  
  console.log('main.tsx - Cleanup completed');
};

cleanup();

// Block any tooltip-related imports completely
const originalImport = (window as any).__vitePreload;
if (originalImport) {
  (window as any).__vitePreload = (...args: any[]) => {
    const [url] = args;
    if (url && typeof url === 'string' && url.includes('tooltip')) {
      console.log('🚫 BLOCKED TOOLTIP IMPORT:', url);
      return Promise.resolve({});
    }
    return originalImport.apply(window, args);
  };
}

// Enhanced error logging
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('tooltip') || args[0].includes('radix') || args[0].includes('useState')) {
      console.log('🚨 CRITICAL ERROR DETECTED:', args);
      console.log('🔍 Error analysis:', {
        isTooltipError: args[0].includes('tooltip'),
        isRadixError: args[0].includes('radix'),
        isHookError: args[0].includes('useState'),
        reactAvailable: !!React,
        windowReact: !!(window as any).React
      });
    }
  }
  originalConsoleError.apply(console, args);
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('main.tsx - Creating React root with complete isolation');

const startApp = () => {
  try {
    console.log('main.tsx - Final React check before render:', {
      React: !!React,
      ReactVersion: React.version,
      useState: !!React.useState,
      ReactDOM: !!ReactDOM,
      windowReact: !!(window as any).React
    });
    
    // Ensure React is properly attached to window for debugging
    (window as any).React = React;
    (window as any).ReactDOM = ReactDOM;
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('main.tsx - Rendering App component with tooltip isolation');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('main.tsx - App rendered successfully with no tooltip dependencies');
  } catch (error) {
    console.error('main.tsx - Error rendering app:', error);
    
    // Enhanced fallback render
    try {
      console.log('main.tsx - Attempting fallback render without StrictMode');
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('main.tsx - Fallback render successful');
    } catch (fallbackError) {
      console.error('main.tsx - Fallback render failed:', fallbackError);
      
      // Ultimate fallback - show error message
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
          <h1>Application Failed to Load</h1>
          <h2>React Hook Error Detected</h2>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Fallback Error:</strong> ${fallbackError}</p>
          <hr>
          <h3>Debug Information:</h3>
          <pre>
React Available: ${!!React}
React Version: ${React?.version || 'Unknown'}
useState Available: ${!!React?.useState}
Window React: ${!!(window as any).React}
          </pre>
        </div>
      `;
    }
  }
};

// Start with longer delay to ensure everything is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startApp, 300);
  });
} else {
  setTimeout(startApp, 300);
}
