
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ClientEquipment {
  id: string;
  client_id: string;
  equipment_id: string;
  user_id: string;
  status: 'ativo' | 'inativo';
  observations?: string;
  created_at: string;
  updated_at: string;
  equipment?: {
    id: string;
    name: string;
    model?: string;
    serial_number?: string;
  };
}

export const useClientEquipments = (clientId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientEquipments, setClientEquipments] = useState<ClientEquipment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClientEquipments = async () => {
    if (!user || !clientId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_equipments')
        .select(`
          *,
          equipment:equipments(id, name, model, serial_number)
        `)
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure status is correctly typed
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'ativo' | 'inativo'
      }));
      
      setClientEquipments(typedData);
    } catch (error) {
      console.error('Erro ao buscar equipamentos do cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar equipamentos vinculados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const linkEquipment = async (equipmentId: string, observations?: string) => {
    if (!user || !clientId) {
      toast({
        title: "Erro",
        description: "Dados insuficientes para vincular equipamento.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('client_equipments')
        .insert({
          client_id: clientId,
          equipment_id: equipmentId,
          user_id: user.id,
          observations: observations || null,
          status: 'ativo'
        })
        .select(`
          *,
          equipment:equipments(id, name, model, serial_number)
        `)
        .single();

      if (error) throw error;

      // Type assertion to ensure status is correctly typed
      const typedData = {
        ...data,
        status: data.status as 'ativo' | 'inativo'
      };

      setClientEquipments(prev => [typedData, ...prev]);
      
      toast({
        title: "Sucesso!",
        description: "Equipamento vinculado ao cliente com sucesso!",
      });
      
      return { success: true, data: typedData };
    } catch (error: any) {
      console.error('Erro ao vincular equipamento:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Erro",
          description: "Este equipamento já está vinculado a este cliente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao vincular equipamento.",
          variant: "destructive",
        });
      }
      
      return { success: false, error: error.message };
    }
  };

  const unlinkEquipment = async (clientEquipmentId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { error } = await supabase
        .from('client_equipments')
        .delete()
        .eq('id', clientEquipmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setClientEquipments(prev => prev.filter(item => item.id !== clientEquipmentId));

      toast({
        title: "Sucesso!",
        description: "Equipamento desvinculado com sucesso!",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao desvincular equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao desvincular equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateClientEquipment = async (clientEquipmentId: string, data: { status?: 'ativo' | 'inativo'; observations?: string }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { data: updatedData, error } = await supabase
        .from('client_equipments')
        .update(data)
        .eq('id', clientEquipmentId)
        .eq('user_id', user.id)
        .select(`
          *,
          equipment:equipments(id, name, model, serial_number)
        `)
        .single();

      if (error) throw error;

      // Type assertion to ensure status is correctly typed
      const typedData = {
        ...updatedData,
        status: updatedData.status as 'ativo' | 'inativo'
      };

      setClientEquipments(prev => prev.map(item => 
        item.id === clientEquipmentId ? typedData : item
      ));

      toast({
        title: "Sucesso!",
        description: "Equipamento atualizado com sucesso!",
      });

      return { success: true, data: typedData };
    } catch (error: any) {
      console.error('Erro ao atualizar equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientEquipments();
    }
  }, [user, clientId]);

  return {
    clientEquipments,
    loading,
    linkEquipment,
    unlinkEquipment,
    updateClientEquipment,
    refetch: fetchClientEquipments,
  };
};
