
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Settings,
  Phone,
  Mail,
  MapPin,
  Star,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const TechniciansPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - will be replaced with real data later
  const technicians = [
    {
      id: '1',
      name: 'Carlos Santos',
      email: 'carlos@email.com',
      phone: '(11) 99999-9999',
      level: 'Sênior',
      specialties: ['Elétrica', 'Hidráulica'],
      rating: 4.8,
      status: 'Ativo'
    },
    {
      id: '2',
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 88888-8888',
      level: 'Pleno',
      specialties: ['Ar Condicionado', 'Refrigeração'],
      rating: 4.6,
      status: 'Ativo'
    },
    {
      id: '3',
      name: 'Pedro Silva',
      email: 'pedro@email.com',
      phone: '(11) 77777-7777',
      level: 'Júnior',
      specialties: ['Informática', 'Redes'],
      rating: 4.2,
      status: 'Férias'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Ativo': 'bg-green-100 text-green-800',
      'Inativo': 'bg-red-100 text-red-800',
      'Férias': 'bg-yellow-100 text-yellow-800',
      'Licença': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      'Júnior': 'bg-blue-100 text-blue-800',
      'Pleno': 'bg-purple-100 text-purple-800',
      'Sênior': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={variants[level as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {level}
      </Badge>
    );
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Técnicos</h1>
          <p className="text-gray-600">Gerencie sua equipe de técnicos</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Técnico
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, especialidade ou nível..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((technician) => (
          <Card key={technician.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Settings className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{technician.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getLevelBadge(technician.level)}
                      {renderRating(technician.rating)}
                    </div>
                  </div>
                </div>
                {getStatusBadge(technician.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{technician.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{technician.phone}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Especialidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {technician.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
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
      {technicians.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum técnico encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Comece adicionando seu primeiro técnico.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeiro técnico
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TechniciansPage;
