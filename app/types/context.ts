import type { User } from "./user";
import type { Quiz, QuizAttempt, QuizResult } from "./quiz";

export interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Quiz state
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentAttempt: QuizAttempt | null;
  quizResults: QuizResult[];

  // UI state
  error: string | null;
  success: string | null;
}

export type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "LOGOUT" }
  | { type: "SET_QUIZZES"; payload: Quiz[] }
  | { type: "ADD_QUIZ"; payload: Quiz }
  | { type: "UPDATE_QUIZ"; payload: Quiz }
  | { type: "DELETE_QUIZ"; payload: string }
  | { type: "SET_CURRENT_QUIZ"; payload: Quiz | null }
  | { type: "SET_CURRENT_ATTEMPT"; payload: QuizAttempt | null }
  | { type: "UPDATE_ATTEMPT_ANSWER"; payload: { questionId: string; answer: string | string[] } }
  | { type: "SET_QUIZ_RESULTS"; payload: QuizResult[] }
  | { type: "ADD_QUIZ_RESULT"; payload: QuizResult }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "CLEAR_MESSAGES" }
  | { type: "RESET_STATE" };

