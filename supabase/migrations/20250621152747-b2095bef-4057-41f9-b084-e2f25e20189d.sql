
-- Criar tabela para serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para produtos/peças
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  cost_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  supplier TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para dados financeiros
CREATE TABLE public.financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  service_order_id UUID REFERENCES public.service_orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para serviços
CREATE POLICY "Users can view their own services" 
  ON public.services FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own services" 
  ON public.services FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services" 
  ON public.services FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services" 
  ON public.services FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para produtos
CREATE POLICY "Users can view their own products" 
  ON public.products FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" 
  ON public.products FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
  ON public.products FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
  ON public.products FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para registros financeiros
CREATE POLICY "Users can view their own financial records" 
  ON public.financial_records FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial records" 
  ON public.financial_records FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial records" 
  ON public.financial_records FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial records" 
  ON public.financial_records FOR DELETE 
  USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER handle_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_financial_records_updated_at
  BEFORE UPDATE ON public.financial_records
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();
