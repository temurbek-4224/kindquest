/**
 * GameQuestion — the canonical question type used throughout the game UI.
 *
 * Populated by mapping a row from the Supabase `public.questions` table
 * (flat-column schema) into the nested shape that GameCard, GameContext,
 * and the result review page all expect.
 *
 * Flat DB columns → nested GameQuestion:
 *   question_uz/ru/en          → question.uz/ru/en
 *   option_a_uz … option_d_en  → options.uz[0..3], options.ru[0..3], options.en[0..3]
 *   correct_answer ('A'|…'D')  → correctAnswerIndex (0..3)
 *   explanation_uz/ru/en       → explanation.uz/ru/en
 */
export interface GameQuestion {
  /** UUID from the database row */
  id: string;

  /** Category key — looked up in CATEGORY_META for colours / icons / labels */
  category: string;

  question: { uz: string; ru: string; en: string };

  /** Indexed [0]=A, [1]=B, [2]=C, [3]=D */
  options: { uz: string[]; ru: string[]; en: string[] };

  /** 0-based index of the correct option  (A→0, B→1, C→2, D→3) */
  correctAnswerIndex: number;

  explanation: { uz: string; ru: string; en: string };
}
