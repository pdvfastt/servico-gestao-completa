
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  Building,
  Phone,
  Mail,
  MapPin,
  FileText
} from "lucide-react";
import { useClients } from '@/hooks/useClients';

const ClientsManager = () => {
  const { clients, loading, createClient } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  const getClientTypeBadge = (type: string) => {
    return type === 'fisica' ? (
      <Badge className="bg-blue-100 text-blue-800">
        <Users className="h-3 w-3 mr-1" />
        Pessoa Física
      </Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800">
        <Building className="h-3 w-3 mr-1" />
        Pessoa Jurídica
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' ? (
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
    );
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.document?.includes(searchTerm) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = clientTypeFilter === 'all' || client.type === clientTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleCreateClient = async (clientData: any) => {
    const result = await createClient(clientData);
    if (result?.success) {
      setIsNewClientOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>Cadastre e gerencie seus clientes</CardDescription>
            </div>
            <Dialog open={isNewClientOpen} onOpenChange={setIsNewClientOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo cliente no sistema
                  </DialogDescription>
                </DialogHeader>
                <NewClientForm onSubmit={handleCreateClient} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, documento ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="fisica">Pessoa Física</SelectItem>
                <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {clients.length === 0 ? "Nenhum cliente cadastrado" : "Nenhum cliente encontrado"}
            </h3>
            <p className="text-gray-600">
              {clients.length === 0 ? "Comece cadastrando seu primeiro cliente." : "Tente ajustar os filtros de busca."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    {client.fantasy_name && (
                      <p className="text-sm text-gray-600 mt-1">{client.fantasy_name}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    {getClientTypeBadge(client.type)}
                    {getStatusBadge(client.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{client.document}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                {(client.city || client.state) && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{[client.city, client.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente do formulário de novo cliente
const NewClientForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [clientType, setClientType] = useState("fisica");
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    const data = {
      type: clientType,
      name: formDataObj.get('name') as string,
      fantasy_name: formDataObj.get('fantasyName') as string || null,
      document: formDataObj.get(clientType === 'fisica' ? 'cpf' : 'cnpj') as string,
      secondary_document: formDataObj.get(clientType === 'fisica' ? 'rg' : 'ie') as string || null,
      contact_person: formDataObj.get('contact') as string || null,
      phone: formDataObj.get('phone') as string,
      email: formDataObj.get('email') as string,
      birth_date: formDataObj.get('birthDate') as string || null,
      cep: formDataObj.get('cep') as string || null,
      street: formDataObj.get('street') as string || null,
      number: formDataObj.get('number') as string || null,
      complement: formDataObj.get('complement') as string || null,
      neighborhood: formDataObj.get('neighborhood') as string || null,
      city: formDataObj.get('city') as string || null,
      state: formDataObj.get('state') as string || null,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
          <TabsTrigger value="address">Endereço e Contato</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="clientType">Tipo de Cliente</Label>
            <Select value={clientType} onValueChange={setClientType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fisica">Pessoa Física</SelectItem>
                <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {clientType === "fisica" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input name="name" placeholder="Digite o nome completo" required />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input name="cpf" placeholder="000.000.000-00" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input name="rg" placeholder="00.000.000-0" />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input name="birthDate" type="date" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Razão Social</Label>
                  <Input name="name" placeholder="Digite a razão social" required />
                </div>
                <div>
                  <Label htmlFor="fantasyName">Nome Fantasia</Label>
                  <Input name="fantasyName" placeholder="Digite o nome fantasia" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input name="cnpj" placeholder="00.000.000/0000-00" required />
                </div>
                <div>
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input name="ie" placeholder="000.000.000.000" />
                </div>
              </div>
              <div>
                <Label htmlFor="contact">Pessoa de Contato</Label>
                <Input name="contact" placeholder="Nome da pessoa responsável" />
              </div>
            </>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input name="phone" placeholder="(00) 00000-0000" required />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input name="email" type="email" placeholder="email@exemplo.com" required />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="address" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input name="cep" placeholder="00000-000" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="street">Logradouro</Label>
              <Input name="street" placeholder="Rua, Avenida, etc." />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="number">Número</Label>
              <Input name="number" placeholder="123" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input name="complement" placeholder="Apartamento, sala, etc." />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input name="neighborhood" placeholder="Nome do bairro" />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input name="city" placeholder="Nome da cidade" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="state">Estado</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
              </SelectContent>
            </Select>
            <Input name="state" type="hidden" />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Cadastrar Cliente
        </Button>
      </div>
    </form>
  );
};

export default ClientsManager;
