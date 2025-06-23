
import React from "react";
import { createRoot } from "react-dom/client";

console.log('🚀 main.tsx - Clean React setup v3');

// Simple validation that React is properly loaded
if (!React || !React.useEffect || !React.useState || !React.createElement) {
  console.error('❌ React not properly loaded');
  throw new Error('React hooks not available - check React configuration');
}

console.log('✅ React validation passed:', {
  React: !!React,
  createElement: !!React.createElement,
  useEffect: !!React.useEffect,
  useState: !!React.useState,
  createContext: !!React.createContext,
  Component: !!React.Component
});

// Import App AFTER React validation
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

console.log('✅ main.tsx - App rendered successfully v3');
