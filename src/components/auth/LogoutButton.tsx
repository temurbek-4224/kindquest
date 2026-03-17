'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const UI = {
  logout: { uz: 'Chiqish', ru: 'Выйти', en: 'Log out' },
};

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { signOut } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  async function handleClick() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className={
        className ??
        'flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors'
      }
    >
      <LogOut className="h-4 w-4" />
      {UI.logout[language]}
    </button>
  );
}
