import { create } from "zustand";

// Types
interface Quiz {
  id: string;
  title: string;
  status: "Published" | "Draft";
  description: string;
  questions: number;
  duration: number;
  completions: number;
  created: string;
  completionRate?: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  participants: number;
  action: string;
  isLive: boolean;
}

interface Student {
  id: string;
  name: string;
  subject: string;
  score: number;
  avatar: string;
  class: string;
  quizzesTaken: number;
  averageScore: number;
  lastActive: string;
}

interface SummaryCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: "purple" | "green" | "blue" | "orange";
}

interface AdminState {
  // Search states
  sidebarSearch: string;
  headerSearch: string;
  quizSearch: string;

  // Quiz filter states
  activeQuizTab: "All Quizzes" | "Published" | "Drafts";
  selectedCategory: string;

  // Student filter states
  activeStudentTab: "All Students" | "10A" | "10B";
  studentSearch: string;
  studentSortBy: string;

  // Settings states
  activeSettingsTab: "Profile" | "Account" | "Notifications" | "Appearance" | "Privacy" | "Billing";

  // UI States
  mobileOpen: boolean;
  sidebarCollapsed: boolean;
  profileModalOpen: boolean;
  userDetailModalOpen: boolean;
  selectedUser: Student | null;
  showBulkModal: boolean;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    bio: string;
    profilePicture?: string;
  };
  account: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    googleConnected: boolean;
  };
  appearance: {
    theme: "System" | "Light" | "Dark";
    language: string;
    fontSize: "Small" | "Medium" | "Large";
    colorScheme: "Purple" | "Blue" | "Green" | "Orange" | "Pink" | "Red";
  };

  // Data
  quizzes: Quiz[];
  events: Event[];
  students: Student[];
  summaryCards: SummaryCard[];

  // Actions
  setSidebarSearch: (search: string) => void;
  setHeaderSearch: (search: string) => void;
  setQuizSearch: (search: string) => void;
  setActiveQuizTab: (tab: "All Quizzes" | "Published" | "Drafts") => void;
  setSelectedCategory: (category: string) => void;
  setActiveStudentTab: (tab: "All Students" | "10A" | "10B") => void;
  setStudentSearch: (search: string) => void;
  setStudentSortBy: (sortBy: string) => void;
  setActiveSettingsTab: (tab: "Profile" | "Account" | "Notifications" | "Appearance" | "Privacy" | "Billing") => void;
  
  // UI Actions
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setProfileModalOpen: (open: boolean) => void;
  setUserDetailModalOpen: (open: boolean) => void;
  setSelectedUser: (user: Student | null) => void;
  setShowBulkModal: (show: boolean) => void;
  updateProfile: (updates: Partial<AdminState["profile"]>) => void;
  updateAccount: (updates: Partial<AdminState["account"]>) => void;
  toggleGoogleConnection: () => void;
  updateAppearance: (updates: Partial<AdminState["appearance"]>) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  setEvents: (events: Event[]) => void;
  setStudents: (students: Student[]) => void;
  setSummaryCards: (cards: SummaryCard[]) => void;
  getFilteredQuizzes: () => Quiz[];
  getFilteredStudents: () => Student[];
}

// Initial data
const initialQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Introduction to Biology",
    status: "Published",
    description: "Basic concepts of biology for beginners",
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
    questions: 20,
    duration: 30,
    completions: 0,
    created: "Created yesterday",
    completionRate: 90,
  },
];

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Science Mid-term Quiz",
    date: "Today, 2:30 PM",
    participants: 32,
    action: "View Live",
    isLive: true,
  },
  {
    id: "2",
    title: "Mathematics Weekly Test",
    date: "Tomorrow, 10:00 AM",
    participants: 28,
    action: "Manage",
    isLive: false,
  },
  {
    id: "3",
    title: "History Final Exam",
    date: "May 20, 9:00 AM",
    participants: 45,
    action: "Manage",
    isLive: false,
  },
];

const initialStudents: Student[] = [
  { id: "1", name: "Alex Johnson", subject: "Science", score: 950, avatar: "👤", class: "10A", quizzesTaken: 12, averageScore: 85, lastActive: "2 hours ago" },
  { id: "2", name: "Emma Watson", subject: "Mathematics", score: 920, avatar: "👤", class: "10A", quizzesTaken: 15, averageScore: 92, lastActive: "1 hour ago" },
  { id: "3", name: "Michael Clark", subject: "Physics", score: 980, avatar: "👤", class: "10B", quizzesTaken: 18, averageScore: 88, lastActive: "30 minutes ago" },
  { id: "4", name: "Sophia Green", subject: "English", score: 890, avatar: "👤", class: "10A", quizzesTaken: 10, averageScore: 79, lastActive: "5 hours ago" },
  { id: "5", name: "Lucia Wilde", subject: "Science", score: 870, avatar: "👤", class: "10B", quizzesTaken: 14, averageScore: 83, lastActive: "3 hours ago" },
];

