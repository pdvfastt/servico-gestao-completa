
-- Criar tabela de relacionamento entre clientes e equipamentos
CREATE TABLE public.client_equipments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  equipment_id uuid NOT NULL REFERENCES public.equipments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'ativo',
  observations text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(client_id, equipment_id)
);

-- Habilitar RLS
ALTER TABLE public.client_equipments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para relacionamentos Cliente-Equipamentos
CREATE POLICY "Users can view their own client equipments" 
  ON public.client_equipments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own client equipments" 
  ON public.client_equipments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own client equipments" 
  ON public.client_equipments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own client equipments" 
  ON public.client_equipments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER trigger_client_equipments_updated_at
  BEFORE UPDATE ON public.client_equipments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
