import { create } from "zustand";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  correctAnswer: string; // ID of the correct option
  points: number;
}

interface CreateQuizState {
  // Quiz Details
  quizTitle: string;
  description: string;
  category: string;
  difficultyLevel: "Easy" | "Medium" | "Hard";

  // Quiz Settings
  timeLimit: number;
  passingScore: number;
  randomizeQuestions: boolean;
  immediateResults: boolean;

  // Questions
  questions: QuizQuestion[];

  // UI State
  showBulkModal: boolean;

  // Actions
  setQuizTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  setDifficultyLevel: (level: "Easy" | "Medium" | "Hard") => void;
  setTimeLimit: (minutes: number) => void;
  setPassingScore: (score: number) => void;
  setRandomizeQuestions: (value: boolean) => void;
  setImmediateResults: (value: boolean) => void;
  addQuestion: () => void;
  removeQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, updates: Partial<QuizQuestion>) => void;
  addOption: (questionId: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, text: string) => void;
  setCorrectAnswer: (questionId: string, optionId: string) => void;
  addBulkQuestions: (questions: QuizQuestion[]) => void;
  resetForm: () => void;
  setShowBulkModal: (show: boolean) => void;
}

export const useCreateQuizStore = create<CreateQuizState>((set) => ({
  // Initial state
  quizTitle: "Introduction to Environmental Science",
  description: "Test your knowledge about environmental science basics, including renewable energy, ecosystems, and sustainability.",
  category: "Science",
  difficultyLevel: "Medium",
  timeLimit: 15,
  passingScore: 70,
  randomizeQuestions: true,
  immediateResults: true,
  questions: [],
  showBulkModal: false,

  // Actions
  setQuizTitle: (value) =>
    set((state) =>
      state.quizTitle === value
        ? state
        : { quizTitle: value }
    ),
  setDescription: (value) =>
    set((state) =>
      state.description === value
        ? state
        : { description: value }
    ),
  setCategory: (value) =>
    set((state) =>
      state.category === value
        ? state
        : { category: value }
    ),
  setDifficultyLevel: (value) =>
    set((state) =>
      state.difficultyLevel === value
        ? state
        : { difficultyLevel: value }
    ),
  setTimeLimit: (value) =>
    set((state) =>
      state.timeLimit === value
        ? state
        : { timeLimit: value }
    ),
  setPassingScore: (value) =>
    set((state) =>
      state.passingScore === value
        ? state
        : { passingScore: value }
    ),
  setRandomizeQuestions: (value) =>
    set((state) =>
      state.randomizeQuestions === value
        ? state
        : { randomizeQuestions: value }
    ),
  setImmediateResults: (value) =>
    set((state) =>
      state.immediateResults === value
        ? state
        : { immediateResults: value }
    ),
  addQuestion: () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: "",
      options: [
        { id: `opt-${Date.now()}-1`, text: "" },
        { id: `opt-${Date.now()}-2`, text: "" },
      ],
      correctAnswer: "",
      points: 10,
    };
    set((state) => ({ questions: [...state.questions, newQuestion] }));
  },
  removeQuestion: (questionId) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== questionId),
    })),
  updateQuestion: (questionId, updates) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    })),
  addOption: (questionId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: `opt-${Date.now()}`, text: "" },
              ],
            }
          : q
      ),
    }));
  },
  removeOption: (questionId, optionId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((opt) => opt.id !== optionId),
              correctAnswer: q.correctAnswer === optionId ? "" : q.correctAnswer,
            }
          : q
      ),
    }));
  },
  updateOption: (questionId, optionId, text) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            }
          : q
      ),
    }));
  },
  setCorrectAnswer: (questionId, optionId) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, correctAnswer: optionId } : q
      ),
    }));
  },
  addBulkQuestions: (newQuestions) => {
    set((state) => ({
      questions: [...state.questions, ...newQuestions],
    }));
  },
  resetForm: () =>
    set({
      quizTitle: "",
      description: "",
      category: "Science",
      difficultyLevel: "Medium",
      timeLimit: 15,
      passingScore: 70,
      randomizeQuestions: true,
      immediateResults: true,
      questions: [],
      showBulkModal: false,
    }),
  setShowBulkModal: (value) =>
    set((state) =>
      state.showBulkModal === value
        ? state
        : { showBulkModal: value }
    ),
}));

