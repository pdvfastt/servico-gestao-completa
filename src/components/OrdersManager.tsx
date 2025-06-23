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
  AlertCircle,
  Download
} from "lucide-react";
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useServices } from '@/hooks/useServices';
import OrderView from './OrderView';
import OrderEdit from './OrderEdit';

const OrdersManager = () => {
  const { orders, loading, createOrder, updateOrder, deleteOrder } = useServiceOrders();
  const { clients } = useClients();
  const { technicians } = useTechnicians();
  const { services } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
    console.log('HandleCreateOrder chamado com:', orderData);
    const result = await createOrder(orderData);
    console.log('Resultado da criação:', result);
    
    if (result?.success) {
      setIsNewOrderOpen(false);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  const handleSaveOrder = async (orderId: string, data: any) => {
    const result = await updateOrder(orderId, data);
    if (result?.success) {
      setIsEditOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      await deleteOrder(orderId);
    }
  };

  const exportToPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Relatório de Ordens de Serviço</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .status-aberta { background-color: #dbeafe; color: #1e40af; }
            .status-andamento { background-color: #fef3c7; color: #92400e; }
            .status-finalizada { background-color: #dcfce7; color: #166534; }
          </style>
        </head>
        <body>
          <h1>Relatório de Ordens de Serviço</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          <table>
            <thead>
              <tr>
                <th>OS</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Valor Total</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => {
                const client = clients.find(c => c.id === order.client_id);
                return `
                  <tr>
                    <td>#${order.id.slice(-8)}</td>
                    <td>${client?.name || 'N/A'}</td>
                    <td><span class="status status-${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span></td>
                    <td>${order.priority}</td>
                    <td>R$ ${(order.total_value || 0).toFixed(2)}</td>
                    <td>${new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedClient = selectedOrder ? clients.find(c => c.id === selectedOrder.client_id) : null;
  const selectedTechnician = selectedOrder ? technicians.find(t => t.id === selectedOrder.technician_id) : null;

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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={exportToPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
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
                    services={services}
                  />
                </DialogContent>
              </Dialog>
            </div>
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
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{new Date(order.expected_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                  
                  {order.total_value && order.total_value > 0 && (
                    <div className="text-lg font-semibold text-green-600">
                      R$ {order.total_value.toFixed(2)}
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <OrderView
        order={selectedOrder}
        client={selectedClient}
        technician={selectedTechnician}
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedOrder(null);
        }}
        onEdit={() => {
          setIsViewOpen(false);
          setIsEditOpen(true);
        }}
      />

      <OrderEdit
        order={selectedOrder}
        clients={clients}
        technicians={technicians}
        services={services}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedOrder(null);
        }}
        onSave={handleSaveOrder}
      />
    </div>
  );
};

// Componente do formulário de nova OS com novos campos
const NewOrderForm = ({ 
  onSubmit, 
  clients, 
  technicians,
  services 
}: { 
  onSubmit: (data: any) => void;
  clients: any[];
  technicians: any[];
  services: any[];
}) => {
  const [serviceValue, setServiceValue] = useState(0);
  const [partsValue, setPartsValue] = useState(0);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("Média");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSerialField, setShowSerialField] = useState(false);

  const totalValue = serviceValue + partsValue;

  // Verificar se é serviço de Instalação NPD
  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setServiceValue(service.price || 0);
      // Mostrar campo Serial Receptor se for Instalação NPD
      setShowSerialField(service.name?.toLowerCase().includes('instalação npd') || false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    const description = (formDataObj.get('description') as string)?.trim();
    const invoiceNumber = formDataObj.get('invoiceNumber') as string;
    const serialReceiver = formDataObj.get('serialReceiver') as string;
    
    if (!description) {
      alert('Descrição é obrigatória');
      return;
    }

    if (!invoiceNumber) {
      alert('Número da Nota Fiscal é obrigatório');
      return;
    }

    if (showSerialField && !serialReceiver) {
      alert('Serial do Receptor é obrigatório para Instalação NPD');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const expectedDateStr = formDataObj.get('expectedDate') as string;
      const expectedTimeStr = formDataObj.get('expectedTime') as string;
      
      let expected_date = null;
      if (expectedDateStr) {
        if (expectedTimeStr) {
          expected_date = `${expectedDateStr}T${expectedTimeStr}:00`;
        } else {
          expected_date = `${expectedDateStr}T09:00:00`;
        }
      }
      
      let fullDescription = description;
      if (invoiceNumber) {
        fullDescription += `\n\nNº Nota Fiscal: ${invoiceNumber}`;
      }
      if (showSerialField && serialReceiver) {
        fullDescription += `\nSerial Receptor: ${serialReceiver}`;
      }
      
      const data = {
        client_id: selectedClient || null,
        technician_id: selectedTechnician || null,
        priority: selectedPriority,
        expected_date,
        description: fullDescription,
        diagnosis: (formDataObj.get('diagnosis') as string) || null,
        observations: (formDataObj.get('observations') as string) || null,
        service_value: serviceValue || 0,
        parts_value: partsValue || 0,
        total_value: totalValue || 0,
        payment_method: selectedPaymentMethod || null,
        status: 'Aberta'
      };

      console.log('Dados a serem enviados:', data);
      await onSubmit(data);
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
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

          <div>
            <Label htmlFor="service">Tipo de Serviço (Referência de Preço)</Label>
            <Select value={selectedService} onValueChange={handleServiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.length === 0 ? (
                  <SelectItem value="" disabled>Nenhum serviço cadastrado</SelectItem>
                ) : (
                  services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - R$ {service.price?.toFixed(2)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Campo obrigatório: Número da Nota Fiscal */}
          <div>
            <Label htmlFor="invoiceNumber">Nº da Nota Fiscal *</Label>
            <Input 
              name="invoiceNumber"
              type="number"
              placeholder="Digite o número da nota fiscal"
              required
            />
          </div>

          {/* Campo condicional: Serial Receptor (apenas para Instalação NPD) */}
          {showSerialField && (
            <div>
              <Label htmlFor="serialReceiver">Serial Receptor *</Label>
              <Input 
                name="serialReceiver"
                placeholder="Digite o serial do receptor"
                required={showSerialField}
              />
            </div>
          )}
          
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

          <div>
            <Label htmlFor="expectedTime">Horário Previsto</Label>
            <Input name="expectedTime" type="time" />
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição do Problema *</Label>
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
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => window.location.reload()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar Ordem de Serviço'}
        </Button>
      </div>
    </form>
  );
};

export default OrdersManager;
