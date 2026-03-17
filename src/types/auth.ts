export type Role = 'user' | 'admin';
export type Language = 'uz' | 'ru' | 'en';

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  preferred_lang: Language;
  total_xp: number;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
}
