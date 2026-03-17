import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * True only when REAL (non-placeholder) Supabase credentials are present.
 *
 * The forms check this before making any network call so they can show
 * "Supabase is not configured" instead of a cryptic "Failed to fetch".
 */
export const isSupabaseConfigured =
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('placeholder') &&
  SUPABASE_ANON_KEY.length > 30 &&
  !SUPABASE_ANON_KEY.includes('placeholder');

/**
 * Returns a Supabase browser client.
 * Call this inside components / hooks only (never at module scope).
 */
export function createClient() {
  return createBrowserClient(
    SUPABASE_URL      || 'https://placeholder.supabase.co',
    SUPABASE_ANON_KEY || 'placeholder-anon-key',
  );
}
