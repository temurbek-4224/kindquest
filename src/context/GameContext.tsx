'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import { type GameQuestion } from '@/types/game';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
export interface AnswerRecord {
  /** UUID of the question (string, from Supabase) */
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'answered' | 'finished';

export interface GameState {
  questions: GameQuestion[];
  currentIndex: number;
  selectedIndex: number | null;
  status: GameStatus;
  answers: AnswerRecord[];
  score: number;
}

type GameAction =
  | { type: 'START';         payload: GameQuestion[] }
  | { type: 'SELECT_ANSWER'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH' }
  | { type: 'RESET' };

/* ─────────────────────────────────────────────────────────────
   Initial state
───────────────────────────────────────────────────────────── */
const INITIAL: GameState = {
  questions:     [],
  currentIndex:  0,
  selectedIndex: null,
  status:        'idle',
  answers:       [],
  score:         0,
};

/* ─────────────────────────────────────────────────────────────
   Reducer
───────────────────────────────────────────────────────────── */
function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return { ...INITIAL, questions: action.payload, status: 'playing' };

    case 'SELECT_ANSWER': {
      const idx = action.payload;
      const q   = state.questions[state.currentIndex];
      const isCorrect = idx === q.correctAnswerIndex;
      const record: AnswerRecord = {
        questionId:    q.id,
        selectedIndex: idx,
        isCorrect,
      };
      return {
        ...state,
        selectedIndex: idx,
        status:        'answered',
        answers:       [...state.answers, record],
        score:         isCorrect ? state.score + 10 : state.score,
      };
    }

    case 'NEXT_QUESTION': {
      const next = state.currentIndex + 1;
      if (next >= state.questions.length) {
        return { ...state, status: 'finished' };
      }
      return {
        ...state,
        currentIndex:  next,
        selectedIndex: null,
        status:        'playing',
      };
    }

    case 'FINISH':
      return { ...state, status: 'finished' };

    case 'RESET':
      return INITIAL;

    default:
      return state;
  }
}

/* ─────────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────────── */
interface GameContextType {
  state:           GameState;
  startGame:       (questions: GameQuestion[]) => void;
  selectAnswer:    (index: number) => void;
  nextQuestion:    () => void;
  resetGame:       () => void;
  currentQuestion: GameQuestion | null;
  isLastQuestion:  boolean;
  percentage:      number;
  correctCount:    number;
}

const GameContext = createContext<GameContextType | null>(null);

/* ─────────────────────────────────────────────────────────────
   Provider
───────────────────────────────────────────────────────────── */
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const startGame = useCallback((questions: GameQuestion[]) => {
    dispatch({ type: 'START', payload: questions });
  }, []);

  const selectAnswer = useCallback((index: number) => {
    if (state.status !== 'playing') return;
    dispatch({ type: 'SELECT_ANSWER', payload: index });
  }, [state.status]);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const isLastQuestion  = state.currentIndex === state.questions.length - 1;
  const correctCount    = state.answers.filter((a) => a.isCorrect).length;
  const percentage      =
    state.questions.length > 0
      ? Math.round((correctCount / state.questions.length) * 100)
      : 0;

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        selectAnswer,
        nextQuestion,
        resetGame,
        currentQuestion,
        isLastQuestion,
        percentage,
        correctCount,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────────── */
export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside <GameProvider>');
  return ctx;
}
