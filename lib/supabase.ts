/**
 * Supabase Client Configuration
 * 
 * Client-side Supabase client for public data access.
 * Uses the anonymous key which respects Row Level Security (RLS) policies.
 * 
 * This client is safe to use in client components and browser code.
 * For admin operations that bypass RLS, use supabase-admin.ts instead.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Public Supabase client
 * 
 * Use this for:
 * - Reading public data (events, games, team members)
 * - Client-side data fetching
 * - Components that need to access Supabase
 * 
 * Do NOT use this for:
 * - Admin operations
 * - Writing sensitive data
 * - Operations that need to bypass RLS
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

