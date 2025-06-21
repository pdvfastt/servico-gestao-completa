
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Plus, 
  Search, 
  Edit,
  Star,
  MapPin,
  Phone,
  Mail,
  Wrench,
  DollarSign
} from "lucide-react";
import { useTechnicians } from '@/hooks/useTechnicians';

const TechniciansManager = () => {
  const { technicians, loading, createTechnician, updateTechnician, deleteTechnician } = useTechnicians();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<any>(null);
  
  const [newTechnician, setNewTechnician] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    level: 'Técnico',
    specialties: [''],
    hourly_rate: 0,
  });

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createTechnician(newTechnician);
    if (result.success) {
      setIsCreateOpen(false);
      setNewTechnician({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        address: '',
        level: 'Técnico',
        specialties: [''],
        hourly_rate: 0,
      });
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getLevelBadge = (level: string) => {
    const styles = {
      'Júnior': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pleno': 'bg-green-100 text-green-800 border-green-200',
      'Sênior': 'bg-purple-100 text-purple-800 border-purple-200',
      'Técnico': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return (
      <Badge className={styles[level as keyof typeof styles] || styles['Técnico']}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Gerenciamento de Técnicos
          </h1>
          <p className="text-gray-600">
            Gerencie a equipe técnica da sua empresa
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar técnicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Novo Técnico
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Técnico</DialogTitle>
                <DialogDescription>
                  Adicione um novo técnico à equipe
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTechnician} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newTechnician.phone}
                      onChange={(e) => setNewTechnician(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
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
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={newTechnician.address}
                    onChange={(e) => setNewTechnician(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Nível</Label>
                    <Select
                      value={newTechnician.level}
                      onValueChange={(value) => setNewTechnician(prev => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Júnior">Júnior</SelectItem>
                        <SelectItem value="Pleno">Pleno</SelectItem>
                        <SelectItem value="Sênior">Sênior</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
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

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Cadastrar Técnico
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando técnicos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((technician) => (
              <Card key={technician.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{technician.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getLevelBadge(technician.level)}
                        <div className="flex items-center">
                          {getRatingStars(technician.rating || 0)}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => setEditingTechnician(technician)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
                    {technician.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="truncate">{technician.address}</span>
                      </div>
                    )}
                    {technician.hourly_rate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-yellow-500" />
                        <span>R$ {technician.hourly_rate?.toFixed(2)}/hora</span>
                      </div>
                    )}
                    {technician.specialties && technician.specialties.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-700">Especialidades:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {technician.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredTechnicians.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum técnico encontrado</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Tente alterar os termos da pesquisa.' : 'Comece cadastrando o primeiro técnico da equipe.'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
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
