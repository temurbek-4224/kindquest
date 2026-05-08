'use client';

import { useState, useMemo } from 'react';
import { Sparkles, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { getSiteUrl } from '@/lib/supabase/get-site-url';
import { useLanguage } from '@/context/LanguageContext';

const UI = {
  title:      { uz: 'Parolni tiklash',        ru: 'Восстановление пароля',  en: 'Reset your password'    },
  email:      { uz: 'E-pochta',               ru: 'Электронная почта',      en: 'Email address'          },
  submit:     { uz: 'Havolani yuborish',       ru: 'Отправить ссылку',       en: 'Send reset link'        },
  success:    {
    uz: 'Emailga havola yuborildi. Pochtangizni tekshiring.',
    ru: 'Ссылка отправлена. Проверьте почту.',
    en: 'Check your email for the reset link.',
  },
  backToLogin: { uz: 'Kirishga qaytish',      ru: 'Вернуться к входу',      en: 'Back to sign in'        },
  errGeneric: { uz: 'Xatolik yuz berdi',       ru: 'Произошла ошибка',       en: 'Something went wrong'   },
};

export default function ForgotPasswordPage() {
  const { language: l } = useLanguage();
  const supabase = useMemo(() => createClient(), []);

  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message || UI.errGeneric[l]);
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="flex items-center gap-2 mb-10 select-none">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-md shadow-violet-300/40">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-extrabold gradient-text tracking-tight">KindQuest</span>
      </Link>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-xl"
        >
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">{UI.success[l]}</h2>
          <Link href="/login" className="font-semibold text-violet-600 hover:underline text-sm">
            {UI.backToLogin[l]}
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-100/40 p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-6">{UI.title[l]}</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl gradient-brand py-3.5 text-sm font-bold text-white shadow-md shadow-violet-300/50 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {UI.submit[l]}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              <Link href="/login" className="font-semibold text-violet-600 hover:underline">
                {UI.backToLogin[l]}
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
