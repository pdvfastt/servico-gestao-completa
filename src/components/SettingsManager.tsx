
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Users, 
  Palette, 
  Building2,
  Plus,
  Upload,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Save,
  X
} from "lucide-react";
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useToast } from '@/hooks/use-toast';

const SettingsManager = () => {
  const { settings, loading: settingsLoading, updateSettings } = useCompanySettings();
  const { users, loading: usersLoading, isAdmin, createUser, updateUserRole, deleteUser } = useUserManagement();
  const { toast } = useToast();
  
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [signUpEnabled, setSignUpEnabled] = useState(() => {
    return localStorage.getItem('signUpEnabled') !== 'false';
  });
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'attendant' as const
  });

  const [editedUser, setEditedUser] = useState({
    fullName: '',
    email: '',
    role: 'attendant' as const
  });

  const handleSettingsUpdate = async (field: string, value: string) => {
    await updateSettings({ [field]: value });
  };

  const handleSignUpToggle = (enabled: boolean) => {
    setSignUpEnabled(enabled);
    localStorage.setItem('signUpEnabled', enabled.toString());
    toast({
      title: enabled ? "Cadastros habilitados" : "Cadastros desabilitados",
      description: enabled ? "Novos usuários podem se cadastrar" : "Cadastro de novos usuários foi desabilitado",
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createUser(newUser.email, newUser.password, newUser.fullName, newUser.role);
    if (result.success) {
      setIsCreateUserOpen(false);
      setNewUser({ email: '', password: '', fullName: '', role: 'attendant' });
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditedUser({
      fullName: user.full_name,
      email: user.email,
      role: user.role
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // Atualizar o role se mudou
      if (editedUser.role !== editingUser.role) {
        await updateUserRole(editingUser.id, editedUser.role);
      }
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso",
      });
      
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      toast({
        title: "Usuário excluído",
        description: `Usuário ${userName} foi excluído com sucesso`,
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: "bg-red-100 text-red-800 border-red-200",
      technician: "bg-blue-100 text-blue-800 border-blue-200",
      attendant: "bg-green-100 text-green-800 border-green-200"
    };
    
    const labels = {
      admin: "Administrador",
      technician: "Técnico", 
      attendant: "Atendente"
    };

    return (
      <Badge className={styles[role as keyof typeof styles]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
        <Card className="max-w-md mx-auto mt-20 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center p-8">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Apenas administradores podem acessar as configurações do sistema.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            Configurações do Sistema
          </h1>
          <p className="text-gray-600">
            Personalize a aparência e gerencie usuários do sistema
          </p>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Dados da Empresa
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Configure as informações da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="company_name">Nome da Empresa</Label>
                    <Input
                      id="company_name"
                      value={settings?.company_name || ''}
                      onChange={(e) => handleSettingsUpdate('company_name', e.target.value)}
                      placeholder="Digite o nome da empresa"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company_logo">Logomarca (URL)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="company_logo"
                        value={settings?.company_logo_url || ''}
                        onChange={(e) => handleSettingsUpdate('company_logo_url', e.target.value)}
                        placeholder="https://exemplo.com/logo.png"
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {settings?.company_logo_url && (
                      <div className="mt-2">
                        <img 
                          src={settings.company_logo_url} 
                          alt="Logo da empresa" 
                          className="h-16 w-auto object-contain border rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Personalização de Cores
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Customize as cores do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="primary_color">Cor Primária</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="primary_color"
                        type="color"
                        value={settings?.primary_color || '#2563eb'}
                        onChange={(e) => handleSettingsUpdate('primary_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings?.primary_color || '#2563eb'}
                        onChange={(e) => handleSettingsUpdate('primary_color', e.target.value)}
                        placeholder="#2563eb"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary_color">Cor Secundária</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={settings?.secondary_color || '#059669'}
                        onChange={(e) => handleSettingsUpdate('secondary_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings?.secondary_color || '#059669'}
                        onChange={(e) => handleSettingsUpdate('secondary_color', e.target.value)}
                        placeholder="#059669"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent_color">Cor de Destaque</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="accent_color"
                        type="color"
                        value={settings?.accent_color || '#dc2626'}
                        onChange={(e) => handleSettingsUpdate('accent_color', e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings?.accent_color || '#dc2626'}
                        onChange={(e) => handleSettingsUpdate('accent_color', e.target.value)}
                        placeholder="#dc2626"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Prévia das Cores</h4>
                  <div className="flex gap-3">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-sm border"
                      style={{ backgroundColor: settings?.primary_color || '#2563eb' }}
                      title="Cor Primária"
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg shadow-sm border"
                      style={{ backgroundColor: settings?.secondary_color || '#059669' }}
                      title="Cor Secundária"
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg shadow-sm border"
                      style={{ backgroundColor: settings?.accent_color || '#dc2626' }}
                      title="Cor de Destaque"
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gerenciamento de Usuários
                  </div>
                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Adicione um novo usuário ao sistema
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                          <Label htmlFor="fullName">Nome Completo</Label>
                          <Input
                            id="fullName"
                            value={newUser.fullName}
                            onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Senha</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Perfil</Label>
                          <Select 
                            value={newUser.role} 
                            onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="attendant">Atendente</SelectItem>
                              <SelectItem value="technician">Técnico</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit">Criar Usuário</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription className="text-green-100">
                  Gerencie usuários e permissões do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            {editingUser?.id === user.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editedUser.fullName}
                                  onChange={(e) => setEditedUser(prev => ({ ...prev, fullName: e.target.value }))}
                                  className="font-medium"
                                />
                                <Input
                                  value={editedUser.email}
                                  onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                                  className="text-sm"
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getRoleBadge(user.role)}
                          {editingUser?.id === user.id ? (
                            <>
                              <Select 
                                value={editedUser.role} 
                                onValueChange={(value) => setEditedUser(prev => ({ ...prev, role: value as any }))}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="attendant">Atendente</SelectItem>
                                  <SelectItem value="technician">Técnico</SelectItem>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="icon" onClick={handleSaveUser} className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="outline" onClick={() => setEditingUser(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="icon" variant="outline" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o usuário "{user.full_name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteUser(user.id, user.full_name)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Configure o comportamento geral do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">Permitir Novos Cadastros</h4>
                        <p className="text-sm text-gray-600">
                          Permite que novos usuários se cadastrem no sistema
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={signUpEnabled}
                      onCheckedChange={handleSignUpToggle}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsManager;
