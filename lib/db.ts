// Database connection utility
// This file handles database connections using Supabase (PostgreSQL)

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

// Get Supabase client instance
export function getDb(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// For backwards compatibility - but prefer using getDb() directly
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  throw new Error('Raw SQL queries not supported with Supabase. Use getDb() and Supabase client methods instead.');
}

// Export Supabase client for direct use
export const supabaseClient = getDb();

// Close database connection (Supabase handles this automatically)
export async function closeDb() {
  supabase = null;
}
