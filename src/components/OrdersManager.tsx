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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  FileText, 
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useServices } from '@/hooks/useServices';
import OrderView from '@/components/OrderView';

const OrdersManager = () => {
  console.log('OrdersManager: Componente carregando...');
  
  const { orders, loading, createOrder, updateOrder, deleteOrder } = useServiceOrders();
  const { clients } = useClients();
  const { technicians } = useTechnicians();
  const { services } = useServices();
  
  console.log('OrdersManager: Hooks carregados', { orders: orders?.length, clients: clients?.length, technicians: technicians?.length, services: services?.length, loading });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const generateOrderCode = (orderId: string) => {
    // Extrair apenas números do ID e pegar os últimos 6 dígitos
    const numbers = orderId.replace(/\D/g, '');
    return numbers.slice(-6).padStart(6, '0');
  };

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

  const filteredOrders = orders.filter(order => {
    const client = clients.find(c => c.id === order.client_id);
    const orderCode = generateOrderCode(order.id);
    const matchesSearch = orderCode.includes(searchTerm) ||
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

  const handleShareWhatsApp = (order: any) => {
    const client = clients.find(c => c.id === order.client_id);
    const technician = technicians.find(t => t.id === order.technician_id);
    const orderCode = generateOrderCode(order.id);
    
    const message = `
🔧 *ORDEM DE SERVIÇO #${orderCode}*

👤 *Cliente:* ${client?.name || 'N/A'}
📱 *Telefone:* ${client?.phone || 'N/A'}

📋 *Descrição:* ${order.description}
${order.diagnosis ? `🔍 *Diagnóstico:* ${order.diagnosis}` : ''}

📊 *Status:* ${order.status}
⚡ *Prioridade:* ${order.priority}
👨‍🔧 *Técnico:* ${technician?.name || 'Não atribuído'}

💰 *Valor Total:* R$ ${(order.total_value || 0).toFixed(2)}

📅 *Criada em:* ${new Date(order.created_at).toLocaleDateString('pt-BR')}
${order.expected_date ? `🕐 *Data Prevista:* ${new Date(order.expected_date).toLocaleDateString('pt-BR')}` : ''}

---
Sistema de Gestão de OS
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  console.log('OrdersManager: Renderizando componente');

  if (loading) {
    console.log('OrdersManager: Mostrando loading');
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log('OrdersManager: Renderizando interface principal');

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
                  services={services}
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

      {/* Tabela de ordens */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {orders.length === 0 ? "Nenhuma OS encontrada" : "Nenhuma OS encontrada"}
              </h3>
              <p className="text-gray-600">
                {orders.length === 0 ? "Comece criando sua primeira ordem de serviço." : "Tente ajustar os filtros de busca."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OS</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const client = clients.find(c => c.id === order.client_id);
                  const technician = technicians.find(t => t.id === order.technician_id);
                  const orderCode = generateOrderCode(order.id);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{orderCode}</TableCell>
                      <TableCell>{client?.name || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{order.description}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{technician?.name || 'Não atribuído'}</TableCell>
                      <TableCell>R$ {(order.total_value || 0).toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleShareWhatsApp(order)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedOrder && (
        <OrderView
          order={selectedOrder}
          client={selectedOrder ? clients.find(c => c.id === selectedOrder.client_id) : null}
          technician={selectedOrder ? technicians.find(t => t.id === selectedOrder.technician_id) : null}
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
      )}

      {selectedOrder && (
        <OrderEditModal
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
      )}
    </div>
  );
};

// Componente do formulário de nova OS
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
  // Estados para persistir TODOS os dados do formulário
  const [formState, setFormState] = React.useState({
    // Dados Básicos
    selectedClient: "",
    selectedTechnician: "",
    selectedService: "",
    selectedPriority: "Média",
    invoiceNumber: "",
    serialReceiver: "",
    serialTvBox: "",
    expectedDate: "",
    expectedTime: "",
    
    // Dados Técnicos
    description: "",
    diagnosis: "",
    observations: "",
    
    // Dados Financeiros
    serviceValue: 0,
    partsValue: 0,
    selectedPaymentMethod: ""
  });

  const [showSerialReceiverField, setShowSerialReceiverField] = React.useState(false);
  const [showSerialTvBoxField, setShowSerialTvBoxField] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalValue = formState.serviceValue + formState.partsValue;

  const updateFormState = (field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (serviceId: string) => {
    updateFormState('selectedService', serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      updateFormState('serviceValue', service.price || 0);
      
      // Verificar se deve mostrar campo Serial Receptor
      const showReceiver = service.name?.toLowerCase().includes('cad serial elsys');
      setShowSerialReceiverField(showReceiver);
      
      // Verificar se deve mostrar campo Serial TvBox
      const showTvBox = service.name?.toLowerCase().includes('cad serial tvbox');
      setShowSerialTvBoxField(showTvBox);
      
      // Limpar campos quando não são necessários
      if (!showReceiver) updateFormState('serialReceiver', '');
      if (!showTvBox) updateFormState('serialTvBox', '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!formState.description || formState.description.trim() === '') {
      alert('Descrição é obrigatória');
      return;
    }

    if (!formState.invoiceNumber) {
      alert('Número da Nota Fiscal é obrigatório');
      return;
    }

    if (showSerialReceiverField && !formState.serialReceiver) {
      alert('Serial do Receptor é obrigatório para este tipo de serviço');
      return;
    }

    if (showSerialTvBoxField && !formState.serialTvBox) {
      alert('Serial TvBox é obrigatório para este tipo de serviço');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let expected_date = null;
      if (formState.expectedDate) {
        if (formState.expectedTime) {
          expected_date = `${formState.expectedDate}T${formState.expectedTime}:00`;
        } else {
          expected_date = `${formState.expectedDate}T09:00:00`;
        }
      }
      
      let fullDescription = formState.description.trim();
      if (formState.invoiceNumber) {
        fullDescription += `\n\nNº Nota Fiscal: ${formState.invoiceNumber}`;
      }
      if (showSerialReceiverField && formState.serialReceiver) {
        fullDescription += `\nSerial Receptor: ${formState.serialReceiver}`;
      }
      if (showSerialTvBoxField && formState.serialTvBox) {
        fullDescription += `\nSerial TvBox: ${formState.serialTvBox}`;
      }
      
      const data = {
        client_id: formState.selectedClient || null,
        technician_id: formState.selectedTechnician || null,
        priority: formState.selectedPriority,
        expected_date,
        description: fullDescription,
        diagnosis: formState.diagnosis || null,
        observations: formState.observations || null,
        service_value: formState.serviceValue || 0,
        parts_value: formState.partsValue || 0,
        total_value: totalValue || 0,
        payment_method: formState.selectedPaymentMethod || null,
        status: 'Aberta'
      };

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
              <Select value={formState.selectedClient} onValueChange={(value) => updateFormState('selectedClient', value)}>
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
              <Select value={formState.selectedTechnician} onValueChange={(value) => updateFormState('selectedTechnician', value)}>
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
            <Label htmlFor="service">Tipo de Serviço</Label>
            <Select value={formState.selectedService} onValueChange={handleServiceChange}>
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

          <div>
            <Label htmlFor="invoiceNumber">Nº da Nota Fiscal *</Label>
            <Input 
              type="number"
              placeholder="Digite o número da nota fiscal"
              value={formState.invoiceNumber}
              onChange={(e) => updateFormState('invoiceNumber', e.target.value)}
              required
            />
          </div>

          {showSerialReceiverField && (
            <div>
              <Label htmlFor="serialReceiver">Serial Receptor *</Label>
              <Input 
                placeholder="Digite o serial do receptor"
                value={formState.serialReceiver}
                onChange={(e) => updateFormState('serialReceiver', e.target.value)}
                required={showSerialReceiverField}
              />
            </div>
          )}

          {showSerialTvBoxField && (
            <div>
              <Label htmlFor="serialTvBox">Serial TvBox *</Label>
              <Input 
                placeholder="Digite o serial do TvBox"
                value={formState.serialTvBox}
                onChange={(e) => updateFormState('serialTvBox', e.target.value)}
                required={showSerialTvBoxField}
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formState.selectedPriority} onValueChange={(value) => updateFormState('selectedPriority', value)}>
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
              <Input 
                type="date"
                value={formState.expectedDate}
                onChange={(e) => updateFormState('expectedDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expectedTime">Horário Previsto</Label>
            <Input 
              type="time"
              value={formState.expectedTime}
              onChange={(e) => updateFormState('expectedTime', e.target.value)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição do Problema *</Label>
            <Textarea 
              placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
              className="min-h-[100px]"
              value={formState.description}
              onChange={(e) => updateFormState('description', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea 
              placeholder="Diagnóstico técnico do problema..."
              className="min-h-[100px]"
              value={formState.diagnosis}
              onChange={(e) => updateFormState('diagnosis', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="observations">Observações Internas</Label>
            <Textarea 
              placeholder="Observações visíveis apenas para a equipe..."
              className="min-h-[80px]"
              value={formState.observations}
              onChange={(e) => updateFormState('observations', e.target.value)}
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
                value={formState.serviceValue || ''}
                onChange={(e) => updateFormState('serviceValue', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="partsValue">Valor das Peças</Label>
              <Input 
                placeholder="0.00" 
                type="number" 
                step="0.01"
                value={formState.partsValue || ''}
                onChange={(e) => updateFormState('partsValue', parseFloat(e.target.value) || 0)}
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
            <Select value={formState.selectedPaymentMethod} onValueChange={(value) => updateFormState('selectedPaymentMethod', value)}>
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

// Modal para editar ordem
const OrderEditModal = ({ order, clients, technicians, services, isOpen, onClose, onSave }: any) => {
  const [serviceValue, setServiceValue] = useState(order?.service_value || 0);
  const [partsValue, setPartsValue] = useState(order?.parts_value || 0);
  const [selectedClient, setSelectedClient] = useState(order?.client_id || "");
  const [selectedTechnician, setSelectedTechnician] = useState(order?.technician_id || "");
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "Aberta");
  const [selectedPriority, setSelectedPriority] = useState(order?.priority || "Média");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(order?.payment_method || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalValue = serviceValue + partsValue;

  React.useEffect(() => {
    if (order) {
      setServiceValue(order.service_value || 0);
      setPartsValue(order.parts_value || 0);
      setSelectedClient(order.client_id || "");
      setSelectedTechnician(order.technician_id || "");
      setSelectedStatus(order.status || "Aberta");
      setSelectedPriority(order.priority || "Média");
      setSelectedPaymentMethod(order.payment_method || "");
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    const description = (formDataObj.get('description') as string)?.trim();
    
    if (!description) {
      alert('Descrição é obrigatória');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = {
        client_id: selectedClient || null,
        technician_id: selectedTechnician || null,
        status: selectedStatus,
        priority: selectedPriority,
        description,
        diagnosis: (formDataObj.get('diagnosis') as string) || null,
        observations: (formDataObj.get('observations') as string) || null,
        service_value: serviceValue || 0,
        parts_value: partsValue || 0,
        total_value: totalValue || 0,
        payment_method: selectedPaymentMethod || null,
      };

      await onSave(order.id, data);
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  const generateOrderCode = (orderId: string) => {
    const numbers = orderId.replace(/\D/g, '');
    return numbers.slice(-6).padStart(6, '0');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar OS #{generateOrderCode(order.id)}</DialogTitle>
          <DialogDescription>
            Altere as informações da ordem de serviço
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Cliente</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
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
                  {technicians.map((technician: any) => (
                    <SelectItem key={technician.id} value={technician.id}>
                      {technician.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aberta">Aberta</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Aguardando Peças">Aguardando Peças</SelectItem>
                  <SelectItem value="Finalizada">Finalizada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>

          <div>
            <Label htmlFor="description">Descrição do Problema *</Label>
            <Textarea 
              name="description"
              placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
              className="min-h-[100px]"
              defaultValue={order.description}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea 
              name="diagnosis"
              placeholder="Diagnóstico técnico do problema..."
              className="min-h-[100px]"
              defaultValue={order.diagnosis || ''}
            />
          </div>

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
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersManager;
