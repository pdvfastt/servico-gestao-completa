import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Users, 
  Trash2,
  Printer
} from "lucide-react";
import { useClients } from '@/hooks/useClients';
import ClientPrint from '@/components/ClientPrint';

const ClientsManager = () => {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateClient = async (clientData: any) => {
    const result = await createClient(clientData);
    if (result?.success) {
      setIsNewClientOpen(false);
    }
  };

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsViewOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsEditOpen(true);
  };

  const handleSaveClient = async (clientId: string, data: any) => {
    const result = await updateClient(clientId, data);
    if (result?.success) {
      setIsEditOpen(false);
      setSelectedClient(null);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteClient(clientId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card className="gradient-bg-red text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Gestão de Clientes</CardTitle>
              <CardDescription className="text-red-100">
                Controle e gerencie todos os clientes
              </CardDescription>
            </div>
            <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-red-600 hover:bg-red-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo cliente
                  </DialogDescription>
                </DialogHeader>
                <ClientForm 
                  onSubmit={handleCreateClient}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-red-200" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-red-300 text-white placeholder:text-red-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white/10 border-red-300 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de clientes */}
      <Card>
        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {clients.length === 0 ? "Nenhum cliente encontrado" : "Nenhum cliente encontrado"}
              </h3>
              <p className="text-gray-600">
                {clients.length === 0 ? "Comece cadastrando seu primeiro cliente." : "Tente ajustar os filtros de busca."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.type}</TableCell>
                    <TableCell>{client.document}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Ativo' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleViewClient(client)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditClient(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <ClientPrint client={client} format="80mm" />
                        <ClientPrint client={client} format="A4" />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedClient && (
        <ClientView
          client={selectedClient}
          isOpen={isViewOpen}
          onClose={() => {
            setIsViewOpen(false);
            setSelectedClient(null);
          }}
          onEdit={() => {
            setIsViewOpen(false);
            setIsEditOpen(true);
          }}
        />
      )}

      {selectedClient && (
        <ClientEditModal
          client={selectedClient}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedClient(null);
          }}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
};

// Componente do formulário de novo cliente
const ClientForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState("Pessoa Física");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    
    if (!name?.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = {
        type: type,
        name: name.trim(),
        fantasy_name: (formData.get('fantasy_name') as string) || null,
        document: (formData.get('document') as string) || null,
        secondary_document: (formData.get('secondary_document') as string) || null,
        birth_date: (formData.get('birth_date') as string) || null,
        phone: (formData.get('phone') as string) || null,
        email: (formData.get('email') as string) || null,
        contact_person: (formData.get('contact_person') as string) || null,
        street: (formData.get('street') as string) || null,
        number: (formData.get('number') as string) || null,
        complement: (formData.get('complement') as string) || null,
        neighborhood: (formData.get('neighborhood') as string) || null,
        city: (formData.get('city') as string) || null,
        state: (formData.get('state') as string) || null,
        cep: (formData.get('cep') as string) || null,
        status: 'Ativo',
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
            <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input 
          name="name"
          placeholder="Nome do cliente"
          required
        />
      </div>

      {type === "Pessoa Jurídica" && (
        <div>
          <Label htmlFor="fantasy_name">Nome Fantasia</Label>
          <Input 
            name="fantasy_name"
            placeholder="Nome fantasia"
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="document">
          {type === "Pessoa Física" ? "CPF *" : "CNPJ *"}
        </Label>
        <Input 
          name="document"
          placeholder={type === "Pessoa Física" ? "CPF do cliente" : "CNPJ do cliente"}
          required
        />
      </div>

      {type === "Pessoa Física" && (
        <div>
          <Label htmlFor="secondary_document">RG</Label>
          <Input 
            name="secondary_document"
            placeholder="RG do cliente"
          />
        </div>
      )}

      {type === "Pessoa Física" && (
        <div>
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input
            type="date"
            name="birth_date"
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input 
          name="phone"
          placeholder="Telefone"
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          name="email"
          type="email"
          placeholder="Email"
        />
      </div>

      <div>
        <Label htmlFor="contact_person">Pessoa de Contato</Label>
        <Input 
          name="contact_person"
          placeholder="Pessoa de contato"
        />
      </div>

      <h3 className="text-lg font-semibold mt-4">Endereço</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="street">Rua</Label>
          <Input 
            name="street"
            placeholder="Rua"
          />
        </div>
        <div>
          <Label htmlFor="number">Número</Label>
          <Input 
            name="number"
            placeholder="Número"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="complement">Complemento</Label>
        <Input 
          name="complement"
          placeholder="Complemento"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input 
            name="neighborhood"
            placeholder="Bairro"
          />
        </div>
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input 
            name="city"
            placeholder="Cidade"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="state">Estado</Label>
          <Input 
            name="state"
            placeholder="Estado"
          />
        </div>
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input 
            name="cep"
            placeholder="CEP"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.location.reload()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar Cliente'}
        </Button>
      </div>
    </form>
  );
};

// Modal para visualizar cliente
const ClientView = ({ client, isOpen, onClose, onEdit }: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Visualizar Cliente</DialogTitle>
          <DialogDescription>
            Informações detalhadas do cliente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={client.name} readOnly />
          </div>
          <div>
            <Label>Tipo</Label>
            <Input value={client.type} readOnly />
          </div>
          <div>
            <Label>Documento</Label>
            <Input value={client.document} readOnly />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={client.phone} readOnly />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={client.email} readOnly />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={client.status} readOnly />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button type="button" onClick={onEdit} className="bg-red-600 hover:bg-red-700">
            Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal para editar cliente
const ClientEditModal = ({ client, isOpen, onClose, onSave }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState(client.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    
    if (!name?.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = {
        type: type,
        name: name.trim(),
        fantasy_name: (formData.get('fantasy_name') as string) || null,
        document: (formData.get('document') as string) || null,
        secondary_document: (formData.get('secondary_document') as string) || null,
        birth_date: (formData.get('birth_date') as string) || null,
        phone: (formData.get('phone') as string) || null,
        email: (formData.get('email') as string) || null,
        contact_person: (formData.get('contact_person') as string) || null,
        street: (formData.get('street') as string) || null,
        number: (formData.get('number') as string) || null,
        complement: (formData.get('complement') as string) || null,
        neighborhood: (formData.get('neighborhood') as string) || null,
        city: (formData.get('city') as string) || null,
        state: (formData.get('state') as string) || null,
        cep: (formData.get('cep') as string) || null,
        status: 'Ativo',
      };

      await onSave(client.id, data);
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Altere as informações do cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
                <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input 
              name="name"
              placeholder="Nome do cliente"
              defaultValue={client.name}
              required
            />
          </div>

          {type === "Pessoa Jurídica" && (
            <div>
              <Label htmlFor="fantasy_name">Nome Fantasia</Label>
              <Input 
                name="fantasy_name"
                placeholder="Nome fantasia"
                defaultValue={client.fantasy_name || ''}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="document">
              {type === "Pessoa Física" ? "CPF *" : "CNPJ *"}
            </Label>
            <Input 
              name="document"
              placeholder={type === "Pessoa Física" ? "CPF do cliente" : "CNPJ do cliente"}
              defaultValue={client.document}
              required
            />
          </div>

          {type === "Pessoa Física" && (
            <div>
              <Label htmlFor="secondary_document">RG</Label>
              <Input 
                name="secondary_document"
                placeholder="RG do cliente"
                defaultValue={client.secondary_document || ''}
              />
            </div>
          )}

          {type === "Pessoa Física" && (
            <div>
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                type="date"
                name="birth_date"
                defaultValue={client.birth_date ? client.birth_date.split('T')[0] : ''}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              name="phone"
              placeholder="Telefone"
              defaultValue={client.phone || ''}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              name="email"
              type="email"
              placeholder="Email"
              defaultValue={client.email || ''}
            />
          </div>

          <div>
            <Label htmlFor="contact_person">Pessoa de Contato</Label>
            <Input 
              name="contact_person"
              placeholder="Pessoa de contato"
              defaultValue={client.contact_person || ''}
            />
          </div>

          <h3 className="text-lg font-semibold mt-4">Endereço</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input 
                name="street"
                placeholder="Rua"
                defaultValue={client.street || ''}
              />
            </div>
            <div>
              <Label htmlFor="number">Número</Label>
              <Input 
                name="number"
                placeholder="Número"
                defaultValue={client.number || ''}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input 
              name="complement"
              placeholder="Complemento"
              defaultValue={client.complement || ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input 
                name="neighborhood"
                placeholder="Bairro"
                defaultValue={client.neighborhood || ''}
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input 
                name="city"
                placeholder="Cidade"
                defaultValue={client.city || ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input 
                name="state"
                placeholder="Estado"
                defaultValue={client.state || ''}
              />
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input 
                name="cep"
                placeholder="CEP"
                defaultValue={client.cep || ''}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientsManager;
