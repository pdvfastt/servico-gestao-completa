
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  console.log('🔒 ProtectedRoute - checking auth:', { user: !!user, loading });

  if (loading) {
    return React.createElement(
      'div',
      { className: "min-h-screen flex items-center justify-center bg-gray-50" },
      React.createElement(
        'div',
        { className: "text-center" },
        React.createElement('div', { 
          className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" 
        }),
        React.createElement('p', { className: "text-gray-600" }, 'Carregando...')
      )
    );
  }

  if (!user) {
    console.log('🔒 ProtectedRoute - redirecting to /auth');
    return React.createElement(Navigate, { to: "/auth", replace: true });
  }

  console.log('🔒 ProtectedRoute - user authenticated, showing content');
  return React.createElement(React.Fragment, null, children);
};

export default ProtectedRoute;
