import { useMemo, useCallback } from "react";
import { useAdminStore } from "./store/adminStore";
import { useNavigate } from "react-router-dom";
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
  
  // Select primitives individually to keep getSnapshot stable
  const activeQuizTab = useAdminStore((s) => s.activeQuizTab);
  const setActiveQuizTab = useAdminStore((s) => s.setActiveQuizTab);
  const quizSearch = useAdminStore((s) => s.quizSearch);
  const setQuizSearch = useAdminStore((s) => s.setQuizSearch);
  const selectedCategory = useAdminStore((s) => s.selectedCategory);
  const setSelectedCategory = useAdminStore((s) => s.setSelectedCategory);
  const quizzes = useAdminStore((s) => s.quizzes);

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

    return filtered;
  }, [quizzes, activeQuizTab, quizSearch]);

  const tabs: ("All Quizzes" | "Published" | "Drafts")[] = ["All Quizzes", "Published", "Drafts"];

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
              <button
                onClick={() => setSelectedCategory(selectedCategory === "All Categories" ? "Science" : "All Categories")}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FilterListIcon fontSize="small" />
                <span>{selectedCategory}</span>
                <KeyboardArrowDownIcon className="text-gray-400" fontSize="small" />
              </button>
            </div>

            {/* Quiz List */}
            <div className="space-y-4">
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
