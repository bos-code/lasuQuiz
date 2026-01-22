import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNotification } from "../components/NotificationProvider";
import { getQuizzes, fallbackQuizzes } from "../lib/api/quizzes";
import { useAdminStore } from "./store/adminStore";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Quizzes = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const { data: quizzes = fallbackQuizzes, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
    placeholderData: fallbackQuizzes,
    staleTime: 30_000,
    onError: (error) => {
      notify({ message: `Unable to load quizzes: ${(error as Error).message}`, severity: "error" });
    },
  });
  
  // Select primitives individually to keep getSnapshot stable
  const activeQuizTab = useAdminStore((s) => s.activeQuizTab);
  const setActiveQuizTab = useAdminStore((s) => s.setActiveQuizTab);
  const quizSearch = useAdminStore((s) => s.quizSearch);
  const setQuizSearch = useAdminStore((s) => s.setQuizSearch);
  const selectedCategory = useAdminStore((s) => s.selectedCategory);
  const setSelectedCategory = useAdminStore((s) => s.setSelectedCategory);

  // Memoize filtered quizzes to prevent infinite loop
  // Don't include getFilteredQuizzes in deps - it's stable, but we depend on the actual values
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;

    // Filter by tab
    if (activeQuizTab !== "All Quizzes") {
      filtered = filtered.filter((q) => q.status === activeQuizTab);
    }

    // Filter by search
    if (quizSearch) {
      const searchLower = quizSearch.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchLower) ||
          q.description.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (q) => (q.category ?? "Uncategorized") === selectedCategory
      );
    }

    return filtered;
  }, [quizzes, activeQuizTab, quizSearch, selectedCategory]);

  const tabs: ("All Quizzes" | "Published" | "Drafts")[] = ["All Quizzes", "Published", "Drafts"];
  const categories = useMemo(() => {
    const unique = new Set<string>(["All Categories"]);
    quizzes.forEach((quiz) => {
      unique.add(quiz.category ?? "Uncategorized");
    });
    return Array.from(unique);
  }, [quizzes]);
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    quizzes.forEach((quiz) => {
      const name = quiz.category ?? "Uncategorized";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    counts.set("All Categories", quizzes.length);
    return counts;
  }, [quizzes]);

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Quizzes</h1>
              <p className="text-gray-400">Create, manage and analyze your quizzes</p>
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <Link
                    key={category}
                    to={
                      category === "All Categories"
                        ? "/admin/categories"
                        : `/admin/categories/${encodeURIComponent(category)}`
                    }
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isActive
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-gray-800 text-gray-300 border-gray-700 hover:border-purple-400/60"
                    }`}
                  >
                    {category} {categoryCounts.get(category) ? `(${categoryCounts.get(category)})` : ""}
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => navigate("/admin/quizzes/create")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <AddIcon fontSize="small" />
              <span>Create New Quiz</span>
            </button>
          </div>

          {/* Quiz Library Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Quiz Library</h2>
              <p className="text-gray-400 text-sm mb-4">Browse and manage all your quizzes</p>

            {/* Filters and Search */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Tabs */}
              <div className="flex gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveQuizTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeQuizTab === tab
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                  <FilterListIcon fontSize="small" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-white appearance-none pr-6"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-gray-900">
                        {category}
                      </option>
                    ))}
                  </select>
                  <KeyboardArrowDownIcon className="text-gray-400 pointer-events-none" fontSize="small" />
                </div>
                {selectedCategory !== "All Categories" && (
                  <Link
                    to={`/admin/categories/${encodeURIComponent(selectedCategory)}`}
                    className="absolute right-0 -bottom-7 text-xs text-purple-300 hover:text-purple-200 underline"
                  >
                    Open {selectedCategory} topics
                  </Link>
                )}
              </div>
            </div>

            {/* Quiz List */}
            <div className="space-y-4">
              {isLoading && <div className="text-gray-400 text-sm">Loading quizzes...</div>}
              {!isLoading && filteredQuizzes.length === 0 && (
                <div className="text-gray-400 text-sm">No quizzes found.</div>
              )}
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Quiz Icon */}
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MenuBookIcon className="text-white text-xl" />
                    </div>

                    {/* Quiz Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            quiz.status === "Published"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          }`}
                        >
                          {quiz.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{quiz.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span className="px-2 py-1 rounded-full bg-gray-700 text-gray-200">
                          {quiz.category ?? "Uncategorized"}
                        </span>
                        <Link
                          to={`/admin/categories/${encodeURIComponent(quiz.category ?? "Uncategorized")}`}
                          className="underline hover:text-purple-200 text-purple-300"
                        >
                          View category
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <MenuBookIcon fontSize="small" />
                          <span>{quiz.questions} questions</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <AccessTimeIcon fontSize="small" />
                          <span>{quiz.duration} min</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <PeopleIcon fontSize="small" />
                          <span>{quiz.completions} completions</span>
                        </span>
                        <span>{quiz.created}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                      <button className="w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors">
                        <MoreVertIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quizzes;
