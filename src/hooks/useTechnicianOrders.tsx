
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ServiceOrder = Database['public']['Tables']['service_orders']['Row'] & {
  clients?: {
    name: string;
    phone: string;
    email: string;
  } | null;
  technicians?: {
    name: string;
  } | null;
};

export const useTechnicianOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTechnicianOrders = async () => {
    if (!user) {
      console.log('❌ Usuário não autenticado - technician orders');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Buscando ordens de serviço do técnico:', user.id);
      
      // Primeiro buscar o ID do técnico baseado no usuário logado
      const { data: technicianData, error: technicianError } = await supabase
        .rpc('get_technician_id_by_user');

      if (technicianError) {
        console.error('❌ Erro ao buscar ID do técnico:', technicianError);
        throw technicianError;
      }

      if (!technicianData) {
        console.log('❌ Usuário não é um técnico');
        setOrders([]);
        setLoading(false);
        return;
      }

      // Buscar ordens de serviço atribuídas ao técnico
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          clients:client_id (name, phone, email),
          technicians:technician_id (name)
        `)
        .eq('technician_id', technicianData)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro Supabase ao buscar ordens do técnico:', error);
        throw error;
      }
      
      console.log('✅ Ordens do técnico encontradas:', data?.length || 0);
      setOrders(data || []);
    } catch (error) {
      console.error('❌ Erro geral ao buscar ordens do técnico:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar suas ordens de serviço.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      console.log('🔄 Atualizando status da ordem:', orderId, 'para:', newStatus);
      
      const { data, error } = await supabase
        .from('service_orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao atualizar status:', error);
        throw error;
      }
      
      console.log('✅ Status da ordem atualizado:', data);
      
      // Atualizar o estado local
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status Atualizado",
        description: `Status da OS alterado para: ${newStatus}`,
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da ordem de serviço.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    console.log('🚀 useTechnicianOrders: useEffect disparado, user:', user?.id);
    fetchTechnicianOrders();
  }, [user]);

  return {
    orders,
    loading,
    updateOrderStatus,
    refetch: fetchTechnicianOrders,
  };
};
