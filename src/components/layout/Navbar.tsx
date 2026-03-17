'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const UI = {
  profile:  { uz: 'Profil',                   ru: 'Профиль',      en: 'Profile'      },
  logout:   { uz: 'Chiqish',                  ru: 'Выйти',        en: 'Log out'      },
  login:    { uz: 'Kirish',                   ru: 'Войти',        en: 'Log in'       },
  register: { uz: "Ro'yxatdan o'tish",        ru: 'Регистрация',  en: 'Sign up'      },
  admin:    { uz: 'Admin panel',              ru: 'Админ панель', en: 'Admin Panel'  },
};

export default function Navbar() {
  const { t, language } = useLanguage();
  const { user, loading, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();
  const l        = language;

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  const links = [
    { href: '/',      label: t.nav.home  },
    { href: '/about', label: t.nav.about },
  ];

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    '';

  const initials = user?.email
    ? (displayName.trim()
        ? displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase())
    : '??';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-violet-100 shadow-sm shadow-violet-50'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ──────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group select-none">
            <motion.div
              whileHover={{ rotate: 20, scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 14 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-md shadow-violet-300/40"
            >
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </motion.div>
            <span className="text-xl font-extrabold gradient-text tracking-tight">KindQuest</span>
          </Link>

          {/* ── Desktop nav ────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200',
                    active
                      ? 'text-violet-700'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-violet-100"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop right ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <div className="h-5 w-px bg-gray-200 mx-1" />

            {loading ? (
              <div className="h-8 w-24 rounded-xl bg-gray-100 animate-pulse" />
            ) : user ? (
              /*
               * ── Authenticated user area ──
               * Avatar + name  →  Link to /profile  (direct, no dropdown)
               * Logout icon    →  logs out
               */
              <div className="flex items-center gap-1">
                {/* Admin Panel link — only for admins */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors',
                      pathname.startsWith('/admin')
                        ? 'border-violet-400 bg-violet-100 text-violet-700'
                        : 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100',
                    )}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    {UI.admin[l]}
                  </Link>
                )}

                {/* Profile link */}
                <Link
                  href="/profile"
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-1.5 transition-colors',
                    pathname === '/profile'
                      ? 'bg-violet-100 text-violet-700'
                      : 'hover:bg-violet-50 text-gray-700',
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-white text-xs font-bold select-none">
                    {initials}
                  </div>
                  <span className="max-w-[100px] truncate text-sm font-medium">
                    {displayName}
                  </span>
                </Link>

                {/* Logout button — always visible, separate from profile link */}
                <button
                  onClick={handleSignOut}
                  title={UI.logout[l]}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-violet-700 rounded-xl hover:bg-violet-50 transition-colors"
                >
                  {UI.login[l]}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-semibold text-white gradient-brand rounded-xl shadow-md shadow-violet-300/50 hover:opacity-90 transition-opacity"
                >
                  {UI.register[l]}
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: lang + burger ──────────────────────── */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageSwitcher compact />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-xl text-gray-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-b border-violet-100"
          >
            <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-1">

              {/* Nav links */}
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-1 border-t border-gray-100 flex flex-col gap-2">
                {user ? (
                  <>
                    {/* Avatar + name */}
                    <Link
                      href="/profile"
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                        pathname === '/profile'
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-gray-700 hover:bg-gray-50',
                      )}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-white text-sm font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{UI.profile[l]}</p>
                      </div>
                      <User className="h-4 w-4 ml-auto shrink-0 text-gray-400" />
                    </Link>

                    {/* Admin Panel link — only for admins */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                          pathname.startsWith('/admin')
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-violet-50 text-violet-700 hover:bg-violet-100',
                        )}
                      >
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        {UI.admin[l]}
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {UI.logout[l]}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-3 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {UI.login[l]}
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-3 text-center text-sm font-semibold text-white gradient-brand rounded-xl shadow-md hover:opacity-90 transition-opacity"
                    >
                      {UI.register[l]}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
