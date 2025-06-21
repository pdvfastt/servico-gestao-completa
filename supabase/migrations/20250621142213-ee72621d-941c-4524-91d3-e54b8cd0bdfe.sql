
-- Criar tabelas para clientes
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fisica', 'juridica')),
  name TEXT NOT NULL,
  fantasy_name TEXT,
  document TEXT NOT NULL,
  secondary_document TEXT,
  contact_person TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  birth_date DATE,
  cep TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabelas para técnicos
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  level TEXT NOT NULL CHECK (level IN ('Júnior', 'Pleno', 'Sênior')),
  hourly_rate DECIMAL(10,2),
  specialties TEXT[],
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Férias', 'Licença')),
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabelas para ordens de serviço
CREATE TABLE public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  technician_id UUID REFERENCES public.technicians(id),
  status TEXT NOT NULL DEFAULT 'Aberta' CHECK (status IN ('Aberta', 'Em Andamento', 'Aguardando Peças', 'Finalizada', 'Cancelada')),
  priority TEXT NOT NULL DEFAULT 'Média' CHECK (priority IN ('Alta', 'Média', 'Baixa')),
  description TEXT NOT NULL,
  diagnosis TEXT,
  observations TEXT,
  service_value DECIMAL(10,2) DEFAULT 0,
  parts_value DECIMAL(10,2) DEFAULT 0,
  total_value DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('dinheiro', 'cartao', 'pix', 'boleto')),
  expected_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes
CREATE POLICY "Users can view their own clients" 
  ON public.clients FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" 
  ON public.clients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
  ON public.clients FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
  ON public.clients FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para técnicos
CREATE POLICY "Users can view their own technicians" 
  ON public.technicians FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own technicians" 
  ON public.technicians FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own technicians" 
  ON public.technicians FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own technicians" 
  ON public.technicians FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para ordens de serviço
CREATE POLICY "Users can view their own service orders" 
  ON public.service_orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own service orders" 
  ON public.service_orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service orders" 
  ON public.service_orders FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own service orders" 
  ON public.service_orders FOR DELETE 
  USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER handle_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_technicians_updated_at
  BEFORE UPDATE ON public.technicians
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_service_orders_updated_at
  BEFORE UPDATE ON public.service_orders
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();
