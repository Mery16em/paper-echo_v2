import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          cover_url: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          cover_url?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          cover_url?: string | null
          user_id?: string
          created_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          book_id: string
          text: string
          tags: string[] | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          text: string
          tags?: string[] | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          text?: string
          tags?: string[] | null
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
