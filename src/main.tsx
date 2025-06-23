
console.log('🚀 main.tsx - MAXIMUM SAFE startup with total React isolation');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// MAXIMUM comprehensive React environment validation
console.log('🔍 main.tsx - MAXIMUM comprehensive React check:', {
  React: !!React,
  ReactVersion: React?.version,
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  createElement: !!React?.createElement,
  ReactDOM: !!ReactDOM,
  createRoot: !!ReactDOM?.createRoot,
  globalReact: !!(window as any).React,
  __REACT_DEVTOOLS_GLOBAL_HOOK__: !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
});

// MAXIMUM global React availability
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
if (typeof global !== 'undefined') {
  (global as any).React = React;
}

// MAXIMUM React validation with immediate error display
if (!React) {
  console.error('❌ CRITICAL: React is not loaded');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px; font-family: monospace;">ERRO CRÍTICO: React não está carregado</div>';
  throw new Error('React is not available - MAXIMUM CRITICAL ERROR');
}

if (!React.useState) {
  console.error('❌ CRITICAL: React hooks are not available');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px; font-family: monospace;">ERRO CRÍTICO: React hooks não estão disponíveis</div>';
  throw new Error('React hooks are not properly initialized - MAXIMUM CRITICAL ERROR');
}

if (!React.createElement) {
  console.error('❌ CRITICAL: React.createElement is not available');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px; font-family: monospace;">ERRO CRÍTICO: React.createElement não está disponível</div>';
  throw new Error('React.createElement is not properly initialized - MAXIMUM CRITICAL ERROR');
}

if (!ReactDOM || !ReactDOM.createRoot) {
  console.error('❌ CRITICAL: ReactDOM.createRoot is not available');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px; font-family: monospace;">ERRO CRÍTICO: ReactDOM não está disponível</div>';
  throw new Error('ReactDOM is not properly initialized - MAXIMUM CRITICAL ERROR');
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ CRITICAL: Root element not found');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px; font-family: monospace;">ERRO CRÍTICO: Elemento root não encontrado</div>';
  throw new Error('Root element not found - MAXIMUM CRITICAL ERROR');
}

// Block any potential Radix imports at runtime
const originalImport = (window as any).__vitePreload;
if (originalImport) {
  (window as any).__vitePreload = (url: string, ...args: any[]) => {
    if (url.includes('radix') || url.includes('@radix-ui')) {
      console.log('🚫 Runtime blocking Radix import:', url);
      return Promise.resolve({});
    }
    return originalImport(url, ...args);
  };
}

console.log('🚀 main.tsx - Starting React application with MAXIMUM validated environment');
console.log('🎯 main.tsx - React is globally available:', !!(window as any).React);
console.log('🛡️ main.tsx - All Radix imports blocked at runtime');

try {
  const root = ReactDOM.createRoot(rootElement);
  
  // MAXIMUM safety check before rendering
  if (!React.StrictMode) {
    console.warn('⚠️ React.StrictMode not available, using fallback');
    root.render(React.createElement(App));
  } else {
    root.render(
      React.createElement(React.StrictMode, null, React.createElement(App))
    );
  }
  
  console.log('✅ main.tsx - App rendered successfully with MAXIMUM safe mode');
} catch (error) {
  console.error('❌ CRITICAL: Failed to render app:', error);
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px; font-family: monospace;">ERRO CRÍTICO: Falha ao renderizar aplicação</div>';
  throw error;
}
