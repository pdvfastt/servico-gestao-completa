
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
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: fullName,
        },
        email_confirm: true,
      });

      if (error) throw error;

      // Atualizar o perfil com o role correto
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
        }
      }

      toast({
        title: "Usuário Criado",
        description: "Novo usuário criado com sucesso!",
      });

      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuário.",
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

  useEffect(() => {
    fetchUsers();
  }, [user]);

  return {
    users,
    loading,
    isAdmin,
    createUser,
    updateUserRole,
    refetch: fetchUsers,
  };
};
