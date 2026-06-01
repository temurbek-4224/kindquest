'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, BookOpen } from 'lucide-react';
import Link from 'next/link';

import { useGame }     from '@/context/GameContext';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import type { DBQuestion } from '@/types/admin';
import type { GameQuestion } from '@/types/game';
import ProgressBar from '@/components/game/ProgressBar';
import GameCard    from '@/components/game/GameCard';

/* ── How many questions to pick per game session ── */
const QUESTIONS_PER_GAME = 10;

/* ── Map correct_answer letter → 0-based index ── */
const LETTER_TO_IDX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

/**
 * Convert a flat Supabase DB row into the nested GameQuestion shape
 * that the game UI (GameCard, GameContext, result review) expects.
 */
function mapDBtoGameQuestion(row: DBQuestion): GameQuestion {
  return {
    id:       row.id,
    category: row.category,
    question: {
      uz: row.question_uz,
      ru: row.question_ru,
      en: row.question_en,
    },
    options: {
      uz: [row.option_a_uz, row.option_b_uz, row.option_c_uz, row.option_d_uz],
      ru: [row.option_a_ru, row.option_b_ru, row.option_c_ru, row.option_d_ru],
      en: [row.option_a_en, row.option_b_en, row.option_c_en, row.option_d_en],
    },
    correctAnswerIndex: LETTER_TO_IDX[row.correct_answer] ?? 0,
    explanation: {
      uz: row.explanation_uz ?? '',
      ru: row.explanation_ru ?? '',
      en: row.explanation_en ?? '',
    },
  };
}

/* ── Per-language UI strings ── */
const UI = {
  question: { uz: 'Savol',                       ru: 'Вопрос',                 en: 'Question'           },
  score:    { uz: 'Ball',                         ru: 'Очки',                   en: 'Score'              },
  next:     { uz: 'Keyingi savol',                ru: 'Следующий вопрос',       en: 'Next Question'      },
  finish:   { uz: "Natijalarni ko'rish",           ru: 'Смотреть результаты',    en: 'See Results'        },
  correct:  { uz: "To'g'ri!",                     ru: 'Правильно!',             en: 'Correct!'           },
  wrong:    { uz: "Noto'g'ri",                    ru: 'Неверно',                en: 'Incorrect'          },
  explain:  { uz: 'Tushuntirish',                 ru: 'Объяснение',             en: 'Explanation'        },
  quit:     { uz: 'Chiqish',                      ru: 'Выйти',                  en: 'Quit'               },
  loading:  { uz: 'Savollar yuklanmoqda…',         ru: 'Загрузка вопросов…',     en: 'Loading questions…' },
  noQ:      { uz: 'Savollar topilmadi',            ru: 'Вопросы не найдены',     en: 'No questions found' },
  noQHint:  {
    uz: "Admin panelidan savollar qo'shing yoki namuna savollarni yuklang.",
    ru: 'Добавьте вопросы в панели администратора или загрузите примеры.',
    en: 'Add questions from the admin panel or seed the sample questions.',
  },
  goHome:   { uz: 'Bosh sahifaga',                ru: 'На главную',             en: 'Go Home'            },
};

/* ───────────────────────────────────────────────────────────── */

