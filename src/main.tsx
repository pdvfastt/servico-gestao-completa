
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('Starting React app...');
console.log('React version:', React.version);

// Ensure React is properly available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Ensure proper React context initialization
React.version && console.log('React hooks available:', typeof React.useState === 'function');

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
