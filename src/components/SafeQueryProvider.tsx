
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";

console.log('SafeQueryProvider - Starting with custom tooltip only');

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

  console.log('SafeQueryProvider - Rendering with custom TooltipProvider');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
