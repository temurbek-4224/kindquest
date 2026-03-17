'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, X, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { DBQuestion } from '@/types/admin';

/* ── Types ─────────────────────────────────────────────── */

type Lang         = 'uz' | 'ru' | 'en';
type OptionLetter = 'a' | 'b' | 'c' | 'd';

interface FormState {
  category:       string;
  question_uz:    string;
  question_ru:    string;
  question_en:    string;
  option_a_uz:    string;
  option_a_ru:    string;
  option_a_en:    string;
  option_b_uz:    string;
  option_b_ru:    string;
  option_b_en:    string;
  option_c_uz:    string;
  option_c_ru:    string;
  option_c_en:    string;
  option_d_uz:    string;
  option_d_ru:    string;
  option_d_en:    string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation_uz: string;
  explanation_ru: string;
  explanation_en: string;
}

interface Props {
  /** If provided, the form is in "edit" mode */
  question?: DBQuestion;
}

/* ── Constants ─────────────────────────────────────────── */

const CATEGORIES = [
  { value: 'respect',    label: 'Hurmat',       icon: '👴' },
  { value: 'honesty',    label: 'Halollik',     icon: '✅' },
  { value: 'kindness',   label: 'Mehribonlik',  icon: '💝' },
  { value: 'school',     label: 'Maktab xulqi', icon: '🏫' },
  { value: 'home',       label: 'Uy-oila',      icon: '🏠' },
  { value: 'discipline', label: 'Intizom',      icon: '⭐' },
  { value: 'general',    label: 'Umumiy',       icon: '📚' },
];

