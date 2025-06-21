
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  PieChart,
  Users,
  Wrench,
  DollarSign,
  Clock
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts';

const ReportsManager = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  
  // Dados simulados para demonstração
  const revenueData = [
    { month: 'Jan', receitas: 45000, despesas: 32000 },
    { month: 'Fev', receitas: 52000, despesas: 35000 },
    { month: 'Mar', receitas: 48000, despesas: 33000 },
    { month: 'Abr', receitas: 61000, despesas: 40000 },
    { month: 'Mai', receitas: 55000, despesas: 38000 },
    { month: 'Jun', receitas: 67000, despesas: 42000 },
  ];

  const servicesData = [
    { name: 'Manutenção', value: 35, color: '#3B82F6' },
    { name: 'Instalação', value: 25, color: '#10B981' },
    { name: 'Reparo', value: 20, color: '#F59E0B' },
    { name: 'Consultoria', value: 20, color: '#8B5CF6' },
  ];

  const ordersStatusData = [
    { status: 'Concluídas', count: 156, percentage: 65 },
    { status: 'Em Andamento', count: 45, percentage: 19 },
    { status: 'Pendentes', count: 28, percentage: 12 },
    { status: 'Canceladas', count: 10, percentage: 4 },
  ];

  const topTechnicians = [
    { name: 'João Silva', orders: 23, rating: 4.8, revenue: 15420 },
    { name: 'Maria Santos', orders: 19, rating: 4.9, revenue: 13250 },
    { name: 'Pedro Costa', orders: 17, rating: 4.7, revenue: 12100 },
    { name: 'Ana Oliveira', orders: 15, rating: 4.6, revenue: 10850 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Relatórios e Análises
          </h1>
          <p className="text-gray-600">
            Visualize métricas e insights do seu negócio
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Equipe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            {/* Cards de Métricas Financeiras */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Receita Total</p>
                      <p className="text-2xl font-bold">R$ 328.000</p>
                      <p className="text-green-200 text-xs mt-1">↗ +12% vs mês anterior</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Lucro Líquido</p>
                      <p className="text-2xl font-bold">R$ 108.000</p>
                      <p className="text-blue-200 text-xs mt-1">↗ +8% vs mês anterior</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Ticket Médio</p>
                      <p className="text-2xl font-bold">R$ 1.367</p>
                      <p className="text-purple-200 text-xs mt-1">↗ +5% vs mês anterior</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Margem de Lucro</p>
                      <p className="text-2xl font-bold">32.9%</p>
                      <p className="text-orange-200 text-xs mt-1">↗ +2.1% vs mês anterior</p>
                    </div>
                    <PieChart className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Receitas vs Despesas */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                <CardTitle>Receitas vs Despesas (Últimos 6 meses)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                    <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição de Serviços */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                  <CardTitle>Distribuição de Serviços</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={servicesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {servicesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {servicesData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status das Ordens */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle>Status das Ordens de Serviço</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {ordersStatusData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${
                            item.status === 'Concluídas' ? 'bg-green-100 text-green-800 border-green-200' :
                            item.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            item.status === 'Pendentes' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {item.status}
                          </Badge>
                          <span className="font-semibold">{item.count}</span>
                        </div>
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Métricas de Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-100 text-sm">Tempo Médio de Conclusão</p>
                      <p className="text-2xl font-bold">3.2 dias</p>
                      <p className="text-cyan-200 text-xs mt-1">↘ -0.5 dias vs mês anterior</p>
                    </div>
                    <Clock className="h-8 w-8 text-cyan-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm">Taxa de Satisfação</p>
                      <p className="text-2xl font-bold">94.8%</p>
                      <p className="text-indigo-200 text-xs mt-1">↗ +1.2% vs mês anterior</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-sm">Taxa de Retrabalho</p>
                      <p className="text-2xl font-bold">2.1%</p>
                      <p className="text-teal-200 text-xs mt-1">↘ -0.8% vs mês anterior</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-teal-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            {/* Top Técnicos */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Técnicos (Este mês)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topTechnicians.map((technician, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-full font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{technician.name}</h4>
                          <p className="text-sm text-gray-600">{technician.orders} ordens concluídas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(technician.revenue)}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">★ {technician.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsManager;
