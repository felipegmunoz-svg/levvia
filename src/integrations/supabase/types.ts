export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          benefits: string | null
          category: string
          created_at: string
          description: string
          duration: string
          frequency: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          level: string
          safety: string | null
          sort_order: number | null
          start_position: string | null
          steps: string[] | null
          title: string
          updated_at: string
          variations: string[] | null
        }
        Insert: {
          benefits?: string | null
          category: string
          created_at?: string
          description?: string
          duration?: string
          frequency?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          safety?: string | null
          sort_order?: number | null
          start_position?: string | null
          steps?: string[] | null
          title: string
          updated_at?: string
          variations?: string[] | null
        }
        Update: {
          benefits?: string | null
          category?: string
          created_at?: string
          description?: string
          duration?: string
          frequency?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          safety?: string | null
          sort_order?: number | null
          start_position?: string | null
          steps?: string[] | null
          title?: string
          updated_at?: string
          variations?: string[] | null
        }
        Relationships: []
      }
      habits: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          modal_content: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          modal_content?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          modal_content?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          affected_areas: string[] | null
          challenge_progress: Json | null
          challenge_start: string | null
          created_at: string
          email: string
          id: string
          name: string
          objective: string | null
          onboarding_data: Json | null
          pain_level: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affected_areas?: string[] | null
          challenge_progress?: Json | null
          challenge_start?: string | null
          created_at?: string
          email?: string
          id: string
          name?: string
          objective?: string | null
          onboarding_data?: Json | null
          pain_level?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affected_areas?: string[] | null
          challenge_progress?: Json | null
          challenge_start?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          objective?: string | null
          onboarding_data?: Json | null
          pain_level?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          category: string
          created_at: string
          description: string | null
          dica: string | null
          icon: string | null
          id: string
          ingredients: string[] | null
          instructions: string[] | null
          is_active: boolean | null
          por_que_resfria: string | null
          servings: string | null
          sort_order: number | null
          tags: string[] | null
          time: string | null
          tipo_refeicao: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          dica?: string | null
          icon?: string | null
          id?: string
          ingredients?: string[] | null
          instructions?: string[] | null
          is_active?: boolean | null
          por_que_resfria?: string | null
          servings?: string | null
          sort_order?: number | null
          tags?: string[] | null
          time?: string | null
          tipo_refeicao?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          dica?: string | null
          icon?: string | null
          id?: string
          ingredients?: string[] | null
          instructions?: string[] | null
          is_active?: boolean | null
          por_que_resfria?: string | null
          servings?: string | null
          sort_order?: number | null
          tags?: string[] | null
          time?: string | null
          tipo_refeicao?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
