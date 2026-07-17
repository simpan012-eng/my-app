import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * This client uses the SECRET key and bypasses Row Level Security.
 * It must NEVER be imported into a client component, and the
 * SUPABASE_SECRET_KEY env var must NOT have the NEXT_PUBLIC_ prefix.
 * Only use this inside Server Actions / Route Handlers, after verifying
 * the caller is an admin.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}