
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, KeyRound } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import CompanySettingsForm from './CompanySettingsForm';
import PermissionsManager from './PermissionsManager';
import PasswordResetManager from './PasswordResetManager';

const SettingsManager = () => {
  const { isAdmin } = useUserManagement();

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Negado</CardTitle>
          <CardDescription>
            Apenas administradores podem acessar as configurações do sistema.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e permissões de usuários
          </p>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="password-reset" className="flex items-center space-x-2">
            <KeyRound className="h-4 w-4" />
            <span>Recuperar Senha</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettingsForm />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsManager />
        </TabsContent>

        <TabsContent value="password-reset">
          <PasswordResetManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManager;
