
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🚀 main.tsx - AGGRESSIVE React setup');

// Ensure React is available globally and properly imported
if (typeof window !== 'undefined') {
  (window as any).React = React;
  console.log('✅ React set globally:', !!window.React);
}

// Additional global React setup for libraries
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🔍 React availability check:', {
  React: !!React,
  createElement: !!React.createElement,
  useEffect: !!React.useEffect,
  useState: !!React.useState
});

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ main.tsx - App rendered with aggressive React setup');
