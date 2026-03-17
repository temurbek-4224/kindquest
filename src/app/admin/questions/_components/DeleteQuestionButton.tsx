'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  id:    string;
  label: string; // truncated question text shown in confirm dialog
}

export default function DeleteQuestionButton({ id, label }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `"${label.slice(0, 60)}…"\n\nBu savolni o'chirishni tasdiqlaysizmi?`,
      )
    )
      return;

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Xatolik: ' + error.message);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="O'chirish"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
