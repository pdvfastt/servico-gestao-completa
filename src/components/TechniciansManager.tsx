
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Phone,
  Mail,
  MapPin,
  Wrench,
  Star,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TechniciansManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewTechnicianOpen, setIsNewTechnicianOpen] = useState(false);

  // Dados de exemplo dos técnicos
  const technicians = [
    {
      id: '001',
      name: 'João Santos',
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'joao.santos@empresa.com',
      address: 'Rua A, 123 - São Paulo, SP',
      specialties: ['Manutenção', 'Instalação', 'Reparos'],
      level: 'Sênior',
      status: 'Ativo',
      totalOS: 45,
      completedOS: 42,
      rating: 4.8,
      hourlyRate: 'R$ 85,00'
    },
    {
      id: '002',
      name: 'Pedro Costa',
      cpf: '987.654.321-00',
      phone: '(11) 88888-8888',
      email: 'pedro.costa@empresa.com',
      address: 'Av. B, 456 - São Paulo, SP',
      specialties: ['Eletrônica', 'Reparos'],
      level: 'Pleno',
      status: 'Ativo',
      totalOS: 28,
      completedOS: 25,
      rating: 4.5,
      hourlyRate: 'R$ 65,00'
    },
    {
      id: '003',
      name: 'Ana Lima',
      cpf: '456.789.123-00',
      phone: '(11) 77777-7777',
      email: 'ana.lima@empresa.com',
      address: 'Rua C, 789 - São Paulo, SP',
      specialties: ['Instalação', 'Configuração'],
      level: 'Júnior',
      status: 'Ativo',
      totalOS: 18,
      completedOS: 16,
      rating: 4.2,
      hourlyRate: 'R$ 45,00'
    },
    {
      id: '004',
      name: 'Roberto Silva',
      cpf: '789.123.456-00',
      phone: '(11) 66666-6666',
      email: 'roberto.silva@empresa.com',
      address: 'Av. D, 321 - São Paulo, SP',
      specialties: ['Manutenção', 'Consultoria'],
      level: 'Sênior',
      status: 'Férias',
      totalOS: 62,
      completedOS: 60,
      rating: 4.9,
      hourlyRate: 'R$ 95,00'
    }
  ];

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      'Júnior': { className: 'bg-blue-100 text-blue-800' },
      'Pleno': { className: 'bg-yellow-100 text-yellow-800' },
      'Sênior': { className: 'bg-purple-100 text-purple-800' },
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig['Júnior'];
    return <Badge className={config.className}>{level}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Ativo': { className: 'bg-green-100 text-green-800' },
      'Inativo': { className: 'bg-gray-100 text-gray-800' },
      'Férias': { className: 'bg-orange-100 text-orange-800' },
      'Licença': { className: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Ativo'];
    return <Badge className={config.className}>{status}</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch = technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technician.cpf.includes(searchTerm) ||
                         technician.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || technician.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateTechnician = () => {
    toast({
      title: "Técnico Cadastrado",
      description: "O novo técnico foi cadastrado com sucesso!",
    });
    setIsNewTechnicianOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Técnicos</CardTitle>
              <CardDescription>Cadastre e gerencie sua equipe técnica</CardDescription>
            </div>
            <Dialog open={isNewTechnicianOpen} onOpenChange={setIsNewTechnicianOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Técnico
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Técnico</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo técnico na equipe
                  </DialogDescription>
                </DialogHeader>
                <NewTechnicianForm onSubmit={handleCreateTechnician} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Férias">Férias</SelectItem>
                <SelectItem value="Licença">Licença</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de técnicos */}
      <div className="grid gap-4">
        {filteredTechnicians.map((technician) => (
          <Card key={technician.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{technician.name}</h3>
                      {getLevelBadge(technician.level)}
                      {getStatusBadge(technician.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {technician.cpf}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {technician.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {technician.email}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {technician.address}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Wrench className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {technician.specialties.join(', ')}
                        </span>
                      </div>
                      {getRatingStars(technician.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total OS</p>
                      <p className="text-xl font-bold text-blue-700">{technician.totalOS}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Concluídas</p>
                      <p className="text-xl font-bold text-green-700">{technician.completedOS}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg col-span-2">
                      <p className="text-sm text-gray-600">Valor/Hora</p>
                      <p className="text-lg font-bold text-yellow-700">{technician.hourlyRate}</p>
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

      {filteredTechnicians.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum técnico encontrado</h3>
            <p className="text-gray-600">Tente alterar os filtros ou cadastrar um novo técnico.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componente do formulário de novo técnico
const NewTechnicianForm = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
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
          <Label htmlFor="phone">Telefone</Label>
          <Input placeholder="(00) 00000-0000" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input type="email" placeholder="email@exemplo.com" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input placeholder="Endereço completo" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="level">Nível</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Júnior</SelectItem>
              <SelectItem value="pleno">Pleno</SelectItem>
              <SelectItem value="senior">Sênior</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hourlyRate">Valor por Hora</Label>
          <Input placeholder="R$ 0,00" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="specialties">Especialidades</Label>
        <Input placeholder="Ex: Manutenção, Instalação, Reparos (separar por vírgula)" />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Cadastrar Técnico
        </Button>
      </div>
    </form>
  );
};

export default TechniciansManager;
