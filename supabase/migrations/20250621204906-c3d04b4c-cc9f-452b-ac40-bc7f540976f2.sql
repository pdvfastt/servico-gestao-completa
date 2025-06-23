
-- Adicionar coluna user_id na tabela technicians se não existir
ALTER TABLE public.technicians 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_technicians_user_id ON public.technicians(user_id);

-- Adicionar política RLS para técnicos visualizarem seus próprios dados
CREATE POLICY "Technicians can view their own data" 
  ON public.technicians 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Permitir técnicos atualizarem seus próprios dados
CREATE POLICY "Technicians can update their own data" 
  ON public.technicians 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Habilitar RLS na tabela technicians
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
