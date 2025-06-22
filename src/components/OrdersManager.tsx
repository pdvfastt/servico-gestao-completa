
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useServices } from '@/hooks/useServices';
import OrderView from '@/components/OrderView';
import OrdersFilters from './orders/OrdersFilters';
import OrdersTable from './orders/OrdersTable';
import NewOrderForm from './orders/NewOrderForm';
import OrderEditModal from './orders/OrderEditModal';

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
    const numbers = orderId.replace(/\D/g, '');
    return numbers.slice(-6).padStart(6, '0');
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

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      await deleteOrder(orderId);
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
                  orders={orders}
                  onDelete={handleDeleteOrder}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <OrdersFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />
        </CardContent>
      </Card>

      {/* Tabela de ordens */}
      <Card>
        <CardContent className="p-0">
          <OrdersTable
            orders={filteredOrders}
            clients={clients}
            technicians={technicians}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onShare={handleShareWhatsApp}
          />
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

export default OrdersManager;
