
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type PermissionType = 
  | 'dashboard'
  | 'orders'
  | 'clients'
  | 'technicians'
  | 'services'
  | 'financial'
  | 'reports'
  | 'settings'
  | 'technician_orders';

export interface UserPermission {
  id: string;
  user_id: string;
  permission: PermissionType;
  granted: boolean;
  granted_by?: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithPermissions {
  id: string;
  full_name: string;
  email: string;
  role: string;
  permissions: Record<PermissionType, boolean>;
}

export const useUserPermissions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
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

  const fetchUsersWithPermissions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const adminStatus = await checkAdminStatus();
      
      if (!adminStatus) {
        setLoading(false);
        return;
      }

      // Buscar todos os usuários
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar todas as permissões
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      // Combinar dados
      const usersWithPermissions = profilesData?.map(profile => {
        const userPermissions = permissionsData?.filter(p => p.user_id === profile.id) || [];
        
        const permissions: Record<PermissionType, boolean> = {
          dashboard: false,
          orders: false,
          clients: false,
          technicians: false,
          services: false,
          financial: false,
          reports: false,
          settings: false,
          technician_orders: false,
        };

        userPermissions.forEach(perm => {
          permissions[perm.permission as PermissionType] = perm.granted;
        });

        return {
          ...profile,
          permissions
        };
      }) || [];

      setUsers(usersWithPermissions);
    } catch (error) {
      console.error('Erro ao buscar usuários e permissões:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários e permissões.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermission = async (userId: string, permission: PermissionType, granted: boolean) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem gerenciar permissões.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission,
          granted,
          granted_by: user?.id
        }, {
          onConflict: 'user_id,permission'
        });

      if (error) throw error;

      // Atualizar estado local
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, permissions: { ...u.permissions, [permission]: granted } }
          : u
      ));

      toast({
        title: "Permissão Atualizada",
        description: `Permissão ${permission} ${granted ? 'concedida' : 'removida'} com sucesso!`,
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar permissão.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updateAllUserPermissions = async (userId: string, permissions: Record<PermissionType, boolean>) => {
    if (!isAdmin) {
      toast({
        title: "Erro",
        description: "Apenas administradores podem gerenciar permissões.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const permissionEntries = Object.entries(permissions).map(([permission, granted]) => ({
        user_id: userId,
        permission: permission as PermissionType,
        granted,
        granted_by: user?.id
      }));

      const { error } = await supabase
        .from('user_permissions')
        .upsert(permissionEntries, {
          onConflict: 'user_id,permission'
        });

      if (error) throw error;

      // Atualizar estado local
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, permissions }
          : u
      ));

      toast({
        title: "Permissões Atualizadas",
        description: "Todas as permissões foram atualizadas com sucesso!",
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar permissões.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchUsersWithPermissions();
  }, [user]);

  return {
    users,
    loading,
    isAdmin,
    updateUserPermission,
    updateAllUserPermissions,
    refetch: fetchUsersWithPermissions,
  };
};
