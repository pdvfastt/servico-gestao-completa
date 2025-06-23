
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FinancialRecord = Database['public']['Tables']['financial_records']['Row'];
type FinancialRecordInsert = Database['public']['Tables']['financial_records']['Insert'];

export const useFinancialRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    if (!user) {
      console.log('❌ Usuário não autenticado - financial records');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Buscando registros financeiros para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro Supabase ao buscar registros financeiros:', error);
        console.error('❌ Código do erro:', error.code);
        console.error('❌ Mensagem do erro:', error.message);
        throw error;
      }
      
      console.log('✅ Registros financeiros encontrados:', data?.length || 0);
      setRecords(data || []);
    } catch (error) {
      console.error('❌ Erro geral ao buscar registros financeiros:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar registros financeiros. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData: Omit<FinancialRecordInsert, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Criando registro financeiro:', recordData);
      
      const { data, error } = await supabase
        .from('financial_records')
        .insert({
          ...recordData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar registro financeiro:', error);
        throw error;
      }
      
      console.log('Registro financeiro criado com sucesso:', data);
      setRecords(prev => [data, ...prev]);
      toast({
        title: "Registro Criado",
        description: "O novo registro financeiro foi criado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar registro financeiro:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar registro financeiro.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateRecord = async (id: string, recordData: Partial<FinancialRecordInsert>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Atualizando registro financeiro:', id, recordData);
      
      const { data, error } = await supabase
        .from('financial_records')
        .update(recordData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao atualizar registro financeiro:', error);
        throw error;
      }
      
      console.log('Registro financeiro atualizado com sucesso:', data);
      setRecords(prev => prev.map(record => record.id === id ? data : record));
      toast({
        title: "Registro Atualizado",
        description: "O registro financeiro foi atualizado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar registro financeiro:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar registro financeiro.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteRecord = async (id: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Removendo registro financeiro:', id);
      
      const { error } = await supabase
        .from('financial_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro Supabase ao remover registro financeiro:', error);
        throw error;
      }
      
      console.log('Registro financeiro removido com sucesso');
      setRecords(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Registro Removido",
        description: "O registro financeiro foi removido com sucesso!",
      });
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover registro financeiro:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover registro financeiro.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    console.log('🚀 useFinancialRecords: useEffect disparado, user:', user?.id);
    fetchRecords();
  }, [user]);

  return {
    records,
    loading,
    createRecord,
    updateRecord,
    deleteRecord,
    refetch: fetchRecords,
  };
};
