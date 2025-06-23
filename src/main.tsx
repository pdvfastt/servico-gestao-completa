
console.log('🚀 main.tsx - ULTRA SAFE startup with maximum React validation');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ULTRA comprehensive React environment validation
console.log('🔍 main.tsx - ULTRA comprehensive React environment check:', {
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

// Make React globally available to prevent any import issues
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
(global as any).React = React;

// Ultra-robust React validation with detailed error messages
if (!React) {
  console.error('❌ CRITICAL: React is not loaded');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px;">ERRO: React não está carregado</div>';
  throw new Error('React is not available');
}

if (!React.useState) {
  console.error('❌ CRITICAL: React hooks are not available');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px;">ERRO: React hooks não estão disponíveis</div>';
  throw new Error('React hooks are not properly initialized');
}

if (!React.createElement) {
  console.error('❌ CRITICAL: React.createElement is not available');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px;">ERRO: React.createElement não está disponível</div>';
  throw new Error('React.createElement is not properly initialized');
}

if (!ReactDOM || !ReactDOM.createRoot) {
  console.error('❌ CRITICAL: ReactDOM.createRoot is not available');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px;">ERRO: ReactDOM não está disponível</div>';
  throw new Error('ReactDOM is not properly initialized');
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ CRITICAL: Root element not found');
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px;">ERRO: Elemento root não encontrado</div>';
  throw new Error('Root element not found');
}

console.log('🚀 main.tsx - Starting React application with ULTRA validated environment');
console.log('🎯 main.tsx - React is globally available:', !!(window as any).React);

try {
  const root = ReactDOM.createRoot(rootElement);
  
  // Add additional safety check before rendering
  if (!React.StrictMode) {
    console.warn('⚠️ React.StrictMode not available, using fallback');
    root.render(React.createElement(App));
  } else {
    root.render(
      React.createElement(React.StrictMode, null, React.createElement(App))
    );
  }
  
  console.log('✅ main.tsx - App rendered successfully with ULTRA safe mode');
} catch (error) {
  console.error('❌ CRITICAL: Failed to render app:', error);
  document.body.innerHTML = '<div style="color: red; font-size: 24px; padding: 20px;">ERRO CRÍTICO: Falha ao renderizar aplicação</div>';
  throw error;
}
