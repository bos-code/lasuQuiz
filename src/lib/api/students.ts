import { supabase } from "../supabaseClient";
import type { Student, SummaryCard } from "./types";
import { formatRelativeDate, mapSupabaseError } from "./utils";

type DbStudent = {
  id: string;
  name: string | null;
  subject: string | null;
  score: number | null;
  avatar: string | null;
  class: string | null;
  quizzes_taken?: number | null;
  average_score?: number | null;
  last_active?: string | null;
};

const mapStudent = (row: DbStudent): Student => ({
  id: row.id,
  name: row.name ?? "Student",
  subject: row.subject ?? "General",
  score: row.score ?? 0,
  avatar: row.avatar ?? "👤",
  class: row.class ?? "10A",
  quizzesTaken: row.quizzes_taken ?? 0,
  averageScore: row.average_score ?? 0,
  lastActive: formatRelativeDate(row.last_active),
});

export const getStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from("students")
    .select("id,name,subject,score,avatar,class,quizzes_taken,average_score,last_active")
    .order("last_active", { ascending: false });

  if (error) throw mapSupabaseError(error);
  if (!data) return fallbackStudents;
  return data.map(mapStudent);
};

export const getSummaryCards = async (): Promise<SummaryCard[]> => {
  const { data, error } = await supabase
    .from("admin_summary_cards")
    .select("title,value,change,icon,color")
    .order("title");

  if (error) throw mapSupabaseError(error);
  return data ?? fallbackSummaryCards;
};

export const fallbackStudents: Student[] = [
  { id: "1", name: "Alex Johnson", subject: "Science", score: 950, avatar: "👤", class: "10A", quizzesTaken: 12, averageScore: 85, lastActive: "2 hours ago" },
  { id: "2", name: "Emma Watson", subject: "Mathematics", score: 920, avatar: "👤", class: "10A", quizzesTaken: 15, averageScore: 92, lastActive: "1 hour ago" },
  { id: "3", name: "Michael Clark", subject: "Physics", score: 980, avatar: "👤", class: "10B", quizzesTaken: 18, averageScore: 88, lastActive: "30 minutes ago" },
  { id: "4", name: "Sophia Green", subject: "English", score: 890, avatar: "👤", class: "10A", quizzesTaken: 10, averageScore: 79, lastActive: "5 hours ago" },
  { id: "5", name: "Lucia Wilde", subject: "Science", score: 870, avatar: "👤", class: "10B", quizzesTaken: 14, averageScore: 83, lastActive: "3 hours ago" },
];

export const fallbackSummaryCards: SummaryCard[] = [
  { title: "Total Quizzes", value: "2,543", change: "+12.5%", icon: "📖", color: "purple" },
  { title: "Active Events", value: "2,543", change: "+12.5%", icon: "📅", color: "green" },
  { title: "Users", value: "2,543", change: "+12.5%", icon: "👥", color: "blue" },
  { title: "Avg. Completion", value: "2,543", change: "-12.5%", icon: "📊", color: "orange" },
];
