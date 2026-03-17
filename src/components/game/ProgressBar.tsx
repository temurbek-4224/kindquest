'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;   // 1-based current question number
  total: number;
  score: number;
  label?: string;    // e.g. "Savol" / "Вопрос" / "Question"
  scoreLabel?: string;
}

export default function ProgressBar({
  current,
  total,
  score,
  label = 'Question',
  scoreLabel = 'Score',
}: ProgressBarProps) {
  const pct = total > 0 ? ((current - 1) / total) * 100 : 0;

  return (
    <div className="w-full space-y-3">
      {/* Labels row */}
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="text-gray-500">
          {label}{' '}
          <span className="text-violet-700">{current}</span>
          <span className="text-gray-400"> / {total}</span>
        </span>
        <span className="flex items-center gap-1.5 text-amber-600">
          <span className="text-lg">⭐</span>
          {scoreLabel}: <span className="font-bold">{score}</span>
        </span>
      </div>

      {/* Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-violet-100">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full gradient-brand"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between px-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 w-1.5 rounded-full transition-colors duration-300',
              i < current - 1
                ? 'bg-violet-500'
                : i === current - 1
                ? 'bg-pink-400 scale-125'
                : 'bg-violet-100',
            )}
          />
        ))}
      </div>
    </div>
  );
}
