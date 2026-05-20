import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase auth session and handles lightweight route
 * protection. Call this inside your root middleware.ts.
 *
 * WHY getSession() instead of getUser():
 * getUser() makes a network round-trip to Supabase Auth on EVERY request.
 * On Vercel Edge Runtime (~1.5 s timeout) this causes 504 MIDDLEWARE_INVOCATION_TIMEOUT
 * when Supabase is slow (free-tier cold start, network lag, etc.).
 * getSession() validates the JWT from the cookie locally — zero network calls —
 * so it is always fast. Full server-side user verification still happens in
 * server components / layouts (e.g. admin/layout.tsx uses getUser()).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );

  // Read session from cookie — no network call, no timeout risk.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  /* ── Route protection ── */
  const { pathname } = request.nextUrl;

  // Protected routes: redirect to /login if not authenticated
  const protectedPaths = ['/profile'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Auth pages: redirect to / if already authenticated
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
