
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with real data later
  const orders = [
    {
      id: '001',
      client: 'João Silva',
      description: 'Manutenção preventiva ar condicionado',
      status: 'Aberta',
      technician: 'Carlos Santos',
      value: 'R$ 150,00',
      date: '2024-01-15'
    },
    {
      id: '002',
      client: 'Maria Oliveira',
      description: 'Reparo sistema elétrico',
      status: 'Em Andamento',
      technician: 'Ana Costa',
      value: 'R$ 250,00',
      date: '2024-01-14'
    },
    {
      id: '003',
      client: 'Pedro Santos',
      description: 'Instalação de câmeras',
      status: 'Finalizada',
      technician: 'Carlos Santos',
      value: 'R$ 450,00',
      date: '2024-01-13'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Aberta': 'bg-blue-100 text-blue-800',
      'Em Andamento': 'bg-yellow-100 text-yellow-800',
      'Finalizada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
          <p className="text-gray-600">Gerencie todas as ordens de serviço</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nova OS
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, descrição ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">OS #{order.id}</h3>
                      <p className="text-gray-600">{order.client}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-800">{order.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>Técnico: {order.technician}</span>
                    <span>•</span>
                    <span>{order.date}</span>
                    <span>•</span>
                    <span className="font-medium text-green-600">{order.value}</span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  {getStatusBadge(order.status)}
                  <div className="flex space-x-2">
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma ordem de serviço encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando sua primeira ordem de serviço.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeira OS
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;
