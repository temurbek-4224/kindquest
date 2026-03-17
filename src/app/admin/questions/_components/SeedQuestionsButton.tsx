'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { questions } from '@/data/questions';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function SeedQuestionsButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const router = useRouter();

  async function handleSeed() {
    if (
      !confirm(
        `${questions.length} ta namuna savolni bazaga qo'shishni xohlaysizmi?\n\nBu amal faqat bo'sh jadval uchun to'g'ri.`,
      )
    )
      return;

    setStatus('loading');
    const supabase = createClient();

    /* Map from the local Question type to the flat-column DB schema */
    const rows = questions.map((q) => ({
      category:       q.category,

      question_uz:    q.question.uz,
      question_ru:    q.question.ru,
      question_en:    q.question.en,

      option_a_uz:    q.options.uz[0] ?? '',
      option_a_ru:    q.options.ru[0] ?? '',
      option_a_en:    q.options.en[0] ?? '',

      option_b_uz:    q.options.uz[1] ?? '',
      option_b_ru:    q.options.ru[1] ?? '',
      option_b_en:    q.options.en[1] ?? '',

      option_c_uz:    q.options.uz[2] ?? '',
      option_c_ru:    q.options.ru[2] ?? '',
      option_c_en:    q.options.en[2] ?? '',

      option_d_uz:    q.options.uz[3] ?? '',
      option_d_ru:    q.options.ru[3] ?? '',
      option_d_en:    q.options.en[3] ?? '',

      correct_answer: LETTERS[q.correctAnswerIndex] ?? 'A',

      explanation_uz: q.explanation.uz || null,
      explanation_ru: q.explanation.ru || null,
      explanation_en: q.explanation.en || null,
    }));

    const { error } = await supabase.from('questions').insert(rows);

    if (error) {
      console.error('[SeedQuestions]', error);
      alert('Xatolik: ' + error.message);
      setStatus('error');
    } else {
      setStatus('done');
      setTimeout(() => {
        router.refresh();
        setStatus('idle');
      }, 1500);
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={status !== 'idle'}
      className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-50"
    >
      {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === 'done'    && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
      {status === 'idle'    && <Download className="h-4 w-4" />}
      {status === 'idle'    && 'Namuna savollarni yuklash'}
      {status === 'loading' && 'Yuklanmoqda…'}
      {status === 'done'    && 'Yuklandi!'}
      {status === 'error'   && "Xatolik — qayta urinib ko'ring"}
    </button>
  );
}
