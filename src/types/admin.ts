/** DB row shape for the questions table (flat-column schema) */
export interface DBQuestion {
  id: string;
  category: string;

  question_uz: string;
  question_ru: string;
  question_en: string;

  option_a_uz: string;
  option_a_ru: string;
  option_a_en: string;

  option_b_uz: string;
  option_b_ru: string;
  option_b_en: string;

  option_c_uz: string;
  option_c_ru: string;
  option_c_en: string;

  option_d_uz: string;
  option_d_ru: string;
  option_d_en: string;

  correct_answer: 'A' | 'B' | 'C' | 'D';

  explanation_uz: string | null;
  explanation_ru: string | null;
  explanation_en: string | null;

  created_at: string;
  updated_at: string;
}

/** DB row shape for profiles (with admin additions) */
export interface DBProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

/** DB row shape for game_results */
export interface DBGameResult {
  id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  language: string;
  created_at: string;
}

/** game_result enriched with profile data */
export interface EnrichedResult extends DBGameResult {
  profile?: Pick<DBProfile, 'full_name' | 'email'> | null;
}
