
import React, { useState, useEffect } from 'react';

// Simple fallback that doesn't use any external libraries
const SimpleFallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

const SafeQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [QueryClient, setQueryClient] = useState<any>(null);
  const [QueryClientProvider, setQueryClientProvider] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeQuery = async () => {
      try {
        // Dynamic import to ensure React is ready
        const { QueryClient: QC, QueryClientProvider: QCP } = await import("@tanstack/react-query");
        
        if (!mounted) return;

        const queryClient = new QC({
          defaultOptions: {
            queries: {
              retry: 1,
              refetchOnWindowFocus: false,
            },
          },
        });

        setQueryClient(queryClient);
        setQueryClientProvider(() => QCP);
        
        // Additional delay to ensure everything is stable
        setTimeout(() => {
          if (mounted) {
            setIsReady(true);
          }
        }, 100);

      } catch (error) {
        console.error('Failed to initialize QueryClient:', error);
        // Fallback - still set ready to true so app doesn't hang
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    // Wait a bit before trying to initialize
    setTimeout(initializeQuery, 50);

    return () => {
      mounted = false;
    };
  }, []);

  if (!isReady || !QueryClient || !QueryClientProvider) {
    return <SimpleFallback children={children} />;
  }

  const Provider = QueryClientProvider;
  return (
    <Provider client={QueryClient}>
      {children}
    </Provider>
  );
};

export default SafeQueryProvider;
