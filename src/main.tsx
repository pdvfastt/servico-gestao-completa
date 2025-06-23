
import React from "react";
import ReactDOM from "react-dom/client";

// CRITICAL: Set React globally IMMEDIATELY before any other imports
// This must happen before any Radix UI components are imported
(window as any).React = React;
(globalThis as any).React = React;

// Set React as both React and react for maximum compatibility
if (typeof window !== 'undefined') {
  (window as any).react = React;
  (window as any).React = React;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).react = React;
  (globalThis as any).React = React;
}

// Also set React on the global object for Node.js compatibility
if (typeof global !== 'undefined') {
  (global as any).React = React;
  (global as any).react = React;
}

// Force all React hooks to be available globally
if (typeof window !== 'undefined') {
  (window as any).useState = React.useState;
  (window as any).useEffect = React.useEffect;
  (window as any).useContext = React.useContext;
  (window as any).createContext = React.createContext;
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
