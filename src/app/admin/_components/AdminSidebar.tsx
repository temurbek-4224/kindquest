'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, BarChart3, Users,
  ChevronLeft, LogOut, Menu, X, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

/* ── Nav items ─────────────────────────────────────────── */
const NAV = [
  { href: '/admin',           label: 'Dashboard',           icon: LayoutDashboard },
  { href: '/admin/questions', label: 'Savollar',            icon: BookOpen        },
  { href: '/admin/results',   label: 'Natijalar',           icon: BarChart3       },
  { href: '/admin/users',     label: 'Foydalanuvchilar',    icon: Users           },
] as const;

interface Props {
  displayName: string;
  email:       string;
}

export default function AdminSidebar({ displayName, email }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';

  /* ── Shared sidebar content ─── */
  const SidebarContent = (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Header */}
      <div className="gradient-brand px-5 py-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 shadow-inner">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-white leading-tight">KindQuest</p>
            <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90 mt-0.5">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <Icon
                className={cn(
                  'h-4.5 w-4.5 shrink-0',
                  active ? 'text-violet-600' : 'text-gray-400',
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 px-3 pb-4 space-y-1 border-t border-gray-100 pt-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-400 shrink-0" />
          Saytga qaytish
        </Link>

        {/* Admin info */}
        <div className="flex items-center gap-2.5 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-brand text-white text-xs font-bold select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-[10px] text-gray-400 truncate">{email}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Chiqish
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white h-screen sticky top-0">
        {SidebarContent}
      </aside>

      {/* ── Mobile top bar ────────────────────────── */}
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-white border-b border-gray-200 px-4 h-14 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-extrabold gradient-text">KindQuest Admin</span>
        </div>

        {/* Mobile overlay */}
        {open && (
          <div className="fixed inset-0 z-50 flex">
            {/* Sidebar panel */}
            <div className="w-60 bg-white h-full shadow-2xl overflow-hidden">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {SidebarContent}
            </div>
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
