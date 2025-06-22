
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Eye, EyeOff, Settings } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { Link, Navigate } from 'react-router-dom';

const Auth = () => {
  console.log('Auth component - Starting render');
  
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { settings, loading: settingsLoading } = useCompanySettings();
  
  console.log('Auth component - All hooks loaded successfully');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const logoUrl = settings?.company_logo_url;
  const companyName = settings?.company_name || 'Sistema de Gestão de OS';

  console.log('Renderizando logo com URL:', logoUrl);
  console.log('Nome da empresa:', companyName);

  useEffect(() => {
    if (logoUrl) {
      const img = new Image();
      img.onload = () => {
        console.log('Logo carregada com sucesso da URL:', logoUrl);
        setLogoLoaded(true);
      };
      img.onerror = () => {
        console.error('Erro ao carregar logo da URL:', logoUrl);
        setLogoLoaded(false);
      };
      img.src = logoUrl;
    }
  }, [logoUrl]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro inesperado ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, name);
      if (!result.success) {
        setError(result.error || 'Erro ao criar conta');
      } else {
        setError('');
        alert('Conta criada! Verifique seu email para ativar a conta.');
      }
    } catch (err) {
      setError('Erro inesperado ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const isFormLoading = loading || authLoading || settingsLoading;

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                {logoUrl && logoLoaded ? (
                  <img 
                    src={logoUrl} 
                    alt="Logo da Empresa" 
                    className="h-12 w-12 object-contain"
                    onError={() => setLogoLoaded(false)}
                  />
                ) : (
                  <Settings className="h-12 w-12 text-red-600" />
                )}
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {companyName}
            </h1>
            <p className="text-gray-100 drop-shadow">
              Faça login para acessar o sistema
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-gray-800">Bem-vindo!</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Entre com suas credenciais ou crie uma nova conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                    Criar Conta
                  </TabsTrigger>
                </TabsList>
                
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isFormLoading}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isFormLoading}
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isFormLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                      disabled={isFormLoading}
                    >
                      {isFormLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        'Entrar'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome Completo</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isFormLoading}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isFormLoading}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isFormLoading}
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isFormLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isFormLoading}
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isFormLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
                      disabled={isFormLoading}
                    >
                      {isFormLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        'Criar Conta'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 text-center footer-black">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span>Copyright 2025 - OS+ Desenvolvido por</span>
          <a 
            href="https://tecmax.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <img 
              src="https://i.postimg.cc/CLbCMsnH/logotecm.png"
              alt="Tecmax"
              className="h-4 w-auto"
            />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
