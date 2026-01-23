import type { Quiz } from "../../lib/api/types";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Odometer } from "../../components/Charts/Odometer";

type RecentQuizzesProps = {
  quizzes: Quiz[];
  loading: boolean;
  onCreate: () => void;
};

const RecentQuizzes = ({ quizzes, loading, onCreate }: RecentQuizzesProps) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-2">Recent Quizzes</h2>
      <p className="text-gray-400 text-sm">Your recently created quizzes</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {loading && <div className="text-gray-400 text-sm">Loading recent quizzes...</div>}
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-purple-500 transition-colors cursor-pointer relative group"
        >
          <ArrowForwardIcon className="absolute top-4 right-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
          <h3 className="text-white font-semibold mb-2 pr-8">{quiz.title}</h3>
          <div className="text-gray-400 text-sm mb-4 flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1">
              <Odometer value={quiz.questions} /> questions,
            </span>
            <span className="inline-flex items-center gap-1">
              <Odometer value={quiz.completions} /> completions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${quiz.completionRate}%` }}></div>
            </div>
            <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
              <Odometer value={quiz.completionRate ?? 0} suffix="%" />
            </span>
          </div>
        </div>
      ))}
      <div
        onClick={onCreate}
        className="bg-gray-700/30 rounded-lg p-4 border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[140px]"
      >
        <AddIcon className="text-4xl text-gray-400 mb-2" />
        <h3 className="text-white font-semibold mb-1">Create New Quiz</h3>
        <p className="text-gray-400 text-xs">Add questions, set time limits and more.</p>
      </div>
    </div>
  </div>
);

export default RecentQuizzes;
