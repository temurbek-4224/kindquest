import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DBProfile, DBGameResult } from '@/types/admin';

export const metadata: Metadata = { title: 'Foydalanuvchilar' };

const LANG_LABELS: Record<string, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-violet-100 text-violet-700' },
  user:  { label: 'User',  color: 'bg-gray-100  text-gray-600'   },
};

export default async function UsersPage() {
  const supabase = await createClient();

  /* Fetch all profiles + game_result aggregates in parallel */
  const [{ data: profiles, error }, { data: results }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<DBProfile[]>(),

    supabase
      .from('game_results')
      .select('user_id, score')
      .returns<Pick<DBGameResult, 'user_id' | 'score'>[]>(),
  ]);

  /* Aggregate stats per user */
  const statsByUser: Record<string, { games: number; totalScore: number }> = {};
  for (const r of results ?? []) {
    if (!statsByUser[r.user_id]) statsByUser[r.user_id] = { games: 0, totalScore: 0 };
    statsByUser[r.user_id].games++;
    statsByUser[r.user_id].totalScore += r.score;
  }

  const list = (profiles ?? []).map((p) => ({
    ...p,
    stats: statsByUser[p.id] ?? { games: 0, totalScore: 0 },
  }));

  const totalAdmins = list.filter((u) => u.role === 'admin').length;

  return (
    <div>
      {/* ── Page header ───────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <h1 className="text-xl font-extrabold text-gray-900">Foydalanuvchilar</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Jami:{' '}
          <span className="font-semibold text-gray-700">{list.length}</span> ta
          foydalanuvchi,{' '}
          <span className="font-semibold text-violet-700">{totalAdmins}</span> ta admin
        </p>
      </div>

      <div className="p-6 space-y-6">

        {/* ── Error ────────────────────────────────── */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <strong>Xatolik:</strong> {error.message}
          </div>
        )}

        {/* ── Admin hint ───────────────────────────── */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Admin tayinlash:</strong> Foydalanuvchiga admin huquqi berish uchun
            Supabase Dashboard → Table Editor → profiles → role ustunini{' '}
            <code className="bg-amber-100 rounded px-1 font-mono text-xs">admin</code>{' '}
            ga o&apos;zgartiring.
          </div>
        </div>

        {/* ── Users table ───────────────────────────── */}
        {list.length === 0 && !error ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
            <p className="text-sm font-medium text-gray-500">
              Hali hech qanday foydalanuvchi yo&apos;q
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Foydalanuvchi
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Rol
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      O&apos;yinlar
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Jami ball
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Qo&apos;shilgan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((u) => {
                    const roleBadge = ROLE_BADGE[u.role] ?? ROLE_BADGE.user;
                    const name = u.full_name || u.email?.split('@')[0] || 'Noma\'lum';
                    const initials = name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-brand text-white text-xs font-bold select-none">
                              {initials || <User className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                                {name}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate max-w-[160px]">
                                {u.email ?? '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold',
                              roleBadge.color,
                            )}
                          >
                            {u.role === 'admin' && (
                              <Shield className="h-3 w-3 mr-1" />
                            )}
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-semibold text-gray-700">
                            {u.stats.games}
                          </span>
                          {u.stats.games > 0 && (
                            <span className="text-xs text-gray-400 ml-1">ta</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {u.stats.totalScore > 0 ? (
                            <span className="text-sm font-extrabold text-amber-600">
                              {u.stats.totalScore}
                              <span className="text-xs font-normal text-gray-400 ml-0.5">
                                pts
                              </span>
                            </span>
                          ) : (
                            <span className="text-sm text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(u.created_at).toLocaleDateString('uz-UZ', {
                            day:   'numeric',
                            month: 'short',
                            year:  'numeric',
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
              <p className="text-xs text-gray-500">
                {list.length} ta foydalanuvchi
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
