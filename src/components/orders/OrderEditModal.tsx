
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OrderEditModalProps {
  order: any;
  clients: any[];
  technicians: any[];
  services: any[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, data: any) => void;
}

const OrderEditModal = ({ 
  order, 
  clients, 
  technicians, 
  services, 
  isOpen, 
  onClose, 
  onSave 
}: OrderEditModalProps) => {
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

export default OrderEditModal;
