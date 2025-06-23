
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Technician = Database['public']['Tables']['technicians']['Row'];
type TechnicianInsert = Database['public']['Tables']['technicians']['Insert'];

export const useTechnicians = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTechnicians = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Buscando técnicos para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro Supabase ao buscar técnicos:', error);
        throw error;
      }
      
      console.log('Técnicos encontrados:', data?.length || 0);
      setTechnicians(data || []);
    } catch (error) {
      console.error('Erro ao buscar técnicos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar técnicos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTechnician = async (technicianData: Omit<TechnicianInsert, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Criando técnico:', technicianData);
      
      const { data, error } = await supabase
        .from('technicians')
        .insert({
          ...technicianData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar técnico:', error);
        throw error;
      }
      
      console.log('Técnico criado com sucesso:', data);
      setTechnicians(prev => [data, ...prev]);
      toast({
        title: "Técnico Cadastrado",
        description: "O novo técnico foi cadastrado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar técnico:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar técnico.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateTechnician = async (id: string, technicianData: Partial<TechnicianInsert>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Atualizando técnico:', id, technicianData);
      
      const { data, error } = await supabase
        .from('technicians')
        .update(technicianData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao atualizar técnico:', error);
        throw error;
      }
      
      console.log('Técnico atualizado com sucesso:', data);
      setTechnicians(prev => prev.map(technician => technician.id === id ? data : technician));
      toast({
        title: "Técnico Atualizado",
        description: "O técnico foi atualizado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar técnico:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar técnico.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteTechnician = async (id: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Removendo técnico:', id);
      
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro Supabase ao remover técnico:', error);
        throw error;
      }
      
      console.log('Técnico removido com sucesso');
      setTechnicians(prev => prev.filter(technician => technician.id !== id));
      toast({
        title: "Técnico Removido",
        description: "O técnico foi removido com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover técnico:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover técnico.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [user]);

  return {
    technicians,
    loading,
    createTechnician,
    updateTechnician,
    deleteTechnician,
    refetch: fetchTechnicians,
  };
};
