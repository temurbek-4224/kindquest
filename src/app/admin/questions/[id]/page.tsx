import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import QuestionForm from '../_components/QuestionForm';
import type { DBQuestion } from '@/types/admin';

export const metadata: Metadata = { title: 'Savolni tahrirlash' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: question, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single<DBQuestion>();

  if (error || !question) notFound();

  return <QuestionForm question={question} />;
}
