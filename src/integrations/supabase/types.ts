export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          details: Json | null
          id: string
          performed_at: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          details?: Json | null
          id?: string
          performed_at?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          details?: Json | null
          id?: string
          performed_at?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          advertiser_id: string
          budget: number
          clicks: number
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          impressions: number
          spent: number
          start_date: string | null
          status: string
          target_audience: Json | null
          target_url: string
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          advertiser_id: string
          budget?: number
          clicks?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          impressions?: number
          spent?: number
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          target_url: string
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          advertiser_id?: string
          budget?: number
          clicks?: number
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          impressions?: number
          spent?: number
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          target_url?: string
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          opportunity_id: string | null
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          opportunity_id?: string | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          opportunity_id?: string | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          id: string
          notes: string | null
          opportunity_id: string
          resume_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          notes?: string | null
          opportunity_id: string
          resume_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string
          resume_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          admin_id: string
          content: string
          created_at: string
          id: string
          recipient_emails: string[] | null
          recipient_type: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          title: string
        }
        Insert: {
          admin_id: string
          content: string
          created_at?: string
          id?: string
          recipient_emails?: string[] | null
          recipient_type?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          title: string
        }
        Update: {
          admin_id?: string
          content?: string
          created_at?: string
          id?: string
          recipient_emails?: string[] | null
          recipient_type?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          title?: string
        }
        Relationships: []
      }
      job_descriptions: {
        Row: {
          created_at: string
          extracted_keywords: string[] | null
          id: string
          text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          extracted_keywords?: string[] | null
          id?: string
          text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          extracted_keywords?: string[] | null
          id?: string
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          application_deadline: string | null
          application_instructions: string | null
          applications: number | null
          approved_at: string | null
          approved_by: string | null
          benefits: string[] | null
          company: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          deadline: string
          description: string
          domain: string
          employment_type: string | null
          experience_required: string | null
          external_id: string | null
          featured: boolean | null
          id: string
          is_approved: boolean | null
          is_expired: boolean | null
          location: string | null
          priority: number | null
          rejection_reason: string | null
          remote_work_allowed: boolean | null
          requirements: string[] | null
          salary_range: string | null
          source_platform: string | null
          source_url: string
          submitted_by: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          views: number | null
        }
        Insert: {
          application_deadline?: string | null
          application_instructions?: string | null
          applications?: number | null
          approved_at?: string | null
          approved_by?: string | null
          benefits?: string[] | null
          company?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deadline: string
          description: string
          domain: string
          employment_type?: string | null
          experience_required?: string | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          is_approved?: boolean | null
          is_expired?: boolean | null
          location?: string | null
          priority?: number | null
          rejection_reason?: string | null
          remote_work_allowed?: boolean | null
          requirements?: string[] | null
          salary_range?: string | null
          source_platform?: string | null
          source_url: string
          submitted_by?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          application_deadline?: string | null
          application_instructions?: string | null
          applications?: number | null
          approved_at?: string | null
          approved_by?: string | null
          benefits?: string[] | null
          company?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deadline?: string
          description?: string
          domain?: string
          employment_type?: string | null
          experience_required?: string | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          is_approved?: boolean | null
          is_expired?: boolean | null
          location?: string | null
          priority?: number | null
          rejection_reason?: string | null
          remote_work_allowed?: boolean | null
          requirements?: string[] | null
          salary_range?: string | null
          source_platform?: string | null
          source_url?: string
          submitted_by?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      opportunity_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      opportunity_tags: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string | null
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_tags_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          branch: string | null
          college: string | null
          created_at: string
          email: string | null
          experience_level: string | null
          github_url: string | null
          id: string
          last_active_at: string | null
          linkedin_url: string | null
          location: string | null
          name: string | null
          notification_preferences: Json | null
          phone: string | null
          portfolio_url: string | null
          preferred_job_types: string[] | null
          preferred_locations: string[] | null
          profile_completion_score: number | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          college?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          github_url?: string | null
          id: string
          last_active_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          profile_completion_score?: number | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          college?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          github_url?: string | null
          id?: string
          last_active_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          portfolio_url?: string | null
          preferred_job_types?: string[] | null
          preferred_locations?: string[] | null
          profile_completion_score?: number | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          opportunity_id: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          opportunity_id?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_audits: {
        Row: {
          created_at: string
          id: string
          jd_id: string | null
          match_score: number
          missing_skills: string[] | null
          resume_id: string | null
          suggestions: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          jd_id?: string | null
          match_score: number
          missing_skills?: string[] | null
          resume_id?: string | null
          suggestions?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          jd_id?: string | null
          match_score?: number
          missing_skills?: string[] | null
          resume_id?: string | null
          suggestions?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_audits_jd_id_fkey"
            columns: ["jd_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resume_audits_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string
          extracted_text: string | null
          file_url: string | null
          id: string
          match_score: number | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          extracted_text?: string | null
          file_url?: string | null
          id?: string
          match_score?: number | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          extracted_text?: string | null
          file_url?: string | null
          id?: string
          match_score?: number | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string | null
          id: string
          name: string
          notification_enabled: boolean | null
          search_criteria: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          notification_enabled?: boolean | null
          search_criteria: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          notification_enabled?: boolean | null
          search_criteria?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
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
      assign_user_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      assign_user_role_secure: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      calculate_profile_completion: {
        Args: { profile_row: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: number
      }
      cleanup_recently_viewed: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          _action_type: string
          _target_type: string
          _target_id: string
          _details?: Json
        }
        Returns: undefined
      }
      mark_expired_opportunities: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      app_role: "user" | "admin" | "moderator" | "advertiser"
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
      app_role: ["user", "admin", "moderator", "advertiser"],
    },
  },
} as const
