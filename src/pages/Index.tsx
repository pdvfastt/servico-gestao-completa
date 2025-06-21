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
  User,
  LogOut,
  Wrench,
  Cog
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import Dashboard from "@/components/Dashboard";
import ClientsManager from "@/components/ClientsManager";
import TechniciansManager from "@/components/TechniciansManager";
import ServicesManager from "@/components/ServicesManager";
import FinancialManager from "@/components/FinancialManager";
import ReportsManager from "@/components/ReportsManager";
import OrdersManager from "@/components/OrdersManager";
import SettingsManager from "@/components/SettingsManager";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserManagement();
  const { settings } = useCompanySettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-cyan-50">
      <div className="container mx-auto p-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-cyan-500 p-3 rounded-xl shadow-md">
                {settings?.company_logo_url ? (
                  <img 
                    src={settings.company_logo_url} 
                    alt="Logo" 
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <Settings className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {settings?.company_name || 'Sistema de Gestão de OS'}
                </h1>
                <p className="text-gray-600 text-lg">
                  Controle completo de ordens de serviço e gestão empresarial
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PWAInstallPrompt />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Sistema Online
              </Badge>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                <TabsList className={`w-full ${isAdmin ? 'grid-cols-8' : 'grid-cols-7'} bg-transparent h-auto p-2 gap-1`}>
                  <TabsTrigger 
                    value="dashboard" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Ordens de Serviço</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="clients" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Clientes</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="technicians" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">Técnicos</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <Wrench className="h-4 w-4" />
                    <span className="font-medium">Serviços</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="financial" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Financeiro</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports" 
                    className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Relatórios</span>
                  </TabsTrigger>
                  {isAdmin && (
                    <TabsTrigger 
                      value="settings" 
                      className="flex items-center space-x-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all"
                    >
                      <Cog className="h-4 w-4" />
                      <span className="font-medium">Configurações</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="dashboard" className="mt-0">
                  <Dashboard />
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                  <OrdersManager />
                </TabsContent>

                <TabsContent value="clients" className="mt-0">
                  <ClientsManager />
                </TabsContent>

                <TabsContent value="technicians" className="mt-0">
                  <TechniciansManager />
                </TabsContent>

                <TabsContent value="services" className="mt-0">
                  <ServicesManager />
                </TabsContent>

                <TabsContent value="financial" className="mt-0">
                  <FinancialManager />
                </TabsContent>

                <TabsContent value="reports" className="mt-0">
                  <ReportsManager />
                </TabsContent>

                {isAdmin && (
                  <TabsContent value="settings" className="mt-0">
                    <SettingsManager />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