const LANGS: { key: Lang; label: string; flag: string }[] = [
  { key: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { key: 'ru', label: 'Русский',   flag: '🇷🇺' },
  { key: 'en', label: 'English',   flag: '🇬🇧' },
];

const OPTION_LETTERS: OptionLetter[] = ['a', 'b', 'c', 'd'];
const OPTION_DISPLAY = ['A', 'B', 'C', 'D'] as const;

const EMPTY: FormState = {
  category:       'respect',
  question_uz:    '',
  question_ru:    '',
  question_en:    '',
  option_a_uz:    '',
  option_a_ru:    '',
  option_a_en:    '',
  option_b_uz:    '',
  option_b_ru:    '',
  option_b_en:    '',
  option_c_uz:    '',
  option_c_ru:    '',
  option_c_en:    '',
  option_d_uz:    '',
  option_d_ru:    '',
  option_d_en:    '',
  correct_answer: 'A',
  explanation_uz: '',
  explanation_ru: '',
  explanation_en: '',
};

/* ── Input helpers ─────────────────────────────────────── */

function inputCls(hasError?: boolean) {
  return cn(
    'w-full rounded-xl border px-3 py-2 text-sm text-gray-800 placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-colors',
    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300',
  );
}

/* ── Component ─────────────────────────────────────────── */

export default function QuestionForm({ question }: Props) {
  const router = useRouter();
  const isEdit = !!question;

  const [form, setForm] = useState<FormState>(() =>
    question
      ? {
          category:       question.category,
          question_uz:    question.question_uz,
          question_ru:    question.question_ru,
          question_en:    question.question_en,
          option_a_uz:    question.option_a_uz,
          option_a_ru:    question.option_a_ru,
          option_a_en:    question.option_a_en,
          option_b_uz:    question.option_b_uz,
          option_b_ru:    question.option_b_ru,
          option_b_en:    question.option_b_en,
          option_c_uz:    question.option_c_uz,
          option_c_ru:    question.option_c_ru,
          option_c_en:    question.option_c_en,
          option_d_uz:    question.option_d_uz,
          option_d_ru:    question.option_d_ru,
          option_d_en:    question.option_d_en,
          correct_answer: question.correct_answer,
          explanation_uz: question.explanation_uz ?? '',
          explanation_ru: question.explanation_ru ?? '',
          explanation_en: question.explanation_en ?? '',
        }
      : EMPTY,
  );

  const [activeTab,    setActiveTab]    = useState<Lang>('uz');
  const [saving,       setSaving]       = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [fieldErrors,  setFieldErrors]  = useState<Record<string, boolean>>({});

  /* ── Helpers ─────────────────────────────────────────── */

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: false }));
  }

  function setOption(letter: OptionLetter, lang: Lang, value: string) {
    const key = `option_${letter}_${lang}` as keyof FormState;
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: false }));
  }

  function getOption(letter: OptionLetter, lang: Lang): string {
    return (form[`option_${letter}_${lang}` as keyof FormState] as string) ?? '';
  }

  /* ── Validation ──────────────────────────────────────── */

  function validate(): boolean {
    const errors: Record<string, boolean> = {};

    if (!form.category) errors.category = true;

    for (const lang of ['uz', 'ru', 'en'] as Lang[]) {
      if (!form[`question_${lang}`].trim()) errors[`question_${lang}`] = true;
      for (const letter of OPTION_LETTERS) {
        const k = `option_${letter}_${lang}` as keyof FormState;
        if (!((form[k] as string) ?? '').trim()) errors[k as string] = true;
      }
    }

    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      const missingLangs = LANGS.filter((l) =>
        errors[`question_${l.key}`] ||
        OPTION_LETTERS.some((lt) => errors[`option_${lt}_${l.key}`]),
      );
      if (missingLangs.length) setActiveTab(missingLangs[0].key);
      setErrorMsg("Barcha maydonlarni to'ldiring.");
      return false;
    }

    return true;
  }

  /* ── Submit ──────────────────────────────────────────── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (!validate()) return;

    setSaving(true);

    const payload = {
      category:       form.category,
      question_uz:    form.question_uz.trim(),
      question_ru:    form.question_ru.trim(),
      question_en:    form.question_en.trim(),
      option_a_uz:    form.option_a_uz.trim(),
      option_a_ru:    form.option_a_ru.trim(),
      option_a_en:    form.option_a_en.trim(),
      option_b_uz:    form.option_b_uz.trim(),
      option_b_ru:    form.option_b_ru.trim(),
      option_b_en:    form.option_b_en.trim(),
      option_c_uz:    form.option_c_uz.trim(),
      option_c_ru:    form.option_c_ru.trim(),
      option_c_en:    form.option_c_en.trim(),
      option_d_uz:    form.option_d_uz.trim(),
      option_d_ru:    form.option_d_ru.trim(),
      option_d_en:    form.option_d_en.trim(),
      correct_answer: form.correct_answer,
      explanation_uz: form.explanation_uz.trim() || null,
      explanation_ru: form.explanation_ru.trim() || null,
      explanation_en: form.explanation_en.trim() || null,
    };

    const supabase = createClient();

    const { error } = isEdit
      ? await supabase.from('questions').update(payload).eq('id', question!.id)
      : await supabase.from('questions').insert(payload);

    if (error) {
      setErrorMsg('Xatolik: ' + error.message);
      setSaving(false);
    } else {
      router.push('/admin/questions');
      router.refresh();
    }
  }

  /* ── Render ──────────────────────────────────────────── */

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── Page header ───────────────────────────────── */}
      <div className="border-b border-gray-100 bg-white px-6 py-5 flex items-center gap-3">
        <Link
          href="/admin/questions"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            {isEdit ? 'Savolni tahrirlash' : "Yangi savol qo'shish"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Barcha uchta tilda (UZ / RU / EN) to&apos;ldiring
          </p>
        </div>
      </div>

      <div className="p-6 max-w-3xl space-y-6">

        {/* ── Error banner ────────────────────────────── */}
        {errorMsg && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X className="h-4 w-4 shrink-0 text-red-500" />
            {errorMsg}
          </div>
        )}

        {/* ── Section 1: Basic info ────────────────────── */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-extrabold text-gray-700 uppercase tracking-wide">
            Asosiy ma&apos;lumot
          </h2>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Kategoriya
              </label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls(fieldErrors.category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Correct answer selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              To&apos;g&apos;ri javob
            </label>
            <div className="flex gap-2">
              {OPTION_DISPLAY.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => set('correct_answer', letter)}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-xl border-2 text-sm font-extrabold transition-all',
                    form.correct_answer === letter
                      ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200'
                      : 'border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600',
                  )}
                >
                  {letter}
                </button>
              ))}
              <span className="ml-2 flex items-center text-xs text-gray-500">
                Variant {form.correct_answer} to&apos;g&apos;ri
              </span>
            </div>
          </div>
        </div>

        {/* ── Section 2: Multilingual content (tabbed) ── */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">

          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {LANGS.map(({ key, label, flag }) => {
              const hasErr =
                !!fieldErrors[`question_${key}`] ||
                OPTION_LETTERS.some((lt) => !!fieldErrors[`option_${lt}_${key}`]);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'flex-1 px-4 py-3 text-sm font-semibold transition-colors border-b-2',
                    activeTab === key
                      ? 'border-violet-600 text-violet-700 bg-violet-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                    hasErr && 'text-red-600',
                  )}
                >
                  <span className="mr-1.5">{flag}</span>
                  {label}
                  {hasErr && <span className="ml-1 text-red-500">*</span>}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-5 space-y-4">

            {/* Question text */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Savol matni
              </label>
              <textarea
                value={form[`question_${activeTab}` as keyof FormState] as string}
                onChange={(e) => set(`question_${activeTab}` as keyof FormState, e.target.value)}
                rows={3}
                placeholder="Savol matnini kiriting…"
                className={inputCls(!!fieldErrors[`question_${activeTab}`])}
              />
            </div>

            {/* Options A–D */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Javob variantlari
                <span className="ml-1 text-gray-400 font-normal">
                  (to&apos;g&apos;risini yuqorida belgilang)
                </span>
              </label>
              <div className="space-y-2">
                {OPTION_LETTERS.map((letter, idx) => {
                  const display = OPTION_DISPLAY[idx];
                  const isCorrect = form.correct_answer === display;
                  const fieldKey = `option_${letter}_${activeTab}`;
                  return (
                    <div key={letter} className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold border-2 select-none',
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-200 text-gray-400',
                        )}
                      >
                        {display}
                      </div>
                      <input
                        type="text"
                        value={getOption(letter, activeTab)}
                        onChange={(e) => setOption(letter, activeTab, e.target.value)}
                        placeholder={`Variant ${display}`}
                        className={inputCls(!!fieldErrors[fieldKey])}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation (optional) */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Tushuntirish{' '}
                <span className="font-normal text-gray-400">(ixtiyoriy)</span>
              </label>
              <textarea
                value={form[`explanation_${activeTab}` as keyof FormState] as string}
                onChange={(e) =>
                  set(`explanation_${activeTab}` as keyof FormState, e.target.value)
                }
                rows={3}
                placeholder="Nima uchun bu javob to'g'ri ekanligi haqida yozing…"
                className={inputCls()}
              />
            </div>
          </div>
        </div>

        {/* ── Action buttons ────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl gradient-brand px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-300/40 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Saqlanmoqda…</>
            ) : (
              <><Save className="h-4 w-4" />{isEdit ? 'Saqlash' : "Qo'shish"}</>
            )}
          </button>

          <Link
            href="/admin/questions"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </Link>
        </div>

      </div>
    </form>
  );
}
