
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Printer
} from "lucide-react";

interface OrderViewProps {
  order: any;
  client: any;
  technician: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const OrderView = ({ order, client, technician, isOpen, onClose, onEdit }: OrderViewProps) => {
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'Alta': { className: 'bg-red-100 text-red-800' },
      'Média': { className: 'bg-yellow-100 text-yellow-800' },
      'Baixa': { className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['Média'];
    return <Badge variant="outline" className={config.className}>{priority}</Badge>;
  };

  const generateOrderCode = (orderId: string) => {
    // Extrair apenas números do ID e pegar os últimos 6 dígitos
    const numbers = orderId.replace(/\D/g, '');
    return numbers.slice(-6).padStart(6, '0');
  };

  const handlePrint = (paperSize: '80mm' | 'A4') => {
    const orderCode = generateOrderCode(order.id);
    
    const printContent = `
      <html>
        <head>
          <title>OS ${orderCode}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              ${paperSize === '80mm' ? 'width: 80mm; font-size: 12px;' : 'width: 210mm; font-size: 14px; padding: 20px;'}
              color: #000;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #000; }
            .info-row { margin-bottom: 5px; }
            .label { font-weight: bold; }
            .value { margin-left: 10px; }
            .financial { border-top: 2px solid #000; padding-top: 10px; }
            .total { font-size: 16px; font-weight: bold; }
            ${paperSize === '80mm' ? '.no-print-80mm { display: none; }' : ''}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ORDEM DE SERVIÇO</h1>
            <h2>OS: ${orderCode}</h2>
            <p>Data: ${new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
          </div>

          ${client ? `
          <div class="section">
            <div class="section-title">DADOS DO CLIENTE</div>
            <div class="info-row"><span class="label">Nome:</span><span class="value">${client.name}</span></div>
            ${client.phone ? `<div class="info-row"><span class="label">Telefone:</span><span class="value">${client.phone}</span></div>` : ''}
            ${client.email ? `<div class="info-row"><span class="label">Email:</span><span class="value">${client.email}</span></div>` : ''}
            ${client.street ? `<div class="info-row"><span class="label">Endereço:</span><span class="value">${client.street}, ${client.number} - ${client.neighborhood}, ${client.city}</span></div>` : ''}
          </div>
          ` : ''}

          ${technician ? `
          <div class="section">
            <div class="section-title">TÉCNICO RESPONSÁVEL</div>
            <div class="info-row"><span class="label">Nome:</span><span class="value">${technician.name}</span></div>
            ${technician.phone ? `<div class="info-row"><span class="label">Telefone:</span><span class="value">${technician.phone}</span></div>` : ''}
            <div class="info-row"><span class="label">Nível:</span><span class="value">${technician.level}</span></div>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">DETALHES DO SERVIÇO</div>
            <div class="info-row"><span class="label">Status:</span><span class="value">${order.status}</span></div>
            <div class="info-row"><span class="label">Prioridade:</span><span class="value">${order.priority}</span></div>
            <div class="info-row"><span class="label">Descrição:</span></div>
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ccc;">
              ${order.description}
            </div>
            ${order.diagnosis ? `
            <div class="info-row"><span class="label">Diagnóstico:</span></div>
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ccc;">
              ${order.diagnosis}
            </div>
            ` : ''}
            ${order.observations ? `
            <div class="info-row"><span class="label">Observações:</span></div>
            <div style="margin: 10px 0; padding: 10px; border: 1px solid #ccc;">
              ${order.observations}
            </div>
            ` : ''}
            ${order.expected_date ? `
            <div class="info-row">
              <span class="label">Data Prevista:</span>
              <span class="value">${new Date(order.expected_date).toLocaleDateString('pt-BR')} às ${new Date(order.expected_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            ` : ''}
          </div>

          <div class="section financial">
            <div class="section-title">INFORMAÇÕES FINANCEIRAS</div>
            <div class="info-row">
              <span class="label">Valor dos Serviços:</span>
              <span class="value">R$ ${(order.service_value || 0).toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="label">Valor das Peças:</span>
              <span class="value">R$ ${(order.parts_value || 0).toFixed(2)}</span>
            </div>
            <hr style="margin: 10px 0;">
            <div class="info-row total">
              <span class="label">TOTAL:</span>
              <span class="value">R$ ${(order.total_value || 0).toFixed(2)}</span>
            </div>
            ${order.payment_method ? `
            <div class="info-row">
              <span class="label">Forma de Pagamento:</span>
              <span class="value" style="text-transform: capitalize;">${order.payment_method}</span>
            </div>
            ` : ''}
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 10px;">
            <p>_________________________________</p>
            <p>Assinatura do Cliente</p>
            <br>
            <p>_________________________________</p>
            <p>Assinatura do Técnico</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>OS #{generateOrderCode(order.id)}</DialogTitle>
              <DialogDescription>
                Criada em {new Date(order.created_at).toLocaleDateString('pt-BR')}
              </DialogDescription>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(order.status)}
              {getPriorityBadge(order.priority)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          {client && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Cliente
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Nome:</strong> {client.name}</p>
                {client.phone && (
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {client.phone}
                  </p>
                )}
                {client.email && (
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {client.email}
                  </p>
                )}
                {client.street && (
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {client.street}, {client.number} - {client.neighborhood}, {client.city}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Informações do Técnico */}
          {technician && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Técnico Responsável
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Nome:</strong> {technician.name}</p>
                {technician.phone && (
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {technician.phone}
                  </p>
                )}
                <p><strong>Nível:</strong> {technician.level}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Detalhes do Serviço */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Detalhes do Serviço
            </h3>
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

              {order.expected_date && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Data: {new Date(order.expected_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Horário: {new Date(order.expected_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Informações Financeiras */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Informações Financeiras
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Valor dos Serviços:</span>
                <span>R$ {(order.service_value || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor das Peças:</span>
                <span>R$ {(order.parts_value || 0).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">R$ {(order.total_value || 0).toFixed(2)}</span>
              </div>
              {order.payment_method && (
                <div className="flex justify-between">
                  <span>Forma de Pagamento:</span>
                  <span className="capitalize">{order.payment_method}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handlePrint('80mm')}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir 80mm
              </Button>
              <Button variant="outline" onClick={() => handlePrint('A4')}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir A4
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button onClick={onEdit}>
                Editar OS
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderView;
