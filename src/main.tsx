
import React from "react";
import ReactDOM from "react-dom/client";

// CRITICAL: Aggressively set React globally IMMEDIATELY and repeatedly
// This must be the absolute first thing that happens
const setReactGlobally = () => {
  const reactObj = React;
  
  // Set on window
  if (typeof window !== 'undefined') {
    (window as any).React = reactObj;
    (window as any).react = reactObj;
    
    // Set all React hooks individually
    (window as any).useState = reactObj.useState;
    (window as any).useEffect = reactObj.useEffect;
    (window as any).useContext = reactObj.useContext;
    (window as any).useRef = reactObj.useRef;
    (window as any).useMemo = reactObj.useMemo;
    (window as any).useCallback = reactObj.useCallback;
    (window as any).useReducer = reactObj.useReducer;
    (window as any).createContext = reactObj.createContext;
    (window as any).forwardRef = reactObj.forwardRef;
    (window as any).memo = reactObj.memo;
  }
  
  // Set on globalThis
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).React = reactObj;
    (globalThis as any).react = reactObj;
    
    // Set all React hooks individually
    (globalThis as any).useState = reactObj.useState;
    (globalThis as any).useEffect = reactObj.useEffect;
    (globalThis as any).useContext = reactObj.useContext;
    (globalThis as any).useRef = reactObj.useRef;
    (globalThis as any).useMemo = reactObj.useMemo;
    (globalThis as any).useCallback = reactObj.useCallback;
    (globalThis as any).useReducer = reactObj.useReducer;
    (globalThis as any).createContext = reactObj.createContext;
    (globalThis as any).forwardRef = reactObj.forwardRef;
    (globalThis as any).memo = reactObj.memo;
  }
  
  // Set on global (Node.js compatibility)
  if (typeof global !== 'undefined') {
    (global as any).React = reactObj;
    (global as any).react = reactObj;
    
    // Set all React hooks individually
    (global as any).useState = reactObj.useState;
    (global as any).useEffect = reactObj.useEffect;
    (global as any).useContext = reactObj.useContext;
    (global as any).useRef = reactObj.useRef;
    (global as any).useMemo = reactObj.useMemo;
    (global as any).useCallback = reactObj.useCallback;
    (global as any).useReducer = reactObj.useReducer;
    (global as any).createContext = reactObj.createContext;
    (global as any).forwardRef = reactObj.forwardRef;
    (global as any).memo = reactObj.memo;
  }
};

// Call it multiple times to ensure it sticks
setReactGlobally();
setReactGlobally();
setReactGlobally();

// Also set it on the module system if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports.React = React;
}

// Now import other modules after React is globally available
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - Starting React application');
console.log('main.tsx - React version:', React.version);
console.log('main.tsx - React hooks available:', typeof React.useState === 'function');
console.log('main.tsx - React set globally:', !!(window as any).React);
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
