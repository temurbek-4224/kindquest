'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowRight, Flag } from 'lucide-react';
import { CATEGORY_META } from '@/data/questions';
import { type GameQuestion } from '@/types/game';
import { type Language } from '@/lib/i18n';
import AnswerButton from './AnswerButton';
import { cn } from '@/lib/utils';

interface GameCardProps {
  question: GameQuestion;
  language: Language;
  selectedIndex: number | null;
  answered: boolean;
  isLastQuestion: boolean;
  onSelect: (index: number) => void;
  onNext: () => void;
  nextLabel: string;
  finishLabel: string;
  explanationLabel: string;
  correctLabel: string;
  incorrectLabel: string;
  /** "Hayotiy vaziyat" / "Жизненная ситуация" / "Life Situation" */
  scenarioLabel?: string;
  /** "To'g'ri qarorni tanlang" / "Выберите верный ответ" / "Choose the right answer" */
  chooseLabel?: string;
}

/* Fallback metadata for any unknown category key from the DB */
const FALLBACK_META = CATEGORY_META['general'] ?? CATEGORY_META['respect'];

export default function GameCard({
  question,
  language,
  selectedIndex,
  answered,
  isLastQuestion,
  onSelect,
  onNext,
  nextLabel,
  finishLabel,
  explanationLabel,
  correctLabel,
  incorrectLabel,
  scenarioLabel,
  chooseLabel,
}: GameCardProps) {
  /* Safe lookup — works for any category string returned from Supabase */
  const meta = CATEGORY_META[question.category] ?? FALLBACK_META;

  const options   = question.options[language];
  const isCorrect = selectedIndex !== null && selectedIndex === question.correctAnswerIndex;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      {/* ── Category badge ── */}
      <div className="mb-5 flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
            meta.bg,
            meta.color,
            meta.border,
          )}
        >
          {/* Icon sourced from CATEGORY_META — no icon column in DB */}
          <span className="text-base leading-none">{meta.icon}</span>
          {meta.label[language]}
        </span>
      </div>

      {/* ── Question text ── */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 p-6 md:p-8">
        {/* Scenario framing labels */}
        {(scenarioLabel || chooseLabel) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {scenarioLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-violet-200 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                🎭 {scenarioLabel}
              </span>
            )}
            {chooseLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-pink-200 px-2.5 py-0.5 text-xs font-semibold text-pink-700">
                ✏️ {chooseLabel}
              </span>
            )}
          </div>
        )}
        <p className="text-lg md:text-xl font-bold leading-relaxed text-gray-800">
          {question.question[language]}
        </p>
      </div>

      {/* ── Answer options ── */}
      <div className="space-y-3 mb-6">
        {options.map((opt, i) => (
          <AnswerButton
            key={i}
            index={i}
            label={opt}
            selected={selectedIndex === i}
            revealed={answered}
            correct={i === question.correctAnswerIndex}
            disabled={answered}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>

      {/* ── Explanation (shown after answering) ── */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            {/* Result badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
              className={cn(
                'mb-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-bold text-sm',
                isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
              )}
            >
              <span className="text-xl">{isCorrect ? '🎉' : '😔'}</span>
              <span className="leading-snug">{isCorrect ? correctLabel : incorrectLabel}</span>
            </motion.div>

            {/* Explanation box — only when text is present (nullable in DB) */}
            {question.explanation[language] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
              >
                <Lightbulb className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">
                    {explanationLabel}
                  </p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {question.explanation[language]}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Next / Finish button */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand py-4 text-base font-bold text-white shadow-lg shadow-violet-300/50 hover:opacity-90 transition-opacity"
            >
              {isLastQuestion ? (
                <>
                  <Flag className="h-5 w-5" />
                  {finishLabel}
                </>
              ) : (
                <>
                  {nextLabel}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
