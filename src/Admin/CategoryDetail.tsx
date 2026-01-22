import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Add as AddIcon,
  Quiz as QuizIcon,
  QueryBuilder as QueryBuilderIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { getQuizzes, fallbackQuizzes } from "../lib/api/quizzes";
import { useCreateQuizStore } from "./store/createQuizStore";

const CategoryDetail = () => {
  const navigate = useNavigate();
  const { category: rawCategory } = useParams();
  const category = rawCategory ? decodeURIComponent(rawCategory) : "All Categories";
  const { setCategory } = useCreateQuizStore();

  const { data: quizzes = fallbackQuizzes, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
    placeholderData: fallbackQuizzes,
    staleTime: 30_000,
  });

  const categoryQuizzes = useMemo(
    () =>
      quizzes.filter(
        (quiz) => (quiz.category ?? "Uncategorized") === category
      ),
    [category, quizzes]
  );

  const quizCount = categoryQuizzes.length;
  const totalQuestions = categoryQuizzes.reduce((sum, quiz) => sum + (quiz.questions ?? 0), 0);
  const totalCompletions = categoryQuizzes.reduce((sum, quiz) => sum + (quiz.completions ?? 0), 0);

  const handleCreate = () => {
    setCategory(category === "All Categories" ? "" : category);
    navigate("/admin/quizzes/create");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/quizzes"
              className="text-gray-400 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowBackIosNewIcon fontSize="small" />
              Back to Quizzes
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{category}</h1>
              <p className="text-gray-400">Topics and questions for this category</p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <AddIcon fontSize="small" />
            <span>Create quiz in {category}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
            <QuizIcon className="text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Quizzes</p>
              <p className="text-white text-2xl font-semibold">{quizCount}</p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
            <QueryBuilderIcon className="text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Questions</p>
              <p className="text-white text-2xl font-semibold">{totalQuestions}</p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
            <GroupsIcon className="text-green-400" />
            <div>
              <p className="text-gray-400 text-sm">Completions</p>
              <p className="text-white text-2xl font-semibold">{totalCompletions}</p>
            </div>
          </div>
        </div>

        {/* Topics (quizzes) */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Topics</h2>
              <p className="text-gray-400 text-sm">Quizzes grouped under this category</p>
            </div>
          </div>

          {isLoading && <div className="text-gray-400 text-sm">Loading category...</div>}
          {!isLoading && categoryQuizzes.length === 0 && (
            <div className="text-gray-400 text-sm">
              No quizzes found in this category yet.
            </div>
          )}

          <div className="space-y-4">
            {categoryQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-900/60 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                        Topic
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${
                          quiz.status === "Published"
                            ? "bg-green-500/10 text-green-300 border-green-500/30"
                            : "bg-orange-500/10 text-orange-300 border-orange-500/30"
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </div>
                    <h3 className="text-white text-lg font-semibold">{quiz.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{quiz.description}</p>
                    <div className="flex items-center gap-4 text-gray-300 text-sm">
                      <span>{quiz.questions} questions</span>
                      <span>•</span>
                      <span>{quiz.duration} mins</span>
                      <span>•</span>
                      <span>{quiz.completions} completions</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}
                    className="text-sm text-purple-300 hover:text-purple-200 underline"
                  >
                    View quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
