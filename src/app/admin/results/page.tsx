import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DBGameResult, DBProfile } from '@/types/admin';

export const metadata: Metadata = { title: 'Natijalar' };

const LANG_LABELS: Record<string, string> = {
  uz: 'UZ',
  ru: 'RU',
  en: 'EN',
};

const LANG_COLORS: Record<string, string> = {
  uz: 'bg-violet-50 text-violet-700',
  ru: 'bg-blue-50 text-blue-700',
  en: 'bg-emerald-50 text-emerald-700',
};

export default async function ResultsPage() {
  const supabase = await createClient();

  /* Fetch results + all profiles in parallel (admin policies allow this) */
  const [{ data: results, error }, { data: profiles }] = await Promise.all([
    supabase
      .from('game_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(300)
      .returns<DBGameResult[]>(),

    supabase
      .from('profiles')
      .select('id, full_name, email')
      .returns<Pick<DBProfile, 'id' | 'full_name' | 'email'>[]>(),
  ]);

  /* Build quick profile lookup map */
  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.id, p]),
  );

  const list = (results ?? []).map((r) => ({
    ...r,
    profile: profileMap[r.user_id] ?? null,
  }));

  /* Stats */
  const total   = list.length;
  const avgPct  = total
    ? Math.round(list.reduce((s, r) => s + Number(r.percentage), 0) / total)
    : 0;
  const avgScore = total
    ? Math.round(list.reduce((s, r) => s + r.score, 0) / total)
    : 0;
  const passRate = total
    ? Math.round((list.filter((r) => Number(r.percentage) >= 70).length / total) * 100)
    : 0;

  return (
    <div>
      {/* ── Page header ───────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <h1 className="text-xl font-extrabold text-gray-900">Natijalar</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Barcha o&apos;yinchilar natijalari
        </p>
      </div>

      <div className="p-6 space-y-6">

        {/* ── Mini stats ────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Jami o'yinlar",    value: total,           color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: "O'rtacha foiz",     value: `${avgPct}%`,    color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { label: "O'rtacha ball",     value: avgScore,        color: 'text-amber-600',  bg: 'bg-amber-50'  },
            { label: 'O\'tish darajasi',  value: `${passRate}%`,  color: 'text-emerald-600',bg: 'bg-emerald-50'},
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm`}>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Error ────────────────────────────────── */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <strong>Xatolik:</strong> {error.message}
          </div>
        )}

        {/* ── Results table ─────────────────────────── */}
        {list.length === 0 && !error ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
            <p className="text-sm font-medium text-gray-500">
              Hali hech qanday natija yo&apos;q
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
                      Ball
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      To&apos;g&apos;ri
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Foiz
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Til
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Sana
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((r) => {
                    const pct    = Math.round(Number(r.percentage));
                    const isGood = pct >= 70;
                    const name   =
                      r.profile?.full_name ||
                      r.profile?.email?.split('@')[0] ||
                      r.user_id.slice(0, 8) + '…';
                    const email  = r.profile?.email ?? '—';

                    return (
                      <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                              {name}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate max-w-[160px]">
                              {email}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-extrabold text-gray-800">
                            {r.score}
                          </span>
                          <span className="text-xs text-gray-400 ml-0.5">pts</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">
                          <span className="font-semibold">{r.correct_answers}</span>
                          <span className="text-gray-400">/{r.total_questions}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {isGood ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-orange-400 shrink-0" />
                            )}
                            <span
                              className={cn(
                                'text-sm font-extrabold',
                                isGood ? 'text-emerald-600' : 'text-orange-500',
                              )}
                            >
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-1 text-[11px] font-bold uppercase',
                              LANG_COLORS[r.language] ?? 'bg-gray-100 text-gray-600',
                            )}
                          >
                            {LANG_LABELS[r.language] ?? r.language}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString('uz-UZ', {
                            day:   'numeric',
                            month: 'short',
                            year:  'numeric',
                          })}
                          <br />
                          <span className="text-[10px]">
                            {new Date(r.created_at).toLocaleTimeString('uz-UZ', {
                              hour:   '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
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
                {list.length} ta natija (so&apos;nggi 300 ta)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
