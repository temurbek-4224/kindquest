'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerButtonProps {
  index: number;
  label: string;
  selected: boolean;    // this button was selected by user
  revealed: boolean;    // answer phase — show correct/wrong
  correct: boolean;     // this is the correct answer
  disabled: boolean;
  onClick: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function AnswerButton({
  index,
  label,
  selected,
  revealed,
  correct,
  disabled,
  onClick,
}: AnswerButtonProps) {
  /* ── Colour logic ── */
  const isWrong = selected && !correct;
  const isRight = revealed && correct;

  const containerClass = cn(
    'group relative flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left',
    'transition-all duration-200 select-none',
    // Base (idle)
    !revealed && 'border-violet-100 bg-white hover:border-violet-400 hover:bg-violet-50 cursor-pointer',
    // Correct answer revealed
    isRight && 'border-emerald-400 bg-emerald-50 cursor-default',
    // Wrong selected answer revealed
    isWrong && 'border-red-400 bg-red-50 cursor-default',
    // Other answers (not selected, answer revealed)
    revealed && !selected && !correct && 'border-gray-100 bg-gray-50 opacity-50 cursor-default',
    // Disabled but not revealed
    disabled && !revealed && 'cursor-default',
  );

  const letterClass = cn(
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors duration-200',
    !revealed && 'bg-violet-100 text-violet-700 group-hover:bg-violet-500 group-hover:text-white',
    isRight && 'bg-emerald-500 text-white',
    isWrong && 'bg-red-500 text-white',
    revealed && !selected && !correct && 'bg-gray-100 text-gray-400',
  );

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={!disabled ? { scale: 1.015 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className={containerClass}
      aria-label={`Option ${OPTION_LETTERS[index]}: ${label}`}
    >
      {/* Letter badge */}
      <span className={letterClass}>{OPTION_LETTERS[index]}</span>

      {/* Label */}
      <span
        className={cn(
          'flex-1 text-sm font-medium leading-snug',
          isRight && 'text-emerald-800',
          isWrong && 'text-red-800',
          !revealed && 'text-gray-800',
          revealed && !selected && !correct && 'text-gray-400',
        )}
      >
        {label}
      </span>

      {/* Status icon */}
      {revealed && correct && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
        </motion.span>
      )}
      {isWrong && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
        >
          <XCircle className="h-5 w-5 shrink-0 text-red-500" />
        </motion.span>
      )}
    </motion.button>
  );
}
