import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex flex-col items-center justify-center px-4 py-16">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10 select-none">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand shadow-md shadow-violet-300/40">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-extrabold gradient-text tracking-tight">KindQuest</span>
      </Link>

      <RegisterForm />
    </div>
  );
}
