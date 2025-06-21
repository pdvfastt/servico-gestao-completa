
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export const useProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Buscando produtos para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro Supabase ao buscar produtos:', error);
        throw error;
      }
      
      console.log('Produtos encontrados:', data?.length || 0);
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<ProductInsert, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Criando produto:', productData);
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar produto:', error);
        throw error;
      }
      
      console.log('Produto criado com sucesso:', data);
      setProducts(prev => [data, ...prev]);
      toast({
        title: "Produto Cadastrado",
        description: "O novo produto foi cadastrado com sucesso!",
      });
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar produto.",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return {
    products,
    loading,
    createProduct,
    refetch: fetchProducts,
  };
};
