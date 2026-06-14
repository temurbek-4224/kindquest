'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Send, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const HOW_CARDS = [
  {
    emoji: '🎭',
    label: { uz: 'Hayotiy vaziyat',     ru: 'Жизненная ситуация',         en: 'Life Scenario'       },
    desc:  { uz: "Temurbek bilan birga haqiqiy hayot vaziyatlariga duch keling",
             ru: "Сталкивайтесь с реальными ситуациями вместе с Темурбеком",
             en: "Face real-life situations together with Temurbek"             },
  },
  {
    emoji: '✏️',
    label: { uz: 'Qaror tanlash',        ru: 'Принятие решения',            en: 'Decision Making'     },
    desc:  { uz: "To'g'ri yoki noto'g'ri qarorni tanlang",
             ru: "Выбирайте правильное или неправильное решение",
             en: "Choose the right or wrong decision"                          },
  },
  {
    emoji: '💡',
    label: { uz: 'Natija va izoh',       ru: 'Результат и объяснение',      en: 'Result & Explanation'},
    desc:  { uz: "Har bir javob uchun batafsil tushuntirish oling",
             ru: "Получите подробное объяснение для каждого ответа",
             en: "Get a detailed explanation for each answer"                  },
  },
  {
    emoji: '🏆',
    label: { uz: 'Mukofot va daraja',    ru: 'Награда и уровень',           en: 'Reward & Level'      },
    desc:  { uz: "To'plangan ball va darajangizni ko'ring",
             ru: "Смотрите набранные очки и ваш уровень",
             en: "See your collected points and level"                         },
  },
];

const FEATURES = [
  { icon: '🎮', uz: "Interaktiv o'yin",          ru: 'Интерактивная игра',        en: 'Interactive Game'       },
  { icon: '🌍', uz: "3 til qo'llab-quvvatlash",  ru: 'Поддержка 3 языков',        en: '3 Language Support'     },
  { icon: '📊', uz: 'Ball va statistika',         ru: 'Очки и статистика',         en: 'Points & Statistics'    },
  { icon: '🔒', uz: 'Xavfsiz autentifikatsiya',  ru: 'Безопасная аутентификация', en: 'Secure Auth'            },
  { icon: '👩‍💼', uz: 'Admin boshqaruv',           ru: 'Панель администратора',     en: 'Admin Panel'            },
  { icon: '🎭', uz: "Stsenariy asosli o'yinlar", ru: 'Сценарийные игры',          en: 'Scenario-based Games'   },
  { icon: '🏅', uz: 'Mukofot tizimi',             ru: 'Система наград',            en: 'Reward System'          },
  { icon: '📱', uz: 'Mobil moslashuvchan',        ru: 'Адаптивный дизайн',         en: 'Mobile Responsive'      },
];

const TECHS: { name: string; color: string }[] = [
  { name: 'Next.js',       color: 'bg-black text-white'         },
  { name: 'TypeScript',    color: 'bg-blue-600 text-white'      },
  { name: 'Tailwind CSS',  color: 'bg-cyan-500 text-white'      },
  { name: 'Supabase',      color: 'bg-emerald-600 text-white'   },
  { name: 'PostgreSQL',    color: 'bg-indigo-600 text-white'    },
  { name: 'Vercel',        color: 'bg-slate-800 text-white'     },
];

const UI = {
  startGame:   { uz: "O'yinni boshlash",              ru: 'Начать игру',              en: 'Start Game'              },
  goHome:      { uz: 'Bosh sahifaga qaytish',          ru: 'На главную',               en: 'Go to Home'              },
  authorTitle: { uz: 'Muallif',                        ru: 'Автор',                    en: 'Author'                  },
  telegram:    { uz: "Telegram orqali bog'laning",     ru: 'Написать в Telegram',      en: 'Contact via Telegram'    },
};

const FADE_UP = {
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true         },
};

export default function AboutPage() {
  const { t, language } = useLanguage();
  const l = language as Language;

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-pink-50">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...FADE_UP} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              KindQuest
            </span>
          </motion.div>

          <motion.h1
            {...FADE_UP}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold gradient-text leading-tight mb-4"
          >
            {t.about.title}
          </motion.h1>

          <motion.p
            {...FADE_UP}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            {t.about.subtitle}
          </motion.p>

          <motion.div
            {...FADE_UP}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/game"
              className="px-6 py-3 rounded-2xl text-sm font-semibold text-white gradient-brand shadow-md shadow-violet-300/40 hover:opacity-90 transition-opacity"
            >
              {UI.startGame[l]}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-2xl text-sm font-semibold text-violet-700 border border-violet-200 bg-white hover:bg-violet-50 transition-colors"
            >
              {UI.goHome[l]}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <motion.div
            {...FADE_UP}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-white border border-violet-100 shadow-sm p-8 sm:p-12"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-brand shrink-0">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">{t.about.mission.title}</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{t.about.mission.description}</p>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-900 text-center mb-12"
          >
            {t.about.how.title}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl bg-white border border-violet-100 shadow-sm p-6 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-xs font-bold text-violet-700 bg-violet-50 rounded-full px-3 py-1 self-start">
                  {t.about.how.steps[i]}
                </span>
                <h3 className="font-bold text-gray-900">{card.label[l]}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc[l]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-900 text-center mb-12"
          >
            {t.about.values.title}
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-100 p-5 flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{f.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{f[l]}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technologies ─────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            {...FADE_UP}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-900 mb-10"
          >
            {t.about.tech.title}
          </motion.h2>

          <motion.div
            {...FADE_UP}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {TECHS.map((tech) => (
              <span
                key={tech.name}
                className={cn('rounded-2xl px-5 py-2.5 text-sm font-bold shadow-sm', tech.color)}
              >
                {tech.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Author ───────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-sm">
          <motion.div
            {...FADE_UP}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-violet-100 shadow-lg overflow-hidden"
          >
            <div className="h-24 gradient-brand" />
            <div className="px-8 pb-8 -mt-10 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-white shadow-md text-3xl mb-4 gradient-brand">
                👩‍💻
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-1">
                {UI.authorTitle[l]}
              </p>
              <h3 className="text-xl font-extrabold text-gray-900 mb-1">Shohina Sagdullayeva</h3>
              <p className="text-sm text-gray-400 mb-6">KindQuest Developer</p>
              <a
                href="https://t.me/shaxina_sagdullayeva"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-[#229ED9] hover:opacity-90 transition-opacity shadow-md"
              >
                <Send className="h-4 w-4" />
                {UI.telegram[l]}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="py-16 px-4 text-center">
        <motion.div
          {...FADE_UP}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/game"
            className="px-8 py-3.5 rounded-2xl text-sm font-semibold text-white gradient-brand shadow-md shadow-violet-300/40 hover:opacity-90 transition-opacity"
          >
            {UI.startGame[l]}
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-2xl text-sm font-semibold text-violet-700 border border-violet-200 bg-white hover:bg-violet-50 transition-colors"
          >
            {UI.goHome[l]}
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
