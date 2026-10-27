/**
 * Server-side Supabase client with the service role key.
 * Bypasses RLS. Never import this from a client component.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

async function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch (error) {
    const cause =
      error instanceof Error && error.cause instanceof Error ? error.cause.message : "";
    const host = (() => {
      try {
        const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        return new URL(raw).host;
      } catch {
        return "Supabase";
      }
    })();
    throw new Error(
      cause
        ? `Could not reach Supabase at ${host}. ${cause}`
        : `Could not reach Supabase at ${host}.`
    );
  }
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: { fetch: adminFetch },
    });
  }
  return client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const real = getSupabaseAdmin();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
