
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - Starting React application');
console.log('main.tsx - React version:', React.version);
console.log('main.tsx - React instance:', React);
console.log('main.tsx - React.useState available:', !!React.useState);
console.log('main.tsx - React.useEffect available:', !!React.useEffect);

// Ensure React is available globally before any components load
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  console.log('main.tsx - Set React on window object');
}

// Make React available globally for all modules
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
  (globalThis as any).ReactDOM = ReactDOM;
  console.log('main.tsx - Set React on globalThis object');
}

// Additional safety check
const reactCheck = () => {
  console.log('React safety check:');
  console.log('- React available:', !!React);
  console.log('- React.useState available:', !!React?.useState);
  console.log('- React.useEffect available:', !!React?.useEffect);
  console.log('- Window.React available:', !!(window as any)?.React);
  console.log('- GlobalThis.React available:', !!(globalThis as any)?.React);
};

reactCheck();

// Force React into global scope for Radix UI components
try {
  if (typeof global === 'undefined') {
    (window as any).global = globalThis;
  }
  (global as any).React = React;
  console.log('main.tsx - Set React on global object');
} catch (e) {
  console.log('main.tsx - Could not set React on global object:', e);
}

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
