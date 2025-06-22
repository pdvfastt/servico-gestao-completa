
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
      console.log('❌ Usuário não autenticado - technicians');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Buscando todos os técnicos');
      
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro Supabase ao buscar técnicos:', error);
        throw error;
      }
      
      console.log('✅ Técnicos encontrados:', data?.length || 0);
      setTechnicians(data || []);
    } catch (error) {
      console.error('❌ Erro geral ao buscar técnicos:', error);
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
      console.error('❌ Usuário não autenticado para criar técnico');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Criando técnico:', technicianData);
      
      // Validar dados obrigatórios
      if (!technicianData.name || technicianData.name.trim() === '') {
        throw new Error('Nome é obrigatório');
      }
      if (!technicianData.email || technicianData.email.trim() === '') {
        throw new Error('Email é obrigatório');
      }
      if (!technicianData.phone || technicianData.phone.trim() === '') {
        throw new Error('Telefone é obrigatório');
      }
      if (!technicianData.cpf || technicianData.cpf.trim() === '') {
        throw new Error('CPF é obrigatório');
      }
      if (!technicianData.level || technicianData.level.trim() === '') {
        throw new Error('Nível é obrigatório');
      }
      
      // Validar o nível antes de enviar
      const validLevels = ['Júnior', 'Pleno', 'Sênior', 'Especialista'];
      if (!validLevels.includes(technicianData.level)) {
        throw new Error(`Nível inválido: ${technicianData.level}. Deve ser um dos: ${validLevels.join(', ')}`);
      }
      
      const { data, error } = await supabase
        .from('technicians')
        .insert({
          ...technicianData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao criar técnico:', error);
        throw error;
      }
      
      console.log('✅ Técnico criado com sucesso:', data);
      await fetchTechnicians(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Técnico cadastrado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao criar técnico:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar técnico';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateTechnician = async (id: string, technicianData: Partial<TechnicianInsert>) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para atualizar técnico');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('📝 Atualizando técnico:', id, technicianData);
      
      // Validar o nível se estiver sendo atualizado
      if (technicianData.level) {
        const validLevels = ['Júnior', 'Pleno', 'Sênior', 'Especialista'];
        if (!validLevels.includes(technicianData.level)) {
          throw new Error(`Nível inválido: ${technicianData.level}. Deve ser um dos: ${validLevels.join(', ')}`);
        }
      }
      
      const { data, error } = await supabase
        .from('technicians')
        .update(technicianData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase ao atualizar técnico:', error);
        throw error;
      }
      
      console.log('✅ Técnico atualizado com sucesso:', data);
      await fetchTechnicians(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Técnico atualizado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao atualizar técnico:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar técnico';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteTechnician = async (id: string) => {
    if (!user) {
      console.error('❌ Usuário não autenticado para deletar técnico');
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('🗑️ Removendo técnico:', id);
      
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro Supabase ao remover técnico:', error);
        throw error;
      }
      
      console.log('✅ Técnico removido com sucesso');
      await fetchTechnicians(); // Recarregar lista
      toast({
        title: "Sucesso!",
        description: "Técnico removido com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover técnico:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover técnico';
      toast({
        title: "Erro",
        description: errorMessage,
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
