
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTechnicianAuth = () => {
  const [loading, setLoading] = useState(false);

  const signInAsTechnician = async (email: string, password: string) => {
    setLoading(true);
    console.log('Tentando fazer login como técnico...');

    try {
      // Fazer login normal primeiro
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Erro no login:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se o usuário é um técnico
      const { data: technicianData, error: technicianError } = await supabase
        .from('technicians')
        .select('id, name, status')
        .eq('user_id', authData.user.id)
        .single();

      if (technicianError || !technicianData) {
        console.error('Usuário não é um técnico:', technicianError);
        
        // Fazer logout se não for técnico
        await supabase.auth.signOut();
        
        throw new Error('Este usuário não está cadastrado como técnico');
      }

      if (technicianData.status !== 'Ativo') {
        // Fazer logout se técnico não estiver ativo
        await supabase.auth.signOut();
        
        throw new Error('Técnico não está ativo no sistema');
      }

      console.log('Login de técnico bem-sucedido:', technicianData.name);

      // Redirecionar para a página principal
      setTimeout(() => {
        window.location.href = '/';
      }, 100);

      return { error: null };
    } catch (error: any) {
      console.error('Erro no login de técnico:', error);
      
      let errorMessage = 'Erro no login';
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('não está cadastrado como técnico')) {
        errorMessage = 'Este usuário não está cadastrado como técnico';
      } else if (error.message.includes('não está ativo')) {
        errorMessage = 'Técnico não está ativo no sistema';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Verifique seu email para confirmar a conta';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
      } else {
        errorMessage = error.message;
      }
      
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  return {
    signInAsTechnician,
    loading,
  };
};
