
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  console.log('🔒 ProtectedRoute - checking auth:', { user: !!user, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔒 ProtectedRoute - redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('🔒 ProtectedRoute - user authenticated, showing content');
  return <>{children}</>;
};

export default ProtectedRoute;
