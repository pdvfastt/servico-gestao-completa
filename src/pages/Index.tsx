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
import { usePermissions } from '@/hooks/usePermissions';
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
  const { permissions, hasPermission } = usePermissions();
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

  // Criar configuração das abas baseada nas permissões
  const tabsConfig = [
    { 
      value: "dashboard", 
      icon: BarChart3, 
      label: "Dashboard", 
      shortLabel: "Home",
      permission: "dashboard" as const
    },
    { 
      value: "orders", 
      icon: FileText, 
      label: "Ordens de Serviço", 
      shortLabel: "OS",
      permission: "orders" as const
    },
    ...(isTechnician && hasPermission("technician_orders") ? [{
      value: "technician-orders", 
      icon: Wrench, 
      label: "Minhas OS", 
      shortLabel: "Minhas OS",
      permission: "technician_orders" as const
    }] : []),
    { 
      value: "clients", 
      icon: Users, 
      label: "Clientes", 
      shortLabel: "Clientes",
      permission: "clients" as const
    },
    { 
      value: "technicians", 
      icon: User, 
      label: "Técnicos", 
      shortLabel: "Técnicos",
      permission: "technicians" as const
    },
    { 
      value: "services", 
      icon: Wrench, 
      label: "Serviços", 
      shortLabel: "Serviços",
      permission: "services" as const
    },
    { 
      value: "financial", 
      icon: DollarSign, 
      label: "Financeiro", 
      shortLabel: "$$",
      permission: "financial" as const
    },
    { 
      value: "reports", 
      icon: BarChart3, 
      label: "Relatórios", 
      shortLabel: "Reports",
      permission: "reports" as const
    },
    ...(hasPermission("settings") ? [{
      value: "settings", 
      icon: Cog, 
      label: "Configurações", 
      shortLabel: "Config",
      permission: "settings" as const
    }] : [])
  ].filter(tab => hasPermission(tab.permission));

  // Garantir que o usuário sempre tenha acesso ao dashboard
  useEffect(() => {
    if (tabsConfig.length > 0 && !tabsConfig.find(tab => tab.value === activeTab)) {
      setActiveTab(tabsConfig[0].value);
    }
  }, [tabsConfig, activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto p-3 md:p-6 flex-1">
        {/* Modern Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
              <div className="bg-red-600 p-2 md:p-3 rounded-lg md:rounded-xl shadow-md flex-shrink-0">
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
                <h1 className="text-xl md:text-4xl font-bold text-red-600 mb-1 md:mb-2 truncate">
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
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-100 bg-gray-50 rounded-t-lg">
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
                {hasPermission("dashboard") && (
                  <TabsContent value="dashboard" className="mt-0">
                    <Dashboard />
                  </TabsContent>
                )}

                {hasPermission("orders") && (
                  <TabsContent value="orders" className="mt-0">
                    <OrdersManager />
                  </TabsContent>
                )}

                {isTechnician && hasPermission("technician_orders") && (
                  <TabsContent value="technician-orders" className="mt-0">
                    <TechnicianOrdersPage />
                  </TabsContent>
                )}

                {hasPermission("clients") && (
                  <TabsContent value="clients" className="mt-0">
                    <ClientsManager />
                  </TabsContent>
                )}

                {hasPermission("technicians") && (
                  <TabsContent value="technicians" className="mt-0">
                    <TechniciansManager />
                  </TabsContent>
                )}

                {hasPermission("services") && (
                  <TabsContent value="services" className="mt-0">
                    <ServicesManager />
                  </TabsContent>
                )}

                {hasPermission("financial") && (
                  <TabsContent value="financial" className="mt-0">
                    <FinancialManager />
                  </TabsContent>
                )}

                {hasPermission("reports") && (
                  <TabsContent value="reports" className="mt-0">
                    <ReportsManager />
                  </TabsContent>
                )}

                {hasPermission("settings") && (
                  <TabsContent value="settings" className="mt-0">
                    <SettingsManager />
                  </TabsContent>
                )}

                {/* Mostrar mensagem se o usuário não tiver acesso a nenhuma funcionalidade */}
                {tabsConfig.length === 0 && (
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">Acesso Restrito</h2>
                    <p className="text-gray-500">
                      Você não tem permissão para acessar nenhuma funcionalidade do sistema. 
                      Entre em contato com o administrador.
                    </p>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span>Copyright 2025 - OS+ Desenvolvido por</span>
          <a 
            href="https://tecmax.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <img 
              src="https://i.postimg.cc/CLbCMsnH/logotecm.png"
              alt="Tecmax"
              className="h-4 w-auto"
            />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
