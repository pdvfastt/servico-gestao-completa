
console.log('🚀 main.tsx - ULTIMATE React application with ZERO Radix');

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🔍 main.tsx - React system check:', {
  React: !!React,
  ReactVersion: React.version,
  useState: !!React.useState,
  ReactDOM: !!ReactDOM,
});

// ULTIMATE cleanup - ensure React is available and block ALL Radix
const ultimateSetup = () => {
  console.log('☢️ Starting ULTIMATE setup');
  
  // Ensure React is globally available and properly initialized
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  
  // ULTIMATE: Block all possible Radix references
  const blockKeys = [
    '__RADIX__', '__RADIX_UI__', '__RADIX_UI_TOOLTIP__', '__RADIX_UI_TOAST__',
    'RadixUI', 'RadixUITooltip', 'RadixUIToast', 'radix', 'RADIX'
  ];
  
  blockKeys.forEach(key => {
    if ((window as any)[key]) {
      console.log('🚫 Removing:', key);
      delete (window as any)[key];
    }
  });
  
  // ULTIMATE: Override any dynamic imports completely
  const originalImport = (window as any).__vitePreload || (window as any).import;
  if (originalImport) {
    (window as any).__vitePreload = (window as any).import = (url: string) => {
      if (typeof url === 'string' && (url.includes('radix') || url.includes('@radix-ui'))) {
        console.log('🚫 ULTIMATE BLOCKED IMPORT:', url);
        return Promise.resolve({
          TooltipProvider: (props: any) => React.createElement('div', props, props.children),
          Tooltip: (props: any) => React.createElement('div', props, props.children),
          TooltipTrigger: (props: any) => React.createElement('div', props, props.children),
          TooltipContent: (props: any) => React.createElement('div', props, props.children),
          default: {
            Provider: (props: any) => React.createElement('div', props, props.children),
            Root: (props: any) => React.createElement('div', props, props.children),
            Trigger: (props: any) => React.createElement('div', props, props.children),
            Content: (props: any) => React.createElement('div', props, props.children),
          }
        });
      }
      return originalImport(url);
    };
  }
  
  // ULTIMATE: Ensure React hooks are available
  if (!React.useState) {
    console.error('❌ React.useState not available!');
    throw new Error('React hooks not available');
  }
  
  console.log('✅ ULTIMATE setup completed');
};

ultimateSetup();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🎯 main.tsx - Starting React application with ULTIMATE Radix blocking');

const startApp = () => {
  try {
    console.log('🔍 main.tsx - ULTIMATE system check before render:', {
      React: !!React,
      ReactVersion: React.version,
      useState: !!React.useState,
      ReactDOM: !!ReactDOM,
      windowReact: !!(window as any).React,
    });
    
    // Ensure React is available
    if (!React || !React.useState) {
      throw new Error('React or useState not available');
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('🚀 main.tsx - Rendering App with ULTIMATE Radix blocking');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ main.tsx - App rendered successfully with ULTIMATE blocking');
  } catch (error) {
    console.error('❌ main.tsx - ULTIMATE render error:', error);
    
    // Simple fallback without complications
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
      console.log('✅ main.tsx - ULTIMATE fallback successful');
    } catch (fallbackError) {
      console.error('💥 main.tsx - ULTIMATE fallback failed:', fallbackError);
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial, sans-serif; background: #fff;">
          <h1>☢️ ULTIMATE Application Error</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Fallback Error:</strong> ${fallbackError}</p>
          <p>React: ${!!React} | useState: ${!!React?.useState}</p>
        </div>
      `;
    }
  }
};

// Start immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
