import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getQuizzes, fallbackQuizzes } from "../lib/api/quizzes";
import { useNotification } from "../components/NotificationProvider";
import { useCreateQuizStore } from "./store/createQuizStore";

type CategoryStat = {
  name: string;
  quizCount: number;
  questionCount: number;
  completions: number;
};

const Categories = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const { setCategory } = useCreateQuizStore();

  const { data: quizzes = fallbackQuizzes, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
    placeholderData: fallbackQuizzes,
    staleTime: 30_000,
    onError: (error) => notify({ message: `Unable to load quizzes: ${(error as Error).message}`, severity: "error" }),
  });

  const categories = useMemo<CategoryStat[]>(() => {
    const map = new Map<string, CategoryStat>();

    quizzes.forEach((quiz) => {
      const name = quiz.category ?? "Uncategorized";
      const entry = map.get(name) ?? { name, quizCount: 0, questionCount: 0, completions: 0 };
      entry.quizCount += 1;
      entry.questionCount += quiz.questions ?? 0;
      entry.completions += quiz.completions ?? 0;
      map.set(name, entry);
    });

    return Array.from(map.values()).sort((a, b) => b.quizCount - a.quizCount || a.name.localeCompare(b.name));
  }, [quizzes]);

  const handleCreate = (category: string) => {
    setCategory(category === "Uncategorized" ? "" : category);
    navigate("/admin/quizzes/create");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Categories</h1>
            <p className="text-gray-400">Browse quiz categories, topics, and questions.</p>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-200">
              <CategoryIcon />
              <span>All Categories</span>
            </div>
            <span className="text-sm text-gray-400">{categories.length} total</span>
          </div>

          {isLoading ? (
            <div className="p-6 text-gray-400">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-gray-400">No categories yet.</div>
          ) : (
            <div className="divide-y divide-gray-700">
              {categories.map((category) => (
                <div key={category.name} className="p-4 flex items-center gap-4 hover:bg-gray-750/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {category.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/categories/${encodeURIComponent(category.name)}`}
                        className="text-white font-semibold hover:underline truncate"
                      >
                        {category.name}
                      </Link>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-200">
                        {category.quizCount} quiz{category.quizCount === 1 ? "" : "zes"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {category.questionCount} questions • {category.completions} completions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCreate(category.name)}
                      className="px-3 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      <AddIcon fontSize="small" />
                      <span>Create quiz</span>
                    </button>
                    <Link
                      to={`/admin/categories/${encodeURIComponent(category.name)}`}
                      className="text-purple-300 hover:text-purple-200 inline-flex items-center gap-1 text-sm"
                    >
                      View
                      <ArrowForwardIosIcon fontSize="inherit" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
