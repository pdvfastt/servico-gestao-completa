
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wijcokzhidfimwnywsuo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpamNva3poaWRmaW13bnl3c3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDk0OTIsImV4cCI6MjA2NjA4NTQ5Mn0.HOl9D1i5z_bpgsdL0baDaqbbeXS-uKl8PKq3CwH6LUo';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
