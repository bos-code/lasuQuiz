import { useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "./store/adminStore";
import { useInfiniteLoopDetector } from "../utils/useInfiniteLoopDetector";
import { SEO } from "../components/SEO";
import { getBreadcrumbStructuredData } from "../utils/structuredData";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

const Dashboard = () => {
  const navigate = useNavigate();
  // Debug infinite loops in development
  // Hooks must be called unconditionally - the hook itself handles dev check
  useInfiniteLoopDetector("Dashboard");

  // Use individual selectors to avoid getSnapshot re-render issues
  const headerSearch = useAdminStore((s) => s.headerSearch);
  const setHeaderSearch = useAdminStore((s) => s.setHeaderSearch);
  const summaryCards = useAdminStore((s) => s.summaryCards);
  const recentEvents = useAdminStore((s) => s.events);
  const topStudents = useAdminStore((s) => s.students);
  const quizzes = useAdminStore((s) => s.quizzes);

  const recentQuizzes = useMemo(
    () => quizzes.filter((q) => q.completionRate !== undefined),
    [quizzes]
  );

  const handleHeaderSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHeaderSearch(e.target.value);
    },
    [setHeaderSearch]
  );

  const iconMap = useMemo<
    Record<string, React.ComponentType<{ className?: string }>>
  >(
    () => ({
      "📖": MenuBookIcon,
      "📅": EventNoteIcon,
      "👥": PeopleIcon,
      "📊": BarChartIcon,
    }),
    []
  );

  const breadcrumbs = getBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Dashboard", url: "/admin" },
  ]);

  const goToCreateQuiz = useCallback(() => {
    navigate("/admin/quizzes/create");
  }, [navigate]);

  return (
    <>
      <SEO
        title="Dashboard"
        description="View your quiz analytics, recent events, top students, and manage your quizzes from the dashboard."
        url="/admin"
        structuredData={breadcrumbs}
      />
      {/* Top Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between">
        <div className="relative flex-1 max-w-md w-full sm:w-auto">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fontSize="small"
          />
          <input
            type="text"
            placeholder="Search..."
            value={headerSearch}
            onChange={handleHeaderSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>
        <button
          onClick={goToCreateQuiz}
          className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <AddIcon fontSize="small" />
          <span>Create Quiz</span>
        </button>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                Welcome back, Sarah! Here's what's happening with your quizzes.
              </p>
            </div>
            <button
              onClick={goToCreateQuiz}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <AddIcon fontSize="small" />
              <span>Create New Quiz</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {summaryCards.map((card, index) => {
              const borderColor =
                card.color === "purple"
                  ? "border-purple-500/50"
                  : card.color === "green"
                    ? "border-green-500/50"
                    : card.color === "blue"
                      ? "border-blue-500/50"
                      : card.color === "orange"
                        ? "border-orange-500/50"
                        : "";
              const IconComponent = iconMap[card.icon] || MenuBookIcon;
              return (
                <div
                  key={index}
                  className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${borderColor}`}
                >
                  <div className="flex items-start justify-between">
                    <IconComponent className="text-4xl mb-4 text-gray-300" />
                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                      <p className="text-2xl font-bold text-white mb-1">
                        {card.value}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          card.change.startsWith("-")
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {card.change}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Recent Events */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">
                  Recent Events
                </h2>
                <p className="text-gray-400 text-sm">
                  Manage your upcoming and active quiz events
                </p>
              </div>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4 border border-gray-600"
                  >
                    <EventIcon className="text-3xl text-gray-300" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">
                        {event.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-1">{event.date}</p>
                      <p className="text-gray-400 text-sm">
                        {event.participants} participants
                      </p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        event.isLive
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-600 hover:bg-gray-500 text-white"
                      }`}
                    >
                      {event.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Students */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">
                  Top Students
                </h2>
                <p className="text-gray-400 text-sm">
                  Students with highest quiz scores
                </p>
              </div>
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4 border border-gray-600"
                  >
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <PeopleIcon className="text-2xl text-gray-300" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {student.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{student.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <EmojiEventsIcon className="text-xl text-yellow-400" />
                      <span className="text-white font-bold">
                        {student.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Recent Quizzes
              </h2>
              <p className="text-gray-400 text-sm">
                Your recently created quizzes
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-purple-500 transition-colors cursor-pointer relative group"
                >
                  <ArrowForwardIcon className="absolute top-4 right-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  <h3 className="text-white font-semibold mb-2 pr-8">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {quiz.questions} questions, {quiz.completions} completions
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${quiz.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      {quiz.completionRate}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="bg-gray-700/30 rounded-lg p-4 border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[140px]">
                <AddIcon className="text-4xl text-gray-400 mb-2" />
                <h3 className="text-white font-semibold mb-1">
                  Create New Quiz
                </h3>
                <p className="text-gray-400 text-xs">
                  Add questions, set time limits and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Dashboard);
