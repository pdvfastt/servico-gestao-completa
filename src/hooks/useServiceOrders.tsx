
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
    console.log('=== INÍCIO CRIAÇÃO ORDEM ===');
    console.log('Dados recebidos:', orderData);
    
    if (!user) {
      console.error('Usuário não autenticado');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    // Validação obrigatória da descrição
    if (!orderData.description || orderData.description.trim() === '') {
      console.error('Descrição é obrigatória');
      toast({
        title: "Erro",
        description: "Descrição é obrigatória.",
        variant: "destructive",
      });
      return { success: false, error: 'Description is required' };
    }

    try {
      // Preparar dados para inserção (removendo service_id que não existe)
      const insertData: ServiceOrderInsert = {
        user_id: user.id,
        client_id: orderData.client_id || null,
        technician_id: orderData.technician_id || null,
        description: orderData.description.trim(),
        diagnosis: orderData.diagnosis || null,
        observations: orderData.observations || null,
        status: orderData.status || 'Aberta',
        priority: orderData.priority || 'Média',
        expected_date: orderData.expected_date || null,
        service_value: Number(orderData.service_value) || 0,
        parts_value: Number(orderData.parts_value) || 0,
        total_value: Number(orderData.total_value) || 0,
        payment_method: orderData.payment_method || null,
      };

      console.log('Dados preparados para inserção:', insertData);
      
      const { data, error } = await supabase
        .from('service_orders')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase detalhado:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Tratamento específico de erros
        if (error.message.includes('violates row-level security policy')) {
          throw new Error('Erro de permissão. Verifique se você está logado corretamente.');
        } else if (error.message.includes('null value in column')) {
          throw new Error('Dados obrigatórios não fornecidos. Verifique todos os campos.');
        } else if (error.message.includes('foreign key')) {
          throw new Error('Erro de referência. Verifique se cliente, técnico ou serviço existem.');
        } else {
          throw new Error(`Erro do banco de dados: ${error.message}`);
        }
      }
      
      console.log('Ordem criada com sucesso:', data);
      
      // Atualizar lista local
      setOrders(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso!",
        description: "Ordem de serviço criada com sucesso!",
      });
      
      console.log('=== FIM CRIAÇÃO ORDEM (SUCESSO) ===');
      return { success: true, data };
      
    } catch (error: any) {
      console.error('Erro durante criação da ordem:', error);
      
      const errorMessage = error.message || 'Erro desconhecido ao criar ordem de serviço';
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.log('=== FIM CRIAÇÃO ORDEM (ERRO) ===');
      return { success: false, error: errorMessage };
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
