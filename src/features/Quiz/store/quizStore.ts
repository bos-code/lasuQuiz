import { create } from "zustand";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit?: number;
}

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  score: number;
  lives: number;
  questions: Question[];
  timeRemaining: number;
  quizTitle: string;
  startTime: number | null;
  answers: Record<number, number>; // question index -> selected answer index

  // Actions
  setQuestions: (questions: Question[]) => void;
  setQuizTitle: (title: string) => void;
  selectAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  skipQuestion: () => void;
  startQuiz: () => void;
  resetQuiz: () => void;
  updateTimeRemaining: (time: number) => void;
}

const initialQuestions: Question[] = [
  {
    id: "1",
    question:
      "Which of the following energy sources cannot be replenished naturally on a human timescale, making it an example of a non-renewable resource?",
    options: [
      "Solar Power",
      "Wind Power",
      "Natural Gas",
      "Hydroelectric Power",
    ],
    correctAnswer: 2,
    points: 100,
    difficulty: "Medium",
  },
];

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestionIndex: 0,
  selectedAnswer: null,
  score: 0,
  lives: 3,
  questions: initialQuestions,
  timeRemaining: 0,
  quizTitle: "Science & Technology Quiz",
  startTime: null,
  answers: {},

  setQuestions: (questions) => set({ questions }),
  setQuizTitle: (title) => set({ quizTitle: title }),
  selectAnswer: (answerIndex) => set({ selectedAnswer: answerIndex }),
  nextQuestion: () => {
    const state = get();
    const currentAnswer = state.selectedAnswer;
    const currentQuestion = state.questions[state.currentQuestionIndex];

    // Save answer
    const newAnswers = {
      ...state.answers,
      [state.currentQuestionIndex]: currentAnswer || -1,
    };

    // Check if correct and update score
    let newScore = state.score;
    if (currentAnswer === currentQuestion.correctAnswer) {
      newScore += currentQuestion.points;
    } else if (currentAnswer !== null) {
      // Wrong answer loses a life
      const newLives = Math.max(0, state.lives - 1);
      set({ lives: newLives });
    }

    // Move to next question
    if (state.currentQuestionIndex < state.questions.length - 1) {
      set({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedAnswer: null,
        score: newScore,
        answers: newAnswers,
      });
    }
  },
  skipQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex < state.questions.length - 1) {
      set({
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedAnswer: null,
      });
    }
  },
  startQuiz: () => set({ startTime: Date.now() }),
  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      lives: 3,
      answers: {},
      startTime: null,
    }),
  updateTimeRemaining: (time) => set({ timeRemaining: time }),
}));








