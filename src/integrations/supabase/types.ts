export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          birth_date: string | null
          cep: string | null
          city: string | null
          complement: string | null
          contact_person: string | null
          created_at: string | null
          document: string
          email: string
          fantasy_name: string | null
          id: string
          name: string
          neighborhood: string | null
          number: string | null
          phone: string
          secondary_document: string | null
          state: string | null
          status: string
          street: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          contact_person?: string | null
          created_at?: string | null
          document: string
          email: string
          fantasy_name?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          number?: string | null
          phone: string
          secondary_document?: string | null
          state?: string | null
          status?: string
          street?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          contact_person?: string | null
          created_at?: string | null
          document?: string
          email?: string
          fantasy_name?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string
          secondary_document?: string | null
          state?: string | null
          status?: string
          street?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financial_records: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string
          id: string
          payment_method: string | null
          service_order_id: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          payment_method?: string | null
          service_order_id?: string | null
          status?: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          payment_method?: string | null
          service_order_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          cost_price: number
          created_at: string | null
          description: string | null
          id: string
          min_stock: number
          name: string
          sale_price: number
          stock: number
          supplier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          cost_price: number
          created_at?: string | null
          description?: string | null
          id?: string
          min_stock?: number
          name: string
          sale_price: number
          stock?: number
          supplier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          cost_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          min_stock?: number
          name?: string
          sale_price?: number
          stock?: number
          supplier?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      service_orders: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string
          diagnosis: string | null
          expected_date: string | null
          id: string
          observations: string | null
          parts_value: number | null
          payment_method: string | null
          priority: string
          service_value: number | null
          status: string
          technician_id: string | null
          total_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description: string
          diagnosis?: string | null
          expected_date?: string | null
          id?: string
          observations?: string | null
          parts_value?: number | null
          payment_method?: string | null
          priority?: string
          service_value?: number | null
          status?: string
          technician_id?: string | null
          total_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string
          diagnosis?: string | null
          expected_date?: string | null
          id?: string
          observations?: string | null
          parts_value?: number | null
          payment_method?: string | null
          priority?: string
          service_value?: number | null
          status?: string
          technician_id?: string | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          name: string
          price: number
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          price: number
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          price?: number
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      technicians: {
        Row: {
          address: string | null
          cpf: string
          created_at: string | null
          email: string
          hourly_rate: number | null
          id: string
          level: string
          name: string
          phone: string
          rating: number | null
          specialties: string[] | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          cpf: string
          created_at?: string | null
          email: string
          hourly_rate?: number | null
          id?: string
          level: string
          name: string
          phone: string
          rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          cpf?: string
          created_at?: string | null
          email?: string
          hourly_rate?: number | null
          id?: string
          level?: string
          name?: string
          phone?: string
          rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "technician" | "attendant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "technician", "attendant"],
    },
  },
} as const
