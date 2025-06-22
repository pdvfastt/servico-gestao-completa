
import React from "react"

// Simplified Sonner toaster that doesn't use hooks
const Toaster = ({ ...props }) => {
  console.log('Rendering simplified Sonner without hooks');
  return null; // Temporarily return null to avoid hook issues
}

const toast = (message: string) => {
  console.log('Toast message:', message);
}

export { Toaster, toast }
