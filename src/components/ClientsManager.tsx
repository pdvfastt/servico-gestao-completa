
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
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Filter,
  Edit,
  Trash2
} from "lucide-react";
import { useClients } from '@/hooks/useClients';

const ClientsManager = () => {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    type: 'Física',
    status: 'Ativo',
    fantasy_name: '',
    contact_person: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    complement: '',
    birth_date: '',
    secondary_document: ''
  });

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createClient(newClient);
    if (result.success) {
      setIsCreateOpen(false);
      setNewClient({
        name: '',
        email: '',
        phone: '',
        document: '',
        type: 'Física',
        status: 'Ativo',
        fantasy_name: '',
        contact_person: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: '',
        complement: '',
        birth_date: '',
        secondary_document: ''
      });
    }
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setIsEditOpen(true);
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    
    const result = await updateClient(editingClient.id, editingClient);
    if (result.success) {
      setIsEditOpen(false);
      setEditingClient(null);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteClient(clientId);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.document.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' 
      ? <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      : <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === 'Física' 
      ? <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pessoa Física</Badge>
      : <Badge className="bg-purple-100 text-purple-800 border-purple-200">Pessoa Jurídica</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Gerenciamento de Clientes
          </h1>
          <p className="text-gray-600">
            Gerencie todos os clientes cadastrados no sistema
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
                    placeholder="Buscar por nome, email ou documento..."
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
                      Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do novo cliente
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClient} className="space-y-6">
                      {/* Dados Básicos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="type">Tipo de Pessoa</Label>
                          <Select value={newClient.type} onValueChange={(value) => setNewClient(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Física">Pessoa Física</SelectItem>
                              <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={newClient.status} onValueChange={(value) => setNewClient(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ativo">Ativo</SelectItem>
                              <SelectItem value="Inativo">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">{newClient.type === 'Física' ? 'Nome Completo' : 'Razão Social'}</Label>
                          <Input
                            id="name"
                            value={newClient.name}
                            onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        {newClient.type === 'Jurídica' && (
                          <div>
                            <Label htmlFor="fantasy_name">Nome Fantasia</Label>
                            <Input
                              id="fantasy_name"
                              value={newClient.fantasy_name}
                              onChange={(e) => setNewClient(prev => ({ ...prev, fantasy_name: e.target.value }))}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="document">{newClient.type === 'Física' ? 'CPF' : 'CNPJ'}</Label>
                          <Input
                            id="document"
                            value={newClient.document}
                            onChange={(e) => setNewClient(prev => ({ ...prev, document: e.target.value }))}
                            required
                          />
                        </div>
                        {newClient.type === 'Física' && (
                          <div>
                            <Label htmlFor="birth_date">Data de Nascimento</Label>
                            <Input
                              id="birth_date"
                              type="date"
                              value={newClient.birth_date}
                              onChange={(e) => setNewClient(prev => ({ ...prev, birth_date: e.target.value }))}
                            />
                          </div>
                        )}
                      </div>

                      {/* Contato */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newClient.email}
                            onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={newClient.phone}
                            onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      {newClient.type === 'Jurídica' && (
                        <div>
                          <Label htmlFor="contact_person">Pessoa de Contato</Label>
                          <Input
                            id="contact_person"
                            value={newClient.contact_person}
                            onChange={(e) => setNewClient(prev => ({ ...prev, contact_person: e.target.value }))}
                          />
                        </div>
                      )}

                      {/* Endereço */}
                      <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium text-gray-900">Endereço</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="street">Rua/Avenida</Label>
                            <Input
                              id="street"
                              value={newClient.street}
                              onChange={(e) => setNewClient(prev => ({ ...prev, street: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="number">Número</Label>
                            <Input
                              id="number"
                              value={newClient.number}
                              onChange={(e) => setNewClient(prev => ({ ...prev, number: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="neighborhood">Bairro</Label>
                            <Input
                              id="neighborhood"
                              value={newClient.neighborhood}
                              onChange={(e) => setNewClient(prev => ({ ...prev, neighborhood: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">Cidade</Label>
                            <Input
                              id="city"
                              value={newClient.city}
                              onChange={(e) => setNewClient(prev => ({ ...prev, city: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">Estado</Label>
                            <Input
                              id="state"
                              value={newClient.state}
                              onChange={(e) => setNewClient(prev => ({ ...prev, state: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cep">CEP</Label>
                            <Input
                              id="cep"
                              value={newClient.cep}
                              onChange={(e) => setNewClient(prev => ({ ...prev, cep: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="complement">Complemento</Label>
                            <Input
                              id="complement"
                              value={newClient.complement}
                              onChange={(e) => setNewClient(prev => ({ ...prev, complement: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
                          Cadastrar Cliente
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Clientes */}
        {loading ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando clientes...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                        {client.type === 'Física' ? <UserCheck className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{client.name}</CardTitle>
                        {client.fantasy_name && (
                          <p className="text-sm text-blue-100">{client.fantasy_name}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(client.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserCheck className="h-4 w-4 text-purple-500" />
                      <span>{client.document}</span>
                    </div>
                    {(client.city || client.state) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{[client.city, client.state].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>Cadastrado em {new Date(client.created_at!).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      {getTypeBadge(client.type)}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClient(client)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteClient(client.id)}
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Atualize os dados do cliente
              </DialogDescription>
            </DialogHeader>
            {editingClient && (
              <form onSubmit={handleUpdateClient} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_type">Tipo de Pessoa</Label>
                    <Select value={editingClient.type} onValueChange={(value) => setEditingClient(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Física">Pessoa Física</SelectItem>
                        <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_status">Status</Label>
                    <Select value={editingClient.status} onValueChange={(value) => setEditingClient(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_name">{editingClient.type === 'Física' ? 'Nome Completo' : 'Razão Social'}</Label>
                    <Input
                      id="edit_name"
                      value={editingClient.name}
                      onChange={(e) => setEditingClient(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_email">Email</Label>
                    <Input
                      id="edit_email"
                      type="email"
                      value={editingClient.email}
                      onChange={(e) => setEditingClient(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_phone">Telefone</Label>
                    <Input
                      id="edit_phone"
                      value={editingClient.phone}
                      onChange={(e) => setEditingClient(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_document">{editingClient.type === 'Física' ? 'CPF' : 'CNPJ'}</Label>
                    <Input
                      id="edit_document"
                      value={editingClient.document}
                      onChange={(e) => setEditingClient(prev => ({ ...prev, document: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600">
                    Atualizar Cliente
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {!loading && filteredClients.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece cadastrando seu primeiro cliente.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClientsManager;
