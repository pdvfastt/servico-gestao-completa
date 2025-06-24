
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface ClientPrintProps {
  client: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClientPrint = ({ client, open, onOpenChange }: ClientPrintProps) => {
  const handlePrint = (format: '80mm' | 'A4') => {
    if (!client) return;
    
    const printContent = `
      <html>
        <head>
          <title>Cliente ${client.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              ${format === '80mm' ? 'width: 80mm; font-size: 12px;' : 'width: 210mm; font-size: 14px; padding: 20px;'}
              color: #000;
            }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #000; }
            .info-row { margin-bottom: 5px; display: flex; }
            .label { font-weight: bold; width: ${format === '80mm' ? '40%' : '30%'}; }
            .value { flex: 1; }
            ${format === '80mm' ? '.no-print-80mm { display: none; }' : ''}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DADOS DO CLIENTE</h1>
            <p>Impresso em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>

          <div class="section">
            <div class="section-title">INFORMAÇÕES PESSOAIS</div>
            <div class="info-row">
              <span class="label">Nome:</span>
              <span class="value">${client.name}</span>
            </div>
            ${client.fantasy_name ? `
            <div class="info-row">
              <span class="label">Nome Fantasia:</span>
              <span class="value">${client.fantasy_name}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">Tipo:</span>
              <span class="value">${client.type}</span>
            </div>
            <div class="info-row">
              <span class="label">Documento:</span>
              <span class="value">${client.document}</span>
            </div>
            ${client.secondary_document ? `
            <div class="info-row">
              <span class="label">Documento Sec.:</span>
              <span class="value">${client.secondary_document}</span>
            </div>
            ` : ''}
            ${client.birth_date ? `
            <div class="info-row">
              <span class="label">Data Nasc.:</span>
              <span class="value">${new Date(client.birth_date).toLocaleDateString('pt-BR')}</span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">CONTATO</div>
            <div class="info-row">
              <span class="label">Telefone:</span>
              <span class="value">${client.phone}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${client.email}</span>
            </div>
            ${client.contact_person ? `
            <div class="info-row">
              <span class="label">Contato:</span>
              <span class="value">${client.contact_person}</span>
            </div>
            ` : ''}
          </div>

          ${client.street ? `
          <div class="section">
            <div class="section-title">ENDEREÇO</div>
            <div class="info-row">
              <span class="label">Rua:</span>
              <span class="value">${client.street}, ${client.number || 'S/N'}</span>
            </div>
            ${client.complement ? `
            <div class="info-row">
              <span class="label">Complemento:</span>
              <span class="value">${client.complement}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">Bairro:</span>
              <span class="value">${client.neighborhood || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Cidade:</span>
              <span class="value">${client.city || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Estado:</span>
              <span class="value">${client.state || 'N/A'}</span>
            </div>
            ${client.cep ? `
            <div class="info-row">
              <span class="label">CEP:</span>
              <span class="value">${client.cep}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">INFORMAÇÕES GERAIS</div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="value">${client.status}</span>
            </div>
            <div class="info-row">
              <span class="label">Cadastrado em:</span>
              <span class="value">${new Date(client.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            <div class="info-row">
              <span class="label">Última atualização:</span>
              <span class="value">${new Date(client.updated_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          ${format === 'A4' ? `
          <div style="margin-top: 40px; text-align: center; font-size: 12px; border-top: 1px solid #000; padding-top: 10px;">
            <p>Sistema de Gestão de OS - Relatório de Cliente</p>
          </div>
          ` : ''}
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
    
    onOpenChange(false);
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Imprimir Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>Selecione o formato de impressão para o cliente <strong>{client.name}</strong>:</p>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={() => handlePrint('80mm')}
              className="justify-start"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir 80mm (Térmica)
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handlePrint('A4')}
              className="justify-start"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir A4 (Completo)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientPrint;
