export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: AnswerOption[];
  correctAnswer: string | string[];
  points: number;
  order: number;
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: UserAnswer[];
  startedAt: string;
  submittedAt?: string;
  score?: number;
  totalPoints?: number;
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  submittedAt: string;
  answers: UserAnswer[];
}



