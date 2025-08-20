import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our LEAN schema
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id: string
          username: string
          email: string
          is_active?: boolean
        }
        Update: {
          username?: string
          email?: string
          is_active?: boolean
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          duration_days: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          duration_days: number
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          price?: number
          duration_days?: number
          is_active?: boolean
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: 'active' | 'expired' | 'cancelled'
          start_date: string
          end_date: string
          payment_provider: string | null
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status?: 'active' | 'expired' | 'cancelled'
          start_date?: string
          end_date: string
          payment_provider?: string | null
          payment_id?: string | null
        }
        Update: {
          status?: 'active' | 'expired' | 'cancelled'
          end_date?: string
          payment_provider?: string | null
          payment_id?: string | null
        }
      }
    }
  }
}

// Type-safe Supabase client
export type SupabaseClient = ReturnType<typeof createClient<Database>>
