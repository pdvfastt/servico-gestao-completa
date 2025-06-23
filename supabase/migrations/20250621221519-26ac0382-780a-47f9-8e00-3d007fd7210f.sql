
-- Remover políticas existentes e criar novas que permitam acesso total para usuários autenticados

-- Políticas para tabela service_orders (corrigir acesso completo)
DROP POLICY IF EXISTS "Authenticated users can view all service orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can view their own service orders" ON public.service_orders;
CREATE POLICY "All authenticated users can view all service orders" 
  ON public.service_orders 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Atualizar outras políticas para garantir acesso total
-- Políticas para tabela clients (remover restrições de user_id)
DROP POLICY IF EXISTS "Authenticated users can view all clients" ON public.clients;
CREATE POLICY "All users can access all clients" 
  ON public.clients 
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para tabela technicians (remover restrições de user_id)
DROP POLICY IF EXISTS "Authenticated users can view all technicians" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can insert technicians" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can update technicians" ON public.technicians;
DROP POLICY IF EXISTS "Authenticated users can delete technicians" ON public.technicians;
CREATE POLICY "All users can access all technicians" 
  ON public.technicians 
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para tabela services (remover restrições de user_id)
DROP POLICY IF EXISTS "Authenticated users can view all services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON public.services;
CREATE POLICY "All users can access all services" 
  ON public.services 
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para tabela financial_records (remover restrições de user_id)
DROP POLICY IF EXISTS "Authenticated users can view all financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Authenticated users can insert financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Authenticated users can update financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Authenticated users can delete financial_records" ON public.financial_records;
CREATE POLICY "All users can access all financial_records" 
  ON public.financial_records 
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para tabela service_orders (acesso completo)
DROP POLICY IF EXISTS "Authenticated users can insert service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Authenticated users can update service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Authenticated users can delete service_orders" ON public.service_orders;
CREATE POLICY "All users can access all service_orders" 
  ON public.service_orders 
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para tabela products (remover restrições de user_id)
DROP POLICY IF EXISTS "Authenticated users can view all products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "All users can access all products" 
  ON public.products 
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
