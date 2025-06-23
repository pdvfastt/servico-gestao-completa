
-- Criar enum para as diferentes permissões do sistema
CREATE TYPE public.permission_type AS ENUM (
  'dashboard',
  'orders',
  'clients', 
  'technicians',
  'services',
  'financial',
  'reports',
  'settings',
  'technician_orders'
);

-- Criar tabela de permissões de usuários
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission permission_type NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- Habilitar RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Criar política para administradores gerenciarem permissões
CREATE POLICY "Admins can manage all permissions" 
  ON public.user_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Criar política para usuários visualizarem suas próprias permissões
CREATE POLICY "Users can view their own permissions" 
  ON public.user_permissions 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Criar trigger para atualizar updated_at
CREATE TRIGGER handle_updated_at_user_permissions
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Inserir permissões padrão para usuários existentes (todos habilitados por padrão)
INSERT INTO public.user_permissions (user_id, permission, granted)
SELECT 
  p.id,
  perm.permission,
  CASE 
    WHEN p.role = 'admin' THEN true
    WHEN p.role = 'technician' AND perm.permission = 'technician_orders' THEN true
    WHEN p.role = 'technician' AND perm.permission IN ('dashboard', 'orders', 'clients') THEN true
    WHEN p.role = 'attendant' THEN true
    ELSE false
  END as granted
FROM public.profiles p
CROSS JOIN (
  SELECT unnest(enum_range(NULL::permission_type)) as permission
) perm
ON CONFLICT (user_id, permission) DO NOTHING;
