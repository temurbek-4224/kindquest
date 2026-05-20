import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes Supabase auth-session cookies so that server components and
 * route handlers always see an up-to-date session.
 *
 * IMPORTANT – this function must NEVER block for more than ~1 second.
 * Vercel Edge Runtime kills middleware after 1.5 s, which produces the
 * dreaded 504 MIDDLEWARE_INVOCATION_TIMEOUT error.
 *
 * Why getSession() can time out:
 *   When the access-token JWT is expired, getSession() silently calls
 *   Supabase Auth (/auth/v1/token?grant_type=refresh_token) to rotate it.
 *   On a free-tier project that cold-started, that round-trip can exceed 1.5 s.
 *
 * Fix applied:
 *   1. Early-return if env vars are not set (avoids hanging on unconfigured deployments).
 *   2. Race getSession() against a 1 000 ms timeout – if Supabase is slow we just
 *      pass the request through unchanged; the user will get a fresh token on the
 *      next protected-page visit (profile/admin each call getUser() themselves).
 *   3. ALL redirect logic has been removed from middleware.
 *      – /profile  is guarded by its own server component (getUser() + redirect).
 *      – /admin    is guarded by AdminLayout        (getUser() + role check).
 *      Keeping redirects here was redundant and added extra latency.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Guard: if credentials are absent (e.g. env vars not set in Vercel dashboard)
  // skip entirely – don't let a broken createServerClient call hang.
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Attempt to refresh session cookies. Race against a 1 000 ms deadline so
  // we never approach Vercel's 1.5 s Edge Runtime limit.
  // If this times out or errors, we fall through and return the unchanged
  // response – the app keeps working; the session will refresh on next visit.
  try {
    await Promise.race([
      supabase.auth.getSession(),
      new Promise<void>((resolve) => setTimeout(resolve, 1000)),
    ]);
  } catch {
    // Supabase unreachable or token-refresh failed – continue without refresh.
  }

  return supabaseResponse;
}
