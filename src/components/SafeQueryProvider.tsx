
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

console.log('🔧 SafeQueryProvider - SIMPLE React setup v4');

// Ensure React is available globally for all packages
if (!(window as any).React) {
  (window as any).React = React;
}
if (!(globalThis as any).React) {
  (globalThis as any).React = React;
}

console.log('✅ SafeQueryProvider - React globally available:', {
  React: !!React,
  useEffect: !!React.useEffect,
  useState: !!React.useState,
  windowReact: !!(window as any).React,
  globalReact: !!(globalThis as any).React
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
  console.log('✅ SafeQueryProvider rendering with simple React setup v4');
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
