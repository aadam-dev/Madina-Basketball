/**
 * Supabase Admin Client Configuration
 * 
 * Server-side Supabase client with service role key.
 * This client BYPASSES Row Level Security (RLS) policies.
 * 
 * SECURITY WARNING:
 * - Only use in API routes (server-side)
 * - Never expose this client to the browser
 * - Never commit the service role key to version control
 * - Always validate user permissions before using this client
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase admin environment variables');
}

/**
 * Admin Supabase client
 * 
 * Use this for:
 * - Admin API routes (after authentication check)
 * - Operations that need to bypass RLS
 * - Writing data that requires elevated permissions
 * 
 * Security requirements:
 * - Always call requireAuth() before using this client
 * - Validate all inputs before database operations
 * - Never use in client components or browser code
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false, // No token refresh needed for service role
    persistSession: false, // No session persistence needed
  },
});

