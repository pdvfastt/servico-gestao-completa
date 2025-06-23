
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

console.log('SafeQueryProvider - Starting WITHOUT any tooltip provider');

const SafeQueryProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('SafeQueryProvider - Creating QueryClient');
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  console.log('SafeQueryProvider - Rendering WITHOUT TooltipProvider');

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
