import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTechnicianAuth } from '@/hooks/useTechnicianAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogIn, UserPlus, AlertCircle, Wrench, Shield } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { user, signIn, signUp, resetPassword } = useAuth();
  const { signInAsTechnician, loading: technicianLoading } = useTechnicianAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
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
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro inesperado no login');
    } finally {
      setLoading(false);
    }
  };

  const handleTechnicianSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await signInAsTechnician(email, password);
    if (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        let errorMessage = 'Erro no cadastro';
        
        if (error.message.includes('already registered')) {
          errorMessage = 'Este email já está cadastrado';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido';
        } else if (error.message.includes('Signups not allowed')) {
          errorMessage = 'Cadastros estão desabilitados pelo administrador';
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } else {
        setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError('Erro inesperado no cadastro');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError('Erro ao enviar email de recuperação');
      } else {
        setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
        setShowResetPassword(false);
      }
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setError('Erro inesperado na recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-cyan-50 p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              Recuperar Senha
            </CardTitle>
            <CardDescription>
              Digite seu email para receber um link de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-600 to-cyan-600 hover:from-orange-700 hover:to-cyan-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Email de Recuperação'
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowResetPassword(false)}
                  disabled={loading}
                >
                  Voltar ao Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Sistema de Gestão OS
          </CardTitle>
          <CardDescription>
            Entre em sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Cadastro
              </TabsTrigger>
              <TabsTrigger value="technician" className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                Técnico
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Senha</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-600 to-cyan-600 hover:from-orange-700 hover:to-cyan-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="w-full text-sm"
                    onClick={() => setShowResetPassword(true)}
                    disabled={loading}
                  >
                    Esqueci minha senha
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-600 to-cyan-600 hover:from-orange-700 hover:to-cyan-700"
                  disabled={loading}
                >
                  {loading ? (
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

            <TabsContent value="technician">
              <form onSubmit={handleTechnicianSignIn} className="space-y-4">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-cyan-700 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Área exclusiva para técnicos
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-email">Email</Label>
                  <Input
                    id="tech-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={technicianLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech-password">Senha</Label>
                  <Input
                    id="tech-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={technicianLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700"
                  disabled={technicianLoading}
                >
                  {technicianLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
