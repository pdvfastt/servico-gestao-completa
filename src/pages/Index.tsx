
import React, { useState, useEffect } from 'react';
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
  Cog,
  Menu
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useCompanySettings } from '@/hooks/useCompanySettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import Dashboard from "@/components/Dashboard";
import ClientsManager from "@/components/ClientsManager";
import TechniciansManager from "@/components/TechniciansManager";
import ServicesManager from "@/components/ServicesManager";
import FinancialManager from "@/components/FinancialManager";
import ReportsManager from "@/components/ReportsManager";
import OrdersManager from "@/components/OrdersManager";
import SettingsManager from "@/components/SettingsManager";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import TechnicianOrdersPage from "@/components/TechnicianOrdersPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserManagement();
  const { settings } = useCompanySettings();
  const isMobile = useIsMobile();

  // Verificar se o usuário é um técnico
  const [isTechnician, setIsTechnician] = useState(false);

  useEffect(() => {
    const checkIfTechnician = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('technicians')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        setIsTechnician(!!data);
      } catch (error) {
        setIsTechnician(false);
      }
    };

    checkIfTechnician();
  }, [user]);

  // Função para verificar se deve mostrar a aba Configurações
  const shouldShowSettings = () => {
    return isAdmin;
  };

  const tabsConfig = [
    { value: "dashboard", icon: BarChart3, label: "Dashboard", shortLabel: "Home" },
    { value: "orders", icon: FileText, label: "Ordens de Serviço", shortLabel: "OS" },
    ...(isTechnician ? [{ value: "technician-orders", icon: Wrench, label: "Minhas OS", shortLabel: "Minhas OS" }] : []),
    { value: "clients", icon: Users, label: "Clientes", shortLabel: "Clientes" },
    { value: "technicians", icon: User, label: "Técnicos", shortLabel: "Técnicos" },
    { value: "services", icon: Wrench, label: "Serviços", shortLabel: "Serviços" },
    { value: "financial", icon: DollarSign, label: "Financeiro", shortLabel: "$$" },
    { value: "reports", icon: BarChart3, label: "Relatórios", shortLabel: "Reports" },
    ...(shouldShowSettings() ? [{ value: "settings", icon: Cog, label: "Configurações", shortLabel: "Config" }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-cyan-50">
      <div className="container mx-auto p-3 md:p-6">
        {/* Modern Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
              <div className="bg-gradient-to-br from-orange-500 to-cyan-500 p-2 md:p-3 rounded-lg md:rounded-xl shadow-md flex-shrink-0">
                {settings?.company_logo_url ? (
                  <img 
                    src={settings.company_logo_url} 
                    alt="Logo" 
                    className="h-6 w-6 md:h-8 md:w-8 object-contain"
                  />
                ) : (
                  <Settings className="h-6 w-6 md:h-8 md:w-8 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent mb-1 md:mb-2 truncate">
                  {isMobile ? 'Gestão OS' : (settings?.company_name || 'Sistema de Gestão de OS')}
                </h1>
                <p className="text-gray-600 text-xs md:text-lg hidden sm:block">
                  Controle completo de ordens de serviço e gestão empresarial
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              <PWAInstallPrompt />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 md:px-3 py-1 text-xs">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mr-1 md:mr-2 animate-pulse"></div>
                <span className="hidden sm:inline">Sistema Online</span>
                <span className="sm:hidden">Online</span>
              </Badge>
              {!isMobile && (
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium truncate max-w-32">{user?.email}</span>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center space-x-1 md:space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                {!isMobile && <span>Sair</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                <div className="tabs-responsive">
                  <TabsList className={`tabs-list-responsive w-full grid bg-transparent h-auto p-1 md:p-2 gap-0.5 md:gap-1`} style={{ gridTemplateColumns: `repeat(${tabsConfig.length}, minmax(0, 1fr))` }}>
                    {tabsConfig.map(({ value, icon: Icon, label, shortLabel }) => (
                      <TabsTrigger 
                        key={value}
                        value={value} 
                        className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 md:py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md md:rounded-lg transition-all text-xs md:text-sm min-w-0"
                      >
                        <Icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="font-medium truncate">
                          {isMobile ? shortLabel : label}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              <div className="p-3 md:p-6">
                <TabsContent value="dashboard" className="mt-0">
                  <Dashboard />
                </TabsContent>

                <TabsContent value="orders" className="mt-0">
                  <OrdersManager />
                </TabsContent>

                {isTechnician && (
                  <TabsContent value="technician-orders" className="mt-0">
                    <TechnicianOrdersPage />
                  </TabsContent>
                )}

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

                {shouldShowSettings() && (
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
