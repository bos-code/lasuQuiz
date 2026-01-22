import CategoryIcon from "@mui/icons-material/Category";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { useCreateQuizStore } from "../store/createQuizStore";

type CategorySnapshotProps = {
  categories: { name: string; quizzes: number; questions: number; completions: number }[];
  loading: boolean;
};

const CategorySnapshot = ({ categories, loading }: CategorySnapshotProps) => {
  const navigate = useNavigate();
  const { setCategory } = useCreateQuizStore();

  const top = categories.slice(0, 4);

  const startCreate = (category: string) => {
    setCategory(category === "Uncategorized" ? "" : category);
    navigate("/admin/quizzes/create");
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <CategoryIcon />
          <span>Categories overview</span>
        </div>
        <Link
          to="/admin/categories"
          className="text-sm text-purple-300 hover:text-purple-200 inline-flex items-center gap-1"
        >
          View all
          <ArrowForwardIosIcon fontSize="inherit" />
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Loading categories...</div>
      ) : top.length === 0 ? (
        <div className="text-gray-400 text-sm">No categories yet. Create your first quiz to get started.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {top.map((cat) => (
            <div key={cat.name} className="p-4 rounded-lg border border-gray-700 bg-gray-900/50">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold">
                    {cat.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.quizzes} quiz{cat.quizzes === 1 ? "" : "zes"}</p>
                  </div>
                </div>
                <button
                  onClick={() => startCreate(cat.name)}
                  className="px-2.5 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <AddIcon fontSize="inherit" />
                  <span>Add quiz</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <span>{cat.questions} questions</span>
                <span>•</span>
                <span>{cat.completions} completions</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySnapshot;
