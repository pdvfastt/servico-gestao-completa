
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CompanySettings {
  id?: string;
  company_name: string;
  company_description?: string;
  company_logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

export const useCompanySettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log('Buscando configurações da empresa para usuário:', user?.id);
      
      if (!user) {
        const defaultSettings: CompanySettings = {
          company_name: 'Sistema de Gestão de OS',
          company_description: 'Controle completo de ordens de serviço e gestão empresarial',
          company_logo_url: 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png',
          primary_color: '#FF4500',
          secondary_color: '#00BFFF',
          accent_color: '#32CD32',
        };
        setSettings(defaultSettings);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('company_settings' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle() as { data: any, error: any };

      if (error) {
        console.error('Erro Supabase ao buscar configurações:', error);
        throw error;
      }
      
      if (data) {
        console.log('Configurações encontradas:', data);
        const loadedSettings = {
          id: data.id,
          company_name: data.company_name || 'Sistema de Gestão de OS',
          company_description: data.company_description || 'Controle completo de ordens de serviço e gestão empresarial',
          company_logo_url: data.company_logo_url || 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png',
          primary_color: data.primary_color || '#FF4500',
          secondary_color: data.secondary_color || '#00BFFF',
          accent_color: data.accent_color || '#32CD32',
        };
        console.log('Configurações processadas:', loadedSettings);
        setSettings(loadedSettings);
      } else {
        const defaultSettings: CompanySettings = {
          company_name: 'Sistema de Gestão de OS',
          company_description: 'Controle completo de ordens de serviço e gestão empresarial',
          company_logo_url: 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png',
          primary_color: '#FF4500',
          secondary_color: '#00BFFF',
          accent_color: '#32CD32',
        };
        console.log('Usando configurações padrão:', defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      const defaultSettings: CompanySettings = {
        company_name: 'Sistema de Gestão de OS',
        company_description: 'Controle completo de ordens de serviço e gestão empresarial',
        company_logo_url: 'https://i.postimg.cc/VNvFbfJc/LOGOREDESATT.png',
        primary_color: '#FF4500',
        secondary_color: '#00BFFF',
        accent_color: '#32CD32',
      };
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    if (!user) {
      return;
    }

    try {
      console.log('Atualizando configurações:', newSettings);
      
      const updatedSettings = { ...settings, ...newSettings };
      
      if (settings?.id) {
        const { data, error } = await supabase
          .from('company_settings' as any)
          .update({
            company_name: updatedSettings.company_name,
            company_description: updatedSettings.company_description,
            company_logo_url: updatedSettings.company_logo_url,
            primary_color: updatedSettings.primary_color,
            secondary_color: updatedSettings.secondary_color,
            accent_color: updatedSettings.accent_color,
          })
          .eq('id', settings.id)
          .eq('user_id', user.id)
          .select()
          .single() as { data: any, error: any };

        if (error) throw error;
        
        const newSettingsData = {
          id: data.id,
          company_name: data.company_name,
          company_description: data.company_description,
          company_logo_url: data.company_logo_url || undefined,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
        };
        console.log('Configurações atualizadas:', newSettingsData);
        setSettings(newSettingsData);
      } else {
        const { data, error } = await supabase
          .from('company_settings' as any)
          .insert({
            user_id: user.id,
            company_name: updatedSettings.company_name,
            company_description: updatedSettings.company_description,
            company_logo_url: updatedSettings.company_logo_url,
            primary_color: updatedSettings.primary_color,
            secondary_color: updatedSettings.secondary_color,
            accent_color: updatedSettings.accent_color,
          })
          .select()
          .single() as { data: any, error: any };

        if (error) throw error;
        
        const newSettingsData = {
          id: data.id,
          company_name: data.company_name,
          company_description: data.company_description,
          company_logo_url: data.company_logo_url || undefined,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
        };
        console.log('Configurações criadas:', newSettingsData);
        setSettings(newSettingsData);
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
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
