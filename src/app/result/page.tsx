'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, Home, Star, Trophy, Target,
  CheckCircle2, XCircle, Loader2, Save,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────── */

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'no-table';

/* ── Daraja va mukofot (Level & Reward) system ─────────────── */
interface LevelInfo {
  level:          { uz: string; ru: string; en: string };
  emoji:          string;
  headerColor:    string;
  badges:         { icon: string; label: { uz: string; ru: string; en: string } }[];
  recommendation: { uz: string; ru: string; en: string };
}

const LEVELS: LevelInfo[] = [
  {
    level:       { uz: 'Hurmatli qahramon',         ru: 'Уважаемый герой',        en: 'Respected Hero'       },
    emoji:       '🏆',
    headerColor: 'from-amber-400 to-orange-500',
    badges: [
      { icon: '🏆', label: { uz: "Odobli bola kubogi",    ru: 'Кубок воспитанного',          en: 'Etiquette Trophy'   } },
      { icon: '⭐', label: { uz: "Hurmat yulduzi",        ru: 'Звезда уважения',              en: 'Star of Respect'    } },
      { icon: '💖', label: { uz: "Mehribonlik belgisi",   ru: 'Знак доброты',                 en: 'Kindness Badge'     } },
      { icon: '🌈', label: { uz: "Yaxshi xulq darajasi", ru: 'Уровень хорошего поведения',   en: 'Good Conduct Level' } },
    ],
    recommendation: {
      uz: "Siz hurmat, mehribonlik va odob qoidalarini yaxshi tushundingiz. Endi bu odatlarni kundalik hayotda ham qo'llashga harakat qiling.",
      ru: 'Вы отлично усвоили правила уважения, доброты и этикета. Старайтесь применять эти привычки в повседневной жизни.',
      en: 'You understood the rules of respect, kindness and etiquette well. Try to apply these habits in your daily life.',
    },
  },
  {
    level:       { uz: "Mehribon do'st",             ru: 'Добрый друг',            en: 'Kind Friend'          },
    emoji:       '💖',
    headerColor: 'from-pink-400 to-rose-500',
    badges: [
      { icon: '💖', label: { uz: "Mehribonlik belgisi",   ru: 'Знак доброты',                 en: 'Kindness Badge'     } },
      { icon: '🌈', label: { uz: "Yaxshi xulq darajasi", ru: 'Уровень хорошего поведения',   en: 'Good Conduct Level' } },
    ],
    recommendation: {
      uz: "Siz yaxshi natija ko'rsatdingiz. Ayrim vaziyatlarda yanada e'tiborli bo'lsangiz, haqiqiy hurmatli qahramonga aylanasiz.",
      ru: 'Вы показали хороший результат. Будьте внимательнее в некоторых ситуациях — и станете настоящим героем.',
      en: 'You showed a good result. Being more careful in some situations will turn you into a true respected hero.',
    },
  },
  {
    level:       { uz: "Odobni o'rganayotgan bola",  ru: 'Изучающий этикет',       en: 'Learning Etiquette'   },
    emoji:       '🌱',
    headerColor: 'from-emerald-400 to-teal-500',
    badges: [
      { icon: '🌈', label: { uz: "Yaxshi xulq darajasi", ru: 'Уровень хорошего поведения',   en: 'Good Conduct Level' } },
    ],
    recommendation: {
      uz: "Siz odob qoidalarini o'rganish yo'lidasiz. Tushuntirishlarni diqqat bilan o'qib, qayta urinib ko'ring.",
      ru: 'Вы на пути к изучению правил этикета. Внимательно читайте объяснения и попробуйте ещё раз.',
      en: 'You are on the path to learning etiquette rules. Read the explanations carefully and try again.',
    },
  },
];

function getLevelInfo(pct: number): LevelInfo {
  if (pct >= 80) return LEVELS[0]!;
  if (pct >= 40) return LEVELS[1]!;
  return LEVELS[2]!;
}

const REWARD_UI = {
  title: { uz: 'Daraja va mukofot',  ru: 'Уровень и награда',   en: 'Level & Reward'      },
  rec:   { uz: '💡 Tavsiya',         ru: '💡 Рекомендация',      en: '💡 Recommendation'   },
};

