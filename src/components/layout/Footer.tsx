'use client';

import Link from 'next/link';
import { Sparkles, Heart, Github } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 py-14 border-b border-white/10">

          {/* Brand */}
          <div className="sm:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">KindQuest</span>
            </div>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              {t.footer.tagline}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/35">
              {t.footer.made_with}
              <Heart className="h-3 w-3 text-pink-400 fill-pink-400" />
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">
              Navigation
            </h3>
            {[
              { href: '/', label: t.footer.links.home },
              { href: '/about', label: t.footer.links.about },
              { href: '/auth/login', label: t.nav.login },
              { href: '/auth/register', label: t.nav.register },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="text-sm text-white/50 hover:text-white transition-colors w-fit"
              >{l.label}</Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">
              Legal
            </h3>
            <Link href="#" className="text-sm text-white/50 hover:text-white transition-colors w-fit">
              {t.footer.links.privacy}
            </Link>
            <Link href="#" className="text-sm text-white/50 hover:text-white transition-colors w-fit">
              {t.footer.links.contact}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs text-white/30">
          <span>© {year} KindQuest. {t.footer.rights}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="text-sm">🇺🇿</span> Uzbekistan
            </span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors" aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
