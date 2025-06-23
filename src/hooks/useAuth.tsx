
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    console.log('🔐 AuthProvider - Setting up auth listener');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('🔐 Initial session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('🔐 Error getting initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Redirect authenticated users away from auth page
        if (session?.user && window.location.pathname === '/auth') {
          console.log('🔐 Redirecting authenticated user to home');
          window.location.href = '/';
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔐 Sign in error:', error);
        return { error };
      }

      console.log('🔐 Sign in successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('🔐 Unexpected sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('🔐 Attempting sign up for:', email);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('🔐 Sign up error:', error);
        return { error };
      }

      console.log('🔐 Sign up successful:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('🔐 Unexpected sign up error:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔐 Attempting password reset for:', email);
    
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('🔐 Password reset error:', error);
        return { error };
      }

      console.log('🔐 Password reset email sent successfully');
      return { error: null };
    } catch (error) {
      console.error('🔐 Unexpected password reset error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('🔐 Attempting sign out');
    
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error('🔐 Sign out error:', error);
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    resetPassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