/* ── Localised strings ──────────────────────────────────── */
const UI = {
  score:       { uz: 'Sizning ballingiz',   ru: 'Ваш счёт',             en: 'Your Score'      },
  correct:     { uz: 'To\'g\'ri javoblar',  ru: 'Правильных ответов',   en: 'Correct Answers' },
  of:          { uz: 'dan',                 ru: 'из',                   en: 'of'              },
  pct:         { uz: 'Foiz',               ru: 'Процент',              en: 'Percentage'      },
  again:       { uz: 'Qayta o\'ynash',      ru: 'Играть ещё раз',       en: 'Play Again'      },
  home:        { uz: 'Bosh sahifaga',       ru: 'На главную',           en: 'Go Home'         },
  review:      { uz: 'Javoblar sharhi',     ru: 'Обзор ответов',        en: 'Answer Review'   },
  saving:      { uz: 'Saqlanmoqda…',                     ru: 'Сохранение…',                       en: 'Saving…'                        },
  saved:       { uz: 'Natija saqlandi ✓',              ru: 'Результат сохранён ✓',               en: 'Result saved ✓'                 },
  saveErr:     { uz: 'Saqlashda xatolik',              ru: 'Ошибка сохранения',                  en: 'Save failed'                    },
  noTable:     { uz: 'Jadval topilmadi (SQL kerak)',   ru: 'Таблица не найдена (нужен SQL)',      en: 'Table missing — run SQL setup'  },
  viewProfile: { uz: 'Profilni ko\'rish',              ru: 'Смотреть профиль',                   en: 'View Profile'                   },
};

