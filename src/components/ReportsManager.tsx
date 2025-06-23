
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportsManager = () => {
  const { orders } = useServiceOrders();
  const { clients } = useClients();
  const { technicians } = useTechnicians();
  const { records } = useFinancialRecords();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    status: '',
    technician: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let reportData: any[] = [];
      let reportTitle = '';
      
      switch (filters.type) {
        case 'orders':
          reportData = orders.filter(order => {
            let matches = true;
            if (filters.status && order.status !== filters.status) matches = false;
            if (filters.technician && order.technician_id !== filters.technician) matches = false;
            if (filters.startDate && order.created_at && new Date(order.created_at) < new Date(filters.startDate)) matches = false;
            if (filters.endDate && order.created_at && new Date(order.created_at) > new Date(filters.endDate)) matches = false;
            return matches;
          });
          reportTitle = 'Relatório de Ordens de Serviço';
          break;
          
        case 'financial':
          reportData = records.filter(record => {
            let matches = true;
            if (filters.startDate && new Date(record.date) < new Date(filters.startDate)) matches = false;
            if (filters.endDate && new Date(record.date) > new Date(filters.endDate)) matches = false;
            return matches;
          });
          reportTitle = 'Relatório Financeiro';
          break;
          
        case 'clients':
          reportData = clients;
          reportTitle = 'Relatório de Clientes';
          break;
          
        case 'technicians':
          reportData = technicians;
          reportTitle = 'Relatório de Técnicos';
          break;
      }
      
      console.log('Dados do relatório:', reportData);
      
      toast({
        title: "Relatório Gerado",
        description: `${reportTitle} foi gerado com sucesso! ${reportData.length} registros encontrados.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = () => {
    if (!filters.type) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de relatório primeiro.",
        variant: "destructive",
      });
      return;
    }

    // Simular exportação
    let data: any[] = [];
    let filename = '';
    
    switch (filters.type) {
      case 'orders':
        data = orders;
        filename = 'relatorio-ordens-servico.csv';
        break;
      case 'financial':
        data = records;
        filename = 'relatorio-financeiro.csv';
        break;
      case 'clients':
        data = clients;
        filename = 'relatorio-clientes.csv';
        break;
      case 'technicians':
        data = technicians;
        filename = 'relatorio-tecnicos.csv';
        break;
    }

    if (data.length === 0) {
      toast({
        title: "Aviso",
        description: "Não há dados para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Converter dados para CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação Concluída",
      description: `Arquivo ${filename} foi baixado com sucesso!`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Central de Relatórios</h2>
        <p className="text-muted-foreground">
          Gere e exporte relatórios detalhados
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configuração do Relatório */}
        <Card>
          <CardHeader>
            <CardTitle>Configurar Relatório</CardTitle>
            <CardDescription>
              Selecione os parâmetros para gerar o relatório
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="type">Tipo de Relatório</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orders">Ordens de Serviço</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="clients">Clientes</SelectItem>
                  <SelectItem value="technicians">Técnicos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {filters.type === 'orders' && (
              <>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Aberta">Aberta</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Finalizada">Finalizada</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="technician">Técnico</Label>
                  <Select value={filters.technician} onValueChange={(value) => handleFilterChange('technician', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os técnicos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Button 
                onClick={generateReport} 
                className="w-full" 
                disabled={isGenerating || !filters.type}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={exportReport} 
                className="w-full"
                disabled={!filters.type}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resumo dos Dados */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo dos Dados</CardTitle>
            <CardDescription>
              Visão geral dos dados disponíveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total de Ordens de Serviço</span>
                <span className="text-sm text-muted-foreground">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total de Clientes</span>
                <span className="text-sm text-muted-foreground">{clients.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total de Técnicos</span>
                <span className="text-sm text-muted-foreground">{technicians.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Registros Financeiros</span>
                <span className="text-sm text-muted-foreground">{records.length}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">OSs Abertas</span>
                  <span className="text-sm text-muted-foreground">
                    {orders.filter(o => o.status === 'Aberta').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">OSs Em Andamento</span>
                  <span className="text-sm text-muted-foreground">
                    {orders.filter(o => o.status === 'Em Andamento').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">OSs Finalizadas</span>
                  <span className="text-sm text-muted-foreground">
                    {orders.filter(o => o.status === 'Finalizada').length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManager;
