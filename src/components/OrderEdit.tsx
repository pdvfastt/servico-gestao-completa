
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderEditProps {
  order: any;
  clients: any[];
  technicians: any[];
  services: any[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, data: any) => void;
}

const OrderEdit = ({ order, clients, technicians, services, isOpen, onClose, onSave }: OrderEditProps) => {
  const [serviceValue, setServiceValue] = useState(order?.service_value || 0);
  const [partsValue, setPartsValue] = useState(order?.parts_value || 0);
  const [selectedClient, setSelectedClient] = useState(order?.client_id || "");
  const [selectedTechnician, setSelectedTechnician] = useState(order?.technician_id || "");
  const [selectedService, setSelectedService] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "Aberta");
  const [selectedPriority, setSelectedPriority] = useState(order?.priority || "Média");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(order?.payment_method || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalValue = serviceValue + partsValue;

  useEffect(() => {
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

  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setServiceValue(service.price || 0);
    }
  };

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
      
      const data = {
        client_id: selectedClient || null,
        technician_id: selectedTechnician || null,
        status: selectedStatus,
        priority: selectedPriority,
        expected_date,
        description,
        diagnosis: (formDataObj.get('diagnosis') as string) || null,
        observations: (formDataObj.get('observations') as string) || null,
        service_value: serviceValue || 0,
        parts_value: partsValue || 0,
        total_value: totalValue || 0,
        payment_method: selectedPaymentMethod || null,
      };

      await onSave(order.id, data);
      onClose();
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
                  <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
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
                <Label htmlFor="service">Tipo de Serviço (Referência de Preço)</Label>
                <Select value={selectedService} onValueChange={handleServiceChange}>
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
              
              <div className="grid grid-cols-3 gap-4">
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
                <div>
                  <Label htmlFor="expectedDate">Data Prevista</Label>
                  <Input 
                    name="expectedDate" 
                    type="date" 
                    defaultValue={order.expected_date ? order.expected_date.split('T')[0] : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expectedTime">Horário Previsto</Label>
                <Input 
                  name="expectedTime" 
                  type="time" 
                  defaultValue={order.expected_date ? new Date(order.expected_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
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
              
              <div>
                <Label htmlFor="observations">Observações Internas</Label>
                <Textarea 
                  name="observations"
                  placeholder="Observações visíveis apenas para a equipe..."
                  className="min-h-[80px]"
                  defaultValue={order.observations || ''}
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

export default OrderEdit;
