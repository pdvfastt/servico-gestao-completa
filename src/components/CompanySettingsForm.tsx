import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Building2, Loader2, Palette, Upload, Image as ImageIcon } from 'lucide-react';
import { useCompanySettings } from '@/hooks/useCompanySettings';

const CompanySettingsForm = () => {
  const { toast } = useToast();
  const { settings, loading, updateSettings } = useCompanySettings();
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 2MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Apenas imagens são aceitas",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const newSettings = {
      company_name: formData.get('company_name') as string,
      company_logo_url: logoPreview || formData.get('company_logo_url') as string,
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
      setLogoPreview(null);
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
              <Label>Logo da Empresa</Label>
              <div className="space-y-4">
                {/* Logo Preview */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                    {logoPreview || settings?.company_logo_url ? (
                      <img 
                        src={logoPreview || settings?.company_logo_url} 
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Carregar Logo
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Imagens JPG, PNG ou GIF até 2MB
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {/* URL Input as fallback */}
                <div className="space-y-2">
                  <Label htmlFor="company_logo_url">Ou insira a URL do logo</Label>
                  <Input
                    id="company_logo_url"
                    name="company_logo_url"
                    type="url"
                    defaultValue={settings?.company_logo_url || ''}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
              </div>
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
              <strong>Dica:</strong> O logo será exibido na página de login e em todo o sistema. 
              Recomendamos usar uma imagem quadrada com fundo transparente para melhor resultado.
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
