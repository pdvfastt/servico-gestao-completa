
-- Remover todas as possíveis variações de políticas existentes
DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;

DROP POLICY IF EXISTS "Users can view own technicians" ON public.technicians;
DROP POLICY IF EXISTS "Users can view their own technicians" ON public.technicians;
DROP POLICY IF EXISTS "Users can insert own technicians" ON public.technicians;
DROP POLICY IF EXISTS "Users can insert their own technicians" ON public.technicians;
DROP POLICY IF EXISTS "Users can update own technicians" ON public.technicians;
DROP POLICY IF EXISTS "Users can update their own technicians" ON public.technicians;
DROP POLICY IF EXISTS "Users can delete own technicians" ON public.technicians;
DROP POLICY IF EXISTS "Users can delete their own technicians" ON public.technicians;

DROP POLICY IF EXISTS "Users can view own services" ON public.services;
DROP POLICY IF EXISTS "Users can view their own services" ON public.services;
DROP POLICY IF EXISTS "Users can insert own services" ON public.services;
DROP POLICY IF EXISTS "Users can insert their own services" ON public.services;
DROP POLICY IF EXISTS "Users can update own services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their own services" ON public.services;

DROP POLICY IF EXISTS "Users can view own service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can view their own service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can insert own service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can insert their own service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can update own service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can update their own service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can delete own service_orders" ON public.service_orders;
DROP POLICY IF EXISTS "Users can delete their own service_orders" ON public.service_orders;

DROP POLICY IF EXISTS "Users can view own financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can view their own financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can insert own financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can insert their own financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can update own financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can update their own financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can delete own financial_records" ON public.financial_records;
DROP POLICY IF EXISTS "Users can delete their own financial_records" ON public.financial_records;

DROP POLICY IF EXISTS "Users can view own products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert own products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

DROP POLICY IF EXISTS "Users can view own company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Users can view their own company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Users can insert own company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Users can insert their own company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Users can update own company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Users can update their own company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Users can delete own company_settings" ON public.company_settings;
DROP POLICY IF EXISTS "Users can delete their own company_settings" ON public.company_settings;

-- Criar políticas com nomes únicos
-- Políticas para clientes
CREATE POLICY "clients_select_own" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "clients_insert_own" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "clients_update_own" ON public.clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "clients_delete_own" ON public.clients
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para técnicos
CREATE POLICY "technicians_select_own" ON public.technicians
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "technicians_insert_own" ON public.technicians
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "technicians_update_own" ON public.technicians
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "technicians_delete_own" ON public.technicians
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para serviços
CREATE POLICY "services_select_own" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "services_insert_own" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "services_update_own" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "services_delete_own" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ordens de serviço
CREATE POLICY "service_orders_select_own" ON public.service_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "service_orders_insert_own" ON public.service_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "service_orders_update_own" ON public.service_orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "service_orders_delete_own" ON public.service_orders
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para registros financeiros
CREATE POLICY "financial_records_select_own" ON public.financial_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "financial_records_insert_own" ON public.financial_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "financial_records_update_own" ON public.financial_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "financial_records_delete_own" ON public.financial_records
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para produtos
CREATE POLICY "products_select_own" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "products_insert_own" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "products_update_own" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "products_delete_own" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para configurações da empresa
CREATE POLICY "company_settings_select_own" ON public.company_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "company_settings_insert_own" ON public.company_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "company_settings_update_own" ON public.company_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "company_settings_delete_own" ON public.company_settings
  FOR DELETE USING (auth.uid() = user_id);
