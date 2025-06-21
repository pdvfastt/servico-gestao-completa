
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
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  DollarSign,
  Clock,
  Package,
  Wrench
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ServicesManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("services");
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  // Dados de exemplo dos serviços
  const services = [
    {
      id: '001',
      name: 'Manutenção Preventiva',
      category: 'Manutenção',
      description: 'Serviço completo de manutenção preventiva em equipamentos',
      price: 'R$ 150,00',
      duration: '2 horas',
      status: 'Ativo'
    },
    {
      id: '002',
      name: 'Instalação de Software',
      category: 'Instalação',
      description: 'Instalação e configuração de softwares diversos',
      price: 'R$ 80,00',
      duration: '1 hora',
      status: 'Ativo'
    },
    {
      id: '003',
      name: 'Reparo de Hardware',
      category: 'Reparo',
      description: 'Reparo de componentes e equipamentos eletrônicos',
      price: 'R$ 120,00',
      duration: '3 horas',
      status: 'Ativo'
    },
    {
      id: '004',
      name: 'Consultoria Técnica',
      category: 'Consultoria',
      description: 'Consultoria especializada em soluções tecnológicas',
      price: 'R$ 200,00',
      duration: '1 hora',
      status: 'Inativo'
    }
  ];

  // Dados de exemplo dos produtos/peças
  const products = [
    {
      id: '001',
      name: 'Fonte ATX 500W',
      category: 'Eletrônicos',
      description: 'Fonte de alimentação ATX 500W certificada',
      costPrice: 'R$ 80,00',
      salePrice: 'R$ 120,00',
      stock: 15,
      minStock: 5,
      supplier: 'TechParts Ltda'
    },
    {
      id: '002',
      name: 'Memória RAM 8GB DDR4',
      category: 'Eletrônicos',
      description: 'Memória RAM 8GB DDR4 2400MHz',
      costPrice: 'R$ 150,00',
      salePrice: 'R$ 220,00',
      stock: 8,
      minStock: 3,
      supplier: 'Components Inc'
    },
    {
      id: '003',
      name: 'Cabo HDMI 2m',
      category: 'Cabos',
      description: 'Cabo HDMI 2.0 de 2 metros',
      costPrice: 'R$ 15,00',
      salePrice: 'R$ 25,00',
      stock: 25,
      minStock: 10,
      supplier: 'Cables & More'
    }
  ];

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'Manutenção': { className: 'bg-blue-100 text-blue-800' },
      'Instalação': { className: 'bg-green-100 text-green-800' },
      'Reparo': { className: 'bg-yellow-100 text-yellow-800' },
      'Consultoria': { className: 'bg-purple-100 text-purple-800' },
      'Eletrônicos': { className: 'bg-indigo-100 text-indigo-800' },
      'Cabos': { className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig['Manutenção'];
    return <Badge className={config.className}>{category}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'Ativo' ? (
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
    );
  };

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return <Badge className="bg-red-100 text-red-800">Estoque Baixo</Badge>;
    } else if (stock <= minStock * 2) {
      return <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">OK</Badge>;
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateService = () => {
    toast({
      title: "Serviço Cadastrado",
      description: "O novo serviço foi cadastrado com sucesso!",
    });
    setIsNewServiceOpen(false);
  };

  const handleCreateProduct = () => {
    toast({
      title: "Produto Cadastrado",
      description: "O novo produto foi cadastrado com sucesso!",
    });
    setIsNewProductOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Serviços e Produtos</CardTitle>
              <CardDescription>Cadastre e gerencie serviços oferecidos e produtos utilizados</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isNewServiceOpen} onOpenChange={setIsNewServiceOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-green-50 hover:bg-green-100">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Serviço
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Serviço</DialogTitle>
                    <DialogDescription>
                      Cadastre um novo serviço oferecido pela empresa
                    </DialogDescription>
                  </DialogHeader>
                  <NewServiceForm onSubmit={handleCreateService} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Produto</DialogTitle>
                    <DialogDescription>
                      Cadastre um novo produto/peça no estoque
                    </DialogDescription>
                  </DialogHeader>
                  <NewProductForm onSubmit={handleCreateProduct} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="services" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Produtos/Peças</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={activeTab === 'services' ? "Buscar serviços..." : "Buscar produtos..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {activeTab === 'services' ? (
                    <>
                      <SelectItem value="Manutenção">Manutenção</SelectItem>
                      <SelectItem value="Instalação">Instalação</SelectItem>
                      <SelectItem value="Reparo">Reparo</SelectItem>
                      <SelectItem value="Consultoria">Consultoria</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                      <SelectItem value="Cabos">Cabos</SelectItem>
                      <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="services" className="mt-6">
              <ServicesTab 
                services={filteredServices} 
                getCategoryBadge={getCategoryBadge}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            
            <TabsContent value="products" className="mt-6">
              <ProductsTab 
                products={filteredProducts} 
                getCategoryBadge={getCategoryBadge}
                getStockBadge={getStockBadge}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente da aba de serviços
const ServicesTab = ({ services, getCategoryBadge, getStatusBadge }: any) => (
  <div className="grid gap-4">
    {services.map((service: any) => (
      <Card key={service.id} className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  {getCategoryBadge(service.category)}
                  {getStatusBadge(service.status)}
                </div>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Preço</p>
                  <p className="text-xl font-bold text-blue-700">{service.price}</p>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Componente da aba de produtos
const ProductsTab = ({ products, getCategoryBadge, getStockBadge }: any) => (
  <div className="grid gap-4">
    {products.map((product: any) => (
      <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  {getCategoryBadge(product.category)}
                  {getStockBadge(product.stock, product.minStock)}
                </div>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm text-gray-600">
                  <strong>Fornecedor:</strong> {product.supplier}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Custo</p>
                  <p className="text-lg font-bold text-red-700">{product.costPrice}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Venda</p>
                  <p className="text-lg font-bold text-green-700">{product.salePrice}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600">Estoque</p>
                  <p className="text-xl font-bold text-blue-700">{product.stock} un</p>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Formulário de novo serviço
const NewServiceForm = ({ onSubmit }: { onSubmit: () => void }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="serviceName">Nome do Serviço</Label>
        <Input placeholder="Digite o nome do serviço" />
      </div>
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manutencao">Manutenção</SelectItem>
            <SelectItem value="instalacao">Instalação</SelectItem>
            <SelectItem value="reparo">Reparo</SelectItem>
            <SelectItem value="consultoria">Consultoria</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    
    <div>
      <Label htmlFor="description">Descrição</Label>
      <Textarea placeholder="Descreva o serviço oferecido..." />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price">Preço</Label>
        <Input placeholder="R$ 0,00" />
      </div>
      <div>
        <Label htmlFor="duration">Duração Estimada</Label>
        <Input placeholder="Ex: 2 horas" />
      </div>
    </div>
    
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline">Cancelar</Button>
      <Button type="submit" className="bg-green-600 hover:bg-green-700">
        Cadastrar Serviço
      </Button>
    </div>
  </form>
);

// Formulário de novo produto
const NewProductForm = ({ onSubmit }: { onSubmit: () => void }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="productName">Nome do Produto</Label>
        <Input placeholder="Digite o nome do produto" />
      </div>
      <div>
        <Label htmlFor="category">Categoria</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eletronicos">Eletrônicos</SelectItem>
            <SelectItem value="cabos">Cabos</SelectItem>
            <SelectItem value="ferramentas">Ferramentas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    
    <div>
      <Label htmlFor="description">Descrição</Label>
      <Textarea placeholder="Descreva o produto..." />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="costPrice">Preço de Custo</Label>
        <Input placeholder="R$ 0,00" />
      </div>
      <div>
        <Label htmlFor="salePrice">Preço de Venda</Label>
        <Input placeholder="R$ 0,00" />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="stock">Estoque Inicial</Label>
        <Input type="number" placeholder="0" />
      </div>
      <div>
        <Label htmlFor="minStock">Estoque Mínimo</Label>
        <Input type="number" placeholder="0" />
      </div>
    </div>
    
    <div>
      <Label htmlFor="supplier">Fornecedor</Label>
      <Input placeholder="Nome do fornecedor" />
    </div>
    
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline">Cancelar</Button>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        Cadastrar Produto
      </Button>
    </div>
  </form>
);

export default ServicesManager;
