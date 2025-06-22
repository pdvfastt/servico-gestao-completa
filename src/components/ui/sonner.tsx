
import React from "react"

// Completely safe Sonner toaster that doesn't use any React hooks or external dependencies
const Toaster = ({ ...props }) => {
  console.log('Rendering completely safe Sonner without any hooks or external dependencies');
  return (
    <div 
      aria-live="polite" 
      aria-label="Notifications" 
      className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
      style={{ pointerEvents: 'none' }}
    />
  );
}

const toast = (message: string) => {
  console.log('Toast message:', message);
  // Safe implementation that doesn't use any React hooks
  return {
    id: Date.now().toString(),
    dismiss: () => console.log('Toast dismissed'),
    update: () => console.log('Toast updated')
  };
}

export { Toaster, toast }
