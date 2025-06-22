
import React from "react"

// Simplified toaster that doesn't use hooks to avoid React dispatcher issues
export function Toaster() {
  console.log('Rendering simplified Toaster without hooks');
  return null; // Temporarily return null to avoid hook issues
}
