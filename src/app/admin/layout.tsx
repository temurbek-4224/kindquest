import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from './_components/AdminSidebar';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin · KindQuest' },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  /* Non-admins are redirected to the home page */
  if (profile?.role !== 'admin') redirect('/');

  const displayName =
    (profile?.full_name as string | null) ??
    user.email?.split('@')[0] ??
    'Admin';

  const email = (profile?.email as string | null) ?? user.email ?? '';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar displayName={displayName} email={email} />

      {/* Main content — pt-14 on mobile to clear fixed top-bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}
