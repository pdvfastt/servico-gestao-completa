
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
import { useToast } from "@/hooks/use-toast";

const ClientsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  // Dados de exemplo dos clientes
  const clients = [
    {
      id: '001',
      name: 'Tech Solutions Ltda',
      type: 'Jurídica',
      document: '12.345.678/0001-90',
      phone: '(11) 99999-9999',
      email: 'contato@techsolutions.com.br',
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      contact: 'Carlos Silva',
      totalOS: 15,
      totalValue: 'R$ 25.000,00',
      status: 'Ativo'
    },
    {
      id: '002',
      name: 'Maria Silva',
      type: 'Física',
      document: '123.456.789-00',
      phone: '(11) 88888-8888',
      email: 'maria.silva@email.com',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      contact: '-',
      totalOS: 8,
      totalValue: 'R$ 3.200,00',
      status: 'Ativo'
    },
    {
      id: '003',
      name: 'Empresa ABC Ltda',
      type: 'Jurídica',
      document: '98.765.432/0001-10',
      phone: '(11) 77777-7777',
      email: 'admin@empresaabc.com.br',
      address: 'Rua Comercial, 456 - São Paulo, SP',
      contact: 'Ana Costa',
      totalOS: 22,
      totalValue: 'R$ 45.800,00',
      status: 'Ativo'
    },
    {
      id: '004',
      name: 'João Santos',
      type: 'Física',
      document: '987.654.321-00',
      phone: '(11) 66666-6666',
      email: 'joao.santos@email.com',
      address: 'Av. Central, 789 - São Paulo, SP',
      contact: '-',
      totalOS: 3,
      totalValue: 'R$ 850,00',
      status: 'Inativo'
    }
  ];

  const getClientTypeBadge = (type: string) => {
    return type === 'Física' ? (
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
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.document.includes(searchTerm) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = clientTypeFilter === 'all' || client.type === clientTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleCreateClient = () => {
    toast({
      title: "Cliente Cadastrado",
      description: "O novo cliente foi cadastrado com sucesso!",
    });
    setIsNewClientOpen(false);
  };

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
                <SelectItem value="Física">Pessoa Física</SelectItem>
                <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    {client.type === 'Física' ? (
                      <Users className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Building className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                      {getClientTypeBadge(client.type)}
                      {getStatusBadge(client.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {client.document}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {client.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {client.email}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {client.address}
                      </div>
                    </div>
                    {client.contact !== '-' && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Contato:</strong> {client.contact}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="bg-gray-50 p-3 rounded-lg mb-2">
                      <p className="text-sm text-gray-600">Total de OS</p>
                      <p className="text-2xl font-bold text-gray-900">{client.totalOS}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Valor Total</p>
                      <p className="text-lg font-bold text-green-700">{client.totalValue}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-600">Tente alterar os filtros ou cadastrar um novo cliente.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componente do formulário de novo cliente
const NewClientForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [clientType, setClientType] = useState("fisica");

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
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
                  <Input placeholder="Digite o nome completo" />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input placeholder="00.000.000-0" />
                </div>
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input type="date" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Razão Social</Label>
                  <Input placeholder="Digite a razão social" />
                </div>
                <div>
                  <Label htmlFor="fantasyName">Nome Fantasia</Label>
                  <Input placeholder="Digite o nome fantasia" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input placeholder="000.000.000.000" />
                </div>
              </div>
              <div>
                <Label htmlFor="contact">Pessoa de Contato</Label>
                <Input placeholder="Nome da pessoa responsável" />
              </div>
            </>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input type="email" placeholder="email@exemplo.com" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="address" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input placeholder="00000-000" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="street">Logradouro</Label>
              <Input placeholder="Rua, Avenida, etc." />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="number">Número</Label>
              <Input placeholder="123" />
            </div>
            <div className="col-span-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input placeholder="Apartamento, sala, etc." />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input placeholder="Nome do bairro" />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input placeholder="Nome da cidade" />
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
                {/* Adicionar outros estados */}
              </SelectContent>
            </Select>
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
