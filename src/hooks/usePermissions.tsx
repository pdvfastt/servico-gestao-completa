
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { PermissionType } from '@/hooks/useUserPermissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Record<PermissionType, boolean>>({
    dashboard: false,
    orders: false,
    clients: false,
    technicians: false,
    services: false,
    financial: false,
    reports: false,
    settings: false,
    technician_orders: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Primeiro verificar se é admin (admins têm acesso total)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role === 'admin') {
        // Admins têm acesso a tudo
        setPermissions({
          dashboard: true,
          orders: true,
          clients: true,
          technicians: true,
          services: true,
          financial: true,
          reports: true,
          settings: true,
          technician_orders: true,
        });
        setLoading(false);
        return;
      }

      // Para outros usuários, buscar permissões específicas
      const { data: userPermissions, error } = await supabase
        .from('user_permissions')
        .select('permission, granted')
        .eq('user_id', user.id);

      if (error) throw error;

      const permissionsMap: Record<PermissionType, boolean> = {
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

      userPermissions?.forEach(perm => {
        permissionsMap[perm.permission as PermissionType] = perm.granted;
      });

      setPermissions(permissionsMap);
    } catch (error) {
      console.error('Erro ao buscar permissões:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions[permission] || false;
  };

  const hasAnyPermission = (permissionList: PermissionType[]): boolean => {
    return permissionList.some(permission => permissions[permission]);
  };

  useEffect(() => {
    fetchUserPermissions();
  }, [user]);

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    refetch: fetchUserPermissions,
  };
};
