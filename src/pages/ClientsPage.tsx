
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Users,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with real data later
  const clients = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      status: 'Ativo',
      type: 'Pessoa Física'
    },
    {
      id: '2',
      name: 'Empresa XYZ Ltda',
      email: 'contato@xyz.com',
      phone: '(11) 88888-8888',
      address: 'Av. Paulista, 456 - São Paulo, SP',
      status: 'Ativo',
      type: 'Pessoa Jurídica'
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria@email.com',
      phone: '(11) 77777-7777',
      address: 'Rua dos Jardins, 789 - São Paulo, SP',
      status: 'Inativo',
      type: 'Pessoa Física'
    }
  ];

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.type}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(client.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{client.address}</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Comece adicionando seu primeiro cliente.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeiro cliente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientsPage;
