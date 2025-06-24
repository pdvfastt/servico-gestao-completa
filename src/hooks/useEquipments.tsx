
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Equipment {
  id: string;
  user_id: string;
  name: string;
  model?: string;
  serial_number?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export const useEquipments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipments(data || []);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar equipamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (equipmentData: Omit<Equipment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('equipments')
        .insert({
          user_id: user.id,
          ...equipmentData
        })
        .select()
        .single();

      if (error) throw error;

      setEquipments(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso!",
        description: "Equipamento criado com sucesso!",
      });
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao criar equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateEquipment = async (equipmentId: string, equipmentData: Partial<Equipment>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('equipments')
        .update(equipmentData)
        .eq('id', equipmentId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setEquipments(prev => prev.map(equipment => 
        equipment.id === equipmentId ? data : equipment
      ));

      toast({
        title: "Sucesso!",
        description: "Equipamento atualizado com sucesso!",
      });

      return { success: true, data };
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

  const deleteEquipment = async (equipmentId: string) => {
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
        .from('equipments')
        .delete()
        .eq('id', equipmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setEquipments(prev => prev.filter(equipment => equipment.id !== equipmentId));

      toast({
        title: "Sucesso!",
        description: "Equipamento excluído com sucesso!",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao excluir equipamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir equipamento.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, [user]);

  return {
    equipments,
    loading,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    refetch: fetchEquipments,
  };
};
