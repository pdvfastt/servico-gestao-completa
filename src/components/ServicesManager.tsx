
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
  Wrench, 
  Plus, 
  Search, 
  Edit,
  Clock,
  DollarSign,
  Tag,
  MoreVertical
} from "lucide-react";
import { useServices } from '@/hooks/useServices';

const ServicesManager = () => {
  const { services, loading, createService, updateService, deleteService } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    duration: '',
  });

  const categories = Array.from(new Set(services.map(service => service.category)));
  
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createService(newService);
    if (result.success) {
      setIsCreateOpen(false);
      setNewService({
        name: '',
        description: '',
        category: '',
        price: 0,
        duration: '',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Manutenção': 'bg-blue-100 text-blue-800 border-blue-200',
      'Instalação': 'bg-green-100 text-green-800 border-green-200',
      'Reparo': 'bg-orange-100 text-orange-800 border-orange-200',
      'Consultoria': 'bg-purple-100 text-purple-800 border-purple-200',
      'Limpeza': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Wrench className="h-8 w-8 text-blue-600" />
            Gerenciamento de Serviços
          </h1>
          <p className="text-gray-600">
            Gerencie o catálogo de serviços da sua empresa
          </p>
        </div>

        <div className="mb-6 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
                <DialogDescription>
                  Adicione um novo serviço ao catálogo
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateService} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input
                    id="name"
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={newService.category}
                      onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duração Estimada</Label>
                    <Input
                      id="duration"
                      value={newService.duration}
                      onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Ex: 2 horas"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Cadastrar Serviço
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando serviços...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                      <Badge className={`${getCategoryColor(service.category)} bg-white/20 text-white border-white/30`}>
                        <Tag className="h-3 w-3 mr-1" />
                        {service.category}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {service.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <span className="text-xl font-bold text-green-600">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                      
                      {service.duration && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{service.duration}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge 
                        className={service.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                        }
                      >
                        {service.status}
                      </Badge>
                      
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum serviço encontrado</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Tente alterar os filtros de pesquisa.' 
                  : 'Comece cadastrando o primeiro serviço do catálogo.'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Serviço
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ServicesManager;
