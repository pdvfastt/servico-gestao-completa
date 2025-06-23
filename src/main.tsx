
import React from "react";
import { createRoot } from "react-dom/client";

console.log('🚀 main.tsx - NUCLEAR React setup v2');

// NUCLEAR: Ensure React is available globally BEFORE any other imports
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = { createRoot };
  console.log('✅ React set globally on window:', !!window.React);
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
  (globalThis as any).ReactDOM = { createRoot };
  console.log('✅ React set globally on globalThis:', !!globalThis.React);
}

// NUCLEAR: Validate React before proceeding
if (!React || !React.useEffect || !React.useState || !React.createElement) {
  console.error('❌ React not properly loaded - aborting');
  throw new Error('React hooks not available - check React configuration');
}

console.log('🔍 React nuclear validation:', {
  React: !!React,
  createElement: !!React.createElement,
  useEffect: !!React.useEffect,
  useState: !!React.useState,
  createContext: !!React.createContext,
  Component: !!React.Component
});

// Import App AFTER React is globally available
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

console.log('✅ main.tsx - App rendered with nuclear React setup v2');
