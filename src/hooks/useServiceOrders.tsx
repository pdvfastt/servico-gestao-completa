
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
      console.log('🔍 Buscando todas as ordens de serviço');
      
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro Supabase ao buscar ordens de serviço:', error);
        throw error;
      }
      
      console.log('✅ Ordens de serviço encontradas:', data?.length || 0);
      setOrders(data || []);
    } catch (error) {
      console.error('❌ Erro geral ao buscar ordens de serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar ordens de serviço.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<ServiceOrderInsert, 'user_id'>) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para criar ordem');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Criando ordem de serviço:', orderData);
      
      // Validar dados obrigatórios
      if (!orderData.description || orderData.description.trim() === '') {
        throw new Error('Descrição é obrigatória');
      }

      const { data, error } = await supabase
        .from('service_orders')
        .insert({
          ...orderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao criar ordem de serviço:', error);
        throw error;
      }
      
      console.log('✅ Ordem de serviço criada com sucesso:', data);
      await fetchOrders(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Ordem de serviço criada com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao criar ordem de serviço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar ordem de serviço';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateOrder = async (id: string, orderData: Partial<ServiceOrderInsert>) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para atualizar ordem');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Atualizando ordem de serviço:', id, orderData);
      
      const { data, error } = await supabase
        .from('service_orders')
        .update(orderData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao atualizar ordem de serviço:', error);
        throw error;
      }
      
      console.log('✅ Ordem de serviço atualizada com sucesso:', data);
      await fetchOrders(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Ordem de serviço atualizada com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar ordem de serviço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar ordem de serviço';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteOrder = async (id: string) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para deletar ordem');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('🗑️ Removendo ordem de serviço:', id);
      
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro Supabase ao remover ordem de serviço:', error);
        throw error;
      }
      
      console.log('✅ Ordem de serviço removida com sucesso');
      await fetchOrders(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Ordem de serviço removida com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover ordem de serviço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover ordem de serviço';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
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
