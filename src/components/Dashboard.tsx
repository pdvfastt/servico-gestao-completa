
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  Users,
  Calendar,
  Plus
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Dados de exemplo
  const stats = [
    {
      title: "OS Abertas",
      value: "24",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Em Andamento",
      value: "18",
      change: "+8%",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Finalizadas (Mês)",
      value: "142",
      change: "+25%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Faturamento (Mês)",
      value: "R$ 45.280",
      change: "+18%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const chartData = [
    { name: 'Jan', os: 65, faturamento: 28000 },
    { name: 'Fev', os: 59, faturamento: 32000 },
    { name: 'Mar', os: 80, faturamento: 45000 },
    { name: 'Abr', os: 81, faturamento: 48000 },
    { name: 'Mai', os: 56, faturamento: 35000 },
    { name: 'Jun', os: 55, faturamento: 38000 },
  ];

  const statusData = [
    { name: 'Abertas', value: 24, color: '#3b82f6' },
    { name: 'Em Andamento', value: 18, color: '#eab308' },
    { name: 'Aguardando Peças', value: 8, color: '#f97316' },
    { name: 'Finalizadas', value: 142, color: '#22c55e' },
  ];

  const recentOrders = [
    { id: '2024001', client: 'Tech Solutions Ltda', status: 'Em Andamento', priority: 'Alta', date: '2024-01-15' },
    { id: '2024002', client: 'João Silva', status: 'Aberta', priority: 'Média', date: '2024-01-15' },
    { id: '2024003', client: 'Empresa ABC', status: 'Aguardando Peças', priority: 'Baixa', date: '2024-01-14' },
    { id: '2024004', client: 'Maria Santos', status: 'Finalizada', priority: 'Alta', date: '2024-01-14' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Aberta': { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'Em Andamento': { variant: 'default' as const, className: 'bg-yellow-100 text-yellow-800' },
      'Aguardando Peças': { variant: 'default' as const, className: 'bg-orange-100 text-orange-800' },
      'Finalizada': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Aberta'];
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
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

  return (
    <div className="space-y-6">
      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change} vs mês anterior</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos e análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - OS por mês */}
        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço por Mês</CardTitle>
            <CardDescription>Quantidade de OS abertas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="os" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de pizza - Status das OS */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Status atual de todas as ordens de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ordens de serviço recentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ordens de Serviço Recentes</CardTitle>
              <CardDescription>Últimas OS cadastradas no sistema</CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova OS
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">OS #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.client}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </div>
                  {getPriorityBadge(order.priority)}
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
