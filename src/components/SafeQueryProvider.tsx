
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

console.log('🔧 SafeQueryProvider - COMPLETELY CLEAN implementation - NO RADIX AT ALL');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const SafeQueryProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ SafeQueryProvider - Clean provider without any tooltip dependencies');
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
