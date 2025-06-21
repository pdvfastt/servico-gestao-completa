
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Pause,
  Play,
  User,
  Phone,
  Calendar,
  DollarSign
} from "lucide-react";
import { useTechnicianOrders } from '@/hooks/useTechnicianOrders';
import { useIsMobile } from '@/hooks/use-mobile';

const TechnicianOrdersPage = () => {
  const { orders, loading, updateOrderStatus } = useTechnicianOrders();
  const isMobile = useIsMobile();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Finalizada':
        return <CheckCircle className="h-4 w-4" />;
      case 'Em Andamento':
        return <Play className="h-4 w-4" />;
      case 'Pausada':
        return <Pause className="h-4 w-4" />;
      case 'Pendente':
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pausada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pendente':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente', icon: Clock, color: 'bg-gray-500' },
    { value: 'Em Andamento', label: 'Em Andamento', icon: Play, color: 'bg-blue-500' },
    { value: 'Pausada', label: 'Pausada', icon: Pause, color: 'bg-yellow-500' },
    { value: 'Finalizada', label: 'Finalizada', icon: CheckCircle, color: 'bg-green-500' },
  ];

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-8 w-8 text-orange-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Ordens de Serviço</h1>
          <p className="text-gray-600">Gerencie suas ordens de serviço atribuídas</p>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.map((status) => {
          const count = orders.filter(order => order.status === status.value).length;
          const Icon = status.icon;
          return (
            <Card key={status.value} className="stat-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${status.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">{status.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de Ordens */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço</CardTitle>
          <CardDescription>
            {orders.length} ordem(ns) de serviço atribuída(s) a você
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma ordem de serviço
              </h3>
              <p className="text-gray-600">
                Você não possui ordens de serviço atribuídas no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {isMobile ? (
                // Layout mobile - Cards
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">OS #{order.id.slice(-8)}</h3>
                            <Badge className={`${getStatusColor(order.status)} border`}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>{order.status}</span>
                              </div>
                            </Badge>
                          </div>
                          
                          <p className="text-gray-700 text-sm">{order.description}</p>
                          
                          {order.clients && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{order.clients.name}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(order.created_at || '').toLocaleDateString('pt-BR')}</span>
                          </div>
                          
                          {order.total_value && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <DollarSign className="h-4 w-4" />
                              <span>R$ {order.total_value.toFixed(2)}</span>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {statusOptions.map((status) => (
                              <Button
                                key={status.value}
                                variant={order.status === status.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleStatusChange(order.id, status.value)}
                                className="text-xs"
                                disabled={order.status === status.value}
                              >
                                <status.icon className="h-3 w-3 mr-1" />
                                {status.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Layout desktop - Tabela
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OS</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          #{order.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.clients?.name || 'N/A'}</p>
                            {order.clients?.phone && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {order.clients.phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{order.description}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(order.status)}
                              <span>{order.status}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at || '').toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {order.total_value ? `R$ ${order.total_value.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {statusOptions.map((status) => (
                              <Button
                                key={status.value}
                                variant={order.status === status.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleStatusChange(order.id, status.value)}
                                disabled={order.status === status.value}
                                className="p-2"
                                title={status.label}
                              >
                                <status.icon className="h-3 w-3" />
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianOrdersPage;
