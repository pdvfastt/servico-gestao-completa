
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Building2, Loader2, Palette } from 'lucide-react';
import { useCompanySettings } from '@/hooks/useCompanySettings';

const CompanySettingsForm = () => {
  const { toast } = useToast();
  const { settings, loading, updateSettings } = useCompanySettings();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const newSettings = {
      company_name: formData.get('company_name') as string,
      company_logo_url: formData.get('company_logo_url') as string,
      primary_color: formData.get('primary_color') as string,
      secondary_color: formData.get('secondary_color') as string,
      accent_color: formData.get('accent_color') as string,
    };

    console.log('Salvando configurações da empresa:', newSettings);

    try {
      await updateSettings(newSettings);
      toast({
        title: "Configurações salvas!",
        description: "As configurações da empresa foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Configurações da Empresa</span>
        </CardTitle>
        <CardDescription>
          Configure as informações e aparência da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                name="company_name"
                defaultValue={settings?.company_name || ''}
                placeholder="Digite o nome da empresa"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_logo_url">URL do Logo</Label>
              <Input
                id="company_logo_url"
                name="company_logo_url"
                type="url"
                defaultValue={settings?.company_logo_url || ''}
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-5 w-5" />
              <h3 className="text-lg font-medium">Cores do Sistema</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Cor Primária</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primary_color"
                    name="primary_color"
                    type="color"
                    defaultValue={settings?.primary_color || '#FF4500'}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    defaultValue={settings?.primary_color || '#FF4500'}
                    placeholder="#FF4500"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_color">Cor Secundária</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondary_color"
                    name="secondary_color"
                    type="color"
                    defaultValue={settings?.secondary_color || '#00BFFF'}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    defaultValue={settings?.secondary_color || '#00BFFF'}
                    placeholder="#00BFFF"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent_color">Cor de Destaque</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accent_color"
                    name="accent_color"
                    type="color"
                    defaultValue={settings?.accent_color || '#32CD32'}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    defaultValue={settings?.accent_color || '#32CD32'}
                    placeholder="#32CD32"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> As cores serão aplicadas em toda a interface do sistema. 
              Escolha cores que representem bem a identidade visual da sua empresa.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Building2 className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanySettingsForm;
