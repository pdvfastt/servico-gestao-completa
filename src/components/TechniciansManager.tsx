
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Plus, 
  Search, 
  UserCheck, 
  Wrench,
  Phone,
  Mail,
  MapPin,
  Star,
  DollarSign,
  Filter,
  Edit,
  Trash2
} from "lucide-react";
import { useTechnicians } from '@/hooks/useTechnicians';

const TechniciansManager = () => {
  const { technicians, loading, createTechnician, updateTechnician, deleteTechnician } = useTechnicians();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newTechnician, setNewTechnician] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    level: 'Júnior',
    status: 'Ativo',
    address: '',
    specialties: [] as string[],
    hourly_rate: 0,
  });

  const handleCreateTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createTechnician(newTechnician);
    if (result.success) {
      setIsCreateOpen(false);
      setNewTechnician({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        level: 'Júnior',
        status: 'Ativo',
        address: '',
        specialties: [],
        hourly_rate: 0,
      });
    }
  };

  const handleEditTechnician = (technician: any) => {
    setEditingTechnician(technician);
    setIsEditOpen(true);
  };

  const handleUpdateTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTechnician) return;
    
    const result = await updateTechnician(editingTechnician.id, editingTechnician);
    if (result.success) {
      setIsEditOpen(false);
      setEditingTechnician(null);
    }
  };

  const handleDeleteTechnician = async (technicianId: string) => {
    if (confirm('Tem certeza que deseja excluir este técnico?')) {
      await deleteTechnician(technicianId);
    }
  };

  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch = technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technician.cpf.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || technician.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' 
      ? <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      : <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      'Júnior': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pleno': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sênior': 'bg-green-100 text-green-800 border-green-200',
      'Especialista': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return <Badge className={colors[level as keyof typeof colors] || colors['Júnior']}>{level}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Gerenciamento de Técnicos
          </h1>
          <p className="text-gray-600">
            Gerencie todos os técnicos cadastrados no sistema
          </p>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Ativo">Ativos</SelectItem>
                    <SelectItem value="Inativo">Inativos</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Técnico
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Técnico</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do novo técnico
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTechnician} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            value={newTechnician.name}
                            onChange={(e) => setNewTechnician(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF</Label>
                          <Input
                            id="cpf"
                            value={newTechnician.cpf}
                            onChange={(e) => setNewTechnician(prev => ({ ...prev, cpf: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newTechnician.email}
                            onChange={(e) => setNewTechnician(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={newTechnician.phone}
                            onChange={(e) => setNewTechnician(prev => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="level">Nível</Label>
                          <Select value={newTechnician.level} onValueChange={(value) => setNewTechnician(prev => ({ ...prev, level: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Júnior">Júnior</SelectItem>
                              <SelectItem value="Pleno">Pleno</SelectItem>
                              <SelectItem value="Sênior">Sênior</SelectItem>
                              <SelectItem value="Especialista">Especialista</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={newTechnician.status} onValueChange={(value) => setNewTechnician(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ativo">Ativo</SelectItem>
                              <SelectItem value="Inativo">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="hourly_rate">Valor/Hora (R$)</Label>
                          <Input
                            id="hourly_rate"
                            type="number"
                            step="0.01"
                            value={newTechnician.hourly_rate}
                            onChange={(e) => setNewTechnician(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Endereço</Label>
                        <Textarea
                          id="address"
                          value={newTechnician.address}
                          onChange={(e) => setNewTechnician(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
                          Cadastrar Técnico
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Técnicos */}
        {loading ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando técnicos...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTechnicians.map((technician) => (
              <Card key={technician.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{technician.name}</CardTitle>
                        <p className="text-sm text-blue-100">{technician.level}</p>
                      </div>
                    </div>
                    {getStatusBadge(technician.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span>{technician.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span>{technician.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserCheck className="h-4 w-4 text-purple-500" />
                      <span>{technician.cpf}</span>
                    </div>
                    {technician.hourly_rate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span>R$ {technician.hourly_rate}/hora</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Avaliação: {technician.rating || 0}/5</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      {getLevelBadge(technician.level)}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTechnician(technician)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteTechnician(technician.id)}
                          className="hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Edição */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Técnico</DialogTitle>
              <DialogDescription>
                Atualize os dados do técnico
              </DialogDescription>
            </DialogHeader>
            {editingTechnician && (
              <form onSubmit={handleUpdateTechnician} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_name">Nome Completo</Label>
                    <Input
                      id="edit_name"
                      value={editingTechnician.name}
                      onChange={(e) => setEditingTechnician(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={editingTechnician.email}
                      onChange={(e) => setEditingTechnician(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_phone">Telefone</Label>
                    <Input
                      id="edit_phone"
                      value={editingTechnician.phone}
                      onChange={(e) => setEditingTechnician(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_level">Nível</Label>
                    <Select value={editingTechnician.level} onValueChange={(value) => setEditingTechnician(prev => ({ ...prev, level: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Júnior">Júnior</SelectItem>
                        <SelectItem value="Pleno">Pleno</SelectItem>
                        <SelectItem value="Sênior">Sênior</SelectItem>
                        <SelectItem value="Especialista">Especialista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_status">Status</Label>
                    <Select value={editingTechnician.status} onValueChange={(value) => setEditingTechnician(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_hourly_rate">Valor/Hora (R$)</Label>
                    <Input
                      id="edit_hourly_rate"
                      type="number"
                      step="0.01"
                      value={editingTechnician.hourly_rate || 0}
                      onChange={(e) => setEditingTechnician(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
                    Atualizar Técnico
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {!loading && filteredTechnicians.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum técnico encontrado</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece cadastrando seu primeiro técnico.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Técnico
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TechniciansManager;
