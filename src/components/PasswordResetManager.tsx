
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PasswordResetManager = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    console.log('Admin enviando recuperação de senha para:', email);

    try {
      const redirectUrl = `${window.location.origin}/auth`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Erro na recuperação de senha:', error);
        
        let errorMessage = 'Erro ao enviar email de recuperação';
        
        if (error.message.includes('Email not found')) {
          errorMessage = 'Email não encontrado no sistema';
        } else if (error.message.includes('For security purposes')) {
          errorMessage = 'Email de recuperação enviado com sucesso!';
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: error.message.includes('For security purposes') ? "Email enviado!" : "Erro na recuperação",
          description: errorMessage,
          variant: error.message.includes('For security purposes') ? "default" : "destructive",
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Email de recuperação de senha enviado com sucesso",
        });
        
        // Limpar o formulário
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Erro inesperado na recuperação de senha:', error);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <KeyRound className="h-5 w-5" />
          <span>Recuperação de Senha</span>
        </CardTitle>
        <CardDescription>
          Envie um email de recuperação de senha para qualquer usuário do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-reset-email" className="text-sm font-medium">Email do Usuário</Label>
            <Input
              id="admin-reset-email"
              name="email"
              type="email"
              placeholder="email@usuario.com"
              required
              disabled={loading}
              className="w-full"
            />
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Mail className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Atenção</p>
                <p className="text-xs text-amber-700 mt-1">
                  O usuário receberá um email com instruções para redefinir sua senha. 
                  Certifique-se de que o email está correto.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando Email...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Enviar Email de Recuperação
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetManager;