const initialSummaryCards: SummaryCard[] = [
  { title: "Total Quizzes", value: "2,543", change: "+12.5%", icon: "📖", color: "purple" },
  { title: "Active Events", value: "2,543", change: "+12.5%", icon: "📅", color: "green" },
  { title: "Students", value: "2,543", change: "+12.5%", icon: "👥", color: "blue" },
  { title: "Avg. Completion", value: "2,543", change: "-12.5%", icon: "📊", color: "orange" },
];

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  sidebarSearch: "",
  headerSearch: "",
  quizSearch: "",
  activeQuizTab: "All Quizzes",
  selectedCategory: "All Categories",
  activeStudentTab: "All Students",
  studentSearch: "",
  studentSortBy: "Name",
  activeSettingsTab: "Profile",
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    role: "Teacher",
    bio: "Science teacher with 10+ years of experience. Passionate about making learning fun and engaging through interactive quizzes",
  },
  account: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    googleConnected: false,
  },
  appearance: {
    theme: "Dark",
    language: "English",
    fontSize: "Medium",
    colorScheme: "Purple",
  },
  // UI States - Initial values
  mobileOpen: false,
  sidebarCollapsed: false,
  profileModalOpen: false,
  userDetailModalOpen: false,
  selectedUser: null,
  showBulkModal: false,
  quizzes: initialQuizzes,
  events: initialEvents,
  students: initialStudents,
  summaryCards: initialSummaryCards,

  // Actions
  setSidebarSearch: (value) =>
    set((state) =>
      state.sidebarSearch === value
        ? state
        : { sidebarSearch: value }
    ),
  setHeaderSearch: (value) =>
    set((state) =>
      state.headerSearch === value
        ? state
        : { headerSearch: value }
    ),
  setQuizSearch: (value) =>
    set((state) =>
      state.quizSearch === value
        ? state
        : { quizSearch: value }
    ),
  setActiveQuizTab: (value) =>
    set((state) =>
      state.activeQuizTab === value
        ? state
        : { activeQuizTab: value }
    ),
  setSelectedCategory: (value) =>
    set((state) =>
      state.selectedCategory === value
        ? state
        : { selectedCategory: value }
    ),
  setActiveStudentTab: (value) =>
    set((state) =>
      state.activeStudentTab === value
        ? state
        : { activeStudentTab: value }
    ),
  setStudentSearch: (value) =>
    set((state) =>
      state.studentSearch === value
        ? state
        : { studentSearch: value }
    ),
  setStudentSortBy: (value) =>
    set((state) =>
      state.studentSortBy === value
        ? state
        : { studentSortBy: value }
    ),
  setActiveSettingsTab: (value) =>
    set((state) =>
      state.activeSettingsTab === value
        ? state
        : { activeSettingsTab: value }
    ),
  updateProfile: (updates) => set((state) => ({ profile: { ...state.profile, ...updates } })),
  updateAccount: (updates) => set((state) => ({ account: { ...state.account, ...updates } })),
  toggleGoogleConnection: () => set((state) => ({ account: { ...state.account, googleConnected: !state.account.googleConnected } })),
  updateAppearance: (updates) => set((state) => ({ appearance: { ...state.appearance, ...updates } })),
  setQuizzes: (quizzes) => set({ quizzes }),
  addQuiz: (quiz) => set((state) => ({ quizzes: [...state.quizzes, quiz] })),
  updateQuiz: (id, updates) =>
    set((state) => ({
      quizzes: state.quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    })),
  deleteQuiz: (id) =>
    set((state) => ({
      quizzes: state.quizzes.filter((q) => q.id !== id),
    })),
  setEvents: (events) => set({ events }),
  setStudents: (students) => set({ students }),
  setSummaryCards: (cards) => set({ summaryCards: cards }),

  // UI Actions
  setMobileOpen: (value) =>
    set((state) =>
      state.mobileOpen === value
        ? state
        : { mobileOpen: value }
    ),
  toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  setSidebarCollapsed: (value) =>
    set((state) =>
      state.sidebarCollapsed === value
        ? state
        : { sidebarCollapsed: value }
    ),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setProfileModalOpen: (value) =>
    set((state) =>
      state.profileModalOpen === value
        ? state
        : { profileModalOpen: value }
    ),
  setUserDetailModalOpen: (value) =>
    set((state) =>
      state.userDetailModalOpen === value
        ? state
        : { userDetailModalOpen: value }
    ),
  setSelectedUser: (value) =>
    set((state) =>
      state.selectedUser === value
        ? state
        : { selectedUser: value }
    ),
  setShowBulkModal: (value) =>
    set((state) =>
      state.showBulkModal === value
        ? state
        : { showBulkModal: value }
    ),

  // Computed
  getFilteredQuizzes: () => {
    const state = get();
    let filtered = state.quizzes;

    // Filter by tab
    if (state.activeQuizTab !== "All Quizzes") {
      filtered = filtered.filter((q) => q.status === state.activeQuizTab);
    }

    // Filter by search
    if (state.quizSearch) {
      const searchLower = state.quizSearch.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchLower) ||
          q.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  },
  getFilteredStudents: () => {
    const state = get();
    let filtered = state.students;

    // Filter by tab
    if (state.activeStudentTab !== "All Students") {
      filtered = filtered.filter((s) => s.class === state.activeStudentTab);
    }

    // Filter by search
    if (state.studentSearch) {
      const searchLower = state.studentSearch.toLowerCase();
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.class.toLowerCase().includes(searchLower)
      );
    }

    // Sort by selected field
    if (state.studentSortBy === "Name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.studentSortBy === "Class") {
      filtered = [...filtered].sort((a, b) => a.class.localeCompare(b.class));
    } else if (state.studentSortBy === "Average Score") {
      filtered = [...filtered].sort((a, b) => b.averageScore - a.averageScore);
    }

    return filtered;
  },
}));

