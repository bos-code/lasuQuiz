import axios from "axios";
import type { Student, SummaryCard } from "./types";
import { formatRelativeDate } from "./utils";

type DbStudent = {
  id: string;
  name: string | null;
  subject: string | null;
  score: number | null;
  avatar: string | null;
  gender: string | null;
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
  gender: row.gender === "male" || row.gender === "female" ? row.gender : null,
  quizzesTaken: row.quizzes_taken ?? 0,
  averageScore: row.average_score ?? 0,
  lastActive: formatRelativeDate(row.last_active),
});

export const getStudents = async (): Promise<Student[]> => {
  const { data } = await axios.get<DbStudent[] | { error: unknown }>("/api/students");
  if (!Array.isArray(data)) {
    throw new Error("Invalid students response");
  }
  return data.length ? data.map(mapStudent) : fallbackStudents;
};

export const getSummaryCards = async (): Promise<SummaryCard[]> => {
  const { data } = await axios.get<SummaryCard[] | { error: unknown }>("/api/summary-cards");
  if (!Array.isArray(data)) {
    throw new Error("Invalid summary cards response");
  }
  return data.length ? data : fallbackSummaryCards;
};

export const fallbackStudents: Student[] = [
  { id: "1", name: "Alex Johnson", subject: "Science", score: 950, avatar: "👤", gender: "male", quizzesTaken: 12, averageScore: 85, lastActive: "2 hours ago" },
  { id: "2", name: "Emma Watson", subject: "Mathematics", score: 920, avatar: "👤", gender: "female", quizzesTaken: 15, averageScore: 92, lastActive: "1 hour ago" },
  { id: "3", name: "Michael Clark", subject: "Physics", score: 980, avatar: "👤", gender: "male", quizzesTaken: 18, averageScore: 88, lastActive: "30 minutes ago" },
  { id: "4", name: "Sophia Green", subject: "English", score: 890, avatar: "👤", gender: "female", quizzesTaken: 10, averageScore: 79, lastActive: "5 hours ago" },
  { id: "5", name: "Lucia Wilde", subject: "Science", score: 870, avatar: "👤", gender: "female", quizzesTaken: 14, averageScore: 83, lastActive: "3 hours ago" },
];

export const fallbackSummaryCards: SummaryCard[] = [
  { title: "Total Quizzes", value: "2,543", change: "+12.5%", icon: "📖", color: "purple" },
  { title: "Active Events", value: "2,543", change: "+12.5%", icon: "📅", color: "green" },
  { title: "Users", value: "2,543", change: "+12.5%", icon: "👥", color: "blue" },
  { title: "Avg. Completion", value: "2,543", change: "-12.5%", icon: "📊", color: "orange" },
];
