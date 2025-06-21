
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  FileText,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useToast } from "@/hooks/use-toast";

const FinancialManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Dados de exemplo financeiros
  const financialData = [
    {
      id: '001',
      osId: '2024001',
      client: 'Tech Solutions Ltda',
      description: 'Manutenção preventiva em servidores',
      value: 2500.00,
      status: 'Pago',
      paymentMethod: 'PIX',
      dueDate: '2024-01-20',
      paidDate: '2024-01-18',
      type: 'Receita'
    },
    {
      id: '002',
      osId: '2024002',
      client: 'Maria Silva',
      description: 'Reparo em impressora laser',
      value: 350.00,
      status: 'Pendente',
      paymentMethod: 'Boleto',
      dueDate: '2024-01-25',
      paidDate: null,
      type: 'Receita'
    },
    {
      id: '003',
      osId: '2024003',
      client: 'Empresa ABC Ltda',
      description: 'Instalação de sistema de monitoramento',
      value: 4200.00,
      status: 'Aprovado',
      paymentMethod: 'Cartão',
      dueDate: '2024-02-01',
      paidDate: null,
      type: 'Receita'
    },
    {
      id: '004',
      osId: '-',
      client: 'TechParts Ltda',
      description: 'Compra de peças e componentes',
      value: -800.00,
      status: 'Pago',
      paymentMethod: 'Transferência',
      dueDate: '2024-01-15',
      paidDate: '2024-01-15',
      type: 'Despesa'
    }
  ];

  const monthlyData = [
    { month: 'Jan', receita: 25000, despesa: 8000, lucro: 17000 },
    { month: 'Fev', receita: 32000, despesa: 10000, lucro: 22000 },
    { month: 'Mar', receita: 45000, despesa: 12000, lucro: 33000 },
    { month: 'Abr', receita: 48000, despesa: 15000, lucro: 33000 },
    { month: 'Mai', receita: 35000, despesa: 11000, lucro: 24000 },
    { month: 'Jun', receita: 38000, despesa: 9000, lucro: 29000 },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pago': { className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Pendente': { className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'Vencido': { className: 'bg-red-100 text-red-800', icon: AlertCircle },
      'Aprovado': { className: 'bg-blue-100 text-blue-800', icon: FileText },
      'Cancelado': { className: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pendente'];
    const Icon = config.icon;
    
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      'PIX': { className: 'bg-purple-100 text-purple-800' },
      'Boleto': { className: 'bg-orange-100 text-orange-800' },
      'Cartão': { className: 'bg-blue-100 text-blue-800' },
      'Dinheiro': { className: 'bg-green-100 text-green-800' },
      'Transferência': { className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = methodConfig[method as keyof typeof methodConfig] || methodConfig['Boleto'];
    return <Badge variant="outline" className={config.className}>{method}</Badge>;
  };

  const filteredData = financialData.filter(item => {
    const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.osId.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Cálculos financeiros
  const totalReceitas = financialData.filter(item => item.type === 'Receita').reduce((sum, item) => sum + item.value, 0);
  const totalDespesas = Math.abs(financialData.filter(item => item.type === 'Despesa').reduce((sum, item) => sum + item.value, 0));
  const lucroLiquido = totalReceitas - totalDespesas;
  const receitasPendentes = financialData.filter(item => item.type === 'Receita' && item.status === 'Pendente').reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receitas (Mês)</p>
                <p className="text-3xl font-bold text-green-700">R$ {totalReceitas.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-green-600 font-medium">+18% vs mês anterior</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Despesas (Mês)</p>
                <p className="text-3xl font-bold text-red-700">R$ {totalDespesas.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-red-600 font-medium">+5% vs mês anterior</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                <p className="text-3xl font-bold text-blue-700">R$ {lucroLiquido.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-blue-600 font-medium">+22% vs mês anterior</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">A Receber</p>
                <p className="text-3xl font-bold text-yellow-700">R$ {receitasPendentes.toLocaleString('pt-BR')}</p>
                <p className="text-sm text-yellow-600 font-medium">3 faturas pendentes</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs do módulo financeiro */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Gráficos financeiros */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receitas vs Despesas</CardTitle>
                <CardDescription>Comparativo mensal dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                    <Bar dataKey="receita" fill="#22c55e" name="Receita" />
                    <Bar dataKey="despesa" fill="#ef4444" name="Despesa" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução do Lucro</CardTitle>
                <CardDescription>Lucro líquido mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                    <Line type="monotone" dataKey="lucro" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filtros para transações */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transações Financeiras</CardTitle>
                  <CardDescription>Receitas, despesas e pagamentos</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por cliente, OS ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Vencido">Vencido</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de transações */}
          <div className="grid gap-4">
            {filteredData.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${transaction.type === 'Receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === 'Receita' ? (
                          <TrendingUp className={`h-6 w-6 ${transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{transaction.client}</h3>
                          {getStatusBadge(transaction.status)}
                          {getPaymentMethodBadge(transaction.paymentMethod)}
                        </div>
                        <p className="text-gray-600 mb-1">{transaction.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {transaction.osId !== '-' && (
                            <span>OS #{transaction.osId}</span>
                          )}
                          <span>Vencimento: {transaction.dueDate}</span>
                          {transaction.paidDate && (
                            <span>Pago em: {transaction.paidDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${transaction.type === 'Receita' ? 'text-green-700' : 'text-red-700'}`}>
                          {transaction.type === 'Receita' ? '+' : ''}R$ {Math.abs(transaction.value).toLocaleString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.type}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>Gere relatórios detalhados para análise financeira</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <span>Relatório de Receitas</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <span>Relatório de Despesas</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <span>Relatório de Lucros</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <span>Contas a Receber</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                  <span>Por Forma de Pagamento</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                  <BarChart className="h-8 w-8 text-indigo-600" />
                  <span>Demonstrativo Mensal</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManager;
