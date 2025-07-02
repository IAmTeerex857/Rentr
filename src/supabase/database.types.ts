export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profile_settings: {
        Row: {
          created_at: string
          currency: string
          id: string
          language: string
          newsletter: boolean
          notifications_app: boolean
          notifications_email: boolean
          notifications_sms: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id: string
          language?: string
          newsletter?: boolean
          notifications_app?: boolean
          notifications_email?: boolean
          notifications_sms?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          language?: string
          newsletter?: boolean
          notifications_app?: boolean
          notifications_email?: boolean
          notifications_sms?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          avatar_url: string | null
          city: string
          completed_onboarding: boolean
          country: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          provider_type: string
          updated_at: string
          user_type: string
        }
        Insert: {
          address?: string
          avatar_url?: string | null
          city?: string
          completed_onboarding?: boolean
          country?: string
          created_at?: string
          email: string
          first_name?: string
          id: string
          last_name?: string
          phone?: string
          provider_type?: string
          updated_at?: string
          user_type?: string
        }
        Update: {
          address?: string
          avatar_url?: string | null
          city?: string
          completed_onboarding?: boolean
          country?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          provider_type?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      },
      properties: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          price: number
          currency: string
          purpose: 'rent' | 'sale'
          bedrooms: number
          bathrooms: number
          area: number
          area_unit: string
          property_type: string
          amenities: string[]
          images: string[]
          owner_id: string
          created_at: string
          updated_at: string
          latitude: number | null
          longitude: number | null
          is_featured: boolean | null
          status: 'active' | 'pending' | 'sold' | 'rented'
        }
        Insert: {
          id?: string
          title: string
          description: string
          location: string
          price: number
          currency?: string
          purpose: 'rent' | 'sale'
          bedrooms: number
          bathrooms: number
          area: number
          area_unit?: string
          property_type: string
          amenities?: string[]
          images?: string[]
          owner_id: string
          created_at?: string
          updated_at?: string
          latitude?: number | null
          longitude?: number | null
          is_featured?: boolean | null
          status?: 'active' | 'pending' | 'sold' | 'rented'
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          price?: number
          currency?: string
          purpose?: 'rent' | 'sale'
          bedrooms?: number
          bathrooms?: number
          area?: number
          area_unit?: string
          property_type?: string
          amenities?: string[]
          images?: string[]
          owner_id?: string
          created_at?: string
          updated_at?: string
          latitude?: number | null
          longitude?: number | null
          is_featured?: boolean | null
          status?: 'active' | 'pending' | 'sold' | 'rented'
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      bookings: {
        Row: {
          id: string
          property_id: string
          user_id: string
          start_date: string
          end_date: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          created_at: string
          updated_at: string
          guests: number
          special_requests?: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          start_date: string
          end_date: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          created_at?: string
          updated_at?: string
          guests: number
          special_requests?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          start_date?: string
          end_date?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price?: number
          created_at?: string
          updated_at?: string
          guests?: number
          special_requests?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_id?: string
          participants: string[]
          last_message?: string
          last_message_time?: string
          unread_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          participants: string[]
          last_message?: string
          last_message_time?: string
          unread_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          participants?: string[]
          last_message?: string
          last_message_time?: string
          unread_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversations_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      },
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          created_at: string
          read: boolean
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          recipient_id: string
          content: string
          created_at?: string
          read?: boolean
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          created_at?: string
          read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
      property_reviews: {
        Row: {
          id: string
          property_id: string
          reviewer_id: string
          booking_id: string | null
          rating: number
          cleanliness_rating: number | null
          location_rating: number | null
          value_rating: number | null
          communication_rating: number | null
          comment: string | null
          response: string | null
          response_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          reviewer_id: string
          booking_id?: string | null
          rating: number
          cleanliness_rating?: number | null
          location_rating?: number | null
          value_rating?: number | null
          communication_rating?: number | null
          comment?: string | null
          response?: string | null
          response_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          reviewer_id?: string
          booking_id?: string | null
          rating?: number
          cleanliness_rating?: number | null
          location_rating?: number | null
          value_rating?: number | null
          communication_rating?: number | null
          comment?: string | null
          response?: string | null
          response_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_reviews_property_id_fkey"
            columns: ["property_id"]
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_reviews_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      },
      host_reviews: {
        Row: {
          id: string
          host_id: string
          reviewer_id: string
          booking_id: string | null
          rating: number
          communication_rating: number | null
          hospitality_rating: number | null
          comment: string | null
          response: string | null
          response_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          reviewer_id: string
          booking_id?: string | null
          rating: number
          communication_rating?: number | null
          hospitality_rating?: number | null
          comment?: string | null
          response?: string | null
          response_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          reviewer_id?: string
          booking_id?: string | null
          rating?: number
          communication_rating?: number | null
          hospitality_rating?: number | null
          comment?: string | null
          response?: string | null
          response_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_reviews_host_id_fkey"
            columns: ["host_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "host_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "host_reviews_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      },
      guest_reviews: {
        Row: {
          id: string
          guest_id: string
          reviewer_id: string
          booking_id: string | null
          rating: number
          cleanliness_rating: number | null
          communication_rating: number | null
          rule_following_rating: number | null
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guest_id: string
          reviewer_id: string
          booking_id?: string | null
          rating: number
          cleanliness_rating?: number | null
          communication_rating?: number | null
          rule_following_rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guest_id?: string
          reviewer_id?: string
          booking_id?: string | null
          rating?: number
          cleanliness_rating?: number | null
          communication_rating?: number | null
          rule_following_rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_reviews_guest_id_fkey"
            columns: ["guest_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_reviews_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      },
      // Removed mapped type that was causing errors
    },
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
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
    Enums: {},
  },
} as const
