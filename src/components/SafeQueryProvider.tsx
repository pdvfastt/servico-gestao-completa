
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

console.log('🔧 SafeQueryProvider - NUCLEAR React validation');

// NUCLEAR: Validate React is properly available before doing anything
if (!React || !React.useEffect || !React.useState) {
  console.error('❌ React hooks not available in SafeQueryProvider');
  throw new Error('React hooks not available - check React import configuration');
}

// NUCLEAR: Ensure React is available globally for QueryClient
if (typeof window !== 'undefined' && !window.React) {
  (window as any).React = React;
}

if (typeof globalThis !== 'undefined' && !globalThis.React) {
  (globalThis as any).React = React;
}

console.log('✅ React hooks validated in SafeQueryProvider:', {
  useEffect: !!React.useEffect,
  useState: !!React.useState,
  createContext: !!React.createContext,
  globalReact: !!(window as any)?.React || !!(globalThis as any)?.React
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const SafeQueryProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ SafeQueryProvider rendering with nuclear React validation');
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
