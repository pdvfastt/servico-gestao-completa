
import React, { useState, useEffect, createContext, useContext } from 'react';
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

// Função para limpar estado de auth
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    console.log('Configurando listener de auth...');
    
    // Configurar listener de mudanças de estado de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Redirect usuários autenticados para home
        if (session?.user && window.location.pathname === '/auth') {
          console.log('Redirecionando usuário autenticado para home');
          window.location.href = '/';
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão inicial:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('Removendo listener de auth');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Iniciando login para:', email);
    
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Erro no logout global (ignorado):', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return { error };
      }

      console.log('Login bem-sucedido:', data.user?.email);
      
      if (data.user) {
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }

      return { error: null };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Iniciando cadastro para:', email);
    
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Erro no logout global (ignorado):', err);
      }

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
        console.error('Erro no cadastro:', error);
        return { error };
      }

      console.log('Cadastro bem-sucedido:', data.user?.email);
      
      if (data.user && !data.user.email_confirmed_at) {
        console.log('Usuário criado, aguardando confirmação de email');
      } else if (data.user && data.user.email_confirmed_at) {
        console.log('Usuário criado e confirmado, redirecionando');
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }

      return { error: null };
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('Iniciando recuperação de senha para:', email);
    
    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Erro na recuperação de senha:', error);
        return { error };
      }

      console.log('Email de recuperação enviado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('Erro inesperado na recuperação de senha:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('Iniciando logout...');
    
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Erro no logout global (ignorado):', err);
      }
      
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erro no logout:', error);
      window.location.href = '/auth';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, resetPassword, signOut }}>
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
