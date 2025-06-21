
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
  FileText, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrdersManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // Dados de exemplo das ordens de serviço
  const orders = [
    {
      id: '2024001',
      client: 'Tech Solutions Ltda',
      clientPhone: '(11) 99999-9999',
      technician: 'João Santos',
      description: 'Manutenção preventiva em servidores',
      status: 'Em Andamento',
      priority: 'Alta',
      createdDate: '2024-01-15',
      expectedDate: '2024-01-20',
      value: 'R$ 2.500,00'
    },
    {
      id: '2024002',
      client: 'Maria Silva',
      clientPhone: '(11) 88888-8888',
      technician: 'Pedro Costa',
      description: 'Reparo em impressora laser',
      status: 'Aberta',
      priority: 'Média',
      createdDate: '2024-01-15',
      expectedDate: '2024-01-18',
      value: 'R$ 350,00'
    },
    {
      id: '2024003',
      client: 'Empresa ABC Ltda',
      clientPhone: '(11) 77777-7777',
      technician: 'Ana Lima',
      description: 'Instalação de sistema de monitoramento',
      status: 'Aguardando Peças',
      priority: 'Baixa',
      createdDate: '2024-01-14',
      expectedDate: '2024-01-25',
      value: 'R$ 4.200,00'
    },
    {
      id: '2024004',
      client: 'Carlos Mendes',
      clientPhone: '(11) 66666-6666',
      technician: 'Roberto Silva',
      description: 'Formatação e instalação de programas',
      status: 'Finalizada',
      priority: 'Alta',
      createdDate: '2024-01-12',
      expectedDate: '2024-01-14',
      value: 'R$ 200,00'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Aberta': { className: 'bg-blue-100 text-blue-800', icon: FileText },
      'Em Andamento': { className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Aguardando Peças': { className: 'bg-orange-100 text-orange-800', icon: AlertCircle },
      'Finalizada': { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Cancelada': { className: 'bg-red-100 text-red-800', icon: AlertCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aberta'];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'Alta': { className: 'bg-red-100 text-red-800' },
      'Média': { className: 'bg-yellow-100 text-yellow-800' },
      'Baixa': { className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['Média'];
    return <Badge variant="outline" className={config.className}>{priority}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = () => {
    toast({
      title: "Ordem de Serviço Criada",
      description: "A nova OS foi criada com sucesso!",
    });
    setIsNewOrderOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Ordens de Serviço</CardTitle>
              <CardDescription>Controle e acompanhe todas as ordens de serviço</CardDescription>
            </div>
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova OS
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                  <DialogDescription>
                    Preencha os dados da nova ordem de serviço
                  </DialogDescription>
                </DialogHeader>
                <NewOrderForm onSubmit={handleCreateOrder} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número, cliente ou descrição..."
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
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Aguardando Peças">Aguardando Peças</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de ordens de serviço */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">OS #{order.id}</h3>
                      {getStatusBadge(order.status)}
                      {getPriorityBadge(order.priority)}
                    </div>
                    <p className="text-gray-600 mb-1">{order.client}</p>
                    <p className="text-sm text-gray-500">{order.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <User className="h-4 w-4 mr-1" />
                      {order.technician}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Criada: {order.createdDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Previsão: {order.expectedDate}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{order.value}</p>
                    <div className="flex items-center space-x-2 mt-2">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma OS encontrada</h3>
            <p className="text-gray-600">Tente alterar os filtros ou criar uma nova ordem de serviço.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componente do formulário de nova OS
const NewOrderForm = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
          <TabsTrigger value="technical">Dados Técnicos</TabsTrigger>
          <TabsTrigger value="financial">Dados Financeiros</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Cliente</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Tech Solutions Ltda</SelectItem>
                  <SelectItem value="client2">Maria Silva</SelectItem>
                  <SelectItem value="client3">João Santos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="technician">Técnico Responsável</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech1">João Santos</SelectItem>
                  <SelectItem value="tech2">Pedro Costa</SelectItem>
                  <SelectItem value="tech3">Ana Lima</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expectedDate">Data Prevista</Label>
              <Input type="date" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição do Problema</Label>
            <Textarea 
              placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea 
              placeholder="Diagnóstico técnico do problema..."
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="observations">Observações Internas</Label>
            <Textarea 
              placeholder="Observações visíveis apenas para a equipe..."
              className="min-h-[80px]"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceValue">Valor dos Serviços</Label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div>
              <Label htmlFor="partsValue">Valor das Peças</Label>
              <Input placeholder="R$ 0,00" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="totalValue">Valor Total</Label>
            <Input placeholder="R$ 0,00" />
          </div>
          
          <div>
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Criar Ordem de Serviço
        </Button>
      </div>
    </form>
  );
};

export default OrdersManager;
