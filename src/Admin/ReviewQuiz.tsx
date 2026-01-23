import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateQuizStore } from "./store/createQuizStore";
import { createQuizWithQuestions } from "../lib/api/quizzes";
import QuizPreviewModal from "./QuizPreviewModal";
import { useNotification } from "../components/NotificationProvider";
import { useInfiniteLoopDetector } from "../utils/useInfiniteLoopDetector";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuizIcon from "@mui/icons-material/Quiz";
import ShuffleIcon from "@mui/icons-material/Shuffle";

const ReviewQuiz = () => {
  useInfiniteLoopDetector("ReviewQuiz");

  const navigate = useNavigate();
  const notify = useNotification();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState<"draft" | "publish" | null>(null);
  const queryClient = useQueryClient();

  const quizTitle = useCreateQuizStore((s) => s.quizTitle);
  const description = useCreateQuizStore((s) => s.description);
  const category = useCreateQuizStore((s) => s.category);
  const difficultyLevel = useCreateQuizStore((s) => s.difficultyLevel);
  const timeLimit = useCreateQuizStore((s) => s.timeLimit);
  const passingScore = useCreateQuizStore((s) => s.passingScore);
  const randomizeQuestions = useCreateQuizStore((s) => s.randomizeQuestions);
  const immediateResults = useCreateQuizStore((s) => s.immediateResults);
  const questions = useCreateQuizStore((s) => s.questions);
  const resetForm = useCreateQuizStore((s) => s.resetForm);

  const totalPoints = useMemo(
    () => questions.reduce((sum, question) => sum + (question.points || 0), 0),
    [questions]
  );

  const persistQuiz = useCallback(
    async (status: "Published" | "Draft") => {
      if (!quizTitle.trim()) {
        notify({ message: "Please add a quiz title before continuing.", severity: "warning" });
        return;
      }
      if (questions.length === 0) {
        notify({ message: "Add at least one question first.", severity: "warning" });
        return;
      }

      setSubmitting(status === "Published" ? "publish" : "draft");
      try {
        await createQuizWithQuestions({
          title: quizTitle,
          description,
          category,
          status,
          duration: timeLimit,
          passingScore,
          randomizeQuestions,
          immediateResults,
          difficultyLevel: difficultyLevel,
          questions,
        });

        await queryClient.invalidateQueries({ queryKey: ["quizzes"] });
        resetForm();
        notify({
          message: status === "Published" ? "Quiz published to Supabase." : "Draft saved to Supabase.",
          severity: "success",
        });
        navigate("/admin/quizzes");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        notify({ message: `Save failed: ${message}`, severity: "error" });
      } finally {
        setSubmitting(null);
      }
    },
    [
      category,
      description,
      difficultyLevel,
      immediateResults,
      navigate,
      notify,
      passingScore,
      queryClient,
      questions,
      quizTitle,
      randomizeQuestions,
      resetForm,
      timeLimit,
    ]
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/quizzes/create/questions")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowBackIcon fontSize="small" />
              <span>Back to Questions</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => persistQuiz("Draft")}
                disabled={submitting !== null}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {submitting === "draft" ? "Saving..." : "Save Draft"}
              </button>
              <button
                onClick={() => setPreviewOpen(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 border border-gray-700"
              >
                <VisibilityIcon fontSize="small" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => persistQuiz("Published")}
                disabled={submitting !== null}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <PublishIcon fontSize="small" />
                <span>{submitting === "publish" ? "Publishing..." : "Publish Quiz"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Review</p>
                    <h1 className="text-3xl font-bold text-white">
                      {quizTitle || "Untitled quiz"}
                    </h1>
                    {description && <p className="text-gray-300 mt-2">{description}</p>}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border border-purple-600/60 bg-purple-600/10 text-purple-200">
                    {difficultyLevel} • {category}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetaItem icon={<MenuBookIcon />} label="Questions" value={`${questions.length} items`} />
                  <MetaItem icon={<AccessTimeIcon />} label="Time Limit" value={`${timeLimit} min`} />
                  <MetaItem icon={<QuizIcon />} label="Passing Score" value={`${passingScore}%`} />
                  <MetaItem icon={<ShuffleIcon />} label="Randomize" value={randomizeQuestions ? "On" : "Off"} />
                  <MetaItem icon={<CheckCircleIcon />} label="Immediate Results" value={immediateResults ? "Enabled" : "Disabled"} />
                  <MetaItem icon={<QuizIcon />} label="Total Points" value={`${totalPoints} pts`} />
                </div>
              </div>

              {/* Questions Review */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Question Set</h2>
                    <p className="text-gray-400 text-sm">
                      Double-check questions, answers, and scoring before publishing.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/quizzes/create/questions")}
                    className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    Edit Questions
                  </button>
                </div>

                {questions.length === 0 ? (
                  <div className="border border-gray-700 rounded-lg p-6 text-center text-gray-400 bg-gray-900/70">
                    No questions added yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="border border-gray-700 rounded-lg p-4 bg-gray-900/60"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-start gap-3">
                            <span className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-200 flex items-center justify-center font-semibold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-white font-semibold">
                                {question.question || "Untitled question"}
                              </p>
                              <p className="text-gray-400 text-sm mt-1">
                                {question.points} pts
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            Correct answer:{" "}
                            {question.options.find((opt) => opt.id === question.correctAnswer)?.text ||
                              "Not set"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, optIndex) => {
                            const isCorrect = option.id === question.correctAnswer;
                            return (
                              <div
                                key={option.id}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                                  isCorrect
                                    ? "border-green-500/50 bg-green-500/10 text-green-200"
                                    : "border-gray-700 bg-gray-800 text-gray-200"
                                }`}
                              >
                                <span className="text-xs font-semibold text-gray-400">
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span>{option.text || "Untitled option"}</span>
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

            {/* Side Panel */}
            <div className="space-y-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-semibold text-white">Checklist</h3>
                <ChecklistItem
                  label="Quiz has a title"
                  complete={Boolean(quizTitle.trim())}
                />
                <ChecklistItem
                  label="At least one question added"
                  complete={questions.length > 0}
                />
                <ChecklistItem
                  label="Correct answers selected"
                  complete={questions.every((q) => Boolean(q.correctAnswer))}
                />
                <ChecklistItem
                  label="Passing score set"
                  complete={passingScore >= 0}
                />
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
                <h3 className="text-lg font-semibold text-white">Next Steps</h3>
                <p className="text-gray-400 text-sm">
                  Publish to make the quiz available to students. You can always edit later.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => persistQuiz("Published")}
                    disabled={submitting !== null}
                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <PublishIcon fontSize="small" />
                    <span>{submitting === "publish" ? "Publishing..." : "Publish Now"}</span>
                  </button>
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700 flex items-center justify-center gap-2"
                  >
                    <VisibilityIcon fontSize="small" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => persistQuiz("Draft")}
                    disabled={submitting !== null}
                    className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors border border-gray-700"
                  >
                    {submitting === "draft" ? "Saving..." : "Save as Draft"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuizPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
};

export default ReviewQuiz;

const MetaItem = ({ icon, label, value }: { icon: ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-700 rounded-lg">
    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  </div>
);

const ChecklistItem = ({ label, complete }: { label: string; complete: boolean }) => (
  <div className="flex items-center gap-2 text-sm">
    <span
      className={`w-5 h-5 rounded-full flex items-center justify-center ${
        complete ? "bg-green-500/20 text-green-300 border border-green-500/40" : "bg-gray-700 text-gray-300 border border-gray-600"
      }`}
    >
      <CheckCircleIcon fontSize="small" sx={{ fontSize: 16 }} />
    </span>
    <span className={complete ? "text-gray-200" : "text-gray-400"}>{label}</span>
  </div>
);
