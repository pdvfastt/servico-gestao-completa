
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
  Share, 
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
    
    const message = `
🔧 *ORDEM DE SERVIÇO #${order.id.slice(-8)}*

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
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.slice(-8)}</TableCell>
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
                          <Button variant="outline" size="sm" onClick={() => handleShareWhatsApp(order)}>
                            <Share className="h-4 w-4" />
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
      <OrderViewModal
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

  const [showSerialField, setShowSerialField] = React.useState(false);
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
      setShowSerialField(service.name?.toLowerCase().includes('instalação npd') || false);
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

    if (showSerialField && !formState.serialReceiver) {
      alert('Serial do Receptor é obrigatório para Instalação NPD');
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
      if (showSerialField && formState.serialReceiver) {
        fullDescription += `\nSerial Receptor: ${formState.serialReceiver}`;
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

          {showSerialField && (
            <div>
              <Label htmlFor="serialReceiver">Serial Receptor *</Label>
              <Input 
                placeholder="Digite o serial do receptor"
                value={formState.serialReceiver}
                onChange={(e) => updateFormState('serialReceiver', e.target.value)}
                required={showSerialField}
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

// Modal para visualizar ordem
const OrderViewModal = ({ order, client, technician, isOpen, onClose, onEdit }: any) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Aberta': { className: 'bg-blue-100 text-blue-800' },
      'Em Andamento': { className: 'bg-yellow-100 text-yellow-800' },
      'Aguardando Peças': { className: 'bg-orange-100 text-orange-800' },
      'Finalizada': { className: 'bg-green-100 text-green-800' },
      'Cancelada': { className: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aberta'];
    return <Badge variant="outline" className={config.className}>{status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>OS #{order.id.slice(-8)}</DialogTitle>
              <DialogDescription>
                Criada em {new Date(order.created_at).toLocaleDateString('pt-BR')}
              </DialogDescription>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(order.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {client && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Cliente</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Nome:</strong> {client.name}</p>
                <p><strong>Telefone:</strong> {client.phone}</p>
                <p><strong>Email:</strong> {client.email}</p>
              </div>
            </div>
          )}

          {technician && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Técnico Responsável</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Nome:</strong> {technician.name}</p>
                <p><strong>Telefone:</strong> {technician.phone}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">Detalhes do Serviço</h3>
            <div className="space-y-4">
              <div>
                <strong>Descrição:</strong>
                <p className="mt-1 text-gray-700">{order.description}</p>
              </div>
              
              {order.diagnosis && (
                <div>
                  <strong>Diagnóstico:</strong>
                  <p className="mt-1 text-gray-700">{order.diagnosis}</p>
                </div>
              )}
              
              {order.observations && (
                <div>
                  <strong>Observações:</strong>
                  <p className="mt-1 text-gray-700">{order.observations}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Financeiras</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Valor dos Serviços:</span>
                <span>R$ {(order.service_value || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor das Peças:</span>
                <span>R$ {(order.parts_value || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">R$ {(order.total_value || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={onEdit}>
              Editar OS
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar OS #{order.id.slice(-8)}</DialogTitle>
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
