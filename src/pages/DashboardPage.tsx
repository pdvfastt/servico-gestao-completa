
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const DashboardPage = () => {
  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: 'Total de Clientes',
      value: '124',
      change: '+2.5%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Ordens Abertas',
      value: '23',
      change: '+4.1%',
      icon: FileText,
      color: 'bg-orange-500'
    },
    {
      title: 'Concluídas Hoje',
      value: '8',
      change: '+12.3%',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Em Andamento',
      value: '15',
      change: '-2.1%',
      icon: Clock,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de ordens de serviço</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className={`ml-2 text-sm ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ordens Recentes</CardTitle>
            <CardDescription>Últimas ordens de serviço criadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">OS #{item.toString().padStart(3, '0')}</p>
                    <p className="text-xs text-gray-500">Cliente Example {item}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Há {item} horas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Métricas de desempenho do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Conclusão</span>
                <span className="text-sm text-gray-600">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tempo Médio</span>
                <span className="text-sm text-gray-600">2.5 dias</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Satisfação</span>
                <span className="text-sm text-gray-600">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
