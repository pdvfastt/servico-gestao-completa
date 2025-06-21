
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('service_orders')
        .insert({
          ...orderData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
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
