
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Save, Loader2 } from 'lucide-react';
import { useCompanySettings } from '@/hooks/useCompanySettings';

const CompanySettingsForm = () => {
  const { settings, loading, updateSettings } = useCompanySettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: settings?.company_name || '',
    company_description: settings?.company_description || '',
    company_logo_url: settings?.company_logo_url || '',
    primary_color: settings?.primary_color || '#2563eb',
    secondary_color: settings?.secondary_color || '#059669',
    accent_color: settings?.accent_color || '#dc2626'
  });

  React.useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        company_description: settings.company_description || '',
        company_logo_url: settings.company_logo_url || '',
        primary_color: settings.primary_color || '#2563eb',
        secondary_color: settings.secondary_color || '#059669',
        accent_color: settings.accent_color || '#dc2626'
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name.trim()) {
      alert('Nome da empresa é obrigatório');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updateSettings(formData);
      if (result.success) {
        console.log('Configurações salvas com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Configurações da Empresa
        </CardTitle>
        <CardDescription>
          Personalize as informações e aparência da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div>
              <Label htmlFor="company_name">Nome da Empresa *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Digite o nome da empresa"
                required
              />
            </div>

            <div>
              <Label htmlFor="company_description">Descrição</Label>
              <Textarea
                id="company_description"
                value={formData.company_description}
                onChange={(e) => setFormData(prev => ({ ...prev, company_description: e.target.value }))}
                placeholder="Digite uma breve descrição da empresa"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="company_logo_url">URL do Logo</Label>
              <Input
                id="company_logo_url"
                type="url"
                value={formData.company_logo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, company_logo_url: e.target.value }))}
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
          </div>

          {/* Preview do Logo */}
          {formData.company_logo_url && (
            <div className="space-y-2">
              <Label>Preview do Logo</Label>
              <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                <img 
                  src={formData.company_logo_url} 
                  alt="Preview do Logo" 
                  className="h-16 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <p className="text-sm text-gray-600">Preview do logo da empresa</p>
              </div>
            </div>
          )}

          {/* Personalização de Cores */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personalização de Cores</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primary_color">Cor Primária</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary_color">Cor Secundária</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                    placeholder="#059669"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accent_color">Cor de Destaque</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="accent_color"
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, accent_color: e.target.value }))}
                    placeholder="#dc2626"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview das Cores */}
          <div className="space-y-2">
            <Label>Preview das Cores</Label>
            <div className="flex space-x-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex flex-col items-center space-y-2">
                <div 
                  className="w-12 h-12 rounded-full border"
                  style={{ backgroundColor: formData.primary_color }}
                ></div>
                <span className="text-xs">Primária</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div 
                  className="w-12 h-12 rounded-full border"
                  style={{ backgroundColor: formData.secondary_color }}
                ></div>
                <span className="text-xs">Secundária</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div 
                  className="w-12 h-12 rounded-full border"
                  style={{ backgroundColor: formData.accent_color }}
                ></div>
                <span className="text-xs">Destaque</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanySettingsForm;
