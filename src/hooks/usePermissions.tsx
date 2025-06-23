
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
      console.log('🔍 Verificando permissões para usuário:', user.id);
      
      // Primeiro verificar se é admin (admins têm acesso total)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        throw profileError;
      }

      console.log('Perfil do usuário:', profile);

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
        console.log('✅ Usuário é admin - todas as permissões concedidas');
        setLoading(false);
        return;
      }

      // Verificar se o usuário é um técnico
      const { data: technicianData } = await supabase
        .from('technicians')
        .select('id, status')
        .eq('user_id', user.id)
        .single();

      console.log('Dados do técnico:', technicianData);

      // Para outros usuários, buscar permissões específicas
      const { data: userPermissions, error } = await supabase
        .from('user_permissions')
        .select('permission, granted')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar permissões específicas:', error);
        throw error;
      }

      console.log('Permissões específicas encontradas:', userPermissions);

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

      // Aplicar permissões específicas do banco
      userPermissions?.forEach(perm => {
        permissionsMap[perm.permission as PermissionType] = perm.granted;
      });

      // Se for técnico ativo, garantir acesso às suas ordens
      if (technicianData && technicianData.status === 'Ativo') {
        permissionsMap.technician_orders = true;
        console.log('✅ Técnico ativo - permissão technician_orders concedida');
      }

      setPermissions(permissionsMap);
      console.log('✅ Permissões finais:', permissionsMap);
    } catch (error) {
      console.error('❌ Erro ao buscar permissões:', error);
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
