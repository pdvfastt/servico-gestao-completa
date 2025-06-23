
-- Adicionar políticas RLS para técnicos acessarem ordens de serviço
CREATE POLICY "Technicians can view their assigned service orders" 
  ON public.service_orders 
  FOR SELECT 
  USING (
    technician_id = (
      SELECT id FROM public.technicians 
      WHERE user_id = auth.uid()
    )
  );

-- Permitir técnicos atualizarem status das suas ordens
CREATE POLICY "Technicians can update status of their assigned service orders" 
  ON public.service_orders 
  FOR UPDATE 
  USING (
    technician_id = (
      SELECT id FROM public.technicians 
      WHERE user_id = auth.uid()
    )
  );

-- Adicionar função para obter o ID do técnico baseado no usuário logado
CREATE OR REPLACE FUNCTION get_technician_id_by_user()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id FROM public.technicians WHERE user_id = auth.uid();
$$;
