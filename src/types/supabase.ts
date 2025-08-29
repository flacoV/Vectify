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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_status: 'free' | 'pro' | 'enterprise'
          subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'pro' | 'enterprise'
          subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      digitalizations: {
        Row: {
          id: string
          user_id: string
          original_filename: string
          original_url: string
          processed_url: string | null
          text_content: string | null
          vector_url: string | null
          png_url: string | null
          status: 'processing' | 'completed' | 'failed'
          type: 'text' | 'drawing' | 'mixed'
          file_size: number
          processing_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_filename: string
          original_url: string
          processed_url?: string | null
          text_content?: string | null
          vector_url?: string | null
          png_url?: string | null
          status?: 'processing' | 'completed' | 'failed'
          type: 'text' | 'drawing' | 'mixed'
          file_size: number
          processing_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_filename?: string
          original_url?: string
          processed_url?: string | null
          text_content?: string | null
          vector_url?: string | null
          png_url?: string | null
          status?: 'processing' | 'completed' | 'failed'
          type?: 'text' | 'drawing' | 'mixed'
          file_size?: number
          processing_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: 'active' | 'canceled' | 'past_due' | 'unpaid'
          plan: 'free' | 'pro' | 'enterprise'
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid'
          plan: 'free' | 'pro' | 'enterprise'
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid'
          plan?: 'free' | 'pro' | 'enterprise'
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
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
