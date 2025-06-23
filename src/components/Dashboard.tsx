import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Users, 
  Wrench, 
  DollarSign, 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useServices } from '@/hooks/useServices';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { orders, createOrder } = useServiceOrders();
  const { clients } = useClients();
  const { technicians } = useTechnicians();
  const { services } = useServices();
  const { records } = useFinancialRecords();

  const totalRevenue = records
    .filter(r => r.type === 'receita')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const totalExpenses = records
    .filter(r => r.type === 'despesa')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const netProfit = totalRevenue - totalExpenses;

  const completedOrders = orders.filter(o => o.status === 'Finalizada').length;
  const openOrders = orders.filter(o => o.status === 'Aberta').length;
  const inProgressOrders = orders.filter(o => o.status === 'Em Andamento').length;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const [isNewOrderOpen, setIsNewOrderOpen] = React.useState(false);

  const handleCreateOrder = async (orderData: any) => {
    const result = await createOrder(orderData);
    if (result?.success) {
      setIsNewOrderOpen(false);
    }
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu sistema de gestão
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              +2% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ordens de Serviço
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              {orders.filter(o => o.status === 'Aberta').length} em aberto
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita do Mês
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {records
                .filter(r => r.type === 'receita')
                .reduce((sum, r) => sum + (r.amount || 0), 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Técnicos Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {technicians.filter(t => t.status === 'Ativo').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {technicians.length} cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Status das Ordens de Serviço</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[
                { name: 'Aberta', value: orders.filter(o => o.status === 'Aberta').length },
                { name: 'Em Andamento', value: orders.filter(o => o.status === 'Em Andamento').length },
                { name: 'Finalizada', value: orders.filter(o => o.status === 'Finalizada').length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Aberta', value: orders.filter(o => o.status === 'Aberta').length },
                    { name: 'Em Andamento', value: orders.filter(o => o.status === 'Em Andamento').length },
                    { name: 'Finalizada', value: orders.filter(o => o.status === 'Finalizada').length },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#00C49F" />
                  <Cell fill="#FFBB28" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ordens de Serviço Recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ordens de Serviço Recentes</CardTitle>
              <CardDescription>
                Últimas 5 ordens de serviço criadas
              </CardDescription>
            </div>
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                  <DialogDescription>
                    Preencha os dados da nova ordem de serviço
                  </DialogDescription>
                </DialogHeader>
                <QuickOrderForm 
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
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma ordem de serviço encontrada
              </h3>
              <p className="text-gray-600">
                Comece criando sua primeira ordem de serviço.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const client = clients.find(c => c.id === order.client_id);
                const getStatusIcon = (status: string) => {
                  switch (status) {
                    case 'Finalizada':
                      return <CheckCircle className="h-4 w-4 text-green-600" />;
                    case 'Em Andamento':
                      return <Clock className="h-4 w-4 text-yellow-600" />;
                    default:
                      return <AlertCircle className="h-4 w-4 text-blue-600" />;
                  }
                };

                return (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-semibold">OS #{order.id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">{client?.name || 'Cliente não encontrado'}</p>
                        <p className="text-xs text-gray-500">{order.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                      {order.total_value && order.total_value > 0 && (
                        <span className="font-semibold text-green-600">
                          R$ {order.total_value.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para formulário rápido
const QuickOrderForm = ({ 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

      onSubmit(data);
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
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
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
                  {technicians.map(technician => (
                    <SelectItem key={technician.id} value={technician.id}>
                      {technician.name}
                    </SelectItem>
                  ))}
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
                {services.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R$ {service.price?.toFixed(2)}
                  </SelectItem>
                ))}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar OS'}
        </Button>
      </div>
    </form>
  );
};

export default Dashboard;
