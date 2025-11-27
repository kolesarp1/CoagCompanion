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
      logs: {
        Row: {
          id: string
          user_id: string
          date: string
          lab_inr: number | null
          home_inr: number | null
          warfarin_dose: number | null
          injections: string | null
          comment: string | null
          vitamin_k_intake: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          lab_inr?: number | null
          home_inr?: number | null
          warfarin_dose?: number | null
          injections?: string | null
          comment?: string | null
          vitamin_k_intake?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          lab_inr?: number | null
          home_inr?: number | null
          warfarin_dose?: number | null
          injections?: string | null
          comment?: string | null
          vitamin_k_intake?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          user_id: string
          target_inr_min: number
          target_inr_max: number
          inr_test_time: string
          dose_time: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          target_inr_min?: number
          target_inr_max?: number
          inr_test_time?: string
          dose_time?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          target_inr_min?: number
          target_inr_max?: number
          inr_test_time?: string
          dose_time?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
