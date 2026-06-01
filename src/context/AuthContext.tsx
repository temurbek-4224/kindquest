'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

/* ── Types ──────────────────────────────────────────────── */

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

/* ── Context ────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Provider ───────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  /*
   * createClient() is now a module-level singleton (see lib/supabase/client.ts).
   * Calling it here returns the same object reference on every render —
   * no useMemo needed, no risk of creating duplicate Supabase instances.
   *
   * This is critical: createBrowserClient uses the Web Locks API for
   * session management. Multiple instances → lock-stealing → AbortError.
   */
  const supabase = createClient();

  const [user,    setUser]    = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    /* If Supabase is not configured, skip — avoids "Failed to fetch" noise */
    if (!isSupabaseConfigured) {
      console.warn(
        '[AuthContext] Supabase is not configured.\n' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
      );
      setLoading(false);
      return;
    }

    /*
     * Safety net: force loading=false after 4 s so the navbar never stays
     * frozen on a skeleton when Supabase is slow (free-tier cold start,
     * expired token refresh hanging, etc.).
     */
    const safetyTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn('[AuthContext] Auth init timed out after 4 s — forcing loading=false');
        }
        return false;
      });
    }, 4000);

    /* Subscribe FIRST so INITIAL_SESSION fires before getSession resolves */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      clearTimeout(safetyTimer);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    /* Also call getSession() explicitly in case onAuthStateChange is slow */
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('[AuthContext] getSession error:', error.message);
      }
      clearTimeout(safetyTimer);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount — supabase is a stable singleton reference

  /* Fetch admin role whenever the authenticated user changes */
  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('[AuthContext] profile role fetch error:', error.message);
        }
        setIsAdmin(data?.role === 'admin');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // supabase is stable singleton — only re-run when user changes

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // supabase is stable singleton

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ── Hook ───────────────────────────────────────────────── */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
