import type { Metadata } from 'next';
import QuestionForm from '../_components/QuestionForm';

export const metadata: Metadata = { title: 'Yangi savol' };

export default function NewQuestionPage() {
  return <QuestionForm />;
}
