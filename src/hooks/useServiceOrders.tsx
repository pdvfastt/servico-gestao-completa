
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ServiceOrder = Database['public']['Tables']['service_orders']['Row'];
type ServiceOrderInsert = Database['public']['Tables']['service_orders']['Insert'];

export const useServiceOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      console.log('❌ Usuário não autenticado - service orders');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Buscando ordens de serviço para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro Supabase ao buscar ordens de serviço:', error);
        console.error('❌ Código do erro:', error.code);
        console.error('❌ Mensagem do erro:', error.message);
        throw error;
      }
      
      console.log('✅ Ordens de serviço encontradas:', data?.length || 0);
      setOrders(data || []);
    } catch (error) {
      console.error('❌ Erro geral ao buscar ordens de serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar ordens de serviço. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<ServiceOrderInsert, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Criando ordem de serviço:', orderData);
      
      const { data, error } = await supabase
        .from('service_orders')
        .insert({
          ...orderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar ordem de serviço:', error);
        throw error;
      }
      
      console.log('Ordem de serviço criada com sucesso:', data);
      setOrders(prev => [data, ...prev]);
      toast({
        title: "OS Criada",
        description: "A nova ordem de serviço foi criada com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar ordem de serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar ordem de serviço.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateOrder = async (id: string, orderData: Partial<ServiceOrderInsert>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Atualizando ordem de serviço:', id, orderData);
      
      const { data, error } = await supabase
        .from('service_orders')
        .update(orderData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao atualizar ordem de serviço:', error);
        throw error;
      }
      
      console.log('Ordem de serviço atualizada com sucesso:', data);
      setOrders(prev => prev.map(order => order.id === id ? data : order));
      toast({
        title: "OS Atualizada",
        description: "A ordem de serviço foi atualizada com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar ordem de serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ordem de serviço.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteOrder = async (id: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Removendo ordem de serviço:', id);
      
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro Supabase ao remover ordem de serviço:', error);
        throw error;
      }
      
      console.log('Ordem de serviço removida com sucesso');
      setOrders(prev => prev.filter(order => order.id !== id));
      toast({
        title: "OS Removida",
        description: "A ordem de serviço foi removida com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover ordem de serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover ordem de serviço.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    console.log('🚀 useServiceOrders: useEffect disparado, user:', user?.id);
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders,
  };
};
