
console.log('🚀 main.tsx - Clean start');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🔍 main.tsx - React check:', {
  React: !!React,
  ReactVersion: React?.version,
  useState: !!React?.useState,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🚀 main.tsx - Starting React application');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('✅ main.tsx - App rendered successfully');
