
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';

console.log('🔧 SafeQueryProvider - ULTRA DEFENSIVE query provider');

const SafeQueryProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('✅ SafeQueryProvider - Creating ULTRA DEFENSIVE query client');
  
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.error('🚨 SafeQueryProvider - Query error:', error, query);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        console.error('🚨 SafeQueryProvider - Mutation error:', error, mutation);
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          console.log('🔄 SafeQueryProvider - Query retry:', failureCount, error);
          return failureCount < 3;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: (failureCount, error) => {
          console.log('🔄 SafeQueryProvider - Mutation retry:', failureCount, error);
          return failureCount < 2;
        },
      },
    },
  }));

  console.log('🎯 SafeQueryProvider - Rendering with ULTRA DEFENSIVE client');

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default SafeQueryProvider;
