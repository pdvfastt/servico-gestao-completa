
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
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

  useEffect(() => {
    fetchClients();
  }, [user]);

  return {
    clients,
    loading,
    createClient,
    refetch: fetchClients,
  };
};
