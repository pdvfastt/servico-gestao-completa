
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
import { useTechnicians } from '@/hooks/useTechnicians';

const TechniciansManager = () => {
  const { technicians, loading, createTechnician } = useTechnicians();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewTechnicianOpen, setIsNewTechnicianOpen] = useState(false);

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

  const handleCreateTechnician = async (technicianData: any) => {
    const result = await createTechnician(technicianData);
    if (result?.success) {
      setIsNewTechnicianOpen(false);
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
      {filteredTechnicians.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {technicians.length === 0 ? "Nenhum técnico cadastrado" : "Nenhum técnico encontrado"}
            </h3>
            <p className="text-gray-600">
              {technicians.length === 0 ? "Comece cadastrando seu primeiro técnico na equipe." : "Tente ajustar os filtros de busca."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map((technician) => (
            <Card key={technician.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{technician.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{technician.cpf}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {getLevelBadge(technician.level)}
                    {getStatusBadge(technician.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{technician.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{technician.email}</span>
                </div>
                {technician.address && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{technician.address}</span>
                  </div>
                )}
                {technician.hourly_rate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>R$ {technician.hourly_rate}/hora</span>
                  </div>
                )}
                {technician.specialties && technician.specialties.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Wrench className="h-4 w-4" />
                    <span>{technician.specialties.join(', ')}</span>
                  </div>
                )}
                {technician.rating && technician.rating > 0 && (
                  <div className="pt-2">
                    {getRatingStars(technician.rating)}
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

// Componente do formulário de novo técnico
const NewTechnicianForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    const specialtiesText = formDataObj.get('specialties') as string;
    const specialties = specialtiesText ? specialtiesText.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    const data = {
      name: formDataObj.get('name') as string,
      cpf: formDataObj.get('cpf') as string,
      phone: formDataObj.get('phone') as string,
      email: formDataObj.get('email') as string,
      address: formDataObj.get('address') as string || null,
      level: formDataObj.get('level') as string,
      hourly_rate: formDataObj.get('hourlyRate') ? parseFloat(formDataObj.get('hourlyRate') as string) : null,
      specialties: specialties.length > 0 ? specialties : null,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="phone">Telefone</Label>
          <Input name="phone" placeholder="(00) 00000-0000" required />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" placeholder="email@exemplo.com" required />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input name="address" placeholder="Endereço completo" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="level">Nível</Label>
          <Select name="level" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Júnior">Júnior</SelectItem>
              <SelectItem value="Pleno">Pleno</SelectItem>
              <SelectItem value="Sênior">Sênior</SelectItem>
            </SelectContent>
          </Select>
          <Input name="level" type="hidden" />
        </div>
        <div>
          <Label htmlFor="hourlyRate">Valor por Hora</Label>
          <Input name="hourlyRate" placeholder="0.00" type="number" step="0.01" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="specialties">Especialidades</Label>
        <Input name="specialties" placeholder="Ex: Manutenção, Instalação, Reparos (separar por vírgula)" />
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
