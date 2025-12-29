import type { AppState, AppAction } from "../types/context";

export const initialState: AppState = {
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Quiz state
  quizzes: [],
  currentQuiz: null,
  currentAttempt: null,
  quizResults: [],

  // UI state
  error: null,
  success: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Auth actions
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    // Quiz actions
    case "SET_QUIZZES":
      return {
        ...state,
        quizzes: action.payload,
      };

    case "ADD_QUIZ":
      return {
        ...state,
        quizzes: [...state.quizzes, action.payload],
      };

    case "UPDATE_QUIZ":
      return {
        ...state,
        quizzes: state.quizzes.map((quiz) =>
          quiz.id === action.payload.id ? action.payload : quiz
        ),
        currentQuiz:
          state.currentQuiz?.id === action.payload.id
            ? action.payload
            : state.currentQuiz,
      };

    case "DELETE_QUIZ":
      return {
        ...state,
        quizzes: state.quizzes.filter((quiz) => quiz.id !== action.payload),
        currentQuiz:
          state.currentQuiz?.id === action.payload ? null : state.currentQuiz,
      };

    case "SET_CURRENT_QUIZ":
      return {
        ...state,
        currentQuiz: action.payload,
      };

    case "SET_CURRENT_ATTEMPT":
      return {
        ...state,
        currentAttempt: action.payload,
      };

    case "UPDATE_ATTEMPT_ANSWER":
      if (!state.currentAttempt) return state;
      return {
        ...state,
        currentAttempt: {
          ...state.currentAttempt,
          answers: [
            ...state.currentAttempt.answers.filter(
              (a) => a.questionId !== action.payload.questionId
            ),
            {
              questionId: action.payload.questionId,
              answer: action.payload.answer,
            },
          ],
        },
      };

    case "SET_QUIZ_RESULTS":
      return {
        ...state,
        quizResults: action.payload,
      };

    case "ADD_QUIZ_RESULT":
      return {
        ...state,
        quizResults: [...state.quizResults, action.payload],
      };

    // UI actions
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        success: null,
      };

    case "SET_SUCCESS":
      return {
        ...state,
        success: action.payload,
        error: null,
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        error: null,
        success: null,
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
}
