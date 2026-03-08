export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'past_due' | 'paused'
export type SessionMode = 'safe_space' | 'coach' | 'checkin'
export type AttachmentStyle = 'unknown' | 'secure' | 'anxious' | 'avoidant' | 'disorganized'
export type EmotionalStyle = 'unknown' | 'need_to_talk' | 'need_time' | 'varies'
export type RelationshipStatus = 'stable' | 'tension' | 'crisis' | 'unknown'
export type UsageMode = 'solo' | 'couple'
export type MessageRole = 'user' | 'assistant'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          locale: string
          trial_started_at: string
          trial_ends_at: string
          trial_sessions_used: number
          subscription_status: SubscriptionStatus
          subscription_id: string | null
          subscription_ends_at: string | null
          usage_mode: UsageMode | null
          relationship_duration: string | null
          relationship_status: RelationshipStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          locale?: string
          trial_started_at?: string
          trial_ends_at?: string
          trial_sessions_used?: number
          subscription_status?: SubscriptionStatus
          subscription_id?: string | null
          subscription_ends_at?: string | null
          usage_mode?: UsageMode | null
          relationship_duration?: string | null
          relationship_status?: RelationshipStatus
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      relational_profiles: {
        Row: {
          id: string
          user_id: string
          dominant_horsemen: string[]
          attachment_style: AttachmentStyle
          emotional_style: EmotionalStyle
          primary_friction_area: string | null
          skills_in_development: Json
          detected_patterns: string[]
          pending_conversations: string[]
          recent_emotions: string[]
          total_sessions: number
          safe_space_sessions: number
          coach_sessions: number
          checkin_sessions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dominant_horsemen?: string[]
          attachment_style?: AttachmentStyle
          emotional_style?: EmotionalStyle
          primary_friction_area?: string | null
          skills_in_development?: Json
          detected_patterns?: string[]
          pending_conversations?: string[]
          recent_emotions?: string[]
          total_sessions?: number
          safe_space_sessions?: number
          coach_sessions?: number
          checkin_sessions?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['relational_profiles']['Insert']>
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          mode: SessionMode
          emotions_detected: string[]
          horsemen_identified: string[]
          attachment_signal: string | null
          topic: string | null
          skill_worked: string | null
          skill_stage: string | null
          experiment_assigned: string | null
          confidence_score: number | null
          pattern_surfaced: string | null
          connection_score: number | null
          session_summary: string | null
          started_at: string
          ended_at: string | null
          duration_seconds: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mode: SessionMode
          emotions_detected?: string[]
          horsemen_identified?: string[]
          attachment_signal?: string | null
          topic?: string | null
          skill_worked?: string | null
          skill_stage?: string | null
          experiment_assigned?: string | null
          confidence_score?: number | null
          pattern_surfaced?: string | null
          connection_score?: number | null
          session_summary?: string | null
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>
      }
      conversation_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          role: MessageRole
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          role: MessageRole
          content: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['conversation_messages']['Insert']>
      }
      checkin_log: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          connection_score: number | null
          primary_emotion: string | null
          topic_mentioned: string | null
          checked_in_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          connection_score?: number | null
          primary_emotion?: string | null
          topic_mentioned?: string | null
          checked_in_at?: string
        }
        Update: Partial<Database['public']['Tables']['checkin_log']['Insert']>
      }
      checkin_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_checkin_date: string | null
          total_checkins: number
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_checkin_date?: string | null
          total_checkins?: number
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['checkin_streaks']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          paddle_subscription_id: string | null
          paddle_customer_id: string | null
          paddle_transaction_id: string | null
          status: string
          amount: number | null
          currency: string
          billing_cycle: string
          current_period_start: string | null
          current_period_end: string | null
          cancelled_at: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          paddle_subscription_id?: string | null
          paddle_customer_id?: string | null
          paddle_transaction_id?: string | null
          status: string
          amount?: number | null
          currency?: string
          billing_cycle?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancelled_at?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
    }
  }
}
