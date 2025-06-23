
console.log('main.tsx - Starting React application');

// Ensure React is available globally before any imports
if (typeof globalThis !== 'undefined') {
  globalThis.React = globalThis.React || {};
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - React imported, version:', React.version);

// Ensure we have a clean state
const cleanup = () => {
  // Remove any potential duplicate React instances
  Object.keys(window).forEach((key) => {
    if (key.includes('__REACT_DEVTOOLS_GLOBAL_HOOK__')) {
      delete (window as any)[key];
    }
  });
};

cleanup();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('main.tsx - Creating React root');

// Additional safety check
const startApp = () => {
  try {
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
    }
  }
};

// Small delay to ensure everything is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  setTimeout(startApp, 10);
}
