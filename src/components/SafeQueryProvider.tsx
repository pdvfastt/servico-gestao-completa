
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

console.log('SafeQueryProvider - Starting with ZERO tooltip dependencies');

const SafeQueryProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('SafeQueryProvider - Creating QueryClient with NO tooltip provider');
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  console.log('SafeQueryProvider - Rendering with ZERO external dependencies');

  // NO TOOLTIP PROVIDER - just pure QueryClient
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
