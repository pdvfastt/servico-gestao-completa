
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  UserCheck, 
  Settings2,
  User,
  FileText,
  Users,
  Wrench,
  DollarSign,
  BarChart3,
  Cog,
  Search,
  Save,
  RotateCcw
} from "lucide-react";
import { useUserPermissions, type PermissionType, type UserWithPermissions } from '@/hooks/useUserPermissions';
import { useToast } from '@/hooks/use-toast';

const PermissionsManager = () => {
  const { users, loading, isAdmin, updateUserPermission, updateAllUserPermissions } = useUserPermissions();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
  const [searchRole, setSearchRole] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const permissionLabels: Record<PermissionType, string> = {
    dashboard: 'Dashboard',
    orders: 'Ordens de Serviço',
    clients: 'Clientes',
    technicians: 'Técnicos',
    services: 'Serviços',
    financial: 'Financeiro',
    reports: 'Relatórios',
    settings: 'Configurações',
    technician_orders: 'Minhas OS (Técnico)'
  };

  const permissionIcons: Record<PermissionType, React.ComponentType<any>> = {
    dashboard: BarChart3,
    orders: FileText,
    clients: Users,
    technicians: User,
    services: Wrench,
    financial: DollarSign,
    reports: BarChart3,
    settings: Cog,
    technician_orders: Settings2
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: "bg-red-100 text-red-800 border-red-200",
      technician: "bg-cyan-100 text-cyan-800 border-cyan-200",
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

  const filteredUsers = users.filter(user => 
    searchRole === 'all' || user.role === searchRole
  );

  const handleQuickPermissionToggle = async (userId: string, permission: PermissionType, currentValue: boolean) => {
    await updateUserPermission(userId, permission, !currentValue);
  };

  const handleOpenUserDialog = (user: UserWithPermissions) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveUserPermissions = async () => {
    if (!selectedUser) return;
    
    await updateAllUserPermissions(selectedUser.id, selectedUser.permissions);
    setIsDialogOpen(false);
  };

  const handlePermissionChange = (permission: PermissionType, granted: boolean) => {
    if (!selectedUser) return;
    
    setSelectedUser({
      ...selectedUser,
      permissions: {
        ...selectedUser.permissions,
        [permission]: granted
      }
    });
  };

  const applyRoleTemplate = (role: string) => {
    if (!selectedUser) return;

    let newPermissions = { ...selectedUser.permissions };

    // Resetar todas as permissões
    Object.keys(newPermissions).forEach(key => {
      newPermissions[key as PermissionType] = false;
    });

    // Aplicar template baseado no role
    switch (role) {
      case 'admin':
        Object.keys(newPermissions).forEach(key => {
          newPermissions[key as PermissionType] = true;
        });
        break;
      case 'technician':
        newPermissions.dashboard = true;
        newPermissions.orders = true;
        newPermissions.clients = true;
        newPermissions.technician_orders = true;
        break;
      case 'attendant':
        newPermissions.dashboard = true;
        newPermissions.orders = true;
        newPermissions.clients = true;
        newPermissions.technicians = true;
        newPermissions.services = true;
        newPermissions.financial = true;
        newPermissions.reports = true;
        break;
    }

    setSelectedUser({
      ...selectedUser,
      permissions: newPermissions
    });
  };

  if (!isAdmin) {
    return (
      <Card className="max-w-md mx-auto mt-20 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="text-center p-8">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Apenas administradores podem gerenciar permissões.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-6 w-6 text-orange-600" />
            Gerenciamento de Permissões
          </h1>
          <p className="text-gray-600 mt-1">
            Controle o acesso às funcionalidades do sistema para cada usuário
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={searchRole} onValueChange={setSearchRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
              <SelectItem value="technician">Técnicos</SelectItem>
              <SelectItem value="attendant">Atendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    {getRoleBadge(user.role)}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleOpenUserDialog(user)}
                    className="flex items-center gap-2"
                  >
                    <Settings2 className="h-4 w-4" />
                    Gerenciar
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {Object.entries(permissionLabels).map(([permission, label]) => {
                    const Icon = permissionIcons[permission as PermissionType];
                    const isGranted = user.permissions[permission as PermissionType];
                    
                    return (
                      <div 
                        key={permission}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          isGranted 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isGranted ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${isGranted ? 'text-green-700' : 'text-gray-500'}`}>
                          {label}
                        </span>
                        <Switch
                          checked={isGranted}
                          onCheckedChange={(checked) => 
                            handleQuickPermissionToggle(user.id, permission as PermissionType, isGranted)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para gerenciamento detalhado */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Gerenciar Permissões - {selectedUser?.full_name}
            </DialogTitle>
            <DialogDescription>
              Defina quais funcionalidades este usuário pode acessar no sistema
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedUser.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedUser.full_name}</h3>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                {getRoleBadge(selectedUser.role)}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Templates de Permissão</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyRoleTemplate('attendant')}
                    >
                      Atendente
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyRoleTemplate('technician')}
                    >
                      Técnico
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyRoleTemplate('admin')}
                    >
                      Admin
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(permissionLabels).map(([permission, label]) => {
                    const Icon = permissionIcons[permission as PermissionType];
                    const isGranted = selectedUser.permissions[permission as PermissionType];
                    
                    return (
                      <div 
                        key={permission}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">{label}</span>
                        </div>
                        <Switch
                          checked={isGranted}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission as PermissionType, checked)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUserPermissions} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar Permissões
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionsManager;
