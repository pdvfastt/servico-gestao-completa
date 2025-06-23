
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
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Buscando ordens de serviço para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro Supabase ao buscar ordens:', error);
        throw error;
      }
      
      console.log('Ordens encontradas:', data?.length || 0);
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao buscar ordens de serviço:', error);
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
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Criando ordem de serviço:', orderData);
      
      // Garantir que todos os campos obrigatórios estão preenchidos
      const insertData = {
        ...orderData,
        user_id: user.id,
        status: orderData.status || 'Aberta',
        priority: orderData.priority || 'Média',
        service_value: orderData.service_value || 0,
        parts_value: orderData.parts_value || 0,
        total_value: orderData.total_value || 0,
      };

      console.log('Dados para inserção:', insertData);
      
      const { data, error } = await supabase
        .from('service_orders')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar ordem:', error);
        throw error;
      }
      
      console.log('Ordem criada com sucesso:', data);
      setOrders(prev => [data, ...prev]);
      toast({
        title: "Ordem de Serviço Criada",
        description: "A nova OS foi criada com sucesso!",
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

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    createOrder,
    refetch: fetchOrders,
  };
};
