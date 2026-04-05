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
      daily_check_ins: {
        Row: {
          ambiente: string
          created_at: string
          data_checkin: string
          exercicios_ids: string[] | null
          id: string
          intensidade: string
          regiao: string
          user_id: string
        }
        Insert: {
          ambiente: string
          created_at?: string
          data_checkin?: string
          exercicios_ids?: string[] | null
          id?: string
          intensidade: string
          regiao: string
          user_id: string
        }
        Update: {
          ambiente?: string
          created_at?: string
          data_checkin?: string
          exercicios_ids?: string[] | null
          id?: string
          intensidade?: string
          regiao?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_diary: {
        Row: {
          created_at: string
          day_number: number
          guilt_after: number | null
          guilt_before: number | null
          id: string
          leg_sensation: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          day_number: number
          guilt_after?: number | null
          guilt_before?: number | null
          id?: string
          leg_sensation?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          day_number?: number
          guilt_after?: number | null
          guilt_before?: number | null
          id?: string
          leg_sensation?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      ebook_chapters: {
        Row: {
          chapter_number: number
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          chapter_number: number
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          chapter_number?: number
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ebook_sections: {
        Row: {
          chapter_id: string | null
          chapter_number: number
          content: string
          content_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          section_title: string
          situation: string[] | null
          sort_order: number | null
          subsection_title: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          chapter_id?: string | null
          chapter_number: number
          content: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          section_title: string
          situation?: string[] | null
          sort_order?: number | null
          subsection_title?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string | null
          chapter_number?: number
          content?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          section_title?: string
          situation?: string[] | null
          sort_order?: number | null
          subsection_title?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ebook_sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "ebook_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          benefits: string | null
          body_part: string[] | null
          category: string
          clinical_benefit: string | null
          created_at: string
          description: string
          duration: string
          duration_seconds: number | null
          environment: string[] | null
          frequency: string | null
          icon: string | null
          id: string
          image_urls: string[]
          is_active: boolean | null
          level: string
          movement_type: string | null
          pain_suitability: number | null
          safety: string | null
          sort_order: number | null
          start_position: string | null
          steps: string[] | null
          title: string
          updated_at: string
          variations: string[] | null
          video_url: string | null
        }
        Insert: {
          benefits?: string | null
          body_part?: string[] | null
          category: string
          clinical_benefit?: string | null
          created_at?: string
          description?: string
          duration?: string
          duration_seconds?: number | null
          environment?: string[] | null
          frequency?: string | null
          icon?: string | null
          id?: string
          image_urls?: string[]
          is_active?: boolean | null
          level?: string
          movement_type?: string | null
          pain_suitability?: number | null
          safety?: string | null
          sort_order?: number | null
          start_position?: string | null
          steps?: string[] | null
          title: string
          updated_at?: string
          variations?: string[] | null
          video_url?: string | null
        }
        Update: {
          benefits?: string | null
          body_part?: string[] | null
          category?: string
          clinical_benefit?: string | null
          created_at?: string
          description?: string
          duration?: string
          duration_seconds?: number | null
          environment?: string[] | null
          frequency?: string | null
          icon?: string | null
          id?: string
          image_urls?: string[]
          is_active?: boolean | null
          level?: string
          movement_type?: string | null
          pain_suitability?: number | null
          safety?: string | null
          sort_order?: number | null
          start_position?: string | null
          steps?: string[] | null
          title?: string
          updated_at?: string
          variations?: string[] | null
          video_url?: string | null
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
      learn_modules: {
        Row: {
          content_paragraphs: string[]
          created_at: string
          day: number
          icon: string | null
          id: string
          is_active: boolean | null
          practical_tip: string
          reflection_question: string
          sort_order: number | null
          subtitle: string
          surprising_fact: string
          title: string
          updated_at: string
        }
        Insert: {
          content_paragraphs?: string[]
          created_at?: string
          day: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          practical_tip?: string
          reflection_question?: string
          sort_order?: number | null
          subtitle?: string
          surprising_fact?: string
          title: string
          updated_at?: string
        }
        Update: {
          content_paragraphs?: string[]
          created_at?: string
          day?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          practical_tip?: string
          reflection_question?: string
          sort_order?: number | null
          subtitle?: string
          surprising_fact?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          body: string
          created_at: string
          id: string
          sent_count: number | null
          title: string
          type: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          sent_count?: number | null
          title: string
          type?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          sent_count?: number | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          evening_enabled: boolean
          evening_time: string
          id: string
          morning_enabled: boolean
          morning_time: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          evening_enabled?: boolean
          evening_time?: string
          id?: string
          morning_enabled?: boolean
          morning_time?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          evening_enabled?: boolean
          evening_time?: string
          id?: string
          morning_enabled?: boolean
          morning_time?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          features: string[]
          id: string
          interval: string
          interval_count: number
          is_active: boolean
          name: string
          price_cents: number
          slug: string
          sort_order: number
          trial_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: string[]
          id?: string
          interval?: string
          interval_count?: number
          is_active?: boolean
          name: string
          price_cents: number
          slug: string
          sort_order?: number
          trial_days?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: string[]
          id?: string
          interval?: string
          interval_count?: number
          is_active?: boolean
          name?: string
          price_cents?: number
          slug?: string
          sort_order?: number
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          affected_areas: string[] | null
          age: number | null
          avatar_url: string | null
          challenge_progress: Json | null
          challenge_start: string | null
          created_at: string
          day1_completed: boolean
          day1_completed_at: string | null
          day1_welcome_shown: boolean
          day2_completed: boolean
          day2_completed_at: string | null
          day2_inflammation_map: Json | null
          day3_completed: boolean
          day3_completed_at: string | null
          day4_completed: boolean
          day4_completed_at: string | null
          day4_sleep_data: Json | null
          day5_completed: boolean
          day5_completed_at: string | null
          day5_movement_data: Json | null
          day6_completed: boolean
          day6_completed_at: string | null
          day6_spice_data: Json | null
          email: string
          has_premium: boolean
          health_conditions: string[] | null
          heat_map_day1: Json | null
          height_cm: number | null
          id: string
          name: string
          objectives: string[] | null
          onboarding_data: Json | null
          pain_level: string | null
          pantry_items: string[] | null
          phone: string | null
          sex: string | null
          status: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          affected_areas?: string[] | null
          age?: number | null
          avatar_url?: string | null
          challenge_progress?: Json | null
          challenge_start?: string | null
          created_at?: string
          day1_completed?: boolean
          day1_completed_at?: string | null
          day1_welcome_shown?: boolean
          day2_completed?: boolean
          day2_completed_at?: string | null
          day2_inflammation_map?: Json | null
          day3_completed?: boolean
          day3_completed_at?: string | null
          day4_completed?: boolean
          day4_completed_at?: string | null
          day4_sleep_data?: Json | null
          day5_completed?: boolean
          day5_completed_at?: string | null
          day5_movement_data?: Json | null
          day6_completed?: boolean
          day6_completed_at?: string | null
          day6_spice_data?: Json | null
          email?: string
          has_premium?: boolean
          health_conditions?: string[] | null
          heat_map_day1?: Json | null
          height_cm?: number | null
          id: string
          name?: string
          objectives?: string[] | null
          onboarding_data?: Json | null
          pain_level?: string | null
          pantry_items?: string[] | null
          phone?: string | null
          sex?: string | null
          status?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          affected_areas?: string[] | null
          age?: number | null
          avatar_url?: string | null
          challenge_progress?: Json | null
          challenge_start?: string | null
          created_at?: string
          day1_completed?: boolean
          day1_completed_at?: string | null
          day1_welcome_shown?: boolean
          day2_completed?: boolean
          day2_completed_at?: string | null
          day2_inflammation_map?: Json | null
          day3_completed?: boolean
          day3_completed_at?: string | null
          day4_completed?: boolean
          day4_completed_at?: string | null
          day4_sleep_data?: Json | null
          day5_completed?: boolean
          day5_completed_at?: string | null
          day5_movement_data?: Json | null
          day6_completed?: boolean
          day6_completed_at?: string | null
          day6_spice_data?: Json | null
          email?: string
          has_premium?: boolean
          health_conditions?: string[] | null
          heat_map_day1?: Json | null
          height_cm?: number | null
          id?: string
          name?: string
          objectives?: string[] | null
          onboarding_data?: Json | null
          pain_level?: string | null
          pantry_items?: string[] | null
          phone?: string | null
          sex?: string | null
          status?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          allergen_free: string[] | null
          category: string
          common_pantry_match: number | null
          cook_time_minutes: number | null
          created_at: string
          description: string | null
          dica: string | null
          diet_profile: string[] | null
          difficulty: string | null
          food_categories: string[] | null
          health_goals: string[] | null
          icon: string | null
          id: string
          image_url: string | null
          inflammation_score: number | null
          ingredients: string[] | null
          instructions: string[] | null
          is_active: boolean | null
          journey_day: number | null
          journey_role: string | null
          main_ingredients: string[] | null
          nutrient_density_score: number | null
          nutritional_highlights: string | null
          pantry_complexity: string | null
          por_que_resfria: string | null
          prep_time_minutes: number | null
          servings: string | null
          sort_order: number | null
          tags: string[] | null
          theme_tags: string[] | null
          time: string | null
          tipo_refeicao: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          allergen_free?: string[] | null
          category?: string
          common_pantry_match?: number | null
          cook_time_minutes?: number | null
          created_at?: string
          description?: string | null
          dica?: string | null
          diet_profile?: string[] | null
          difficulty?: string | null
          food_categories?: string[] | null
          health_goals?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          inflammation_score?: number | null
          ingredients?: string[] | null
          instructions?: string[] | null
          is_active?: boolean | null
          journey_day?: number | null
          journey_role?: string | null
          main_ingredients?: string[] | null
          nutrient_density_score?: number | null
          nutritional_highlights?: string | null
          pantry_complexity?: string | null
          por_que_resfria?: string | null
          prep_time_minutes?: number | null
          servings?: string | null
          sort_order?: number | null
          tags?: string[] | null
          theme_tags?: string[] | null
          time?: string | null
          tipo_refeicao?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          allergen_free?: string[] | null
          category?: string
          common_pantry_match?: number | null
          cook_time_minutes?: number | null
          created_at?: string
          description?: string | null
          dica?: string | null
          diet_profile?: string[] | null
          difficulty?: string | null
          food_categories?: string[] | null
          health_goals?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          inflammation_score?: number | null
          ingredients?: string[] | null
          instructions?: string[] | null
          is_active?: boolean | null
          journey_day?: number | null
          journey_role?: string | null
          main_ingredients?: string[] | null
          nutrient_density_score?: number | null
          nutritional_highlights?: string | null
          pantry_complexity?: string | null
          por_que_resfria?: string | null
          prep_time_minutes?: number | null
          servings?: string | null
          sort_order?: number | null
          tags?: string[] | null
          theme_tags?: string[] | null
          time?: string | null
          tipo_refeicao?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sos_protocols: {
        Row: {
          created_at: string | null
          description: string | null
          exercise_sequence: Json
          icon: string | null
          id: string
          is_active: boolean | null
          situation: string
          sort_order: number | null
          title: string
          total_time_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          exercise_sequence?: Json
          icon?: string | null
          id?: string
          is_active?: boolean | null
          situation: string
          sort_order?: number | null
          title: string
          total_time_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          exercise_sequence?: Json
          icon?: string | null
          id?: string
          is_active?: boolean | null
          situation?: string
          sort_order?: number | null
          title?: string
          total_time_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          notes: string | null
          payment_method: string | null
          plan_id: string
          status: string
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          plan_id: string
          status?: string
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          plan_id?: string
          status?: string
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      symptom_entries: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: string | null
          notes: string | null
          pain_level: number
          swelling: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          notes?: string | null
          pain_level?: number
          swelling?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: string | null
          notes?: string | null
          pain_level?: number
          swelling?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_module_progress: {
        Row: {
          completed_at: string
          id: string
          module_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          module_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          module_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learn_modules"
            referencedColumns: ["id"]
          },
        ]
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
