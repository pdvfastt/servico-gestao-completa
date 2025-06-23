
console.log('main.tsx - Starting React application');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - React imported, version:', React.version);
console.log('main.tsx - React object:', React);
console.log('main.tsx - useState available:', !!React.useState);

// Ensure we have a clean state
const cleanup = () => {
  // Remove any potential duplicate React instances
  Object.keys(window).forEach((key) => {
    if (key.includes('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
      delete (window as any)[key];
    }
  });
  
  // Clear any cached tooltip imports
  if ((window as any).__VITE_TOOLTIP_CACHE__) {
    delete (window as any).__VITE_TOOLTIP_CACHE__;
  }
};

cleanup();

// Log any module loading errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('tooltip')) {
    console.log('🚨 TOOLTIP ERROR DETECTED:', args);
  }
  originalConsoleError.apply(console, args);
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('main.tsx - Creating React root');

// Additional safety check with timeout to ensure React is fully loaded
const startApp = () => {
  try {
    console.log('main.tsx - React check before render:', {
      React: !!React,
      ReactVersion: React.version,
      useState: !!React.useState,
      ReactDOM: !!ReactDOM,
      windowReact: !!(window as any).React
    });
    
    // Ensure React is properly attached to window for debugging
    (window as any).React = React;
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('main.tsx - Rendering App component');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('main.tsx - App rendered successfully');
  } catch (error) {
    console.error('main.tsx - Error rendering app:', error);
    // Fallback render without StrictMode
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('main.tsx - App rendered successfully (without StrictMode)');
    } catch (fallbackError) {
      console.error('main.tsx - Fallback render also failed:', fallbackError);
      // Last resort - render a simple div
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red;">
          <h1>Application Failed to Load</h1>
          <p>React Hook Error Detected</p>
          <pre>${fallbackError}</pre>
        </div>
      `;
    }
  }
};

// Ensure everything is ready with a longer delay
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(startApp, 100);
  });
} else {
  setTimeout(startApp, 100);
}
