
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

export const useUserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      const adminStatus = data?.role === 'admin';
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Erro ao verificar status admin:', error);
      return false;
    }
  };

  const fetchUsers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const adminStatus = await checkAdminStatus();
      
      if (!adminStatus) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email: string, password: string, fullName: string, role: UserRole) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem criar usuários.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      console.log('Criando usuário:', { email, fullName, role });
      
      // Criar usuário através do auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) {
        console.error('Erro ao criar usuário:', authError);
        
        if (authError.message.includes('already registered')) {
          toast({
            title: "Erro",
            description: "Este email já está cadastrado no sistema.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro",
            description: authError.message || "Erro ao criar usuário.",
            variant: "destructive",
          });
        }
        return { success: false, error: authError };
      }

      if (authData.user) {
        // Atualizar o perfil com o role correto
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
        }

        // Recarregar lista de usuários
        await fetchUsers();
        
        toast({
          title: "Usuário Criado",
          description: `Usuário ${fullName} foi criado com sucesso!`,
        });
        
        return { success: true, user: authData.user };
      }

      return { success: false };
    } catch (error) {
      console.error('Erro inesperado ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar usuário.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem alterar perfis.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ));

      toast({
        title: "Perfil Atualizado",
        description: "Perfil do usuário atualizado com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil do usuário.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem excluir usuários.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      // Primeiro, excluir o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Remover da lista local
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast({
        title: "Usuário Excluído",
        description: "Usuário foi excluído com sucesso!",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  return {
    users,
    loading,
    isAdmin,
    createUser,
    updateUserRole,
    deleteUser,
    refetch: fetchUsers,
  };
};
