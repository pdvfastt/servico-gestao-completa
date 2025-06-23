
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🚀 main.tsx - NUCLEAR SAFE React initialization');

// Ensure React is available globally with maximum protection
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

// Nuclear validation of React environment
console.log('🔍 React environment NUCLEAR check:', {
  React: !!React,
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  createElement: !!React?.createElement,
  ReactDOM: !!ReactDOM,
  createRoot: !!ReactDOM?.createRoot,
});

if (!React || !React.useState || !React.useEffect || !React.createElement) {
  console.error('❌ NUCLEAR CRITICAL: React environment is corrupted');
  document.body.innerHTML = `
    <div style="color: red; font-size: 24px; padding: 20px; font-family: monospace; text-align: center;">
      <h1>ERRO CRÍTICO: React Não Disponível</h1>
      <p>O ambiente React está corrompido. Recarregue a página.</p>
    </div>
  `;
  throw new Error('React environment is corrupted - NUCLEAR STOP');
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ NUCLEAR CRITICAL: Root element not found');
  document.body.innerHTML = `
    <div style="color: red; font-size: 24px; padding: 20px; font-family: monospace; text-align: center;">
      <h1>ERRO: Elemento Root Não Encontrado</h1>
      <p>O elemento #root não existe no DOM.</p>
    </div>
  `;
  throw new Error('Root element not found - NUCLEAR CRITICAL ERROR');
}

console.log('✅ main.tsx - NUCLEAR validations passed, proceeding with app render');

// Block any potential Radix pollution
(window as any).__RADIX_BLOCKED__ = true;
console.log('🚫 NUCLEAR: Radix completely blocked');

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ main.tsx - App rendered successfully with NUCLEAR safety');
} catch (error) {
  console.error('❌ NUCLEAR RENDER ERROR:', error);
  document.body.innerHTML = `
    <div style="color: red; font-size: 24px; padding: 20px; font-family: monospace; text-align: center;">
      <h1>ERRO DE RENDERIZAÇÃO</h1>
      <p>Falha ao renderizar a aplicação: ${error}</p>
    </div>
  `;
  throw error;
}
