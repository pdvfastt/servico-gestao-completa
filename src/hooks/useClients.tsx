
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];

export const useClients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    if (!user) {
      console.log('❌ Usuário não autenticado');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Buscando todos os clientes');
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro Supabase ao buscar clientes:', error);
        throw error;
      }
      
      console.log('✅ Clientes encontrados:', data?.length || 0);
      setClients(data || []);
    } catch (error) {
      console.error('❌ Erro geral ao buscar clientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Omit<ClientInsert, 'user_id'>) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para criar cliente');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Criando cliente:', clientData);
      
      // Validar dados obrigatórios
      if (!clientData.name || clientData.name.trim() === '') {
        throw new Error('Nome é obrigatório');
      }
      if (!clientData.email || clientData.email.trim() === '') {
        throw new Error('Email é obrigatório');
      }
      if (!clientData.phone || clientData.phone.trim() === '') {
        throw new Error('Telefone é obrigatório');
      }
      if (!clientData.document || clientData.document.trim() === '') {
        throw new Error('Documento é obrigatório');
      }
      if (!clientData.type || clientData.type.trim() === '') {
        throw new Error('Tipo é obrigatório');
      }
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao criar cliente:', error);
        throw error;
      }
      
      console.log('✅ Cliente criado com sucesso:', data);
      await fetchClients(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Cliente cadastrado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar cliente';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientInsert>) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para atualizar cliente');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Atualizando cliente:', id, clientData);
      
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao atualizar cliente:', error);
        throw error;
      }
      
      console.log('✅ Cliente atualizado com sucesso:', data);
      await fetchClients(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar cliente';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para deletar cliente');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('🗑️ Removendo cliente:', id);
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro Supabase ao remover cliente:', error);
        throw error;
      }
      
      console.log('✅ Cliente removido com sucesso');
      await fetchClients(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Cliente removido com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover cliente';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};
