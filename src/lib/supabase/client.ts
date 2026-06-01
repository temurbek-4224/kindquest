import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * True only when REAL (non-placeholder) Supabase credentials are present.
 * Components check this before making network calls.
 */
export const isSupabaseConfigured =
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('placeholder') &&
  SUPABASE_ANON_KEY.length > 30 &&
  !SUPABASE_ANON_KEY.includes('placeholder');

/**
 * Module-level singleton — ONE browser client shared by every component.
 *
 * WHY A SINGLETON:
 *   createBrowserClient uses the Web Locks API to coordinate auth-session
 *   management (token refresh, cross-tab sync).  Creating more than one
 *   instance on the same page causes:
 *
 *     AbortError: Lock broken by another request with the 'steal' option
 *
 *   because each new instance acquires the lock with steal:true, aborting
 *   in-flight operations (e.g. a questions fetch) on the previous instance.
 *
 * WHY MODULE-SCOPE (not lazy):
 *   Storing the result of createBrowserClient() in a module-level const lets
 *   TypeScript infer the exact same return type as the old per-call pattern,
 *   keeping strict-mode type-checking happy.  client.ts is only imported by
 *   'use client' components, so this code runs in the browser bundle only.
 */
const _client = createBrowserClient(
  SUPABASE_URL      || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
);

export function createClient() {
  return _client;
}
