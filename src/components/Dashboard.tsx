
import React from 'react';
import { BarChart3 } from "lucide-react";
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useServices } from '@/hooks/useServices';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import StatsCards from './dashboard/StatsCards';
import ChartsSection from './dashboard/ChartsSection';
import RecentOrders from './dashboard/RecentOrders';

const Dashboard = () => {
  const { orders, createOrder, deleteOrder } = useServiceOrders();
  const { clients } = useClients();
  const { technicians } = useTechnicians();
  const { services } = useServices();
  const { records } = useFinancialRecords();

  const totalRevenue = records
    .filter(r => r.type === 'receita')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const totalExpenses = records
    .filter(r => r.type === 'despesa')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const netProfit = totalRevenue - totalExpenses;

  const completedOrders = orders.filter(o => o.status === 'Finalizada').length;
  const openOrders = orders.filter(o => o.status === 'Aberta').length;
  const inProgressOrders = orders.filter(o => o.status === 'Em Andamento').length;

  const activeTechnicians = technicians.filter(t => t.status === 'Ativo').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-gray-500 to-red-500 flex flex-col">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-red-600 to-gray-600 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Visão geral do seu sistema de gestão
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Stats Cards */}
        <StatsCards
          clientsCount={clients.length}
          ordersCount={orders.length}
          openOrders={openOrders}
          totalRevenue={totalRevenue}
          activeTechnicians={activeTechnicians}
          totalTechnicians={technicians.length}
        />

        {/* Charts Section */}
        <ChartsSection
          openOrders={openOrders}
          inProgressOrders={inProgressOrders}
          completedOrders={completedOrders}
        />

        {/* Recent Orders Section */}
        <RecentOrders
          orders={orders}
          clients={clients}
          technicians={technicians}
          services={services}
          onCreateOrder={createOrder}
          onDeleteOrder={deleteOrder}
        />
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-8 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://i.postimg.cc/CLbCMsnH/logotecm.png" 
              alt="Tecmax Logo" 
              className="h-10 w-auto"
            />
            <p className="text-sm">&copy; 2024 Tecmax. Todos os direitos reservados.</p>
          </div>
          <p className="text-xs text-gray-400">Versão 1.0.1</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
