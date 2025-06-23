
import React from 'react';

console.log('🔧 SafeQueryProvider - NUCLEAR React validation v2');

// NUCLEAR: Validate React is properly available before doing anything
if (!React || !React.useEffect || !React.useState) {
  console.error('❌ React hooks not available in SafeQueryProvider');
  throw new Error('React hooks not available - check React import configuration');
}

// NUCLEAR: Ensure React is available globally for QueryClient and all dependencies
if (typeof window !== 'undefined' && !window.React) {
  (window as any).React = React;
  console.log('🔧 SafeQueryProvider - Set React on window');
}

if (typeof globalThis !== 'undefined' && !globalThis.React) {
  (globalThis as any).React = React;
  console.log('🔧 SafeQueryProvider - Set React on globalThis');
}

console.log('✅ React hooks validated in SafeQueryProvider v2:', {
  useEffect: !!React.useEffect,
  useState: !!React.useState,
  createContext: !!React.createContext,
  globalReact: !!(window as any)?.React || !!(globalThis as any)?.React
});

// Import QueryClient AFTER React validation
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const SafeQueryProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ SafeQueryProvider rendering with nuclear React validation v2');
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
