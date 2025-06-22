
import React from "react"

// Completely inert Sonner toaster that does absolutely nothing
const Toaster = ({ ...props }) => {
  console.log('Rendering completely inert Sonner - no hooks, no functionality');
  // Return a simple div that doesn't call any hooks or functions
  return <div style={{ display: 'none' }} />;
}

const toast = (message: string) => {
  console.log('Inert toast message:', message);
  // Return a dummy object without calling any functions
  return {
    id: 'dummy',
    dismiss: () => {},
    update: () => {}
  };
}

export { Toaster, toast }
