import { create } from "zustand";

// Types
interface Quiz {
  id: string;
  title: string;
  status: "Published" | "Draft";
  description: string;
  category?: string;
  questions: number;
  duration: number;
  completions: number;
  created: string;
  completionRate?: number;
}

interface Student {
  id: string;
  name: string;
  subject: string;
  score: number;
  avatar: string;
  gender?: "male" | "female" | null;
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

interface NotificationSettings {
  emailAlerts: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
  reminders: boolean;
}

interface PrivacySettings {
  profileVisibility: "Public" | "Organization" | "Private";
  showActivityStatus: boolean;
  searchIndexing: boolean;
  dataSharing: boolean;
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
  activeStudentTab: "All Students" | "male" | "female";
  studentSearch: string;
  studentSortBy: "Name" | "Gender" | "Average Score";

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
    nickName?: string;
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
    fontSize: "Small" | "Medium" | "Large";
    colorScheme: "Purple" | "Blue" | "Green" | "Orange" | "Pink" | "Red";
  };
  notifications: NotificationSettings;
  privacy: PrivacySettings;

  // Data
  quizzes: Quiz[];
  students: Student[];
  summaryCards: SummaryCard[];

  // Actions
  setSidebarSearch: (search: string) => void;
  setHeaderSearch: (search: string) => void;
  setQuizSearch: (search: string) => void;
  setActiveQuizTab: (tab: "All Quizzes" | "Published" | "Drafts") => void;
  setSelectedCategory: (category: string) => void;
  setActiveStudentTab: (tab: "All Students" | "male" | "female") => void;
  setStudentSearch: (search: string) => void;
  setStudentSortBy: (sortBy: "Name" | "Gender" | "Average Score") => void;
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
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updatePrivacy: (updates: Partial<PrivacySettings>) => void;
  setQuizzes: (quizzes: Quiz[]) => void;
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
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

const initialStudents: Student[] = [
  { id: "1", name: "Alex Johnson", subject: "Science", score: 950, avatar: "👤", gender: "male", quizzesTaken: 12, averageScore: 85, lastActive: "2 hours ago" },
  { id: "2", name: "Emma Watson", subject: "Mathematics", score: 920, avatar: "👤", gender: "female", quizzesTaken: 15, averageScore: 92, lastActive: "1 hour ago" },
  { id: "3", name: "Michael Clark", subject: "Physics", score: 980, avatar: "👤", gender: "male", quizzesTaken: 18, averageScore: 88, lastActive: "30 minutes ago" },
  { id: "4", name: "Sophia Green", subject: "English", score: 890, avatar: "👤", gender: "female", quizzesTaken: 10, averageScore: 79, lastActive: "5 hours ago" },
  { id: "5", name: "Lucia Wilde", subject: "Science", score: 870, avatar: "👤", gender: "female", quizzesTaken: 14, averageScore: 83, lastActive: "3 hours ago" },
];

const initialSummaryCards: SummaryCard[] = [
  { title: "Total Quizzes", value: "2,543", change: "+12.5%", icon: "📖", color: "purple" },
  { title: "Active Events", value: "2,543", change: "+12.5%", icon: "📅", color: "green" },
  { title: "Users", value: "2,543", change: "+12.5%", icon: "👥", color: "blue" },
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
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    bio: "",
  },
  account: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    googleConnected: false,
  },
  appearance: {
    theme: "Dark",
    fontSize: "Medium",
    colorScheme: "Purple",
  },
  notifications: {
    emailAlerts: true,
    pushAlerts: true,
    weeklyDigest: false,
    productUpdates: true,
    reminders: true,
  },
  privacy: {
    profileVisibility: "Organization",
    showActivityStatus: true,
    searchIndexing: false,
    dataSharing: true,
  },
  // UI States - Initial values
  mobileOpen: false,
  sidebarCollapsed: true,
  profileModalOpen: false,
  userDetailModalOpen: false,
  selectedUser: null,
  showBulkModal: false,
  quizzes: initialQuizzes,
  events: [],
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
  updateNotifications: (updates) => set((state) => ({ notifications: { ...state.notifications, ...updates } })),
  updatePrivacy: (updates) => set((state) => ({ privacy: { ...state.privacy, ...updates } })),
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
      filtered = filtered.filter((s) => s.gender === state.activeStudentTab);
    }

    // Filter by search
    if (state.studentSearch) {
      const searchLower = state.studentSearch.toLowerCase();
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchLower) ||
        (s.gender ?? "").toLowerCase().includes(searchLower)
      );
    }

    // Sort by selected field
    if (state.studentSortBy === "Name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.studentSortBy === "Gender") {
      filtered = [...filtered].sort((a, b) => (a.gender ?? "").localeCompare(b.gender ?? ""));
    } else if (state.studentSortBy === "Average Score") {
      filtered = [...filtered].sort((a, b) => b.averageScore - a.averageScore);
    }

    return filtered;
  },
}));
