import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Plus, Pencil, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import DeleteQuestionButton from './_components/DeleteQuestionButton';
import SeedQuestionsButton from './_components/SeedQuestionsButton';
import type { DBQuestion } from '@/types/admin';

export const metadata: Metadata = { title: 'Savollar' };

const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  respect:    { label: 'Hurmat',       color: 'text-orange-700',  bg: 'bg-orange-50'  },
  honesty:    { label: 'Halollik',     color: 'text-emerald-700', bg: 'bg-emerald-50' },
  kindness:   { label: 'Mehribonlik',  color: 'text-pink-700',    bg: 'bg-pink-50'    },
  school:     { label: 'Maktab xulqi', color: 'text-blue-700',    bg: 'bg-blue-50'    },
  home:       { label: 'Uy-oila',      color: 'text-violet-700',  bg: 'bg-violet-50'  },
  discipline: { label: 'Intizom',      color: 'text-amber-700',   bg: 'bg-amber-50'   },
};

export default async function QuestionsPage() {
  const supabase = await createClient();

  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<DBQuestion[]>();

  const list = questions ?? [];

  return (
    <div>
      {/* ── Page header ───────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Savollar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Jami: <span className="font-semibold text-gray-700">{list.length}</span> ta savol
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {list.length === 0 && <SeedQuestionsButton />}
          <Link
            href="/admin/questions/new"
            className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-bold text-white shadow-md shadow-violet-300/40 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Yangi savol
          </Link>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div className="p-6">

        {/* Error state */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <strong>Xatolik:</strong> {error.message}
          </div>
        )}

        {/* Empty state */}
        {!error && list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
              <BookOpen className="h-7 w-7 text-violet-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Hech qanday savol yo&apos;q
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Namuna savollarni yuklab oling yoki yangi savol qo&apos;shing
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <SeedQuestionsButton />
              <Link
                href="/admin/questions/new"
                className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2 text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Yangi savol
              </Link>
            </div>
          </div>
        )}

        {/* Questions table */}
        {list.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Savol
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Kategoriya
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Javob
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Qo&apos;shilgan
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((q, i) => {
                    const cat = CATEGORY_LABELS[q.category];
                    return (
                      <tr key={q.id} className="hover:bg-gray-50/70 transition-colors group">
                        <td className="px-5 py-3.5 text-sm text-gray-400 font-mono w-10">
                          {i + 1}
                        </td>
                        <td className="px-5 py-3.5 max-w-xs">
                          <p className="text-sm text-gray-700 font-medium line-clamp-2">
                            {q.question_uz}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          {cat ? (
                            <span className={cn(
                              'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold',
                              cat.bg, cat.color,
                            )}>
                              {cat.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">{q.category}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-xs font-extrabold text-emerald-700">
                            {q.correct_answer}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(q.created_at).toLocaleDateString('uz-UZ', {
                            day:   'numeric',
                            month: 'short',
                            year:  'numeric',
                          })}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/admin/questions/${q.id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                              title="Tahrirlash"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            <DeleteQuestionButton
                              id={q.id}
                              label={q.question_uz}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                {list.length} ta savol topildi
              </p>
              <Link
                href="/admin/questions/new"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Yangi qo&apos;shish
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