const RATINGS = [
  {
    min: 90, emoji: '🏆',
    color: 'from-yellow-400 to-amber-500', shadow: 'shadow-amber-200',
    uz: 'Ajoyib! Siz zo\'rsiz!', ru: 'Отлично! Вы молодец!', en: 'Excellent! You are amazing!',
  },
  {
    min: 70, emoji: '🌟',
    color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200',
    uz: 'Yaxshi! Davom eting!', ru: 'Хорошо! Продолжайте!', en: 'Great job! Keep it up!',
  },
  {
    min: 50, emoji: '👍',
    color: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-200',
    uz: 'Yomon emas! Ko\'proq mashq qiling!', ru: 'Неплохо! Практикуйтесь больше!', en: 'Not bad! Keep practising!',
  },
  {
    min: 0, emoji: '💪',
    color: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-200',
    uz: 'Yana urining! Siz bajarasiz!', ru: 'Попробуйте ещё раз! Вы справитесь!', en: 'Try again! You can do it!',
  },
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

/* ─────────────────────────────────────────────────────────── */

export default function ResultPage() {
  const router                                     = useRouter();
  const { language }                               = useLanguage();
  const { state, resetGame, correctCount, percentage } = useGame();
  const { user }                                   = useAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const supabase                                   = useMemo(() => createClient(), []);

  const savedOnce                     = useRef(false);
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');

  const l      = language;
  const total  = state.questions.length;
  const rating = RATINGS.find((r) => percentage >= r.min) ?? RATINGS[RATINGS.length - 1];

  /* Redirect if landed here without a finished game */
  useEffect(() => {
    if (state.status !== 'finished' && state.answers.length === 0) {
      router.replace('/');
    }
  }, [state.status, state.answers.length, router]);

  /* ── Persist result to Supabase (once, only if user is logged in) ── */
  useEffect(() => {
    if (state.status !== 'finished' || savedOnce.current || !user) return;

    savedOnce.current = true;
    setSaveStatus('saving');

    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    supabase
      .from('game_results')
      .insert({
        user_id:         user.id,
        score:           state.score,
        correct_answers: correctCount,
        total_questions: total,
        percentage:      pct,
        language:        language,
      })
      .then(({ error }) => {
        if (error) {
          // Log the full error object for debugging
          console.error('[ResultPage] save error:', {
            message: error.message,
            code:    (error as { code?: string }).code,
            details: (error as { details?: string }).details,
            hint:    (error as { hint?: string }).hint,
          });

          // Detect "table does not exist" / schema cache miss
          const msg = error.message?.toLowerCase() ?? '';
          if (
            msg.includes('schema cache') ||
            msg.includes('does not exist') ||
            msg.includes('not found') ||
            (error as { code?: string }).code === '42P01'   // PostgreSQL "undefined_table"
          ) {
            setSaveStatus('no-table');
          } else {
            setSaveStatus('error');
          }
        } else {
          setSaveStatus('saved');
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, user]);

  if (state.status !== 'finished' && state.answers.length === 0) return null;

  function handlePlayAgain() {
    /* Reset to 'idle' so game/page.tsx will re-fetch fresh questions */
    resetGame();
    router.push('/game');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10 pb-20">

        {/* ── Hero result card ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 280, damping: 22 }}
          className="mb-8 overflow-hidden rounded-3xl bg-white border border-violet-100 shadow-xl shadow-violet-100/40"
        >
          {/* Coloured header */}
          <div className={cn('bg-gradient-to-br px-6 py-10 text-center text-white', rating.color)}>

            <motion.div
              className={cn('mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 text-5xl shadow-2xl', rating.shadow)}
              animate={{ rotate: [0, -8, 8, -5, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              {rating.emoji}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-2xl md:text-3xl font-extrabold"
            >
              {rating[l]}
            </motion.h1>

            {/* ── Live save-status badge (only when logged in) ── */}
            <AnimatePresence mode="wait">
              {user && saveStatus !== 'idle' && (
                <motion.div
                  key={saveStatus}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold"
                >
                  {saveStatus === 'saving'   && <><Loader2 className="h-3 w-3 animate-spin" />{UI.saving[l]}</>}
                  {saveStatus === 'saved'    && <><Save    className="h-3 w-3"               />{UI.saved[l]}</>}
                  {saveStatus === 'error'    && <><XCircle className="h-3 w-3"               />{UI.saveErr[l]}</>}
                  {saveStatus === 'no-table' && <><XCircle className="h-3 w-3"               />{UI.noTable[l]}</>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Score pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/25 px-6 py-3"
            >
              <Star className="h-5 w-5 fill-white text-white" />
              <span className="text-3xl font-black">{state.score}</span>
              <span className="text-white/80 text-sm font-medium">{UI.score[l]}</span>
            </motion.div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
            {[
              { Icon: CheckCircle2, value: correctCount,                          label: UI.correct[l], color: 'text-emerald-600' },
              { Icon: Target,       value: `${correctCount} ${UI.of[l]} ${total}`, label: UI.correct[l], color: 'text-blue-600'    },
              { Icon: Trophy,       value: `${percentage}%`,                       label: UI.pct[l],     color: 'text-amber-600'  },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
                className="flex flex-col items-center gap-1 py-5 px-3 text-center"
              >
                <s.Icon className={cn('h-5 w-5 mb-1', s.color)} />
                <span className={cn('text-xl font-extrabold', s.color)}>{s.value}</span>
                <span className="text-xs text-gray-400 font-medium leading-tight">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Percentage bar ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8 rounded-2xl bg-white border border-violet-100 p-5 shadow-sm"
        >
          <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
            <span>{UI.pct[l]}</span>
            <span className="text-violet-700 font-bold">{percentage}%</span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-violet-100">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', rating.color)}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </motion.div>

        {/* ── Daraja va mukofot ───────────────────────────── */}
        {(() => {
          const lvl = getLevelInfo(percentage);
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.76 }}
              className="mb-8 overflow-hidden rounded-3xl bg-white border border-violet-100 shadow-lg shadow-violet-50/60"
            >
              {/* Header */}
              <div className={cn('bg-gradient-to-br px-6 py-5 text-white text-center', lvl.headerColor)}>
                <div className="text-4xl mb-2">{lvl.emoji}</div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                  {REWARD_UI.title[l]}
                </p>
                <h3 className="text-xl font-extrabold">{lvl.level[l]}</h3>
              </div>

              <div className="p-5">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {lvl.badges.map((b, bi) => (
                    <motion.div
                      key={bi}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.86 + bi * 0.1, type: 'spring', stiffness: 350 }}
                      className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 px-3 py-2"
                    >
                      <span className="text-lg">{b.icon}</span>
                      <span className="text-xs font-bold text-gray-700">{b.label[l]}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Moral recommendation */}
                <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 p-4">
                  <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mb-1.5">
                    {REWARD_UI.rec[l]}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{lvl.recommendation[l]}</p>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* ── Action buttons ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mb-10 flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={handlePlayAgain}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand py-4 text-base font-bold text-white shadow-lg shadow-violet-300/40 hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="h-5 w-5" />
            {UI.again[l]}
          </button>

          {/* After successful save → show "View Profile" instead of "Go Home" */}
          {user && saveStatus === 'saved' ? (
            <Link
              href="/profile"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50 py-4 text-base font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              {UI.viewProfile[l]}
            </Link>
          ) : (
            <Link
              href="/"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-violet-200 bg-white py-4 text-base font-bold text-violet-700 hover:bg-violet-50 transition-colors"
            >
              <Home className="h-5 w-5" />
              {UI.home[l]}
            </Link>
          )}
        </motion.div>

        {/* ── Answer review ───────────────────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="show" transition={{ delayChildren: 1 }}>
          <h2 className="text-lg font-extrabold text-gray-800 mb-4">{UI.review[l]}</h2>

          <div className="space-y-4">
            {state.questions.map((q, qi) => {
              const record  = state.answers.find((a) => a.questionId === q.id);
              const userIdx = record?.selectedIndex ?? null;
              const correct = q.correctAnswerIndex;
              const isRight = record?.isCorrect ?? false;

              return (
                <motion.div
                  key={q.id}
                  variants={fadeUp}
                  className={cn(
                    'rounded-2xl border p-5',
                    isRight ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50',
                  )}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                      isRight ? 'bg-emerald-500' : 'bg-red-500',
                    )}>
                      {qi + 1}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{q.question[l]}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    {userIdx !== null && (
                      <div className={cn(
                        'flex items-center gap-2 rounded-xl px-3 py-2',
                        isRight ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800',
                      )}>
                        {isRight
                          ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          : <XCircle      className="h-4 w-4 shrink-0 text-red-600"     />}
                        <span className="font-semibold">{OPTION_LETTERS[userIdx]}.</span>
                        <span>{q.options[l][userIdx]}</span>
                      </div>
                    )}

                    {!isRight && (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2 text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span className="font-semibold">{OPTION_LETTERS[correct]}.</span>
                        <span>{q.options[l][correct]}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
