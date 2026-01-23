export type QuizStatus = "Published" | "Draft";

export type Quiz = {
  id: string;
  title: string;
  status: QuizStatus;
  description: string;
  category?: string;
  questions: number;
  duration: number;
  completions: number;
  created: string;
  completionRate?: number;
};

export type Student = {
  id: string;
  name: string;
  subject: string;
  score: number;
  avatar: string;
  gender?: "male" | "female" | null;
  quizzesTaken: number;
  averageScore: number;
  lastActive: string;
};

export type SummaryCard = {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: "purple" | "green" | "blue" | "orange";
};
