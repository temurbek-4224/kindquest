'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language) ?? languages[0];

  /* Close on outside click */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium',
          'text-gray-600 hover:text-violet-700 hover:bg-violet-50',
          'transition-colors duration-200 select-none',
          open && 'bg-violet-50 text-violet-700',
        )}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">{current.flag}</span>
        {!compact && (
          <span className="hidden sm:inline text-sm">{current.nativeLabel}</span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'min-w-[175px] rounded-2xl bg-white',
              'shadow-xl shadow-violet-100/60 border border-violet-100',
              'overflow-hidden p-1.5',
            )}
          >
            {languages.map((lang) => {
              const active = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl px-3 py-2.5',
                    'text-sm transition-colors duration-150 cursor-pointer',
                    active
                      ? 'bg-violet-50 text-violet-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  <span className="text-xl leading-none">{lang.flag}</span>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-medium">{lang.nativeLabel}</span>
                    <span className="text-xs text-gray-400 font-normal">{lang.label}</span>
                  </div>
                  {active && (
                    <Check className="h-3.5 w-3.5 ml-auto text-violet-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
