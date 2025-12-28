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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          content: string
          created_at: string
          id: string
          message_type: string
          metadata: Json | null
          vehicle_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          message_type: string
          metadata?: Json | null
          vehicle_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          alert_id: string | null
          created_at: string
          customer_notes: string | null
          estimated_duration: number | null
          id: string
          priority: string | null
          scheduled_date: string
          service_center_id: string | null
          service_type: string
          status: string | null
          technician_notes: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          alert_id?: string | null
          created_at?: string
          customer_notes?: string | null
          estimated_duration?: number | null
          id?: string
          priority?: string | null
          scheduled_date: string
          service_center_id?: string | null
          service_type: string
          status?: string | null
          technician_notes?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          alert_id?: string | null
          created_at?: string
          customer_notes?: string | null
          estimated_duration?: number | null
          id?: string
          priority?: string | null
          scheduled_date?: string
          service_center_id?: string | null
          service_type?: string
          status?: string | null
          technician_notes?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "maintenance_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_center_id_fkey"
            columns: ["service_center_id"]
            isOneToOne: false
            referencedRelation: "service_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_feedback: {
        Row: {
          appointment_id: string | null
          created_at: string
          feedback_text: string | null
          id: string
          rating: number | null
          sentiment: string | null
          vehicle_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          sentiment?: string | null
          vehicle_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          sentiment?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_feedback_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_alerts: {
        Row: {
          ai_recommendation: string | null
          alert_type: string
          component: string
          confidence_score: number | null
          created_at: string
          description: string
          id: string
          is_resolved: boolean | null
          predicted_failure_date: string | null
          resolved_at: string | null
          severity: string
          vehicle_id: string | null
        }
        Insert: {
          ai_recommendation?: string | null
          alert_type: string
          component: string
          confidence_score?: number | null
          created_at?: string
          description: string
          id?: string
          is_resolved?: boolean | null
          predicted_failure_date?: string | null
          resolved_at?: string | null
          severity: string
          vehicle_id?: string | null
        }
        Update: {
          ai_recommendation?: string | null
          alert_type?: string
          component?: string
          confidence_score?: number | null
          created_at?: string
          description?: string
          id?: string
          is_resolved?: boolean | null
          predicted_failure_date?: string | null
          resolved_at?: string | null
          severity?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_alerts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      rca_capa: {
        Row: {
          affected_models: string[] | null
          assigned_team: string | null
          component: string
          corrective_action: string | null
          created_at: string
          failure_type: string
          id: string
          manufacturing_feedback: string | null
          occurrence_count: number | null
          preventive_action: string | null
          priority: string | null
          root_cause: string
          status: string | null
          updated_at: string
        }
        Insert: {
          affected_models?: string[] | null
          assigned_team?: string | null
          component: string
          corrective_action?: string | null
          created_at?: string
          failure_type: string
          id?: string
          manufacturing_feedback?: string | null
          occurrence_count?: number | null
          preventive_action?: string | null
          priority?: string | null
          root_cause: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          affected_models?: string[] | null
          assigned_team?: string | null
          component?: string
          corrective_action?: string | null
          created_at?: string
          failure_type?: string
          id?: string
          manufacturing_feedback?: string | null
          occurrence_count?: number | null
          preventive_action?: string | null
          priority?: string | null
          root_cause?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_centers: {
        Row: {
          available_slots: number | null
          capacity: number | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          current_load: number | null
          id: string
          location: string
          name: string
          operating_hours: string | null
          specializations: string[] | null
        }
        Insert: {
          available_slots?: number | null
          capacity?: number | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_load?: number | null
          id?: string
          location: string
          name: string
          operating_hours?: string | null
          specializations?: string[] | null
        }
        Update: {
          available_slots?: number | null
          capacity?: number | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_load?: number | null
          id?: string
          location?: string
          name?: string
          operating_hours?: string | null
          specializations?: string[] | null
        }
        Relationships: []
      }
      ueba_logs: {
        Row: {
          action_type: string
          agent_name: string
          anomaly_type: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          is_anomaly: boolean | null
          resource_accessed: string | null
          risk_score: number | null
          session_id: string | null
        }
        Insert: {
          action_type: string
          agent_name: string
          anomaly_type?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          is_anomaly?: boolean | null
          resource_accessed?: string | null
          risk_score?: number | null
          session_id?: string | null
        }
        Update: {
          action_type?: string
          agent_name?: string
          anomaly_type?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          is_anomaly?: boolean | null
          resource_accessed?: string | null
          risk_score?: number | null
          session_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          battery_voltage: number | null
          created_at: string
          engine_temp: number | null
          fuel_level: number | null
          health_score: number | null
          id: string
          last_service_date: string | null
          license_plate: string | null
          location_lat: number | null
          location_lng: number | null
          make: string
          mileage: number | null
          model: string
          next_service_date: string | null
          oil_pressure: number | null
          owner_email: string | null
          owner_name: string
          owner_phone: string | null
          telematics_status: string | null
          tire_pressure_fl: number | null
          tire_pressure_fr: number | null
          tire_pressure_rl: number | null
          tire_pressure_rr: number | null
          updated_at: string
          vehicle_id: string
          vin: string | null
          year: number
        }
        Insert: {
          battery_voltage?: number | null
          created_at?: string
          engine_temp?: number | null
          fuel_level?: number | null
          health_score?: number | null
          id?: string
          last_service_date?: string | null
          license_plate?: string | null
          location_lat?: number | null
          location_lng?: number | null
          make: string
          mileage?: number | null
          model: string
          next_service_date?: string | null
          oil_pressure?: number | null
          owner_email?: string | null
          owner_name: string
          owner_phone?: string | null
          telematics_status?: string | null
          tire_pressure_fl?: number | null
          tire_pressure_fr?: number | null
          tire_pressure_rl?: number | null
          tire_pressure_rr?: number | null
          updated_at?: string
          vehicle_id: string
          vin?: string | null
          year: number
        }
        Update: {
          battery_voltage?: number | null
          created_at?: string
          engine_temp?: number | null
          fuel_level?: number | null
          health_score?: number | null
          id?: string
          last_service_date?: string | null
          license_plate?: string | null
          location_lat?: number | null
          location_lng?: number | null
          make?: string
          mileage?: number | null
          model?: string
          next_service_date?: string | null
          oil_pressure?: number | null
          owner_email?: string | null
          owner_name?: string
          owner_phone?: string | null
          telematics_status?: string | null
          tire_pressure_fl?: number | null
          tire_pressure_fr?: number | null
          tire_pressure_rl?: number | null
          tire_pressure_rr?: number | null
          updated_at?: string
          vehicle_id?: string
          vin?: string | null
          year?: number
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
