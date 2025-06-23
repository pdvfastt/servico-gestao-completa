
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Wrench, 
  DollarSign, 
  Activity,
  TrendingUp
} from "lucide-react";

interface StatsCardsProps {
  clientsCount: number;
  ordersCount: number;
  openOrders: number;
  totalRevenue: number;
  activeTechnicians: number;
  totalTechnicians: number;
}

const StatsCards = ({ 
  clientsCount, 
  ordersCount, 
  openOrders, 
  totalRevenue, 
  activeTechnicians, 
  totalTechnicians 
}: StatsCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="stat-card-blue border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-blue-700">
            Total de Clientes
          </CardTitle>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700 mb-2">{clientsCount}</div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-600 font-medium">
              +2% desde o mês passado
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card-green border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-green-700">
            Ordens de Serviço
          </CardTitle>
          <div className="bg-green-600 p-2 rounded-lg">
            <Wrench className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700 mb-2">{ordersCount}</div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{openOrders}</span> em aberto
          </p>
        </CardContent>
      </Card>

      <Card className="stat-card-purple border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-purple-700">
            Receita do Mês
          </CardTitle>
          <div className="bg-purple-600 p-2 rounded-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-700 mb-2">
            R$ {totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-600 font-medium">
              +20.1% desde o mês passado
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="stat-card border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">
            Técnicos Ativos
          </CardTitle>
          <div className="bg-gray-600 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-700 mb-2">
            {activeTechnicians}
          </div>
          <p className="text-sm text-gray-600">
            de <span className="font-semibold">{totalTechnicians}</span> cadastrados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
