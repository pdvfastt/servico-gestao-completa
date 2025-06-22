
import React from "react"

// Completely safe toaster that doesn't use any React hooks
export function Toaster() {
  console.log('Rendering completely safe Toaster without any hooks');
  return (
    <div 
      aria-live="polite" 
      aria-label="Notifications" 
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      style={{ pointerEvents: 'none' }}
    />
  );
}
