
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanySettings {
  id?: string;
  company_name: string;
  company_logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

export const useCompanySettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Usar configurações padrão se não existir
        setSettings({
          company_name: 'Sistema de Gestão de OS',
          primary_color: '#2563eb',
          secondary_color: '#059669',
          accent_color: '#dc2626',
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações da empresa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          ...settings,
          ...newSettings,
        });

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
};
