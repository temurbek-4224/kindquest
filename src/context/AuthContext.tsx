'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
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
   * IMPORTANT: createClient() must be memoized so we get ONE stable instance
   * for the lifetime of this provider. Creating it on every render leaks
   * the onAuthStateChange subscription and causes unpredictable behaviour.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = useMemo(() => createClient(), []);

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
     * Safety net: force loading=false after 4 seconds so the navbar never
     * gets stuck showing a skeleton permanently.
     *
     * Why this is needed:
     *   When the access-token in cookies is expired, getSession() and the
     *   onAuthStateChange INITIAL_SESSION event both try to refresh the token
     *   by calling Supabase Auth over the network. On a slow or cold-starting
     *   free-tier project this can hang indefinitely, keeping loading=true
     *   forever and hiding the Sign-in / Sign-up buttons.
     */
    const safetyTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn('[AuthContext] Auth init timed out after 4 s — forcing loading=false');
        }
        return false;
      });
    }, 4000);

    /* Subscribe to auth state changes FIRST — fires INITIAL_SESSION quickly */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      clearTimeout(safetyTimer);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    /* Initial session fetch — also resolves loading */
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
  }, [supabase]);

  /* Fetch admin role whenever the user changes */
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
  }, [user, supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

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
