import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useTechnicianAuth } from '@/hooks/useTechnicianAuth';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Settings, Loader2, Eye, EyeOff, Shield, Wrench } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const { signInAsTechnician } = useTechnicianAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [technicianLoading, setTechnicianLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Verificar se novos cadastros estão habilitados (padrão: true)
  const signUpEnabled = localStorage.getItem('signUpEnabled') !== 'false';

  // Redirect se já estiver logado
  React.useEffect(() => {
    if (user) {
      console.log('Usuário já logado, redirecionando...');
      window.location.href = '/';
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Tentando fazer login...');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Erro no login:', error);
        
        let errorMessage = 'Erro no login';
        
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Verifique seu email para confirmar a conta';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro no login",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando...",
        });
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTechnicianSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTechnicianLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await signInAsTechnician(email, password);
    setTechnicianLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!signUpEnabled) {
      toast({
        title: "Cadastro desabilitado",
        description: "O cadastro de novos usuários está temporariamente desabilitado",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    console.log('Tentando fazer cadastro...');

    // Validações simples
    if (!fullName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        console.error('Erro no cadastro:', error);
        
        let errorMessage = 'Erro no cadastro';
        
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido';
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Erro no cadastro",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta ou aguarde o redirecionamento",
        });
      }
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-lg"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Settings className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Sistema de Gestão de OS
          </h1>
          <p className="text-white/90 text-lg drop-shadow">
            Gerencie suas ordens de serviço com eficiência
          </p>
        </div>

        {/* Main Card */}
        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Entre com sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                <TabsTrigger value="login" className="flex items-center space-x-1 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
                  <LogIn className="h-3 w-3" />
                  <span>Login</span>
                </TabsTrigger>
                <TabsTrigger value="technician" className="flex items-center space-x-1 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
                  <Wrench className="h-3 w-3" />
                  <span>Técnico</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="flex items-center space-x-1 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
                  disabled={!signUpEnabled}
                >
                  <UserPlus className="h-3 w-3" />
                  <span>Cadastro</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={loading}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        required
                        disabled={loading}
                        className="h-11 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar no Sistema"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="technician">
                <form onSubmit={handleTechnicianSignIn} className="space-y-5">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Área do Técnico</span>
                    </div>
                    <p className="text-xs text-orange-700 mt-1">
                      Entre com suas credenciais para acessar suas ordens de serviço
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="tech-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={technicianLoading}
                      className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-password" className="text-sm font-medium text-gray-700">Senha</Label>
                    <div className="relative">
                      <Input
                        id="tech-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        required
                        disabled={technicianLoading}
                        className="h-11 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium" 
                    disabled={technicianLoading}
                  >
                    {technicianLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Wrench className="mr-2 h-4 w-4" />
                        Entrar como Técnico
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Nome Completo</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      required
                      disabled={loading || !signUpEnabled}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={loading || !signUpEnabled}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required
                        disabled={loading || !signUpEnabled}
                        className="h-11 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={!signUpEnabled}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium" 
                    disabled={loading || !signUpEnabled}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : !signUpEnabled ? (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Cadastro Desabilitado
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-white/80">
          <p className="text-sm drop-shadow">
            Sistema seguro e confiável para gestão de ordens de serviço
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
