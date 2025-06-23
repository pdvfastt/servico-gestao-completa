
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import SafeQueryProvider from "@/components/SafeQueryProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

console.log('🚀 App.tsx - COMPLETELY CLEAN app without ANY tooltip dependencies');

const App = () => {
  console.log('✅ App component rendering with zero Radix dependencies');
  
  return (
    <SafeQueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SafeQueryProvider>
  );
};

export default App;
