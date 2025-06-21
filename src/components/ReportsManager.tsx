
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Settings,
  DollarSign,
  Clock,
  CheckCircle,
  FileX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportsManager = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState("os-status");
  const [dateRange, setDateRange] = useState("last-30-days");

  const reportTypes = [
    {
      id: 'os-status',
      title: 'Status das OS',
      description: 'Distribuição por status das ordens de serviço',
      icon: BarChart3,
      chart: 'pie'
    },
    {
      id: 'technician-performance',
      title: 'Performance dos Técnicos',
      description: 'Análise de produtividade da equipe técnica',
      icon: Users,
      chart: 'bar'
    },
    {
      id: 'monthly-os',
      title: 'OS por Período',
      description: 'Evolução mensal das ordens de serviço',
      icon: TrendingUp,
      chart: 'line'
    },
    {
      id: 'client-analysis',
      title: 'Análise de Clientes',
      description: 'Ranking e análise dos melhores clientes',
      icon: Users,
      chart: 'table'
    },
    {
      id: 'service-analysis',
      title: 'Análise de Serviços',
      description: 'Performance dos serviços oferecidos',
      icon: Settings,
      chart: 'bar'
    },
    {
      id: 'financial-summary',
      title: 'Resumo Financeiro',
      description: 'Visão geral das finanças do período',
      icon: DollarSign,
      chart: 'mixed'
    }
  ];

  const handleGenerateReport = () => {
    toast({
      title: "Relatório Gerado",
      description: "O relatório foi gerado com sucesso e está pronto para download!",
    });
  };

  const renderChart = () => {
    return (
      <div className="flex items-center justify-center h-400 bg-gray-50 rounded-lg">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado disponível</h3>
          <p className="text-gray-600">Dados dos relatórios aparecerão aqui quando houver informações cadastradas no sistema.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Central de Relatórios</CardTitle>
          <CardDescription>Gere relatórios detalhados para análise e tomada de decisões</CardDescription>
        </CardHeader>
      </Card>

      {/* Filtros e seleção de relatório */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reportType">Tipo de Relatório</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o relatório" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last-90-days">Últimos 90 dias</SelectItem>
                  <SelectItem value="this-month">Este mês</SelectItem>
                  <SelectItem value="last-month">Mês passado</SelectItem>
                  <SelectItem value="this-year">Este ano</SelectItem>
                  <SelectItem value="custom">Período customizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input type="date" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={handleGenerateReport}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Área do relatório */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {reportTypes.find(r => r.id === selectedReport)?.title || 'Relatório'}
                </CardTitle>
                <CardDescription>
                  {reportTypes.find(r => r.id === selectedReport)?.description || 'Descrição do relatório'}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Período: {dateRange === 'last-30-days' ? 'Últimos 30 dias' : 'Período selecionado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>
      </div>

      {/* Tipos de relatórios disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>Explore todos os tipos de relatórios disponíveis no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card 
                  key={report.id} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedReport === report.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedReport === report.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de OS</p>
                <p className="text-3xl font-bold text-blue-700">0</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                <p className="text-3xl font-bold text-green-700">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-3xl font-bold text-yellow-700">0</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-3xl font-bold text-red-700">0</p>
              </div>
              <FileX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManager;
