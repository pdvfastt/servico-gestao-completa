
-- Create the company_settings table
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#2563eb',
  secondary_color TEXT NOT NULL DEFAULT '#059669',
  accent_color TEXT NOT NULL DEFAULT '#dc2626',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on company_settings
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own company settings
CREATE POLICY "Users can view own company settings" ON public.company_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own company settings
CREATE POLICY "Users can insert own company settings" ON public.company_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own company settings
CREATE POLICY "Users can update own company settings" ON public.company_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own company settings
CREATE POLICY "Users can delete own company settings" ON public.company_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger for company_settings
CREATE TRIGGER handle_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add unique constraint to ensure one setting per user
ALTER TABLE public.company_settings ADD CONSTRAINT unique_user_company_settings UNIQUE (user_id);

-- Update profiles table to ensure admin policies work correctly
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Policy for admins to insert profiles
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Policy for admins to update profiles
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Policy for admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
