
-- Primeiro, vamos verificar se já existe algum usuário admin e criar um se necessário
-- Como não podemos inserir diretamente na tabela auth.users, vamos usar uma abordagem diferente

-- Vamos atualizar um usuário existente para ser admin (se houver algum)
-- Ou criar as condições para que quando você se cadastrar, seja automaticamente admin

-- Vamos modificar a função handle_new_user para que o primeiro usuário seja sempre admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Contar quantos usuários já existem
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  
  -- Se for o primeiro usuário ou se o email for admin@teste.com, tornar admin
  IF user_count = 0 OR NEW.email = 'admin@teste.com' THEN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Administrador'),
      NEW.email,
      'admin'::public.user_role
    );
  ELSE
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
      NEW.email,
      'attendant'::public.user_role
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Se já existe algum usuário, vamos promover o primeiro para admin
UPDATE public.profiles 
SET role = 'admin'::public.user_role 
WHERE id = (
  SELECT id FROM public.profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);
