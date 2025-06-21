
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Wrench, DollarSign, AlertCircle, Plus } from 'lucide-react';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const { orders, createOrder } = useServiceOrders();
  const { clients } = useClients();
  const { technicians } = useTechnicians();
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    technician_id: '',
    description: '',
    priority: 'Média',
    expected_date: ''
  });

  const recentOrders = orders.slice(0, 5);
  const openOrders = orders.filter(order => order.status === 'Aberta').length;
  const inProgressOrders = orders.filter(order => order.status === 'Em Andamento').length;

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description) {
      return;
    }

    setIsSubmitting(true);
    
    const result = await createOrder({
      client_id: formData.client_id || null,
      technician_id: formData.technician_id || null,
      description: formData.description,
      priority: formData.priority as 'Alta' | 'Média' | 'Baixa',
      expected_date: formData.expected_date || null
    });

    if (result.success) {
      setFormData({
        client_id: '',
        technician_id: '',
        description: '',
        priority: 'Média',
        expected_date: ''
      });
      setIsCreateOrderOpen(false);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aberta': return 'bg-blue-100 text-blue-800';
      case 'Em Andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Finalizada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Métricas principais */}
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
              clientes cadastrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              OSs Abertas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOrders}</div>
            <p className="text-xs text-muted-foreground">
              aguardando atendimento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Andamento
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressOrders}</div>
            <p className="text-xs text-muted-foreground">
              sendo executadas
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
              disponíveis para serviços
            </p>
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
            <Button onClick={() => setIsCreateOrderOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova OS
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma ordem de serviço encontrada.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Data Criação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.description.length > 50 
                        ? `${order.description.substring(0, 50)}...` 
                        : order.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar nova OS */}
      <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
            <DialogDescription>
              Crie uma nova ordem de serviço rapidamente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="client_id">Cliente</Label>
              <Select value={formData.client_id} onValueChange={(value) => handleInputChange('client_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="technician_id">Técnico</Label>
              <Select value={formData.technician_id} onValueChange={(value) => handleInputChange('technician_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o técnico (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.filter(t => t.status === 'Ativo').map((technician) => (
                    <SelectItem key={technician.id} value={technician.id}>
                      {technician.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Descrição do Problema</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o problema ou serviço solicitado..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="expected_date">Data Prevista</Label>
                <Input
                  id="expected_date"
                  type="date"
                  value={formData.expected_date}
                  onChange={(e) => handleInputChange('expected_date', e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Ordem de Serviço'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
