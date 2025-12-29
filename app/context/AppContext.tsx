import { createContext, useContext, useReducer, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { appReducer, initialState } from "./AppReducer";
import type { AppState, AppAction } from "../types/context";
import { signOut as supabaseSignOut } from "../lib/supabase/auth";
import { queryClient } from "../lib/react-query/queryClient";
import { useNavigate } from "react-router";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Auth helpers
  login: (user: AppState["user"]) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Quiz helpers
  setQuizzes: (quizzes: AppState["quizzes"]) => void;
  setCurrentQuiz: (quiz: AppState["currentQuiz"]) => void;
  // UI helpers
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  clearMessages: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

function AppContextProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const navigate = useNavigate();

  // Auth helpers
  function login(user: AppState["user"]) {
    dispatch({ type: "SET_USER", payload: user });
  }

  async function logout() {
    try {
      await supabaseSignOut();
      dispatch({ type: "LOGOUT" });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to sign out. Please try again.",
      });
    }
  }

  async function refreshUser() {
    // User will be refreshed via React Query
    queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
  }

  // Quiz helpers
  function setQuizzes(quizzes: AppState["quizzes"]) {
    dispatch({ type: "SET_QUIZZES", payload: quizzes });
  }

  function setCurrentQuiz(quiz: AppState["currentQuiz"]) {
    dispatch({ type: "SET_CURRENT_QUIZ", payload: quiz });
  }

  // UI helpers
  function showError(message: string) {
    dispatch({ type: "SET_ERROR", payload: message });
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      dispatch({ type: "CLEAR_MESSAGES" });
    }, 5000);
  }

  function showSuccess(message: string) {
    dispatch({ type: "SET_SUCCESS", payload: message });
    // Auto-clear success after 3 seconds
    setTimeout(() => {
      dispatch({ type: "CLEAR_MESSAGES" });
    }, 3000);
  }

  function clearMessages() {
    dispatch({ type: "CLEAR_MESSAGES" });
  }

  const value: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    refreshUser,
    setQuizzes,
    setCurrentQuiz,
    showError,
    showSuccess,
    clearMessages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>{children}</AppContextProvider>
    </QueryClientProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
