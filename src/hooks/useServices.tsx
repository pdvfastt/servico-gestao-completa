
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];

export const useServices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    if (!user) {
      console.log('❌ Usuário não autenticado - services');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Buscando todos os serviços');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro Supabase ao buscar serviços:', error);
        throw error;
      }
      
      console.log('✅ Serviços encontrados:', data?.length || 0);
      setServices(data || []);
    } catch (error) {
      console.error('❌ Erro geral ao buscar serviços:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar serviços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<ServiceInsert, 'user_id'>) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para criar serviço');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Criando serviço:', serviceData);
      
      // Validar dados obrigatórios
      if (!serviceData.name || serviceData.name.trim() === '') {
        throw new Error('Nome é obrigatório');
      }
      if (!serviceData.category || serviceData.category.trim() === '') {
        throw new Error('Categoria é obrigatória');
      }
      if (!serviceData.price || serviceData.price <= 0) {
        throw new Error('Preço é obrigatório e deve ser maior que zero');
      }
      
      const { data, error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao criar serviço:', error);
        throw error;
      }
      
      console.log('✅ Serviço criado com sucesso:', data);
      await fetchServices(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Serviço cadastrado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao criar serviço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar serviço';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateService = async (id: string, serviceData: Partial<ServiceInsert>) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para atualizar serviço');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Atualizando serviço:', id, serviceData);
      
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao atualizar serviço:', error);
        throw error;
      }
      
      console.log('✅ Serviço atualizado com sucesso:', data);
      await fetchServices(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Serviço atualizado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar serviço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar serviço';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteService = async (id: string) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para deletar serviço');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('🗑️ Removendo serviço:', id);
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro Supabase ao remover serviço:', error);
        throw error;
      }
      
      console.log('✅ Serviço removido com sucesso');
      await fetchServices(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Serviço removido com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover serviço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover serviço';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user]);

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices,
  };
};
