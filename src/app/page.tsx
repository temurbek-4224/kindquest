'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  Play,
  ArrowRight,
  BookOpen,
  Heart,
  Trophy,
  Zap,
  Star,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

/* ─────────────────────── Animation variants ─────────────────── */
// Use bezier array so TypeScript is happy with Framer Motion's Easing type
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11 } },
};

/* ─────────────────────── Static data ───────────────────────────
   Labels are stored per-language to avoid bloating the dictionary.
   For categories the label is picked by current language at render.
──────────────────────────────────────────────────────────────── */
const STATS = [
  { value: '500+', uz: 'Savol',  ru: 'Вопросов', en: 'Questions' },
  { value: '6',    uz: 'Mavzu',  ru: 'Тем',       en: 'Topics'    },
  { value: '3',    uz: 'Til',    ru: 'Языка',      en: 'Languages' },
  { value: '∞',    uz: 'Qiziq',  ru: 'Весело',     en: 'Fun'       },
];

const CATEGORIES = [
  { icon: '👴', color: 'from-orange-400 to-red-500',    shadow: 'shadow-orange-200',  uz: 'Kattalarni hurmat',   ru: 'Уважение к старшим',   en: 'Respecting Elders'   },
  { icon: '✅', color: 'from-emerald-400 to-teal-500',  shadow: 'shadow-emerald-200', uz: 'Halollik',            ru: 'Честность',             en: 'Honesty'             },
  { icon: '💝', color: 'from-pink-400 to-rose-500',     shadow: 'shadow-pink-200',    uz: 'Mehribonlik',         ru: 'Доброта',               en: 'Kindness'            },
  { icon: '🏫', color: 'from-blue-400 to-cyan-500',     shadow: 'shadow-blue-200',    uz: 'Maktab xulqi',        ru: 'Поведение в школе',     en: 'School Behavior'     },
  { icon: '🏠', color: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-200',  uz: 'Uyda yordam',         ru: 'Помощь дома',           en: 'Helping at Home'     },
  { icon: '⭐', color: 'from-yellow-400 to-amber-500',  shadow: 'shadow-yellow-200',  uz: 'Intizom',             ru: 'Дисциплина',            en: 'Discipline'          },
];

const FEATURE_META = [
  { Icon: BookOpen, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200' },
  { Icon: Heart,    gradient: 'from-pink-500 to-rose-600',     shadow: 'shadow-pink-200'   },
  { Icon: Trophy,   gradient: 'from-amber-400 to-orange-500',  shadow: 'shadow-amber-200'  },
];

/* Float emojis in hero */
const FLOATS = [
  { e: '⭐', t: '8%',  l: '6%',  d: 3.6 },
  { e: '🌈', t: '14%', l: '82%', d: 4.1 },
  { e: '💫', t: '70%', l: '9%',  d: 3.2 },
  { e: '🎯', t: '75%', l: '78%', d: 4.5 },
  { e: '🏆', t: '42%', l: '4%',  d: 3.8 },
  { e: '✨', t: '38%', l: '90%', d: 4.0 },
  { e: '🎮', t: '18%', l: '50%', d: 5.0 },
  { e: '💡', t: '60%', l: '55%', d: 3.4 },
  { e: '🌟', t: '85%', l: '35%', d: 4.3 },
  { e: '🤝', t: '52%', l: '25%', d: 3.9 },
];

/* ─────────────────────── Page ───────────────────────────────── */
export default function HomePage() {
  const { t, language } = useLanguage();

  /* Pick the right language label from a trilingual object */
  function loc(item: { uz: string; ru: string; en: string }) {
    return item[language];
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1">

        {/* ════════════════════════ HERO ════════════════════════ */}
        <section className="relative min-h-[92vh] flex items-center justify-center gradient-hero overflow-hidden">

          {/* Blob decorations */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full opacity-60 animate-blob"
              style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }}
            />
            <div
              className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full opacity-50 animate-blob"
              style={{ background: 'radial-gradient(circle, #f9a8d4 0%, transparent 70%)', animationDelay: '3s' }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 animate-blob"
              style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', animationDelay: '1.5s' }}
            />
          </div>

          {/* Floating emojis */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
            {FLOATS.map((f, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl opacity-75"
                style={{ top: f.t, left: f.l }}
                animate={{ y: [0, -16, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: f.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
                {f.e}
              </motion.span>
            ))}
          </div>

          {/* Hero content */}
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center gap-7"
            >
              {/* Badge */}
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-violet-700 shadow-sm">
                  <Zap className="h-3.5 w-3.5 fill-violet-400 text-violet-400" />
                  {t.home.hero.badge}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="max-w-3xl text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight"
              >
                <span className="gradient-text">{t.home.hero.title}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                className="max-w-xl text-lg sm:text-xl text-gray-600 leading-relaxed"
              >
                {t.home.hero.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center gap-3"
              >
                <Link href="/game">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2.5 h-14 px-9 text-base font-bold text-white gradient-brand rounded-2xl shadow-xl shadow-violet-300/50 hover:opacity-90 transition-opacity"
                  >
                    <Play className="h-5 w-5 fill-white shrink-0" />
                    {t.home.hero.cta_start}
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 h-14 px-8 text-base font-semibold text-violet-700 bg-white/90 border border-violet-200 rounded-2xl hover:bg-white hover:border-violet-400 transition-all shadow-sm"
                  >
                    {t.home.hero.cta_learn}
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col items-center gap-1 pt-2 text-gray-400"
              >
                <span className="text-xs">scroll</span>
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════ STATS ══════════════════════ */}
        <section className="border-y border-gray-100 bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-4xl md:text-5xl font-extrabold gradient-text">
                    {s.value}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">{loc(s)}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════ FEATURES ═══════════════════ */}
        <section className="section bg-gradient-to-b from-white to-violet-50/50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">

            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                {t.home.features.title}
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">{t.home.features.subtitle}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {t.home.features.cards.map((card, i) => {
                const meta = FEATURE_META[i];
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    whileHover={{ y: -7 }}
                    transition={{ duration: 0.25 }}
                    className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:shadow-violet-100/60 transition-shadow duration-300"
                  >
                    {/* Icon */}
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} shadow-lg ${meta.shadow}`}>
                      <meta.Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                    {/* Decorative circle */}
                    <div className={`pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-gradient-to-br ${meta.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════ CATEGORIES ═════════════════ */}
        <section className="section bg-violet-50/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">

            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                {t.home.categories.title}
              </h2>
              <p className="text-gray-500">{t.home.categories.subtitle}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ scale: 1.04, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group cursor-pointer rounded-3xl bg-gradient-to-br ${cat.color} p-6 text-white shadow-lg ${cat.shadow} hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">
                    {cat.icon}
                  </div>
                  <h3 className="text-sm md:text-base font-bold leading-snug">
                    {loc(cat)}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════ HOW IT WORKS ═══════════════ */}
        <section className="section bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">

            <motion.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                {t.about.how.title}
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {t.about.how.steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-2xl font-extrabold text-white shadow-lg shadow-violet-300/40">
                    {i + 1}
                    {i < t.about.how.steps.length - 1 && (
                      <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-violet-300 to-pink-200 ml-0" />
                    )}
                  </div>
                  <p className="font-semibold text-gray-700 text-sm md:text-base">{step}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════ CTA BANNER ═════════════════ */}
        <section className="relative overflow-hidden gradient-brand py-24 text-white">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                className="text-6xl select-none"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                🚀
              </motion.div>
              <h2 className="max-w-xl text-4xl md:text-5xl font-extrabold leading-tight">
                {t.home.cta.title}
              </h2>
              <p className="max-w-sm text-lg text-white/75">
                {t.home.cta.subtitle}
              </p>
              <Link href="/game">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-10 text-base font-bold text-violet-700 bg-white rounded-2xl shadow-2xl hover:bg-white/95 transition-colors"
                >
                  {t.home.cta.button}
                </motion.button>
              </Link>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex -space-x-2">
                  {['🧒','👦','👧','🧒','👦'].map((e, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-sm"
                    >
                      {e}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
                  ))}
                  <span className="ml-1 font-medium">1,200+ {language === 'uz' ? "o'quvchi" : language === 'ru' ? 'учеников' : 'students'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
