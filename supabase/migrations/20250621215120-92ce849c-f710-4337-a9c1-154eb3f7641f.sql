
-- Remover a política restritiva existente para ordens de serviço
DROP POLICY IF EXISTS "Users can view their own service orders" ON public.service_orders;

-- Criar nova política que permite usuários autenticados visualizarem todas as ordens
CREATE POLICY "Authenticated users can view all service orders" 
  ON public.service_orders 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Manter as outras políticas restritivas para operações de modificação
-- (apenas o dono pode inserir, atualizar e deletar suas próprias ordens)
