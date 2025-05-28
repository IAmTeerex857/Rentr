export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Simplified Database interface for development
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          country: string | null
          user_type: 'seeker' | 'provider'
          created_at: string
          updated_at: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          user_type: 'seeker' | 'provider'
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          user_type?: 'seeker' | 'provider'
          created_at?: string
          updated_at?: string | null
          avatar_url?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          notifications_email: boolean
          notifications_sms: boolean
          notifications_app: boolean
          currency: string
          language: string
          newsletter: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          notifications_email?: boolean
          notifications_sms?: boolean
          notifications_app?: boolean
          currency?: string
          language?: string
          newsletter?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          notifications_email?: boolean
          notifications_sms?: boolean
          notifications_app?: boolean
          currency?: string
          language?: string
          newsletter?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
