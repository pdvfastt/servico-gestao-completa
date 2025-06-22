import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Trash2
} from "lucide-react";
import QuickOrderForm from './QuickOrderForm';

interface RecentOrdersProps {
  orders: any[];
  clients: any[];
  technicians: any[];
  services: any[];
  onCreateOrder: (data: any) => Promise<{ success: boolean; data?: any; error?: any }> | { success: boolean; data?: any; error?: any };
  onDeleteOrder: (orderId: string) => void;
}

const RecentOrders = ({ 
  orders, 
  clients, 
  technicians, 
  services, 
  onCreateOrder, 
  onDeleteOrder 
}: RecentOrdersProps) => {
  const [isNewOrderOpen, setIsNewOrderOpen] = React.useState(false);

  const handleCreateOrder = async (orderData: any) => {
    try {
      const result = await onCreateOrder(orderData);
      if (result?.success) {
        setIsNewOrderOpen(false);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      await onDeleteOrder(orderId);
    }
  };

  const recentOrders = orders.slice(0, 5);

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
                orders={orders}
                onDelete={handleDeleteOrder}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
