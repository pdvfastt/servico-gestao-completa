
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// CRITICAL: Set React globally BEFORE any other imports or operations
// This prevents Radix UI components from getting null React references
(window as any).React = React;
(globalThis as any).React = React;

// Force React to be the default export as well for compatibility
if (typeof window !== 'undefined') {
  (window as any).react = React;
  (window as any).React = React;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).react = React;
  (globalThis as any).React = React;
}

// Also set React on the global object for maximum compatibility
if (typeof global !== 'undefined') {
  (global as any).React = React;
  (global as any).react = React;
}

console.log('main.tsx - Starting React application');
console.log('main.tsx - React version:', React.version);
console.log('main.tsx - React hooks available:', typeof React.useState === 'function');
console.log('main.tsx - React set globally:', !!(window as any).React);

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
