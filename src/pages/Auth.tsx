
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/hooks/useAuth';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, resetPassword } = useAuth();
  const { settings } = useCompanySettings();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const simulateProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const handleSubmit = async (type: 'signin' | 'signup') => {
    setIsLoading(true);
    const progressInterval = simulateProgress();
    
    try {
      if (type === 'signin') {
        const result = await signIn(formData.email, formData.password);
        // Só mostrar erro se realmente houver um erro
        if (result.error) {
          alert('Erro ao fazer login: ' + (result.error.message || 'Erro desconhecido'));
        }
      } else {
        const result = await signUp(formData.email, formData.password, formData.fullName);
        // Só mostrar erro se realmente houver um erro
        if (result.error) {
          alert('Erro ao criar conta: ' + (result.error.message || 'Erro desconhecido'));
        }
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      alert('Digite seu email primeiro');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await resetPassword(formData.email);
      if (result.error) {
        alert('Erro ao enviar email de redefinição: ' + (result.error.message || 'Erro desconhecido'));
      } else {
        alert('Email de redefinição enviado com sucesso!');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-gray-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {settings?.company_name || 'Tecmax'}
          </h1>
          <p className="text-red-100">
            {settings?.company_description || 'Sistema de Gestão de Ordens de Serviço'}
          </p>
        </div>
        
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-6">
            {/* Loading Progress Bar */}
            {isLoading && (
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  <span className="text-sm text-gray-600">Autenticando...</span>
                </div>
                <Progress value={loadingProgress} className="w-full h-2" />
              </div>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSubmit('signin')} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                  <Button 
                    variant="link" 
                    onClick={handlePasswordReset}
                    className="w-full text-red-600 hover:text-red-700"
                    disabled={isLoading}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSubmit('signup')} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Criando...</span>
                      </div>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <footer className="bg-black text-white mt-8 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-4">
            {settings?.company_logo_url ? (
              <img 
                src={settings.company_logo_url} 
                alt="Logo da Empresa" 
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback para logo padrão em caso de erro
                  e.currentTarget.src = "https://i.postimg.cc/CLbCMsnH/logotecm.png";
                }}
              />
            ) : (
              <img 
                src="https://i.postimg.cc/CLbCMsnH/logotecm.png" 
                alt="Tecmax Logo" 
                className="h-8 w-auto"
              />
            )}
            <p className="text-sm">&copy; 2024 {settings?.company_name || 'Tecmax'}. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