export default function GamePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    state,
    startGame,
    selectAnswer,
    nextQuestion,
    currentQuestion,
    isLastQuestion,
  } = useGame();

  /*
   * Use the module-level singleton — same instance as AuthContext and every
   * other component.  No useMemo needed; createClient() always returns _client.
   * This prevents the AbortError caused by multiple instances stealing the
   * Web Locks API lock from each other.
   */
  const supabase = createClient();

  const [fetchError, setFetchError] = useState('');
  const [fetchErrorDetail, setFetchErrorDetail] = useState('');
  const l = language;

  /*
   * Guard against duplicate concurrent fetches.
   * useRef persists across renders without triggering re-renders.
   * We check this before starting a new fetch so React Strict Mode
   * double-invocation in dev doesn't fire two simultaneous requests.
   */
  const fetchStarted = useRef(false);

  /* ── Fetch questions from Supabase → start game ─────────── */
  useEffect(() => {
    /* Only kick off when the game hasn't started yet */
    if (state.status !== 'idle') return;
    /* Prevent duplicate concurrent fetches (Strict Mode, fast re-mounts) */
    if (fetchStarted.current) return;
    fetchStarted.current = true;

    let cancelled = false;
    setFetchError('');
    setFetchErrorDetail('');

    supabase
      .from('questions')
      .select('*')
      .then(({ data, error }) => {
        if (cancelled) return;

        if (error) {
          console.error(
            '[GamePage] Supabase fetch error:',
            error.message,
            '| code:', error.code,
            '| details:', error.details,
          );
          setFetchError('error');
          setFetchErrorDetail(error.message);
          fetchStarted.current = false; // allow retry on next mount
          return;
        }

        if (!data || data.length === 0) {
          console.warn(
            '[GamePage] questions table returned 0 rows — ' +
            'table may be empty or RLS is blocking reads for the anon role.',
          );
          setFetchError('empty');
          fetchStarted.current = false;
          return;
        }

        /* Shuffle all rows, pick up to QUESTIONS_PER_GAME */
        const picked = [...data]
          .sort(() => Math.random() - 0.5)
          .slice(0, QUESTIONS_PER_GAME)
          .map((row) => mapDBtoGameQuestion(row as DBQuestion));

        startGame(picked);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Navigate to /result when the game finishes ── */
  useEffect(() => {
    if (state.status === 'finished') {
      router.push('/result');
    }
  }, [state.status, router]);

  /* ── Loading / error / transitioning states ── */
  if (!currentQuestion || state.status === 'idle' || state.status === 'finished') {

    /* Error state: DB returned nothing or query failed */
    if (fetchError) {
      const isDbError = fetchError === 'error';
      const errorMsg: Record<string, { uz: string; ru: string; en: string }> = {
        title: {
          uz: isDbError ? 'Xatolik yuz berdi' : UI.noQ.uz,
          ru: isDbError ? 'Произошла ошибка' : UI.noQ.ru,
          en: isDbError ? 'Something went wrong' : UI.noQ.en,
        },
        hint: {
          uz: isDbError
            ? "Supabase bilan bog'lanishda muammo. Keyinroq qayta urinib ko'ring."
            : UI.noQHint.uz,
          ru: isDbError
            ? 'Проблема с подключением к Supabase. Попробуйте позже.'
            : UI.noQHint.ru,
          en: isDbError
            ? 'Could not connect to the database. Please try again later.'
            : UI.noQHint.en,
        },
      };
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center bg-gradient-to-br from-violet-50 via-white to-pink-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100">
            <BookOpen className="h-10 w-10 text-violet-400" />
          </div>
          <div className="max-w-sm">
            <h2 className="text-xl font-extrabold text-gray-800 mb-2">{errorMsg.title[l]}</h2>
            <p className="text-sm text-gray-500 mb-2">{errorMsg.hint[l]}</p>
            {isDbError && fetchErrorDetail && (
              <p className="text-xs text-red-400 font-mono break-all mb-4">{fetchErrorDetail}</p>
            )}
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl gradient-brand px-8 py-3 text-sm font-bold text-white shadow-lg shadow-violet-300/40 hover:opacity-90 transition-opacity"
          >
            {UI.goHome[l]}
          </Link>
        </div>
      );
    }

    /* Loading spinner */
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-4 border-violet-200 border-t-violet-600"
        />
        <p className="text-sm font-medium text-gray-400">{UI.loading[l]}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold gradient-text text-lg hidden sm:inline">KindQuest</span>
          </Link>

          {/* Progress */}
          <div className="flex-1">
            <ProgressBar
              current={state.currentIndex + 1}
              total={state.questions.length}
              score={state.score}
              label={UI.question[l]}
              scoreLabel={UI.score[l]}
            />
          </div>

          {/* Quit */}
          <Link
            href="/"
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
            title={UI.quit[l]}
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">{UI.quit[l]}</span>
          </Link>
        </div>
      </header>

      {/* ── Game area ── */}
      <main className="mx-auto max-w-2xl px-4 py-8 pb-20">

        {/* Question counter chip */}
        <motion.div
          key={state.currentIndex}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
            {state.currentIndex + 1} / {state.questions.length}
          </span>
        </motion.div>

        {/* Animated question card */}
        <AnimatePresence mode="wait">
          <GameCard
            key={currentQuestion.id}
            question={currentQuestion}
            language={l}
            selectedIndex={state.selectedIndex}
            answered={state.status === 'answered'}
            isLastQuestion={isLastQuestion}
            onSelect={selectAnswer}
            onNext={nextQuestion}
            nextLabel={UI.next[l]}
            finishLabel={UI.finish[l]}
            explanationLabel={UI.explain[l]}
            correctLabel={UI.correct[l]}
            incorrectLabel={UI.wrong[l]}
          />
        </AnimatePresence>
      </main>
    </div>
  );
}
