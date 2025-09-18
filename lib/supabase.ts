import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual Supabase project credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface ChatSession {
  id: string;
  title: string;
  messages: any[]; // JSON array of messages
  created_at: string;
  updated_at: string;
  user_id?: string; // Optional for future user authentication
}

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: ChatSession;
        Insert: Omit<ChatSession, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
    };
  };
}
