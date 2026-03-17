import { uz } from './dictionaries/uz';
import { ru } from './dictionaries/ru';
import { en } from './dictionaries/en';

export type Language = 'uz' | 'ru' | 'en';
export type { Dictionary } from './dictionaries/uz';

export const LANGUAGES: {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}[] = [
  { code: 'uz', label: "O'zbekcha", nativeLabel: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский',   nativeLabel: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English',   nativeLabel: 'English', flag: '🇬🇧' },
];

export const DEFAULT_LANGUAGE: Language = 'uz';
export const LANG_COOKIE_KEY = 'kq_lang';

const dictionaries = { uz, ru, en } as const;

export function getDictionary(lang: Language) {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LANGUAGE];
}
