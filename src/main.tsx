
import React from "react";
import ReactDOM from "react-dom/client";

// Simple but effective React global setup
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).react = React;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
  (globalThis as any).react = React;
}

// Now import other modules after React is globally available
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx - Starting React application');
console.log('main.tsx - React version:', React.version);
console.log('main.tsx - React set globally on window:', !!(window as any).React);

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
