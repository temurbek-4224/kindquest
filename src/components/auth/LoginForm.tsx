'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

const UI = {
  title:      { uz: 'Hisobga kirish',       ru: 'Войти в аккаунт',       en: 'Sign in to your account'   },
  email:      { uz: 'E-pochta',              ru: 'Электронная почта',      en: 'Email address'             },
  password:   { uz: 'Parol',                 ru: 'Пароль',                 en: 'Password'                  },
  submit:     { uz: 'Kirish',                ru: 'Войти',                  en: 'Sign in'                   },
  noAccount:  { uz: 'Hisob yo\'q?',          ru: 'Нет аккаунта?',          en: 'Don\'t have an account?'   },
  register:   { uz: 'Ro\'yxatdan o\'ting',   ru: 'Зарегистрируйтесь',      en: 'Sign up'                   },
  forgot:     { uz: 'Parolni unutdingizmi?', ru: 'Забыли пароль?',         en: 'Forgot password?'          },
  /* Shown only when credentials are wrong (HTTP 400 from Supabase) */
  errInvalid: { uz: 'E-pochta yoki parol noto\'g\'ri', ru: 'Неверный email или пароль', en: 'Invalid email or password' },
  /* Shown when .env.local is not set up */
  errNotSetup: {
    uz: 'Supabase sozlanmagan. .env.local faylida NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY ni to\'ldiring.',
    ru: 'Supabase не настроен. Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в файле .env.local.',
    en: 'Supabase is not configured. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
  },
  /* Shown when the network call itself fails (wrong URL, no internet, CORS) */
  errNetwork: {
    uz: 'Serverga ulanib bo\'lmadi. Supabase URL va Anon Key to\'g\'riligini tekshiring.',
    ru: 'Не удалось подключиться к серверу. Проверьте Supabase URL и Anon Key.',
    en: 'Cannot reach the server. Check that your Supabase URL and Anon Key are correct.',
  },
};

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const { language } = useLanguage();
  const l = language;
  const router = useRouter();

  /*
   * Memoize so the same client instance is reused across re-renders.
   * Avoids re-creating (and leaking) listeners on every render.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = useMemo(() => createClient(), []);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    /* ── Guard: check env vars before making any network request ── */
    if (!isSupabaseConfigured) {
      setError(UI.errNotSetup[l]);
      console.error(
        '[LoginForm] Supabase env vars are missing or contain placeholder values.\n' +
        'Edit .env.local and restart the dev server.',
      );
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('[LoginForm] signIn error:', signInError);

        /*
         * Distinguish between:
         *  - Network/fetch errors  → show the connectivity error
         *  - Auth errors (400/401) → show "invalid credentials" (don't leak details)
         */
        if (
          signInError.message.toLowerCase().includes('fetch') ||
          signInError.message.toLowerCase().includes('network') ||
          signInError.message.toLowerCase().includes('failed')
        ) {
          setError(UI.errNetwork[l]);
        } else {
          /* Supabase auth error — keep message generic for security */
          setError(UI.errInvalid[l]);
        }

        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();

    } catch (unexpectedErr) {
      const msg =
        unexpectedErr instanceof Error
          ? unexpectedErr.message
          : String(unexpectedErr);

      console.error('[LoginForm] unexpected exception:', unexpectedErr);

      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError(UI.errNetwork[l]);
      } else {
        setError(msg || UI.errInvalid[l]);
      }
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-100/40 p-8">

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">{UI.title[l]}</h1>

        {/* ── Dev-mode warning when Supabase is not configured ── */}
        {!isSupabaseConfigured && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <p className="text-xs font-medium text-amber-800">
              Supabase not configured — add real credentials to <code className="font-mono">.env.local</code> and restart the server.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {UI.email[l]}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-700">{UI.password[l]}</label>
              <span className="text-xs text-violet-600 hover:underline cursor-pointer">
                {UI.forgot[l]}
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-11 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 leading-relaxed"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3.5 text-sm font-bold text-white shadow-md shadow-violet-300/50 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {UI.submit[l]}
          </button>
        </form>

        {/* Sign-up link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {UI.noAccount[l]}{' '}
          <Link href="/register" className="font-semibold text-violet-600 hover:underline">
            {UI.register[l]}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
