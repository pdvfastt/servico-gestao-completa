
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Buscando configurações da empresa para usuário:', user.id);
      
      // Usar query direta já que a tabela não está nos tipos ainda
      const { data, error } = await supabase
        .from('company_settings' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro Supabase ao buscar configurações:', error);
        throw error;
      }
      
      if (data) {
        console.log('Configurações encontradas:', data);
        setSettings({
          id: data.id,
          company_name: data.company_name,
          company_logo_url: data.company_logo_url || undefined,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
        });
      } else {
        // Configurações padrão se não existir
        const defaultSettings: CompanySettings = {
          company_name: 'Sistema de Gestão de OS',
          primary_color: '#2563eb',
          secondary_color: '#059669',
          accent_color: '#dc2626',
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      // Definir configurações padrão em caso de erro
      const defaultSettings: CompanySettings = {
        company_name: 'Sistema de Gestão de OS',
        primary_color: '#2563eb',
        secondary_color: '#059669',
        accent_color: '#dc2626',
      };
      setSettings(defaultSettings);
      
      toast({
        title: "Aviso",
        description: "Usando configurações padrão.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Atualizando configurações:', newSettings);
      
      const updatedSettings = { ...settings, ...newSettings };
      
      if (settings?.id) {
        // Atualizar configurações existentes usando query direta
        const { data, error } = await supabase
          .from('company_settings' as any)
          .update({
            company_name: updatedSettings.company_name,
            company_logo_url: updatedSettings.company_logo_url,
            primary_color: updatedSettings.primary_color,
            secondary_color: updatedSettings.secondary_color,
            accent_color: updatedSettings.accent_color,
          })
          .eq('id', settings.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        setSettings({
          id: data.id,
          company_name: data.company_name,
          company_logo_url: data.company_logo_url || undefined,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
        });
      } else {
        // Criar novas configurações usando query direta
        const { data, error } = await supabase
          .from('company_settings' as any)
          .insert({
            user_id: user.id,
            company_name: updatedSettings.company_name,
            company_logo_url: updatedSettings.company_logo_url,
            primary_color: updatedSettings.primary_color,
            secondary_color: updatedSettings.secondary_color,
            accent_color: updatedSettings.accent_color,
          })
          .select()
          .single();

        if (error) throw error;
        
        setSettings({
          id: data.id,
          company_name: data.company_name,
          company_logo_url: data.company_logo_url || undefined,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
        });
      }
      
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
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
};
