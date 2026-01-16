import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCreateQuizStore } from "./store/createQuizStore";

interface QuizPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

const QuizPreviewModal = ({ open, onClose }: QuizPreviewModalProps) => {
  const quizTitle = useCreateQuizStore((s) => s.quizTitle);
  const description = useCreateQuizStore((s) => s.description);
  const category = useCreateQuizStore((s) => s.category);
  const difficultyLevel = useCreateQuizStore((s) => s.difficultyLevel);
  const timeLimit = useCreateQuizStore((s) => s.timeLimit);
  const passingScore = useCreateQuizStore((s) => s.passingScore);
  const randomizeQuestions = useCreateQuizStore((s) => s.randomizeQuestions);
  const immediateResults = useCreateQuizStore((s) => s.immediateResults);
  const questions = useCreateQuizStore((s) => s.questions);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        role="presentation"
      />

      <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-2 text-white font-semibold">
            <VisibilityIcon fontSize="small" />
            <span>Preview Quiz</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-300 transition-colors"
            aria-label="Close preview"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <p className="text-sm text-gray-400 mb-1">Title</p>
            <h2 className="text-2xl font-bold text-white">{quizTitle || "Untitled quiz"}</h2>
            {description && (
              <p className="text-gray-300 mt-2">{description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetaPill label="Category" value={category} />
            <MetaPill label="Difficulty" value={difficultyLevel} />
            <MetaPill label="Time Limit" value={`${timeLimit} min`} />
            <MetaPill label="Passing Score" value={`${passingScore}%`} />
            <MetaPill label="Randomize Questions" value={randomizeQuestions ? "On" : "Off"} />
            <MetaPill label="Immediate Results" value={immediateResults ? "On" : "Off"} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Questions</h3>
              <span className="text-sm text-gray-400">{questions.length} item(s)</span>
            </div>

            {questions.length === 0 ? (
              <div className="p-6 border border-gray-700 rounded-lg text-center text-gray-400 bg-gray-800/60">
                No questions added yet. Add questions to see them here.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/60"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-semibold text-purple-400">
                          Q{index + 1}
                        </span>
                        <p className="text-white font-medium leading-relaxed">
                          {q.question || "Untitled question"}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-700/70 px-2 py-1 rounded">
                        {q.points} pts
                      </span>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isCorrect = opt.id === q.correctAnswer;
                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                              isCorrect
                                ? "border-green-500/50 bg-green-500/10 text-green-200"
                                : "border-gray-700 bg-gray-800 text-gray-200"
                            }`}
                          >
                            <span className="text-xs font-semibold text-gray-400">
                              {String.fromCharCode(65 + q.options.indexOf(opt))}
                            </span>
                            <span>{opt.text || "Untitled option"}</span>
                            {isCorrect && (
                              <span className="ml-auto text-xs font-semibold">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPreviewModal;

const MetaPill = ({ label, value }: { label: string; value: string | number }) => (
  <div className="border border-gray-700 rounded-lg px-3 py-2 bg-gray-800/70">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-semibold text-white">{value}</p>
  </div>
);
