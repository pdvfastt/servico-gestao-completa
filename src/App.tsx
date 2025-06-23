
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import SafeQueryProvider from "@/components/SafeQueryProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

console.log('🚀 App.tsx - Clean app initialization');

const App = () => {
  console.log('✅ App component rendering');
  
  return React.createElement(
    SafeQueryProvider,
    null,
    React.createElement(
      AuthProvider,
      null,
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: "/auth", element: React.createElement(Auth, null) }),
          React.createElement(Route, { 
            path: "/", 
            element: React.createElement(
              ProtectedRoute,
              null,
              React.createElement(Index, null)
            )
          }),
          React.createElement(Route, { path: "*", element: React.createElement(NotFound, null) })
        )
      )
    )
  );
};

export default App;
