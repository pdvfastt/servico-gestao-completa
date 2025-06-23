
import React from "react";
import ReactDOM from "react-dom/client";

// CRITICAL: Ensure React is available globally BEFORE any other imports
// This must be done synchronously and immediately
const ensureReactGlobal = () => {
  // Set React on all possible global contexts
  const globals = [
    typeof window !== 'undefined' ? window : null,
    typeof globalThis !== 'undefined' ? globalThis : null,
    typeof global !== 'undefined' ? global : null,
    typeof self !== 'undefined' ? self : null
  ].filter(Boolean);

  globals.forEach(globalObj => {
    if (globalObj && typeof globalObj === 'object') {
      (globalObj as any).React = React;
      (globalObj as any).react = React;
      // Also set individual hooks for maximum compatibility
      (globalObj as any).useState = React.useState;
      (globalObj as any).useEffect = React.useEffect;
      (globalObj as any).useContext = React.useContext;
      (globalObj as any).useRef = React.useRef;
      (globalObj as any).useMemo = React.useMemo;
      (globalObj as any).useCallback = React.useCallback;
      (globalObj as any).useReducer = React.useReducer;
      (globalObj as any).createContext = React.createContext;
      (globalObj as any).forwardRef = React.forwardRef;
      (globalObj as any).memo = React.memo;
      (globalObj as any).createElement = React.createElement;
      (globalObj as any).Fragment = React.Fragment;
    }
  });
};

// Call it multiple times to ensure it sticks
ensureReactGlobal();
ensureReactGlobal();

// Also try to hijack the module system if possible
if (typeof require !== 'undefined' && require.cache) {
  try {
    // Try to ensure React is in the module cache
    const reactModule = { exports: React, default: React };
    if (require.cache['react']) {
      require.cache['react'].exports = React;
    }
  } catch (e) {
    // Ignore errors in module cache manipulation
    console.log('Could not set React in require cache:', e);
  }
}

// Set it one more time after potential module operations
ensureReactGlobal();

// Now import other modules after React is globally available
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - Starting React application');
console.log('main.tsx - React version:', React.version);
console.log('main.tsx - React set globally on window:', !!(window as any).React);
console.log('main.tsx - useState available globally:', typeof (window as any).useState === 'function');

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('main.tsx - Creating React root');
const root = ReactDOM.createRoot(rootElement);

console.log('main.tsx - Rendering App component');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('main.tsx - App rendered successfully');
