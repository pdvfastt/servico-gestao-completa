
import React from "react";
import ReactDOM from "react-dom/client";

// CRITICAL: Set React globally BEFORE any other imports
const setupReactGlobally = () => {
  const reactObj = React;
  
  // Function to set React on all possible global objects
  const setOnGlobal = (globalObj: any, key: string) => {
    if (globalObj && typeof globalObj === 'object') {
      globalObj[key] = reactObj;
      
      // Set all React hooks individually for compatibility
      globalObj.useState = reactObj.useState;
      globalObj.useEffect = reactObj.useEffect;
      globalObj.useContext = reactObj.useContext;
      globalObj.useRef = reactObj.useRef;
      globalObj.useMemo = reactObj.useMemo;
      globalObj.useCallback = reactObj.useCallback;
      globalObj.useReducer = reactObj.useReducer;
      globalObj.createContext = reactObj.createContext;
      globalObj.forwardRef = reactObj.forwardRef;
      globalObj.memo = reactObj.memo;
      globalObj.createElement = reactObj.createElement;
      globalObj.Fragment = reactObj.Fragment;
      globalObj.Component = reactObj.Component;
      globalObj.PureComponent = reactObj.PureComponent;
    }
  };
  
  // Set on multiple global objects
  if (typeof window !== 'undefined') {
    setOnGlobal(window, 'React');
    setOnGlobal(window, 'react');
  }
  
  if (typeof globalThis !== 'undefined') {
    setOnGlobal(globalThis, 'React');
    setOnGlobal(globalThis, 'react');
  }
  
  if (typeof global !== 'undefined') {
    setOnGlobal(global, 'React');
    setOnGlobal(global, 'react');
  }
  
  // Also try to set on self (for web workers compatibility)
  if (typeof self !== 'undefined') {
    setOnGlobal(self, 'React');
    setOnGlobal(self, 'react');
  }
};

// Call setup function multiple times to ensure it sticks
setupReactGlobally();
setupReactGlobally();
setupReactGlobally();

// Also set it on the module system if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports.React = React;
}

// Wait a bit to ensure React is fully set before importing other modules
await new Promise(resolve => setTimeout(resolve, 10));

// Now import other modules after React is globally available
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - Starting React application');
console.log('main.tsx - React version:', React.version);
console.log('main.tsx - React hooks available:', typeof React.useState === 'function');
console.log('main.tsx - React set globally on window:', !!(window as any).React);
console.log('main.tsx - useState globally available:', typeof (window as any).useState === 'function');

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
