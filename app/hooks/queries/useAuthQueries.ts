import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, signIn, signOut, signUp } from "../../lib/supabase/auth";
import type { LoginCredentials, RegisterData } from "../../types/auth";
import { useApp } from "../../context/AppContext";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

/**
 * Get current authenticated user
 */
export function useUser() {
  const { login } = useApp();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const user = await getCurrentUser();
      if (user) {
        login(user);
      }
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Sign in mutation
 */
export function useSignIn() {
  const queryClient = useQueryClient();
  const { login, showError, showSuccess } = useApp();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => signIn(credentials),
    onSuccess: async (data) => {
      // Invalidate and refetch user
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
      const user = await getCurrentUser();
      if (user) {
        login(user);
        showSuccess("Successfully signed in!");
      }
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to sign in");
    },
  });
}

/**
 * Sign up mutation
 */
export function useSignUp() {
  const { showError, showSuccess } = useApp();

  return useMutation({
    mutationFn: (data: RegisterData) => signUp(data),
    onSuccess: () => {
      showSuccess("Account created successfully! Please sign in.");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to create account");
    },
  });
}

/**
 * Sign out mutation
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const { logout, showError } = useApp();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: async () => {
      // Clear all queries
      queryClient.clear();
      await logout();
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to sign out");
    },
  });
}

