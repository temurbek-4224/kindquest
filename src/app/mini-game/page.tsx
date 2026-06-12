'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  RotateCcw,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface BehaviorItem {
  id:          number;
  text:        string;
  isPolite:    boolean;
  emoji:       string;
  explanation: string;
}

type Phase = 'playing' | 'answered' | 'finished';

/* ─────────────────────────────────────────────────────────────
   Hardcoded behavior data (no Supabase needed)
───────────────────────────────────────────────────────────── */
const BEHAVIORS: BehaviorItem[] = [
  {
    id: 1,
    text: 'Kattalarga salom berish',
    isPolite: true,
    emoji: '👋',
    explanation:
      "Kattalarni hurmat qilish yaxshi tarbiyaning belgisi. Salom berish bilan siz ularga e'tibor va hurmatizni ko'rsatasiz.",
  },
  {
    id: 2,
    text: "Do'stini masxara qilish",
    isPolite: false,
    emoji: '😢',
    explanation:
      "Boshqalarni masxara qilish yomon xulq. Bu do'stlikni buzadi va insonni xafa qiladi.",
  },
  {
    id: 3,
    text: 'Navbat kutish',
    isPolite: true,
    emoji: '🕐',
    explanation:
      "Navbat kutish — intizom va boshqalarga hurmatning muhim ko'rinishi. Sabr-toqatli bo'lish katta fazilat.",
  },
  {
    id: 4,
    text: "Yolg'on gapirish",
    isPolite: false,
    emoji: '🤥',
    explanation:
      "Yolg'on gapirish ishonchni yo'qotadi. Haqiqatni aytish har doim eng to'g'ri yo'l.",
  },
  {
    id: 5,
    text: 'Rahmat aytish',
    isPolite: true,
    emoji: '🙏',
    explanation:
      "Rahmat aytish — minnatdorligingizni bildiradi. Bu oddiy so'z, lekin boshqani xursand qiladi.",
  },
  {
    id: 6,
    text: "O'qituvchining gapini bo'lish",
    isPolite: false,
    emoji: '🙅',
    explanation:
      "O'qituvchining gapini bo'lish hurmatsizblik. Boshqa odam gapirayotganda sabr bilan kutish kerak.",
  },
  {
    id: 7,
    text: 'Kichiklarga yordam berish',
    isPolite: true,
    emoji: '🤝',
    explanation:
      "Kichiklarga yordam berish — katta yurakning belgisi. Kuchlilar zaiflarni qo'llab-quvvatlaydi.",
  },
  {
    id: 8,
    text: 'Jamoat joyida baland ovozda gaplashish',
    isPolite: false,
    emoji: '📢',
    explanation:
      "Jamoat joyida baland gaplashish atrofdagilarga xalal beradi. Past ovozda gaplashish odobli xulq.",
  },
  {
    id: 9,
    text: 'Ota-onaga yordam berish',
    isPolite: true,
    emoji: '💖',
    explanation:
      "Ota-onaga yordam berish — mehr va hurmatning eng go'zal ko'rinishi. Ular sizga juda ko'p mehnat qiladilar.",
  },
  {
    id: 10,
    text: "Boshqalarning buyumini ruxsatsiz olish",
    isPolite: false,
    emoji: '🚫',
    explanation:
      "Ruxsatsiz boshqaning buyumini olish noto'g'ri. Avvalo ruxsat so'rash zarur — bu hurmatning belgisi.",
  },
];

const TOTAL = BEHAVIORS.length;

