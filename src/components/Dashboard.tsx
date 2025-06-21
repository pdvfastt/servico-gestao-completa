
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
  TrendingDown,
  BarChart3,
  Activity
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

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  const [isNewOrderOpen, setIsNewOrderOpen] = React.useState(false);

  const handleCreateOrder = async (orderData: any) => {
    const result = await createOrder(orderData);
    if (result?.success) {
      setIsNewOrderOpen(false);
    }
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Visão geral do seu sistema de gestão
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card-blue border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700">
                Total de Clientes
              </CardTitle>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-2">{clients.length}</div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600 font-medium">
                  +2% desde o mês passado
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card-green border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-green-700">
                Ordens de Serviço
              </CardTitle>
              <div className="bg-green-600 p-2 rounded-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-2">{orders.length}</div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{openOrders}</span> em aberto
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-purple border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700">
                Receita do Mês
              </CardTitle>
              <div className="bg-purple-600 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-2">
                R$ {totalRevenue.toFixed(2)}
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600 font-medium">
                  +20.1% desde o mês passado
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Técnicos Ativos
              </CardTitle>
              <div className="bg-gray-600 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700 mb-2">
                {technicians.filter(t => t.status === 'Ativo').length}
              </div>
              <p className="text-sm text-gray-600">
                de <span className="font-semibold">{technicians.length}</span> cadastrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center space-x-2">
                <BarChart3 className="h-6 w-6" />
                <span>Status das Ordens de Serviço</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={[
                  { name: 'Aberta', value: openOrders },
                  { name: 'Em Andamento', value: inProgressOrders },
                  { name: 'Finalizada', value: completedOrders },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="value" fill="url(#blueGreenGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center space-x-2">
                <Activity className="h-6 w-6" />
                <span>Distribuição por Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Aberta', value: openOrders },
                      { name: 'Em Andamento', value: inProgressOrders },
                      { name: 'Finalizada', value: completedOrders },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6" />
                <div>
                  <CardTitle className="text-xl">Ordens de Serviço Recentes</CardTitle>
                  <CardDescription className="text-green-100">
                    Últimas 5 ordens de serviço criadas
                  </CardDescription>
                </div>
              </div>
              <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-green-600 hover:bg-green-50 border-0 shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova OS
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      Nova Ordem de Serviço
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
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
          <CardContent className="p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl inline-block mb-4">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma ordem de serviço encontrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando sua primeira ordem de serviço.
                </p>
                <Button 
                  onClick={() => setIsNewOrderOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira OS
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order, index) => {
                  const client = clients.find(c => c.id === order.client_id);
                  const getStatusIcon = (status: string) => {
                    switch (status) {
                      case 'Finalizada':
                        return <CheckCircle className="h-5 w-5 text-green-600" />;
                      case 'Em Andamento':
                        return <Clock className="h-5 w-5 text-blue-600" />;
                      default:
                        return <AlertCircle className="h-5 w-5 text-purple-600" />;
                    }
                  };

                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'Finalizada':
                        return 'bg-green-100 text-green-700 border-green-200';
                      case 'Em Andamento':
                        return 'bg-blue-100 text-blue-700 border-blue-200';
                      default:
                        return 'bg-purple-100 text-purple-700 border-purple-200';
                    }
                  };

                  return (
                    <div 
                      key={order.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r ${
                        index % 3 === 0 ? 'from-blue-50 to-blue-100 border-blue-200' :
                        index % 3 === 1 ? 'from-green-50 to-green-100 border-green-200' :
                        'from-purple-50 to-purple-100 border-purple-200'
                      } hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-gray-800">OS #{order.id.slice(-8)}</p>
                          <p className="text-gray-600 font-medium">{client?.name || 'Cliente não encontrado'}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{order.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getStatusColor(order.status)} border font-medium px-3 py-1`}>
                          {order.status}
                        </Badge>
                        {order.total_value && order.total_value > 0 && (
                          <div className="bg-white px-3 py-1 rounded-lg border shadow-sm">
                            <span className="font-bold text-green-600">
                              R$ {order.total_value.toFixed(2)}
                            </span>
                          </div>
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
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-green-100">
          <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Dados Básicos</TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Dados Técnicos</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-white data-[state=active]:shadow-md">Dados Financeiros</TabsTrigger>
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
          className="border-gray-300 hover:bg-gray-50"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0 shadow-lg"
        >
          {isSubmitting ? 'Criando...' : 'Criar OS'}
        </Button>
      </div>
    </form>
  );
};

export default Dashboard;
