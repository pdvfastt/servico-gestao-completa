
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

console.log('🔧 SafeQueryProvider - AGGRESSIVE React validation');

// Validate React is properly available
if (!React || !React.useEffect || !React.useState) {
  console.error('❌ React hooks not available in SafeQueryProvider');
  throw new Error('React hooks not available - check React import configuration');
}

console.log('✅ React hooks validated in SafeQueryProvider:', {
  useEffect: !!React.useEffect,
  useState: !!React.useState,
  createContext: !!React.createContext
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
  console.log('✅ SafeQueryProvider rendering with validated React');
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
