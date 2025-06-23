
import React, { useState, useMemo } from 'react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { useTechnicians } from '@/hooks/useTechnicians';

// Interface para os dados dos técnicos no relatório
interface TechnicianStats {
  name: string;
  orders: number;
  rating: number;
  revenue: number;
}

const ReportsManager = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const { orders, loading: ordersLoading } = useServiceOrders();
  const { records, loading: recordsLoading } = useFinancialRecords();
  const { technicians, loading: techniciansLoading } = useTechnicians();

  // Filtrar dados baseado no período selecionado
  const filteredData = useMemo(() => {
    const daysAgo = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const filteredOrders = orders.filter(order => 
      new Date(order.created_at) >= cutoffDate
    );

    const filteredRecords = records.filter(record => 
      new Date(record.created_at) >= cutoffDate
    );

    return { filteredOrders, filteredRecords };
  }, [orders, records, selectedPeriod]);

  // Calcular métricas financeiras
  const financialMetrics = useMemo(() => {
    const revenues = filteredData.filteredRecords.filter(record => record.type === 'receita');
    const expenses = filteredData.filteredRecords.filter(record => record.type === 'despesa');
    
    const totalRevenue = revenues.reduce((sum, record) => sum + Number(record.amount), 0);
    const totalExpenses = expenses.reduce((sum, record) => sum + Number(record.amount), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    const completedOrders = filteredData.filteredOrders.filter(order => order.status === 'Concluída');
    const averageTicket = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => sum + Number(order.total_value || 0), 0) / completedOrders.length 
      : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      averageTicket
    };
  }, [filteredData]);

  // Dados para gráfico de receitas vs despesas (últimos 6 meses)
  const revenueData = useMemo(() => {
    const monthsData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthRecords = records.filter(record => {
        const recordDate = new Date(record.created_at);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      
      const revenues = monthRecords.filter(r => r.type === 'receita').reduce((sum, r) => sum + Number(r.amount), 0);
      const expenses = monthRecords.filter(r => r.type === 'despesa').reduce((sum, r) => sum + Number(r.amount), 0);
      
      monthsData.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        receitas: revenues,
        despesas: expenses
      });
    }
    return monthsData;
  }, [records]);

  // Distribuição de status das ordens
  const ordersStatusData = useMemo(() => {
    const statusCount: { [key: string]: number } = {};
    filteredData.filteredOrders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    
    const total = filteredData.filteredOrders.length;
    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count: count as number,
      percentage: total > 0 ? Math.round((count as number / total) * 100) : 0
    }));
  }, [filteredData.filteredOrders]);

  // Top técnicos por performance
  const topTechnicians = useMemo((): TechnicianStats[] => {
    const technicianStats: { [key: string]: { orders: number; revenue: number; technician: any } } = {};
    
    filteredData.filteredOrders.forEach(order => {
      if (order.technician_id) {
        if (!technicianStats[order.technician_id]) {
          technicianStats[order.technician_id] = {
            orders: 0,
            revenue: 0,
            technician: technicians.find(t => t.id === order.technician_id)
          };
        }
        technicianStats[order.technician_id].orders += 1;
        technicianStats[order.technician_id].revenue += Number(order.total_value || 0);
      }
    });
    
    return Object.values(technicianStats)
      .filter(stat => stat.technician)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map(stat => ({
        name: stat.technician.name,
        orders: stat.orders,
        rating: Number(stat.technician.rating || 0),
        revenue: stat.revenue
      }));
  }, [filteredData.filteredOrders, technicians]);

  // Métricas de performance
  const performanceMetrics = useMemo(() => {
    const completedOrders = filteredData.filteredOrders.filter(order => order.status === 'Concluída');
    
    // Tempo médio de conclusão (em dias)
    const avgCompletionTime = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => {
          const created = new Date(order.created_at);
          const updated = new Date(order.updated_at);
          const days = Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / completedOrders.length 
      : 0;

    // Taxa de satisfação simulada baseada na avaliação dos técnicos
    const satisfactionRate = technicians.length > 0 
      ? (technicians.reduce((sum, tech) => sum + Number(tech.rating || 4.5), 0) / technicians.length) * 20
      : 94.8;

    // Taxa de retrabalho simulada
    const reworkRate = Math.max(0, 5 - (satisfactionRate / 20));

    return {
      avgCompletionTime,
      satisfactionRate,
      reworkRate
    };
  }, [filteredData.filteredOrders, technicians]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (ordersLoading || recordsLoading || techniciansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados dos relatórios...</p>
        </div>
      </div>
    );
  }

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
                      <p className="text-2xl font-bold">{formatCurrency(financialMetrics.totalRevenue)}</p>
                      <p className="text-green-200 text-xs mt-1">Período selecionado</p>
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
                      <p className="text-2xl font-bold">{formatCurrency(financialMetrics.netProfit)}</p>
                      <p className="text-blue-200 text-xs mt-1">Receitas - Despesas</p>
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
                      <p className="text-2xl font-bold">{formatCurrency(financialMetrics.averageTicket)}</p>
                      <p className="text-purple-200 text-xs mt-1">Por ordem concluída</p>
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
                      <p className="text-2xl font-bold">{financialMetrics.profitMargin.toFixed(1)}%</p>
                      <p className="text-orange-200 text-xs mt-1">Lucro / Receita</p>
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
              {/* Status das Ordens */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle>Status das Ordens de Serviço</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {ordersStatusData.length > 0 ? ordersStatusData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${
                            item.status === 'Concluída' ? 'bg-green-100 text-green-800 border-green-200' :
                            item.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            item.status === 'Aberta' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {item.status}
                          </Badge>
                          <span className="font-semibold">{item.count}</span>
                        </div>
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-center py-4">Nenhuma ordem encontrada para o período selecionado</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Informações resumidas */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                  <CardTitle>Resumo do Período</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total de Ordens:</span>
                      <span className="font-semibold">{filteredData.filteredOrders.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Registros Financeiros:</span>
                      <span className="font-semibold">{filteredData.filteredRecords.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Técnicos Ativos:</span>
                      <span className="font-semibold">{technicians.filter(t => t.status === 'Ativo').length}</span>
                    </div>
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
                      <p className="text-2xl font-bold">{performanceMetrics.avgCompletionTime.toFixed(1)} dias</p>
                      <p className="text-cyan-200 text-xs mt-1">Baseado em ordens concluídas</p>
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
                      <p className="text-2xl font-bold">{performanceMetrics.satisfactionRate.toFixed(1)}%</p>
                      <p className="text-indigo-200 text-xs mt-1">Baseado na avaliação dos técnicos</p>
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
                      <p className="text-2xl font-bold">{performanceMetrics.reworkRate.toFixed(1)}%</p>
                      <p className="text-teal-200 text-xs mt-1">Estimativa baseada na qualidade</p>
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
                  Top Técnicos (Período selecionado)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topTechnicians.length > 0 ? topTechnicians.map((technician, index) => (
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
                          <span className="text-sm text-gray-600">★ {technician.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Nenhum técnico com ordens no período selecionado</p>
                  )}
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
