
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
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';

const OrdersManager = () => {
  const { orders, loading, createOrder } = useServiceOrders();
  const { clients } = useClients();
  const { technicians } = useTechnicians();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

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
    const client = clients.find(c => c.id === order.client_id);
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = async (orderData: any) => {
    const result = await createOrder(orderData);
    if (result?.success) {
      setIsNewOrderOpen(false);
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
                <NewOrderForm 
                  onSubmit={handleCreateOrder}
                  clients={clients}
                  technicians={technicians}
                />
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

      {/* Lista de ordens */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {orders.length === 0 ? "Nenhuma OS encontrada" : "Nenhuma OS encontrada"}
            </h3>
            <p className="text-gray-600">
              {orders.length === 0 ? "Comece criando sua primeira ordem de serviço." : "Tente ajustar os filtros de busca."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const client = clients.find(c => c.id === order.client_id);
            const technician = technicians.find(t => t.id === order.technician_id);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">OS #{order.id.slice(-8)}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{client?.name || 'Cliente não encontrado'}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {getStatusBadge(order.status)}
                      {getPriorityBadge(order.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">{order.description}</p>
                  
                  {technician && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{technician.name}</span>
                    </div>
                  )}
                  
                  {order.expected_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.expected_date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  {order.total_value && order.total_value > 0 && (
                    <div className="text-lg font-semibold text-green-600">
                      R$ {order.total_value.toFixed(2)}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

// Componente do formulário de nova OS
const NewOrderForm = ({ 
  onSubmit, 
  clients, 
  technicians 
}: { 
  onSubmit: (data: any) => void;
  clients: any[];
  technicians: any[];
}) => {
  const [serviceValue, setServiceValue] = useState(0);
  const [partsValue, setPartsValue] = useState(0);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("Média");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const totalValue = serviceValue + partsValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    const data = {
      client_id: selectedClient || null,
      technician_id: selectedTechnician || null,
      priority: selectedPriority,
      expected_date: formDataObj.get('expectedDate') as string || null,
      description: formDataObj.get('description') as string,
      diagnosis: formDataObj.get('diagnosis') as string || null,
      observations: formDataObj.get('observations') as string || null,
      service_value: serviceValue || 0,
      parts_value: partsValue || 0,
      total_value: totalValue || 0,
      payment_method: selectedPaymentMethod || null,
    };

    console.log('Dados do formulário:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <SelectItem value="" disabled>Nenhum cliente cadastrado</SelectItem>
                  ) : (
                    clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="technician">Técnico Responsável</Label>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o técnico" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.length === 0 ? (
                    <SelectItem value="" disabled>Nenhum técnico cadastrado</SelectItem>
                  ) : (
                    technicians.map(technician => (
                      <SelectItem key={technician.id} value={technician.id}>
                        {technician.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expectedDate">Data Prevista</Label>
              <Input name="expectedDate" type="date" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição do Problema</Label>
            <Textarea 
              name="description"
              placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea 
              name="diagnosis"
              placeholder="Diagnóstico técnico do problema..."
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="observations">Observações Internas</Label>
            <Textarea 
              name="observations"
              placeholder="Observações visíveis apenas para a equipe..."
              className="min-h-[80px]"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serviceValue">Valor dos Serviços</Label>
              <Input 
                placeholder="0.00" 
                type="number" 
                step="0.01"
                value={serviceValue || ''}
                onChange={(e) => setServiceValue(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="partsValue">Valor das Peças</Label>
              <Input 
                placeholder="0.00" 
                type="number" 
                step="0.01"
                value={partsValue || ''}
                onChange={(e) => setPartsValue(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="totalValue">Valor Total</Label>
            <Input 
              placeholder="R$ 0,00" 
              value={`R$ ${totalValue.toFixed(2)}`}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
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
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Criar Ordem de Serviço
        </Button>
      </div>
    </form>
  );
};

export default OrdersManager;
