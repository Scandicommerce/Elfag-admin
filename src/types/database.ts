
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      resource: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string
          category: string
          region: string
          is_taken: boolean
          taken_at: string | null
          taken_by: string | null
        }
        Insert: {
          id?: never
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description: string
          category: string
          region: string
          is_taken?: boolean
          taken_at?: string | null
          taken_by?: string | null
        }
        Update: {
          id?: never
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          region?: string
          is_taken?: boolean
          taken_at?: string | null
          taken_by?: string | null
        }
      }
      message: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          resource_id: number
          from_user_id: string
          to_user_id: string
          message: string
          read_at: string | null
          is_interest: boolean
          status: 'pending' | 'accepted' | 'rejected'
        }
        Insert: {
          id?: never
          created_at?: string
          updated_at?: string
          resource_id: number
          from_user_id: string
          to_user_id: string
          message: string
          read_at?: string | null
          is_interest?: boolean
          status?: 'pending' | 'accepted' | 'rejected'
        }
        Update: {
          id?: never
          created_at?: string
          updated_at?: string
          resource_id?: number
          from_user_id?: string
          to_user_id?: string
          message?: string
          read_at?: string | null
          is_interest?: boolean
          status?: 'pending' | 'accepted' | 'rejected'
        }
      }
    }
  }
}
