
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Trash2 } from "lucide-react";
import BarcodeScanner from '@/components/BarcodeScanner';

interface NewOrderFormProps {
  onSubmit: (data: any) => void;
  clients: any[];
  technicians: any[];
  services: any[];
  orders: any[];
  onDelete: (orderId: string) => void;
}

const NewOrderForm = ({ 
  onSubmit, 
  clients, 
  technicians,
  services,
  orders,
  onDelete 
}: NewOrderFormProps) => {
  const [formState, setFormState] = React.useState({
    selectedClient: "",
    selectedTechnician: "",
    selectedService: "",
    selectedPriority: "Média",
    invoiceNumber: "",
    serialReceiver: "",
    serialTvBox: "",
    expectedDate: "",
    expectedTime: "",
    description: "",
    diagnosis: "",
    observations: "",
    serviceValue: 0,
    partsValue: 0,
    selectedPaymentMethod: "",
    selectedStatus: "Aberta"
  });

  const [showSerialReceiverField, setShowSerialReceiverField] = React.useState(false);
  const [showSerialTvBoxField, setShowSerialTvBoxField] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isReceiverScannerOpen, setIsReceiverScannerOpen] = React.useState(false);
  const [isTvBoxScannerOpen, setIsTvBoxScannerOpen] = React.useState(false);

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
      
      const serviceName = service.name?.toLowerCase() || '';
      const showReceiver = serviceName.includes('cad serial elsys') ||
                          serviceName.includes('cad serial rec - elsys');
      setShowSerialReceiverField(showReceiver);
      
      const showTvBox = serviceName.includes('cad serial tvbox');
      setShowSerialTvBoxField(showTvBox);
      
      if (!showReceiver) updateFormState('serialReceiver', '');
      if (!showTvBox) updateFormState('serialTvBox', '');
    }
  };

  const handleReceiverScan = (code: string) => {
    updateFormState('serialReceiver', code);
    setIsReceiverScannerOpen(false);
  };

  const handleTvBoxScan = (code: string) => {
    updateFormState('serialTvBox', code);
    setIsTvBoxScannerOpen(false);
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
        status: formState.selectedStatus
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Erro no submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="technical">Dados Técnicos</TabsTrigger>
            <TabsTrigger value="financial">Dados Financeiros</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar OS</TabsTrigger>
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
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Digite o serial do receptor"
                    value={formState.serialReceiver}
                    onChange={(e) => updateFormState('serialReceiver', e.target.value)}
                    required={showSerialReceiverField}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsReceiverScannerOpen(true)}
                    className="px-3"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {showSerialTvBoxField && (
              <div>
                <Label htmlFor="serialTvBox">Serial TvBox *</Label>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Digite o serial do TvBox"
                    value={formState.serialTvBox}
                    onChange={(e) => updateFormState('serialTvBox', e.target.value)}
                    required={showSerialTvBoxField}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsTvBoxScannerOpen(true)}
                    className="px-3"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
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
                <Label htmlFor="status">Status</Label>
                <Select value={formState.selectedStatus} onValueChange={(value) => updateFormState('selectedStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aberta">Aberta</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Pausada">Pausada</SelectItem>
                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedDate">Data Prevista</Label>
                <Input 
                  type="date"
                  value={formState.expectedDate}
                  onChange={(e) => updateFormState('expectedDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expectedTime">Horário Previsto</Label>
                <Input 
                  type="time"
                  value={formState.expectedTime}
                  onChange={(e) => updateFormState('expectedTime', e.target.value)}
                />
              </div>
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

          <TabsContent value="manage" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Gerenciar Ordens de Serviço</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma ordem de serviço encontrada
                  </div>
                ) : (
                  orders.map((order) => {
                    const client = clients.find(c => c.id === order.client_id);
                    return (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium">OS #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">{client?.name || 'Cliente não encontrado'}</p>
                          <p className="text-xs text-gray-500 truncate">{order.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {order.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(order.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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

      <BarcodeScanner
        isOpen={isReceiverScannerOpen}
        onClose={() => setIsReceiverScannerOpen(false)}
        onScan={handleReceiverScan}
        title="Escanear Serial do Receptor"
      />

      <BarcodeScanner
        isOpen={isTvBoxScannerOpen}
        onClose={() => setIsTvBoxScannerOpen(false)}
        onScan={handleTvBoxScan}
        title="Escanear Serial do TvBox"
      />
    </>
  );
};

export default NewOrderForm;
