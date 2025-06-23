
console.log('🚀 main.tsx - FINAL SOLUTION with complete React validation and Radix elimination');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// CRITICAL: Ensure React is available globally BEFORE any other imports
if (!React || !React.useState || !React.useEffect || !React.createElement) {
  console.error('❌ CRITICAL: React environment is corrupted before initialization');
  document.body.innerHTML = `
    <div style="color: red; font-size: 24px; padding: 20px; font-family: monospace; text-align: center;">
      <h1>ERRO CRÍTICO: Ambiente React Corrompido</h1>
      <p>O React não está disponível. Recarregue a página.</p>
    </div>
  `;
  throw new Error('React environment is completely corrupted - STOP EXECUTION');
}

// GLOBAL React availability
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;
if (typeof global !== 'undefined') {
  (global as any).React = React;
}

// AGGRESSIVE Radix blocking at module level
const originalRequire = (window as any).require;
if (originalRequire) {
  (window as any).require = function(id: string) {
    if (id.includes('@radix-ui') || id.includes('radix')) {
      console.log('🚫 BLOCKED require for:', id);
      return {
        TooltipProvider: ({ children }: any) => children,
        Tooltip: ({ children }: any) => children,
        TooltipTrigger: ({ children }: any) => children,
        TooltipContent: () => null,
        default: {}
      };
    }
    return originalRequire.apply(this, arguments);
  };
}

// Block dynamic imports
const originalImport = (window as any).__vitePreload || (window as any).import;
if (originalImport) {
  (window as any).__vitePreload = (url: string, ...args: any[]) => {
    if (url.includes('radix') || url.includes('@radix-ui')) {
      console.log('🚫 BLOCKED dynamic import:', url);
      return Promise.resolve({
        TooltipProvider: ({ children }: any) => children,
        Tooltip: ({ children }: any) => children,
        TooltipTrigger: ({ children }: any) => children,
        TooltipContent: () => null,
        default: {}
      });
    }
    return originalImport ? originalImport(url, ...args) : Promise.resolve({});
  };
}

// Block all possible Radix module resolutions
const moduleMap = new Map();
const originalDefine = (window as any).define;
if (originalDefine) {
  (window as any).define = function(name: string, deps: any, factory: any) {
    if (typeof name === 'string' && (name.includes('@radix-ui') || name.includes('radix'))) {
      console.log('🚫 BLOCKED AMD define for:', name);
      return;
    }
    return originalDefine.apply(this, arguments);
  };
}

console.log('🔍 main.tsx - Final React environment validation:', {
  React: !!React,
  ReactVersion: React?.version,
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  createElement: !!React?.createElement,
  ReactDOM: !!ReactDOM,
  createRoot: !!ReactDOM?.createRoot,
});

// FINAL validation before proceeding
if (!React.useState) {
  console.error('❌ FINAL CHECK FAILED: React hooks not available');
  document.body.innerHTML = `
    <div style="color: red; font-size: 24px; padding: 20px; font-family: monospace; text-align: center;">
      <h1>ERRO FINAL: React Hooks Indisponíveis</h1>
      <p>Os hooks do React não estão funcionando. Contate o suporte.</p>
    </div>
  `;
  throw new Error('FINAL CHECK: React hooks are not available - ABORT');
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ CRITICAL: Root element not found');
  document.body.innerHTML = `
    <div style="color: red; font-size: 24px; padding: 20px; font-family: monospace; text-align: center;">
      <h1>ERRO: Elemento Root Não Encontrado</h1>
      <p>O elemento #root não existe no DOM.</p>
    </div>
  `;
  throw new Error('Root element not found - CRITICAL ERROR');
}

console.log('✅ main.tsx - All validations passed, proceeding with app render');

try {
  const root = ReactDOM.createRoot(rootElement);
  
  // Safe rendering with maximum error protection
  root.render(
    React.createElement(React.StrictMode, null, React.createElement(App))
  );
  
  console.log('✅ main.tsx - App rendered successfully without any Radix interference');
} catch (error) {
  console.error('❌ FINAL RENDER ERROR:', error);
  document.body.innerHTML = `
    <div style="color: red; font-size: 24px; padding: 20px; font-family: monospace; text-align: center;">
      <h1>ERRO DE RENDERIZAÇÃO</h1>
      <p>Falha ao renderizar a aplicação: ${error}</p>
    </div>
  `;
  throw error;
}
