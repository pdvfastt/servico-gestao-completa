
-- Criar tabela de equipamentos
CREATE TABLE public.equipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  model text,
  serial_number text,
  observations text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para equipamentos
CREATE POLICY "Users can view their own equipments" 
  ON public.equipments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own equipments" 
  ON public.equipments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equipments" 
  ON public.equipments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equipments" 
  ON public.equipments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar tabela de relacionamento entre OS e equipamentos
CREATE TABLE public.service_order_equipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id uuid NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES public.equipments(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para relacionamentos
ALTER TABLE public.service_order_equipments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para relacionamentos OS-Equipamentos
CREATE POLICY "Users can view their own service order equipments" 
  ON public.service_order_equipments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.service_orders 
      WHERE id = service_order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own service order equipments" 
  ON public.service_order_equipments 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.service_orders 
      WHERE id = service_order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own service order equipments" 
  ON public.service_order_equipments 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.service_orders 
      WHERE id = service_order_id AND user_id = auth.uid()
    )
  );

-- Adicionar campo para armazenar o número sequencial da OS
ALTER TABLE public.service_orders ADD COLUMN order_number text;

-- Criar função para gerar número da OS
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger AS $$
DECLARE
  current_year text := EXTRACT(year FROM now())::text;
  max_number integer;
  new_number text;
BEGIN
  -- Buscar o maior número do ano atual
  SELECT COALESCE(MAX(CAST(SPLIT_PART(order_number, '-', 2) AS integer)), 0)
  INTO max_number
  FROM public.service_orders 
  WHERE order_number LIKE current_year || '-%'
    AND user_id = NEW.user_id;
  
  -- Gerar novo número
  new_number := current_year || '-' || LPAD((max_number + 1)::text, 4, '0');
  
  -- Atribuir ao registro
  NEW.order_number := new_number;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para gerar número automaticamente
CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Atualizar registros existentes que não têm order_number
DO $$
DECLARE
  rec RECORD;
  current_year text := EXTRACT(year FROM now())::text;
  counter integer := 1;
BEGIN
  FOR rec IN 
    SELECT id, user_id, created_at 
    FROM public.service_orders 
    WHERE order_number IS NULL 
    ORDER BY user_id, created_at
  LOOP
    UPDATE public.service_orders 
    SET order_number = EXTRACT(year FROM rec.created_at)::text || '-' || LPAD(counter::text, 4, '0')
    WHERE id = rec.id;
    
    counter := counter + 1;
  END LOOP;
END $$;
