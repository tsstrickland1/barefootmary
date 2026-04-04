import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client using the service role key.
 * Bypasses Row Level Security — only use inside authenticated server actions.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
