
console.log('🚀 main.tsx - SIMPLE React setup v4');

// Import React first and ensure it's globally available
import React from "react";
import { createRoot } from "react-dom/client";

// Make React globally available for all packages
(window as any).React = React;
(globalThis as any).React = React;

console.log('✅ React made globally available:', {
  React: !!React,
  useEffect: !!React.useEffect,
  useState: !!React.useState,
  windowReact: !!(window as any).React,
  globalReact: !!(globalThis as any).React
});

// Now import other modules
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ main.tsx - App rendered successfully v4');
