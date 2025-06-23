
console.log('🚀 main.tsx - Safe startup with enhanced React validation');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Enhanced React environment validation
console.log('🔍 main.tsx - Comprehensive React environment check:', {
  React: !!React,
  ReactVersion: React?.version,
  useState: !!React?.useState,
  ReactDOM: !!ReactDOM,
  createRoot: !!ReactDOM?.createRoot,
  __REACT_DEVTOOLS_GLOBAL_HOOK__: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
});

// Robust React validation
if (!React) {
  console.error('❌ React is not loaded');
  throw new Error('React is not available');
}

if (!React.useState) {
  console.error('❌ React hooks are not available');
  throw new Error('React hooks are not properly initialized');
}

if (!ReactDOM || !ReactDOM.createRoot) {
  console.error('❌ ReactDOM.createRoot is not available');
  throw new Error('ReactDOM is not properly initialized');
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error('Root element not found');
}

console.log('🚀 main.tsx - Starting React application with validated environment');

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ main.tsx - App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  throw error;
}
