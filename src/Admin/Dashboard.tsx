import { useMemo, useCallback, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAdminStore } from "./store/adminStore";
import { useInfiniteLoopDetector } from "../utils/useInfiniteLoopDetector";
import { SEO } from "../components/SEO";
import { getBreadcrumbStructuredData } from "../utils/structuredData";
import { useNotification } from "../components/NotificationProvider";
import { getQuizzes, fallbackQuizzes } from "../lib/api/quizzes";
import { getStudents, getSummaryCards, fallbackStudents, fallbackSummaryCards } from "../lib/api/students";
import DashboardHeader from "./dashboard/DashboardHeader";
import SummaryCards from "./dashboard/SummaryCards";
import TopUsers from "./dashboard/TopUsers";
import RecentQuizzes from "./dashboard/RecentQuizzes";
import QuizCharts from "./dashboard/QuizCharts";
import CategorySnapshot from "./dashboard/CategorySnapshot";

const Dashboard = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  // Debug infinite loops in development
  // Hooks must be called unconditionally - the hook itself handles dev check
  useInfiniteLoopDetector("Dashboard");

  // Use individual selectors to avoid getSnapshot re-render issues
  const headerSearch = useAdminStore((s) => s.headerSearch);
  const setHeaderSearch = useAdminStore((s) => s.setHeaderSearch);
  const profile = useAdminStore((s) => s.profile);
  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);
  const showError = useCallback(
    (error: unknown, prefix: string) => {
      const message = error instanceof Error ? error.message : String(error);
      notify({ message: `${prefix}: ${message}`, severity: "error" });
    },
    [notify]
  );
  const {
    data: summaryCards = fallbackSummaryCards,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary-cards"],
    queryFn: getSummaryCards,
    placeholderData: fallbackSummaryCards,
    staleTime: 30_000,
  });
  const {
    data: topStudents = fallbackStudents,
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
    placeholderData: fallbackStudents,
    staleTime: 30_000,
  });
  const {
    data: quizzes = fallbackQuizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
    placeholderData: fallbackQuizzes,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (summaryError) showError(summaryError, "Summary failed");
  }, [showError, summaryError]);
  useEffect(() => {
    if (studentsError) showError(studentsError, "Students failed");
  }, [showError, studentsError]);
  useEffect(() => {
    if (quizzesError) showError(quizzesError, "Quizzes failed");
  }, [quizzesError, showError]);

  const recentQuizzes = useMemo(
    () => quizzes.filter((q) => q.completionRate !== undefined),
    [quizzes]
  );

  const breadcrumbs = getBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Dashboard", url: "/admin" },
  ]);

  const goToCreateQuiz = useCallback(() => {
    navigate("/admin/quizzes/create");
  }, [navigate]);

  const quizCountsByStatus = useMemo(
    () => [
      { label: "Published", value: quizzes.filter((q) => q.status === "Published").length },
      { label: "Drafts", value: quizzes.filter((q) => q.status === "Draft").length },
    ],
    [quizzes]
  );

  const completionsTrend = useMemo(
    () =>
      quizzes.slice(0, 6).map((q, idx) => ({
        label: `Q${idx + 1}`,
        value: q.completions,
      })),
    [quizzes]
  );

  const categoryStats = useMemo(() => {
    const map = new Map<string, { quizzes: number; questions: number; completions: number }>();
    quizzes.forEach((quiz) => {
      const name = quiz.category ?? "Uncategorized";
      const entry = map.get(name) ?? { quizzes: 0, questions: 0, completions: 0 };
      entry.quizzes += 1;
      entry.questions += quiz.questions ?? 0;
      entry.completions += quiz.completions ?? 0;
      map.set(name, entry);
    });
    return Array.from(map.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quizzes - a.quizzes || a.name.localeCompare(b.name));
  }, [quizzes]);

  const displayName = useMemo(() => {
    const nick = profile.nickName?.trim();
    if (nick) return nick;
    const first = profile.firstName?.trim();
    if (first) return first;
    const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
    if (name) return name;
    if (profile.email) return profile.email;
    return "there";
  }, [profile.email, profile.firstName, profile.lastName, profile.nickName]);

  const totalQuestions = useMemo(
    () => quizzes.reduce((sum, quiz) => sum + (quiz.questions ?? 0), 0),
    [quizzes]
  );
  const totalCompletions = useMemo(
    () => quizzes.reduce((sum, quiz) => sum + (quiz.completions ?? 0), 0),
    [quizzes]
  );

  const quickStats = useMemo(
    () => [
      { label: "Published", value: quizCountsByStatus.find((c) => c.label === "Published")?.value ?? 0, tone: "emerald" },
      { label: "Drafts", value: quizCountsByStatus.find((c) => c.label === "Drafts")?.value ?? 0, tone: "amber" },
      { label: "Categories", value: categoryStats.length, tone: "cyan" },
      { label: "Questions", value: totalQuestions, tone: "purple" },
      { label: "Completions", value: totalCompletions, tone: "blue" },
    ],
    [categoryStats.length, quizCountsByStatus, totalCompletions, totalQuestions]
  );

  return (
    <>
      <SEO
        title="Dashboard"
        description="View your quiz analytics, top users, and manage your quizzes from the dashboard."
        url="/admin"
        structuredData={breadcrumbs}
      />
      <DashboardHeader
        headerSearch={headerSearch}
        onSearchChange={setHeaderSearch}
        onCreateQuiz={goToCreateQuiz}
        onHome={goHome}
      />

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative">
          <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden>
            <div className="w-64 h-64 bg-purple-600/20 blur-3xl rounded-full absolute -top-10 -left-10" />
            <div className="w-72 h-72 bg-blue-500/10 blur-3xl rounded-full absolute bottom-0 right-0" />
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-purple-900/50 via-gray-900 to-gray-900 border border-purple-500/30 rounded-3xl shadow-2xl p-5 sm:p-7">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-purple-200 uppercase tracking-[0.2em]">Overview</p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow">
                    Welcome back, {displayName}
                    <span className="text-purple-200">.</span>
                  </h1>
                  <p className="text-gray-300 max-w-2xl">
                    Track quiz momentum, users, and categories at a glance. Fresh gradients and a tighter grid keep everything within reach.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/10">
                      {quizzes.length} quizzes
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/10">
                      {topStudents.length} top users
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/10">
                      {categoryStats.length} categories
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <button
                    onClick={goHome}
                    className="px-4 py-3 bg-gray-800/80 hover:bg-gray-700 text-white rounded-xl border border-gray-700 font-semibold transition-colors backdrop-blur"
                  >
                    Home
                  </button>
                  <button
                    onClick={goToCreateQuiz}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-purple-600/30"
                  >
                    Create New Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative space-y-5 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-5">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-lg"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-4 sm:p-5 shadow-2xl">
              <SummaryCards cards={summaryCards} loading={summaryLoading} />
            </div>

            <div className="grid auto-rows-[minmax(260px,auto)] gap-4 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4 sm:space-y-5">
                <div className="rounded-3xl border border-purple-500/25 bg-gradient-to-br from-purple-900/30 via-gray-900 to-gray-900 shadow-xl p-1.5">
                  <div className="rounded-2xl bg-gray-900">
                    <QuizCharts trend={completionsTrend} statusCounts={quizCountsByStatus} />
                  </div>
                </div>

                <div className="rounded-3xl border border-orange-500/25 bg-gradient-to-br from-orange-900/25 via-gray-900 to-gray-900 shadow-xl p-1.5">
                  <div className="rounded-2xl bg-gray-900">
                    <RecentQuizzes quizzes={recentQuizzes} loading={quizzesLoading} onCreate={goToCreateQuiz} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-900/25 via-gray-900 to-gray-900 shadow-xl p-1.5">
                  <div className="rounded-2xl bg-gray-900">
                    <CategorySnapshot categories={categoryStats} loading={quizzesLoading} />
                  </div>
                </div>

                <div className="rounded-3xl border border-blue-500/25 bg-gradient-to-br from-blue-900/25 via-gray-900 to-gray-900 shadow-xl p-1.5">
                  <div className="rounded-2xl bg-gray-900">
                    <TopUsers students={topStudents} loading={studentsLoading} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Dashboard);
