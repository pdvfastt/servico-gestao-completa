
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

console.log('🔧 SafeQueryProvider - Clean implementation without tooltips');

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface SafeQueryProviderProps {
  children: React.ReactNode;
}

const SafeQueryProvider = ({ children }: SafeQueryProviderProps) => {
  console.log('✅ SafeQueryProvider - Rendering without tooltips');
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
