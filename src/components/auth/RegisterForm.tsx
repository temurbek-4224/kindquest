'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

const UI = {
  title:       { uz: 'Hisob yaratish',          ru: 'Создать аккаунт',         en: 'Create an account'         },
  name:        { uz: 'Ism',                      ru: 'Имя',                     en: 'Full name'                 },
  email:       { uz: 'E-pochta',                 ru: 'Электронная почта',       en: 'Email address'             },
  password:    { uz: 'Parol',                    ru: 'Пароль',                  en: 'Password'                  },
  confirm:     { uz: 'Parolni tasdiqlang',       ru: 'Подтвердите пароль',      en: 'Confirm password'          },
  submit:      { uz: 'Ro\'yxatdan o\'tish',      ru: 'Зарегистрироваться',      en: 'Sign up'                   },
  hasAccount:  { uz: 'Hisob bor?',               ru: 'Уже есть аккаунт?',       en: 'Already have an account?'  },
  login:       { uz: 'Kirish',                   ru: 'Войти',                   en: 'Sign in'                   },
  passMismatch:{ uz: 'Parollar mos emas',        ru: 'Пароли не совпадают',     en: 'Passwords do not match'    },
  passShort:   { uz: 'Parol kamida 6 belgi',     ru: 'Минимум 6 символов',      en: 'Minimum 6 characters'      },
  success:     {
    uz: 'Ro\'yxatdan o\'tdingiz! Emailni tasdiqlang.',
    ru: 'Успешно! Проверьте email.',
    en: 'Success! Check your email to confirm.',
  },
  errGeneric:  { uz: 'Xatolik yuz berdi',        ru: 'Произошла ошибка',        en: 'Something went wrong'      },
  /* Shown when .env.local has placeholder / missing values */
  errNotSetup: {
    uz: 'Supabase sozlanmagan. .env.local faylida NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY ni to\'ldiring.',
    ru: 'Supabase не настроен. Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в файле .env.local.',
    en: 'Supabase is not configured. Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
  },
  /* Network-level failure (wrong URL, no internet, CORS, etc.) */
  errNetwork:  {
    uz: 'Serverga ulanib bo\'lmadi. Supabase URL va Anon Key to\'g\'riligini tekshiring.',
    ru: 'Не удалось подключиться к серверу. Проверьте Supabase URL и Anon Key.',
    en: 'Cannot reach the server. Check that your Supabase URL and Anon Key are correct.',
  },
};

export default function RegisterForm() {
  const { language } = useLanguage();
  const l = language;
  const router = useRouter();

  /*
   * Memoize the client so we get ONE stable instance for the lifetime of
   * this component mount. Creating it on every render wastes resources.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase = useMemo(() => createClient(), []);

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    /* ── Local validation ── */
    if (password.length < 6)  { setError(UI.passShort[l]);    return; }
    if (password !== confirm)  { setError(UI.passMismatch[l]); return; }

    /* ── Guard: env vars must be real before hitting the network ── */
    if (!isSupabaseConfigured) {
      setError(UI.errNotSetup[l]);
      console.error(
        '[RegisterForm] Supabase env vars are missing or contain placeholder values.\n' +
        'Edit .env.local and restart the dev server.',
      );
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
          // emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        /* Distinguish network errors from Supabase auth errors */
        if (
          signUpError.message.toLowerCase().includes('fetch') ||
          signUpError.message.toLowerCase().includes('network') ||
          signUpError.message.toLowerCase().includes('failed')
        ) {
          setError(UI.errNetwork[l]);
        } else {
          /* Real Supabase error (e.g. "User already registered", "Invalid email") */
          setError(signUpError.message);
        }
        console.error('[RegisterForm] signUp error:', signUpError);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      /* If email confirmation is disabled in Supabase → redirect immediately */
      setTimeout(() => router.push('/'), 3000);

    } catch (unexpectedErr) {
      /*
       * Catches any thrown exception (e.g. the SDK throws instead of returning
       * an error object, or there's a JS runtime error).
       */
      const msg =
        unexpectedErr instanceof Error
          ? unexpectedErr.message
          : String(unexpectedErr);

      console.error('[RegisterForm] unexpected exception:', unexpectedErr);

      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError(UI.errNetwork[l]);
      } else {
        setError(msg || UI.errGeneric[l]);
      }
      setLoading(false);
    }
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-xl"
      >
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">{UI.success[l]}</h2>
      </motion.div>
    );
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

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{UI.name[l]}</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali Valiyev"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{UI.email[l]}</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{UI.password[l]}</label>
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

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{UI.confirm[l]}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5 leading-relaxed"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

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

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {UI.hasAccount[l]}{' '}
          <Link href="/login" className="font-semibold text-violet-600 hover:underline">
            {UI.login[l]}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
