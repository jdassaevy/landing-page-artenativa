
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "class_periods": {
                  Row: {
                    "created_at": string,"ends_at": string,"id": string,"is_current": boolean,"name": string,"starts_at": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"ends_at": string,"id"?: string,"is_current"?: boolean,"name": string,"starts_at": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"ends_at"?: string,"id"?: string,"is_current"?: boolean,"name"?: string,"starts_at"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"classes": {
                  Row: {
                    "created_at": string,"end_time": string,"id": string,"is_active": boolean,"location_id": string,"modality": string,"period_id": string,"start_time": string,"updated_at": string,"weekday": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"end_time": string,"id"?: string,"is_active"?: boolean,"location_id": string,"modality": string,"period_id": string,"start_time": string,"updated_at"?: string,"weekday": number
                  }
                  Update: {
                    "created_at"?: string,"end_time"?: string,"id"?: string,"is_active"?: boolean,"location_id"?: string,"modality"?: string,"period_id"?: string,"start_time"?: string,"updated_at"?: string,"weekday"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "classes_location_id_fkey"
      columns: ["location_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "classes_period_id_fkey"
      columns: ["period_id"]
isOneToOne: false
      referencedRelation: "class_periods"
      referencedColumns: ["id"]
    }
                  ]
                },"events": {
                  Row: {
                    "cover_path": string | null,"created_at": string,"description": string | null,"end_time": string | null,"event_date": string,"id": string,"latitude": number | null,"longitude": number | null,"maps_url": string | null,"promotion_ends_at": string | null,"promotion_starts_at": string | null,"show_on_home": boolean,"show_popup": boolean,"slug": string,"start_time": string | null,"status": string,"table_message": string | null,"ticket_message": string | null,"title": string,"updated_at": string,"venue_address": string,"venue_city": string,"venue_name": string,"venue_state": string,"whatsapp_number": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "cover_path"?: string | null,"created_at"?: string,"description"?: string | null,"end_time"?: string | null,"event_date": string,"id"?: string,"latitude"?: number | null,"longitude"?: number | null,"maps_url"?: string | null,"promotion_ends_at"?: string | null,"promotion_starts_at"?: string | null,"show_on_home"?: boolean,"show_popup"?: boolean,"slug": string,"start_time"?: string | null,"status"?: string,"table_message"?: string | null,"ticket_message"?: string | null,"title": string,"updated_at"?: string,"venue_address": string,"venue_city": string,"venue_name": string,"venue_state": string,"whatsapp_number"?: string | null
                  }
                  Update: {
                    "cover_path"?: string | null,"created_at"?: string,"description"?: string | null,"end_time"?: string | null,"event_date"?: string,"id"?: string,"latitude"?: number | null,"longitude"?: number | null,"maps_url"?: string | null,"promotion_ends_at"?: string | null,"promotion_starts_at"?: string | null,"show_on_home"?: boolean,"show_popup"?: boolean,"slug"?: string,"start_time"?: string | null,"status"?: string,"table_message"?: string | null,"ticket_message"?: string | null,"title"?: string,"updated_at"?: string,"venue_address"?: string,"venue_city"?: string,"venue_name"?: string,"venue_state"?: string,"whatsapp_number"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"locations": {
                  Row: {
                    "address": string,"city": string,"created_at": string,"id": string,"image_path": string | null,"is_active": boolean,"latitude": number | null,"longitude": number | null,"maps_url": string | null,"name": string,"state": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "address": string,"city": string,"created_at"?: string,"id"?: string,"image_path"?: string | null,"is_active"?: boolean,"latitude"?: number | null,"longitude"?: number | null,"maps_url"?: string | null,"name": string,"state": string,"updated_at"?: string
                  }
                  Update: {
                    "address"?: string,"city"?: string,"created_at"?: string,"id"?: string,"image_path"?: string | null,"is_active"?: boolean,"latitude"?: number | null,"longitude"?: number | null,"maps_url"?: string | null,"name"?: string,"state"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "duplicate_class_period":
{ Args: { "new_ends_at": string,"new_name": string,"new_starts_at": string,"source_period_id": string }; Returns: string
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
