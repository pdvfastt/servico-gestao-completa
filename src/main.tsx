
import React from "react";
import ReactDOM from "react-dom/client";

// CRITICAL: Set React globally BEFORE any dynamic imports or async operations
const setupReactGlobally = () => {
  // Ensure React is available on all possible global objects
  const globalTargets = [window, globalThis, self];
  
  globalTargets.forEach(target => {
    if (target && typeof target === 'object') {
      // Set React itself
      (target as any).React = React;
      (target as any).react = React;
      
      // Set all React hooks individually for maximum compatibility
      (target as any).useState = React.useState;
      (target as any).useEffect = React.useEffect;
      (target as any).useContext = React.useContext;
      (target as any).useRef = React.useRef;
      (target as any).useMemo = React.useMemo;
      (target as any).useCallback = React.useCallback;
      (target as any).useReducer = React.useReducer;
      (target as any).useLayoutEffect = React.useLayoutEffect;
      (target as any).useImperativeHandle = React.useImperativeHandle;
      (target as any).useDebugValue = React.useDebugValue;
      (target as any).useDeferredValue = React.useDeferredValue;
      (target as any).useTransition = React.useTransition;
      (target as any).useId = React.useId;
      (target as any).useSyncExternalStore = React.useSyncExternalStore;
      (target as any).useInsertionEffect = React.useInsertionEffect;
      
      // Set React utilities
      (target as any).createContext = React.createContext;
      (target as any).forwardRef = React.forwardRef;
      (target as any).memo = React.memo;
      (target as any).createElement = React.createElement;
      (target as any).cloneElement = React.cloneElement;
      (target as any).Fragment = React.Fragment;
      (target as any).StrictMode = React.StrictMode;
      (target as any).Suspense = React.Suspense;
      (target as any).lazy = React.lazy;
    }
  });
};

// Call setup immediately and synchronously
setupReactGlobally();

// Also try to intercept require calls if available
if (typeof require !== 'undefined') {
  try {
    // Monkey patch require to always return our React for react modules
    const originalRequire = require;
    (window as any).require = function(id: string) {
      if (id === 'react' || id === 'React') {
        return React;
      }
      return originalRequire.apply(this, arguments);
    };
  } catch (e) {
    console.log('Could not monkey patch require:', e);
  }
}

// Set up a module resolver that always returns our React
if (typeof window !== 'undefined') {
  // Try to intercept any module resolution
  (window as any).__REACT__ = React;
  (window as any).__react__ = React;
  
  // Set on various module systems
  if ((window as any).define && (window as any).define.amd) {
    (window as any).define('react', [], () => React);
  }
}

// Call setup again to ensure it persists
setupReactGlobally();

console.log('main.tsx - React setup completed');
console.log('main.tsx - React version:', React.version);
console.log('main.tsx - React available globally:', !!(window as any).React);
console.log('main.tsx - useState available:', typeof (window as any).useState);
console.log('main.tsx - useEffect available:', typeof (window as any).useEffect);

// Now import other modules
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - Starting React application');

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
