'use client';

import { motion } from 'framer-motion';
import { type User } from '@supabase/supabase-js';
import {
  Trophy, Target, Star, TrendingUp, Calendar,
  CheckCircle2, XCircle, Globe, Mail, User as UserIcon,
  Play, BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import LogoutButton from '@/components/auth/LogoutButton';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

/* ── Types ──────────────────────────────────────────────── */

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface GameResult {
  id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  language: string;
  created_at: string;
}

interface ComputedStats {
  totalGames:  number;
  bestScore:   number;
  avgPercent:  number;
  totalScore:  number;
}

interface ProfileClientProps {
  user:          User;
  profile:       Profile | null;
  recentResults: GameResult[];
  stats:         ComputedStats;
}

/* ── Localised labels ───────────────────────────────────── */
const UI = {
  memberSince: { uz: 'Ro\'yxatdan o\'tgan sana', ru: 'Дата регистрации',      en: 'Member since'       },
  prefLang:    { uz: 'Tanlangan til',            ru: 'Предпочтительный язык', en: 'Preferred language' },
  statistics:  { uz: 'Statistika',               ru: 'Статистика',            en: 'Statistics'         },
  totalGames:  { uz: 'Jami o\'yinlar',           ru: 'Всего игр',             en: 'Total Games'        },
  totalScore:  { uz: 'Jami ball',                ru: 'Всего очков',           en: 'Total Score'        },
  bestScore:   { uz: 'Eng yuqori ball',          ru: 'Лучший счёт',           en: 'Best Score'         },
  avgPercent:  { uz: 'O\'rtacha aniqlik',        ru: 'Средняя точность',      en: 'Avg. Accuracy'      },
  recentGames: { uz: 'So\'nggi o\'yinlar',       ru: 'Последние игры',        en: 'Recent Games'       },
  playGame:    { uz: 'O\'yin boshlash',          ru: 'Начать игру',           en: 'Play a Game'        },
  noGames:     {
    uz: 'Hali o\'yin yo\'q. Birinchi o\'yiningizni boshlang!',
    ru: 'Игр пока нет. Начните первую игру!',
    en: 'No games yet. Start your first game!',
  },
  correct:     { uz: 'to\'g\'ri',               ru: 'верных',               en: 'correct'            },
  langLabels: {
    uz: { uz: "O'zbek tili",  ru: 'Узбекский',  en: 'Uzbek'   },
    ru: { uz: 'Rus tili',     ru: 'Русский',    en: 'Russian' },
    en: { uz: 'Ingliz tili',  ru: 'Английский', en: 'English' },
  } as Record<string, Record<string, string>>,
};

const fadeUp  = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

/* ─────────────────────────────────────────────────────────── */

export default function ProfileClient({ user, profile, recentResults, stats }: ProfileClientProps) {
  const { language } = useLanguage();
  const l = language;

  const displayName =
    profile?.full_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'User';

  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(
        l === 'ru' ? 'ru-RU' : l === 'uz' ? 'uz-UZ' : 'en-US',
        { month: 'long', year: 'numeric' },
      )
    : '—';

  const statCards = [
    { Icon: Target,     value: stats.totalGames,     label: UI.totalGames[l],  color: 'text-violet-600', bg: 'bg-violet-50',  border: 'border-violet-100' },
    { Icon: Trophy,     value: stats.bestScore,      label: UI.bestScore[l],   color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100'  },
    { Icon: TrendingUp, value: `${stats.avgPercent}%`, label: UI.avgPercent[l], color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { Icon: Star,       value: stats.totalScore,     label: UI.totalScore[l],  color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-100'   },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 pb-20 space-y-6">

        {/* ── Profile hero card ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 280, damping: 22 }}
          className="overflow-hidden rounded-3xl bg-white border border-violet-100 shadow-xl shadow-violet-100/40"
        >
          {/* Gradient banner */}
          <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 px-6 pt-8 pb-14">
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center rounded-2xl bg-white/25 text-white text-2xl font-black shadow-lg ring-4 ring-white/30 select-none shrink-0"
                style={{ width: 68, height: 68 }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold text-white truncate">{displayName}</h1>
                <p className="text-sm text-white/75 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Info row — overlaps gradient banner */}
          <div className="-mt-7 mx-4 rounded-2xl bg-white border border-gray-100 shadow-md px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">

              <div className="flex items-center gap-2.5 text-gray-600 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                  <Mail className="h-4 w-4 text-violet-500" />
                </div>
                <span className="truncate font-medium text-gray-700">{user.email}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <Globe className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">{UI.prefLang[l]}</p>
                  <p className="font-semibold text-gray-700 text-sm">
                    {UI.langLabels[l]?.[l] ?? language.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <UserIcon className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">{UI.memberSince[l]}</p>
                  <p className="font-semibold text-gray-700 text-sm">{memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end px-5 py-3 mt-1 border-t border-gray-100">
            <LogoutButton />
          </div>
        </motion.div>

        {/* ── Statistics ────────────────────────────────── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <BarChart3 className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-extrabold text-gray-800">{UI.statistics[l]}</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {statCards.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={cn(
                  'flex flex-col gap-1 rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow',
                  s.border,
                )}
              >
                <div className={cn('mb-1 flex h-9 w-9 items-center justify-center rounded-xl', s.bg)}>
                  <s.Icon className={cn('h-5 w-5', s.color)} />
                </div>
                <span className={cn('text-2xl font-extrabold', s.color)}>{s.value}</span>
                <span className="text-xs text-gray-400 font-medium">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Recent games ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-violet-500" />
              <h2 className="text-lg font-extrabold text-gray-800">{UI.recentGames[l]}</h2>
            </div>
            <Link href="/game" className="text-sm font-semibold text-violet-600 hover:underline">
              {UI.playGame[l]} →
            </Link>
          </div>

          {recentResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-6 py-12 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
                <Play className="h-7 w-7 text-violet-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-4">{UI.noGames[l]}</p>
              <Link
                href="/game"
                className="inline-flex items-center gap-2 rounded-xl gradient-brand px-6 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              >
                {UI.playGame[l]}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentResults.map((r, i) => {
                const isGood = Number(r.percentage) >= 70;
                const date   = new Date(r.created_at).toLocaleDateString(
                  l === 'ru' ? 'ru-RU' : l === 'uz' ? 'uz-UZ' : 'en-US',
                  { day: 'numeric', month: 'short', year: 'numeric' },
                );
                const gameLang =
                  r.language === 'uz' ? "O'zbek" :
                  r.language === 'ru' ? 'Русский' :
                  'English';

                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm hover:shadow-md hover:border-violet-100 transition-all"
                  >
                    {/* Result icon */}
                    <div className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      isGood ? 'bg-emerald-50' : 'bg-orange-50',
                    )}>
                      {isGood
                        ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        : <XCircle      className="h-6 w-6 text-orange-400"  />}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          'text-lg font-extrabold',
                          isGood ? 'text-emerald-600' : 'text-orange-500',
                        )}>
                          {Math.round(Number(r.percentage))}%
                        </span>
                        <span className="text-xs text-gray-400">
                          · {r.correct_answers}/{r.total_questions} {UI.correct[l]}
                        </span>
                        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                          {gameLang}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {date}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="font-extrabold text-gray-800">{r.score}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">pts</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

      </main>
    </div>
  );
}
