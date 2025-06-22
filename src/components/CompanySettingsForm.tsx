
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Building2, Loader2, Palette, Upload, Image as ImageIcon } from 'lucide-react';
import { useCompanySettings } from '@/hooks/useCompanySettings';

const CompanySettingsForm = () => {
  const { toast } = useToast();
  const { settings, loading, updateSettings } = useCompanySettings();
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState(settings?.primary_color || '#FF4500');
  const [secondaryColor, setSecondaryColor] = useState(settings?.secondary_color || '#00BFFF');
  const [accentColor, setAccentColor] = useState(settings?.accent_color || '#32CD32');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update color states when settings change
  React.useEffect(() => {
    if (settings) {
      setPrimaryColor(settings.primary_color || '#FF4500');
      setSecondaryColor(settings.secondary_color || '#00BFFF');
      setAccentColor(settings.accent_color || '#32CD32');
    }
  }, [settings]);

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
        console.log('Logo preview definido:', result); // Debug
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const logoUrl = logoPreview || formData.get('company_logo_url') as string;
    
    const newSettings = {
      company_name: formData.get('company_name') as string,
      company_description: formData.get('company_description') as string,
      company_logo_url: logoUrl,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
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
              <Label htmlFor="company_description">Descrição da Empresa</Label>
              <Textarea
                id="company_description"
                name="company_description"
                defaultValue={settings?.company_description || ''}
                placeholder="Digite a descrição da empresa que aparecerá no cabeçalho"
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Esta descrição aparecerá no cabeçalho principal do sistema
              </p>
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
                          console.log('Erro ao carregar preview da logo');
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            `;
                          }
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
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
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
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
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
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
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
              A descrição aparecerá no cabeçalho principal.
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
