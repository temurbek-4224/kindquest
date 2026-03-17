'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  DEFAULT_LANGUAGE,
  getDictionary,
  LANG_COOKIE_KEY,
  LANGUAGES,
} from '@/lib/i18n';
import type { Dictionary, Language } from '@/lib/i18n';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  languages: typeof LANGUAGES;
}

/* ─────────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────────── */
const LanguageContext = createContext<LanguageContextType | null>(null);

/* ─────────────────────────────────────────────────────────────
   Cookie helpers
───────────────────────────────────────────────────────────── */
function readCookie(): Language | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${LANG_COOKIE_KEY}=`));
  const val = match?.split('=')[1];
  if (val === 'uz' || val === 'ru' || val === 'en') return val;
  return null;
}

function writeCookie(lang: Language) {
  document.cookie = `${LANG_COOKIE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

/* ─────────────────────────────────────────────────────────────
   Provider
───────────────────────────────────────────────────────────── */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>(DEFAULT_LANGUAGE);

  /* Hydrate from cookie on mount */
  useEffect(() => {
    const stored = readCookie();
    if (stored) setLang(stored);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    writeCookie(lang);
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: getDictionary(language),
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────────── */
export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
