
console.log('🚀 main.tsx - Clean start after tooltip removal');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Simple React environment check
console.log('🔍 main.tsx - React system check:', {
  React: !!React,
  ReactVersion: React?.version,
  useState: !!React?.useState,
  ReactDOM: !!ReactDOM,
  ReactDOMClient: !!ReactDOM?.createRoot,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🎯 main.tsx - Starting React application');

const startApp = () => {
  try {
    // Ensure React is properly loaded
    if (!React || !React.useState || !React.createElement) {
      throw new Error('React not properly loaded');
    }
    
    if (!ReactDOM || !ReactDOM.createRoot) {
      throw new Error('ReactDOM not properly loaded');
    }
    
    console.log('✅ main.tsx - React environment validated');
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('🚀 main.tsx - Rendering App');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ main.tsx - App rendered successfully');
  } catch (error) {
    console.error('❌ main.tsx - Render error:', error);
    
    // Fallback render
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('✅ main.tsx - Fallback render successful');
    } catch (fallbackError) {
      console.error('💥 main.tsx - All renders failed:', fallbackError);
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
          <h1>Application Error</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Fallback Error:</strong> ${fallbackError}</p>
          <p>React Available: ${!!React}</p>
          <p>React Version: ${React?.version || 'Unknown'}</p>
          <p>useState Available: ${!!React?.useState}</p>
          <p>ReactDOM Available: ${!!ReactDOM}</p>
        </div>
      `;
    }
  }
};

// Start app when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
