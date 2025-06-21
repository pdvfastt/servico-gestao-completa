
-- Políticas para tabela clients
DROP POLICY IF EXISTS "Users can view clients" ON public.clients;
CREATE POLICY "Authenticated users can view all clients" 
  ON public.clients 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert clients" ON public.clients;
CREATE POLICY "Authenticated users can insert clients" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update clients" ON public.clients;
CREATE POLICY "Authenticated users can update clients" 
  ON public.clients 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete clients" ON public.clients;
CREATE POLICY "Authenticated users can delete clients" 
  ON public.clients 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para tabela technicians
DROP POLICY IF EXISTS "Users can view technicians" ON public.technicians;
CREATE POLICY "Authenticated users can view all technicians" 
  ON public.technicians 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert technicians" ON public.technicians;
CREATE POLICY "Authenticated users can insert technicians" 
  ON public.technicians 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update technicians" ON public.technicians;
CREATE POLICY "Authenticated users can update technicians" 
  ON public.technicians 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete technicians" ON public.technicians;
CREATE POLICY "Authenticated users can delete technicians" 
  ON public.technicians 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para tabela services
DROP POLICY IF EXISTS "Users can view services" ON public.services;
CREATE POLICY "Authenticated users can view all services" 
  ON public.services 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert services" ON public.services;
CREATE POLICY "Authenticated users can insert services" 
  ON public.services 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update services" ON public.services;
CREATE POLICY "Authenticated users can update services" 
  ON public.services 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete services" ON public.services;
CREATE POLICY "Authenticated users can delete services" 
  ON public.services 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para tabela financial_records
DROP POLICY IF EXISTS "Users can view financial_records" ON public.financial_records;
CREATE POLICY "Authenticated users can view all financial_records" 
  ON public.financial_records 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert financial_records" ON public.financial_records;
CREATE POLICY "Authenticated users can insert financial_records" 
  ON public.financial_records 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update financial_records" ON public.financial_records;
CREATE POLICY "Authenticated users can update financial_records" 
  ON public.financial_records 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete financial_records" ON public.financial_records;
CREATE POLICY "Authenticated users can delete financial_records" 
  ON public.financial_records 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para tabela service_orders (inserção, atualização e exclusão)
DROP POLICY IF EXISTS "Users can insert service_orders" ON public.service_orders;
CREATE POLICY "Authenticated users can insert service_orders" 
  ON public.service_orders 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update service_orders" ON public.service_orders;
CREATE POLICY "Authenticated users can update service_orders" 
  ON public.service_orders 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete service_orders" ON public.service_orders;
CREATE POLICY "Authenticated users can delete service_orders" 
  ON public.service_orders 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para tabela products
DROP POLICY IF EXISTS "Users can view products" ON public.products;
CREATE POLICY "Authenticated users can view all products" 
  ON public.products 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert products" ON public.products;
CREATE POLICY "Authenticated users can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update products" ON public.products;
CREATE POLICY "Authenticated users can update products" 
  ON public.products 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete products" ON public.products;
CREATE POLICY "Authenticated users can delete products" 
  ON public.products 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Políticas para tabela company_settings
DROP POLICY IF EXISTS "Users can view company_settings" ON public.company_settings;
CREATE POLICY "Authenticated users can view all company_settings" 
  ON public.company_settings 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert company_settings" ON public.company_settings;
CREATE POLICY "Authenticated users can insert company_settings" 
  ON public.company_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update company_settings" ON public.company_settings;
CREATE POLICY "Authenticated users can update company_settings" 
  ON public.company_settings 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete company_settings" ON public.company_settings;
CREATE POLICY "Authenticated users can delete company_settings" 
  ON public.company_settings 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
