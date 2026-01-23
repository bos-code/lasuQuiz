import axios from "axios";
import { supabase } from "../supabaseClient";
import type { Quiz, QuizStatus } from "./types";
import { formatRelativeDate, mapSupabaseError, normalizeStatus } from "./utils";
type NewQuestionOption = {
  id: string;
  text: string;
};

const cryptoRandomFallback = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export type NewQuizQuestion = {
  id: string;
  question: string;
  options: NewQuestionOption[];
  correctAnswer: string; // option id
  points: number;
  difficulty?: "Easy" | "Medium" | "Hard";
  timeLimitSeconds?: number | null;
};

export type CreateQuizPayload = {
  title: string;
  description?: string;
  category?: string;
  status: QuizStatus;
  duration: number; // minutes
  passingScore?: number;
  randomizeQuestions?: boolean;
  immediateResults?: boolean;
  difficultyLevel?: "Easy" | "Medium" | "Hard";
  questions: NewQuizQuestion[];
};

type DbQuiz = {
  id: string;
  title: string;
  status: string | null;
  description: string | null;
  category?: string | null;
  questions: number | null;
  duration: number | null;
  completions: number | null;
  completion_rate?: number | null;
  created_at?: string | null;
};

const mapQuiz = (row: DbQuiz): Quiz => ({
  id: row.id,
  title: row.title ?? "Untitled quiz",
  status: normalizeStatus(row.status),
  description: row.description ?? "",
  category: row.category ?? undefined,
  questions: row.questions ?? 0,
  duration: row.duration ?? 0,
  completions: row.completions ?? 0,
  created: formatRelativeDate(row.created_at),
  completionRate: row.completion_rate ?? undefined,
});

export const getQuizzes = async (): Promise<Quiz[]> => {
  const { data } = await axios.get<DbQuiz[] | { error: unknown }>("/api/quizzes");
  if (!Array.isArray(data)) {
    throw new Error("Invalid quizzes response");
  }
  return data.length ? data.map(mapQuiz) : fallbackQuizzes;
};

export const getQuiz = async (id: string): Promise<Quiz | null> => {
  const { data, error } = await supabase
    .from("quizzes")
    .select(
      "id,title,status,description,category,questions,duration,completions,completion_rate,created_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  return data ? mapQuiz(data) : null;
};

export const upsertQuiz = async (payload: {
  id?: string;
  title: string;
  description: string;
  category?: string;
  status: QuizStatus;
  questions: number;
  duration: number;
  completions?: number;
  completionRate?: number;
}) => {
  const { error, data } = await supabase
    .from("quizzes")
    .upsert(
      [
        {
          id: payload.id,
          title: payload.title,
          description: payload.description,
          category: payload.category,
          status: payload.status,
          questions: payload.questions,
          duration: payload.duration,
          completions: payload.completions ?? 0,
          completion_rate: payload.completionRate ?? null,
        },
      ],
      { onConflict: "id" }
    )
    .select()
    .maybeSingle();

  if (error) throw mapSupabaseError(error);
  if (!data) throw new Error("Quiz was not returned from Supabase");

  return mapQuiz(data);
};

export const deleteQuiz = async (id: string) => {
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) throw mapSupabaseError(error);
};

/**
 * Creates a quiz along with its questions and options in Supabase.
 * Returns the persisted quiz id.
 */
export const createQuizWithQuestions = async (payload: CreateQuizPayload) => {
  if (!payload.title.trim()) throw new Error("Quiz title is required.");
  if (!payload.questions.length) throw new Error("Add at least one question.");

  const newId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : cryptoRandomFallback();

  // 1) Insert quiz
  const quizInsert = {
    id: newId,
    title: payload.title,
    description: payload.description ?? null,
    category: payload.category ?? null,
    status: payload.status,
    duration: payload.duration,
    passing_score: payload.passingScore ?? 70,
    randomize_questions: payload.randomizeQuestions ?? true,
    immediate_results: payload.immediateResults ?? true,
    difficulty: payload.difficultyLevel ?? "Medium",
    questions: payload.questions.length,
    completions: 0,
    completion_rate: null,
  };

  const { data: quizRow, error: quizError } = await supabase
    .from("quizzes")
    .insert(quizInsert)
    .select("id")
    .single();

  if (quizError || !quizRow) throw mapSupabaseError(quizError);
  const quizId = quizRow.id as string;

  try {
    // 2) Insert questions
    const questionRows = payload.questions.map((q, idx) => ({
      quiz_id: quizId,
      body: q.question,
      points: q.points ?? 0,
      order_index: idx + 1,
      difficulty: q.difficulty ?? payload.difficultyLevel ?? "Medium",
      time_limit_seconds: q.timeLimitSeconds ?? null,
    }));

    const { data: insertedQuestions, error: questionError } = await supabase
      .from("quiz_questions")
      .insert(questionRows)
      .select("id, order_index");

    if (questionError || !insertedQuestions?.length) throw mapSupabaseError(questionError);

    // Align inserted questions back to source via order_index (not by returned order)
    const questionIdByOrder = new Map<number, string>(
      insertedQuestions.map((row: any) => [row.order_index as number, row.id as string])
    );

    // 3) Insert options
    const optionRows = payload.questions.flatMap((original, qIndex) => {
      const questionId = questionIdByOrder.get(qIndex + 1);
      if (!questionId) throw new Error("Question id mapping failed");
      return original.options.map((opt, optIndex) => ({
        question_id: questionId,
        label: String.fromCharCode(65 + optIndex),
        text: opt.text,
        is_correct: opt.id === original.correctAnswer,
        order_index: optIndex + 1,
      }));
    });

    const { error: optionError } = await supabase.from("quiz_options").insert(optionRows);
    if (optionError) throw mapSupabaseError(optionError);
  } catch (error) {
    // Best-effort cleanup on failure
    await supabase.from("quizzes").delete().eq("id", quizId);
    throw error;
  }

  return quizId;
};

export const fallbackQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Introduction to Biology",
    status: "Published",
    description: "Basic concepts of biology for beginners",
    category: "Science",
    questions: 15,
    duration: 20,
    completions: 32,
    created: "Created just now",
    completionRate: 75,
  },
  {
    id: "2",
    title: "Advanced Mathematics",
    status: "Published",
    description: "Complex mathematical problems and solutions",
    category: "Mathematics",
    questions: 25,
    duration: 45,
    completions: 28,
    created: "Created 2 hours ago",
    completionRate: 40,
  },
  {
    id: "3",
    title: "Chemistry Fundamentals",
    status: "Draft",
    description: "Introduction to chemical reactions and compounds",
    category: "Chemistry",
    questions: 20,
    duration: 30,
    completions: 0,
    created: "Created yesterday",
    completionRate: 90,
  },
];
