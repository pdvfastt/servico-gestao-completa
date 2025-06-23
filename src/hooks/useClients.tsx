
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
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Buscando clientes para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro Supabase ao buscar clientes:', error);
        throw error;
      }
      
      console.log('Clientes encontrados:', data?.length || 0);
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
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
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Criando cliente:', clientData);
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar cliente:', error);
        throw error;
      }
      
      console.log('Cliente criado com sucesso:', data);
      setClients(prev => [data, ...prev]);
      toast({
        title: "Cliente Cadastrado",
        description: "O novo cliente foi cadastrado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar cliente.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientInsert>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Atualizando cliente:', id, clientData);
      
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao atualizar cliente:', error);
        throw error;
      }
      
      console.log('Cliente atualizado com sucesso:', data);
      setClients(prev => prev.map(client => client.id === id ? data : client));
      toast({
        title: "Cliente Atualizado",
        description: "O cliente foi atualizado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Removendo cliente:', id);
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro Supabase ao remover cliente:', error);
        throw error;
      }
      
      console.log('Cliente removido com sucesso');
      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: "Cliente Removido",
        description: "O cliente foi removido com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente.",
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