/* ─────────────────────────────────────────────────────────────
   Level / badge helpers
───────────────────────────────────────────────────────────── */
function getLevelInfo(score: number) {
  if (score >= 8) {
    return {
      label:    'Hurmatli qahramon',
      emoji:    '🏆',
      color:    'from-amber-400 to-orange-500',
      shadow:   'shadow-amber-200',
      badges:   ['🏆', '⭐', '💖', '🌈'],
    };
  }
  if (score >= 4) {
    return {
      label:    "Mehribon do'st",
      emoji:    '💖',
      color:    'from-pink-400 to-rose-500',
      shadow:   'shadow-pink-200',
      badges:   ['💖', '🌈'],
    };
  }
  return {
    label:    "Odobni o'rganayotgan bola",
    emoji:    '🌱',
    color:    'from-emerald-400 to-teal-500',
    shadow:   'shadow-emerald-200',
    badges:   ['🌈'],
  };
}

/* ─────────────────────────────────────────────────────────────
   Result screen (shown when all items answered)
───────────────────────────────────────────────────────────── */
function ResultScreen({
  score,
  onRestart,
}: {
  score: number;
  onRestart: () => void;
}) {
  const lvl = getLevelInfo(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-12 pb-20 flex flex-col items-center gap-6">

        {/* Result card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 280, damping: 22 }}
          className="w-full overflow-hidden rounded-3xl bg-white border border-violet-100 shadow-2xl shadow-violet-100/50"
        >
          {/* Colored header */}
          <div className={cn('bg-gradient-to-br px-6 py-10 text-white text-center', lvl.color)}>
            <motion.div
              animate={{ rotate: [0, -8, 8, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 text-5xl shadow-2xl"
            >
              {lvl.emoji}
            </motion.div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">
              Mini o'yin yakunlandi! 🎉
            </p>
            <h2 className="text-2xl font-extrabold">{lvl.label}</h2>
          </div>

          <div className="p-6">
            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-5 rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 px-5 py-4 text-center"
            >
              <p className="text-sm text-gray-500 mb-1">Natija</p>
              <p className="text-4xl font-extrabold gradient-text">
                {score}
                <span className="text-2xl text-gray-300"> / {TOTAL}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {TOTAL} tadan{' '}
                <span className="font-bold text-violet-700">{score} tasini</span>{' '}
                to'g'ri topdingiz
              </p>
            </motion.div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {lvl.badges.map((b, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 350 }}
                  className="text-3xl"
                >
                  {b}
                </motion.span>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-violet-100">
                <motion.div
                  className={cn('h-full rounded-full bg-gradient-to-r', lvl.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / TOTAL) * 100}%` }}
                  transition={{ delay: 0.6, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1 px-0.5">
                <span>0</span>
                <span className="font-bold text-violet-600">{Math.round((score / TOTAL) * 100)}%</span>
                <span>{TOTAL}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRestart}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand py-4 text-base font-bold text-white shadow-lg shadow-violet-300/40 hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="h-5 w-5" />
                Qayta o'ynash
              </button>
              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-violet-200 bg-white py-4 text-base font-bold text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <Home className="h-5 w-5" />
                Bosh sahifaga
              </Link>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main mini-game page
───────────────────────────────────────────────────────────── */
export default function MiniGamePage() {
  const [currentIndex, setCurrentIndex]       = useState(0);
  const [score, setScore]                     = useState(0);
  const [phase, setPhase]                     = useState<Phase>('playing');
  const [chosenPolite, setChosenPolite]       = useState<boolean | null>(null);

  const item      = BEHAVIORS[currentIndex]!;
  const isCorrect = chosenPolite !== null && chosenPolite === item.isPolite;

  /* ── Select answer ── */
  function handleChoice(polite: boolean) {
    if (phase !== 'playing') return;
    setChosenPolite(polite);
    if (polite === item.isPolite) setScore((s) => s + 1);
    setPhase('answered');
  }

  /* ── Advance to next item or finish ── */
  function handleNext() {
    const next = currentIndex + 1;
    if (next >= TOTAL) {
      setPhase('finished');
    } else {
      setCurrentIndex(next);
      setChosenPolite(null);
      setPhase('playing');
    }
  }

  /* ── Restart ── */
  function handleRestart() {
    setCurrentIndex(0);
    setScore(0);
    setChosenPolite(null);
    setPhase('playing');
  }

  /* ── Finished state delegates to result screen ── */
  if (phase === 'finished') {
    return <ResultScreen score={score} onRestart={handleRestart} />;
  }

  const pct = (currentIndex / TOTAL) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      <Navbar />

      {/* ── Sticky game header ── */}
      <div className="sticky top-16 z-30 border-b border-violet-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3">

          {/* Title row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-brand shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-extrabold gradient-text">Odobli yoki odobsiz?</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Score chip */}
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                ⭐ {score} ball
              </span>
              {/* Progress chip */}
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                {currentIndex + 1} / {TOTAL}
              </span>
            </div>
          </div>

          {/* Progress track */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-violet-100">
            <motion.div
              className="h-full rounded-full gradient-brand"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>

          {/* Step dots */}
          <div className="mt-1.5 flex justify-between px-0.5">
            {BEHAVIORS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                  i < currentIndex
                    ? 'bg-violet-500'
                    : i === currentIndex
                    ? 'bg-pink-400 scale-125'
                    : 'bg-violet-100',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Game area ── */}
      <main className="mx-auto max-w-lg px-4 py-8 pb-20">

        {/* Sub-title */}
        <p className="text-center text-sm font-semibold text-gray-400 mb-6">
          Harakatni to'g'ri guruhga ajrating
        </p>

        {/* ── Behavior card (animates on key change) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-6"
          >
            {/* Card */}
            <div className="rounded-3xl bg-white border border-violet-100 shadow-xl shadow-violet-100/40 overflow-hidden">

              {/* Feedback banner (only when answered) */}
              <AnimatePresence>
                {phase === 'answered' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 text-sm font-semibold',
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800',
                    )}
                  >
                    {isCorrect
                      ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      : <XCircle      className="h-4 w-4 shrink-0 text-red-600"     />}
                    {isCorrect
                      ? 'Ajoyib! Bu odobli qaror. ✅'
                      : "Bu javob to'g'ri emas. Harakatni qayta o'ylab ko'ring."}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Emoji + text */}
              <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
                <motion.div
                  animate={
                    phase === 'playing'
                      ? { y: [0, -6, 0] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 text-5xl shadow-sm select-none"
                >
                  {item.emoji}
                </motion.div>
                <p className="text-xl font-extrabold text-gray-800 leading-snug max-w-xs">
                  {item.text}
                </p>
              </div>

              {/* Explanation (shown after answering) */}
              <AnimatePresence>
                {phase === 'answered' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-5 mb-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <Lightbulb className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">
                          Tushuntirish
                        </p>
                        <p className="text-sm text-amber-900 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Choice buttons (shown while playing) ── */}
        {phase === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Odobli button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChoice(true)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 px-4 py-5 text-white shadow-lg shadow-emerald-200/60 hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl">✅</span>
              <span className="text-base font-extrabold leading-snug text-center">
                Odobli harakat
              </span>
            </motion.button>

            {/* Odobsiz button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChoice(false)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 px-4 py-5 text-white shadow-lg shadow-red-200/60 hover:opacity-90 transition-opacity"
            >
              <span className="text-3xl">❌</span>
              <span className="text-base font-extrabold leading-snug text-center">
                Odobsiz harakat
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* ── Revealed answer state ── */}
        {phase === 'answered' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Show correct answer label */}
            <div
              className={cn(
                'flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-semibold',
                'bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100',
              )}
            >
              <span className="text-gray-600">To'g'ri javob:</span>
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold',
                item.isPolite
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700',
              )}>
                {item.isPolite ? '✅ Odobli harakat' : '❌ Odobsiz harakat'}
              </span>
            </div>

            {/* Next button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-4 text-base font-bold text-white shadow-lg shadow-violet-300/40 hover:opacity-90 transition-opacity"
            >
              {currentIndex + 1 >= TOTAL ? (
                <>🏁 Natijani ko'rish</>
              ) : (
                <>
                  Keyingi
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
