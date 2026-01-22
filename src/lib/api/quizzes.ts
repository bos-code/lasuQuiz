import { supabase } from "../supabaseClient";
import type { Quiz, QuizStatus } from "./types";
import { formatRelativeDate, mapSupabaseError, normalizeStatus } from "./utils";

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
  const { data, error } = await supabase
    .from("quizzes")
    .select(
      "id,title,status,description,category,questions,duration,completions,completion_rate,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw mapSupabaseError(error);
  if (!data) return fallbackQuizzes;

  return data.map(mapQuiz);
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
