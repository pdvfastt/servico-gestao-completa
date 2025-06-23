
console.log('🚀 main.tsx - Safe startup');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('✅ main.tsx - React environment check:', {
  React: !!React,
  ReactVersion: React?.version,
  useState: !!React?.useState,
  ReactDOM: !!ReactDOM,
});

// Ensure we have a valid React environment
if (!React || !React.useState || !ReactDOM) {
  console.error('❌ Invalid React environment detected');
  throw new Error('React environment is not properly initialized');
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found');
  throw new Error('Root element not found');
}

console.log('🚀 main.tsx - Starting React application safely');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ main.tsx - App rendered successfully');
