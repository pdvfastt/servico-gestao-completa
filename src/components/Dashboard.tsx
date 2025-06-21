
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
  // Empty data states - will be replaced with real data from database
  const stats = [
    {
      title: "OS Abertas",
      value: "0",
      change: "+0%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Em Andamento",
      value: "0",
      change: "+0%",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Finalizadas (Mês)",
      value: "0",
      change: "+0%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Faturamento (Mês)",
      value: "R$ 0,00",
      change: "+0%",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  const chartData = [];
  const statusData = [];
  const recentOrders = [];

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
            <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum dado disponível</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de pizza - Status das OS */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Status atual de todas as ordens de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum dado disponível</p>
              </div>
            </div>
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
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma OS encontrada</h3>
              <p className="text-gray-600">Comece criando sua primeira ordem de serviço.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
