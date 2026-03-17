import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Users, BarChart3, BookOpen, Trophy, Plus, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const supabase = await createClient();

  /* Parallel queries for all stats */
  const [
    { count: totalUsers },
    { count: totalGames },
    { count: totalQuestions },
    { data: scores },
    { data: recentResults },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('game_results').select('*', { count: 'exact', head: true }),
    supabase.from('questions').select('*', { count: 'exact', head: true }),
    supabase.from('game_results').select('score'),
    supabase
      .from('game_results')
      .select('id, score, percentage, language, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const avgScore =
    scores?.length
      ? Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length)
      : 0;

  const stats = [
    {
      label:  "Foydalanuvchilar",
      value:  totalUsers   ?? 0,
      Icon:   Users,
      color:  'text-violet-600',
      bg:     'bg-violet-50',
      border: 'border-violet-100',
      href:   '/admin/users',
    },
    {
      label:  "O'yinlar soni",
      value:  totalGames   ?? 0,
      Icon:   BarChart3,
      color:  'text-blue-600',
      bg:     'bg-blue-50',
      border: 'border-blue-100',
      href:   '/admin/results',
    },
    {
      label:  "Savollar",
      value:  totalQuestions ?? 0,
      Icon:   BookOpen,
      color:  'text-emerald-600',
      bg:     'bg-emerald-50',
      border: 'border-emerald-100',
      href:   '/admin/questions',
    },
    {
      label:  "O'rtacha ball",
      value:  avgScore,
      Icon:   Trophy,
      color:  'text-amber-600',
      bg:     'bg-amber-50',
      border: 'border-amber-100',
      href:   '/admin/results',
    },
  ];

  const LANG_LABELS: Record<string, string> = { uz: 'UZ', ru: 'RU', en: 'EN' };

  return (
    <div>
      {/* ── Page header ─────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <h1 className="text-xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          KindQuest platformasi umumiy ko&apos;rinishi
        </p>
      </div>

      <div className="p-6 space-y-6">

        {/* ── Stat cards ──────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className={`group rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow ${s.border}`}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <s.Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* ── Quick actions ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href:  '/admin/questions/new',
              icon:  Plus,
              label: 'Yangi savol',
              desc:  'Quiz savoliga yangi element qo\'shish',
              color: 'bg-violet-600 hover:bg-violet-700',
            },
            {
              href:  '/admin/results',
              icon:  BarChart3,
              label: 'Natijalar',
              desc:  'O\'yinchilar natijalarini ko\'rish',
              color: 'bg-blue-600 hover:bg-blue-700',
            },
            {
              href:  '/admin/users',
              icon:  Users,
              label: 'Foydalanuvchilar',
              desc:  'Ro\'yxatdan o\'tganlarni boshqarish',
              color: 'bg-emerald-600 hover:bg-emerald-700',
            },
          ].map(({ href, icon: Icon, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-2xl ${color} px-5 py-4 text-white transition-colors shadow-sm group`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs text-white/70 mt-0.5 truncate">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {/* ── Recent games ─────────────────────────── */}
        {recentResults && recentResults.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900 text-sm">So&apos;nggi o&apos;yinlar</h2>
              <Link
                href="/admin/results"
                className="text-xs font-semibold text-violet-600 hover:underline"
              >
                Barchasi →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentResults.map((r) => {
                const pct = Math.round(Number(r.percentage));
                const isGood = pct >= 70;
                return (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${isGood ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                    <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]">
                      {r.user_id.slice(0, 8)}…
                    </span>
                    <span className={`text-sm font-extrabold ml-auto ${isGood ? 'text-emerald-600' : 'text-orange-500'}`}>
                      {pct}%
                    </span>
                    <span className="text-xs font-semibold text-gray-700 w-12 text-right">
                      {r.score} pts
                    </span>
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600 uppercase">
                      {LANG_LABELS[r.language] ?? r.language}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
