
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  User
} from "lucide-react";
import Dashboard from "@/components/Dashboard";
import OrdersManager from "@/components/OrdersManager";
import ClientsManager from "@/components/ClientsManager";
import TechniciansManager from "@/components/TechniciansManager";
import ServicesManager from "@/components/ServicesManager";
import FinancialManager from "@/components/FinancialManager";
import ReportsManager from "@/components/ReportsManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Sistema de Gestão de OS
              </h1>
              <p className="text-gray-600">
                Controle completo de ordens de serviço e gestão empresarial
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Sistema Online
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Administrador</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Ordens de Serviço</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="technicians" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Técnicos</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsManager />
          </TabsContent>

          <TabsContent value="technicians">
            <TechniciansManager />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialManager />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
