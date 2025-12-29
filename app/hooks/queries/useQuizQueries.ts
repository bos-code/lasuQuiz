import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../../utils/supabase";
import type { Quiz, QuizAttempt, QuizResult } from "../../types/quiz";
import { useApp } from "../../context/AppContext";

// Query keys
export const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (filters?: string) => [...quizKeys.lists(), { filters }] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  attempts: () => [...quizKeys.all, "attempts"] as const,
  attempt: (id: string) => [...quizKeys.attempts(), id] as const,
  results: () => [...quizKeys.all, "results"] as const,
  result: (id: string) => [...quizKeys.results(), id] as const,
};

/**
 * Get all quizzes
 */
export function useQuizzes() {
  const { setQuizzes } = useApp();

  return useQuery({
    queryKey: quizKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const quizzes = (data || []) as Quiz[];
      setQuizzes(quizzes);
      return quizzes;
    },
  });
}

/**
 * Get a single quiz by ID
 */
export function useQuiz(quizId: string | undefined) {
  const { setCurrentQuiz } = useApp();

  return useQuery({
    queryKey: quizKeys.detail(quizId || ""),
    queryFn: async () => {
      if (!quizId) return null;

      // Fetch quiz
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", quizId)
        .single();

      if (quizError) throw quizError;

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order", { ascending: true });

      if (questionsError) throw questionsError;

      const quiz: Quiz = {
        ...quizData,
        questions: questionsData || [],
      } as Quiz;

      setCurrentQuiz(quiz);
      return quiz;
    },
    enabled: !!quizId,
  });
}

/**
 * Get user's quiz attempts
 */
export function useQuizAttempts(userId: string | undefined) {
  return useQuery({
    queryKey: quizKeys.attempts(),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", userId)
        .order("started_at", { ascending: false });

      if (error) throw error;
      return (data || []) as QuizAttempt[];
    },
    enabled: !!userId,
  });
}

/**
 * Get user's quiz results
 */
export function useQuizResults(userId: string | undefined) {
  return useQuery({
    queryKey: quizKeys.results(),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("quiz_attempts")
        .select(`
          *,
          quizzes (
            id,
            title
          )
        `)
        .eq("user_id", userId)
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      // Transform to QuizResult format
      const results: QuizResult[] = (data || []).map((attempt: any) => ({
        attemptId: attempt.id,
        quizId: attempt.quiz_id,
        quizTitle: attempt.quizzes?.title || "Unknown Quiz",
        score: attempt.score || 0,
        totalPoints: attempt.total_points || 0,
        percentage: attempt.total_points
          ? Math.round((attempt.score / attempt.total_points) * 100)
          : 0,
        submittedAt: attempt.submitted_at,
        answers: [], // Would need to fetch separately
      }));

      return results;
    },
    enabled: !!userId,
  });
}

/**
 * Create quiz attempt mutation
 */
export function useCreateQuizAttempt() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useApp();

  return useMutation({
    mutationFn: async (data: { quizId: string; userId: string }) => {
      const { data: attempt, error } = await supabase
        .from("quiz_attempts")
        .insert({
          quiz_id: data.quizId,
          user_id: data.userId,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return attempt as QuizAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts() });
      showSuccess("Quiz started!");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to start quiz");
    },
  });
}

/**
 * Submit quiz mutation
 */
export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { showError, showSuccess } = useApp();

  return useMutation({
    mutationFn: async (data: {
      attemptId: string;
      answers: Array<{ questionId: string; answer: string | string[] }>;
    }) => {
      // Calculate score
      // This is simplified - you'd need to fetch questions and compare answers
      const score = 0; // Calculate based on answers
      const totalPoints = data.answers.length;

      // Update attempt
      const { data: attempt, error: attemptError } = await supabase
        .from("quiz_attempts")
        .update({
          submitted_at: new Date().toISOString(),
          score,
          total_points: totalPoints,
        })
        .eq("id", data.attemptId)
        .select()
        .single();

      if (attemptError) throw attemptError;

      // Save answers
      const answersToInsert = data.answers.map((answer) => ({
        attempt_id: data.attemptId,
        question_id: answer.questionId,
        answer: Array.isArray(answer.answer)
          ? JSON.stringify(answer.answer)
          : answer.answer,
      }));

      const { error: answersError } = await supabase
        .from("user_answers")
        .insert(answersToInsert);

      if (answersError) throw answersError;

      return attempt as QuizAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts() });
      queryClient.invalidateQueries({ queryKey: quizKeys.results() });
      showSuccess("Quiz submitted successfully!");
    },
    onError: (error: Error) => {
      showError(error.message || "Failed to submit quiz");
    },
  });
}

