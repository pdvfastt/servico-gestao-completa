
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

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

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Record<PermissionType, boolean>>({
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
  const [loading, setLoading] = useState(false);

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions[permission] || false;
  };

  const hasAnyPermission = (permissionList: PermissionType[]): boolean => {
    return permissionList.some(permission => permissions[permission]);
  };

  useEffect(() => {
    // Simplificado: todos os usuários autenticados têm acesso total
    if (user) {
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
    }
    setLoading(false);
  }, [user]);

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    refetch: () => {},
  };
};
