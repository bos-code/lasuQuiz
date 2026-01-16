import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "./store/quizStore";
import { SEO } from "../../components/SEO";
import { getQuizStructuredData } from "../../utils/structuredData";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FlagIcon from "@mui/icons-material/Flag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentQuestionIndex,
    selectedAnswer,
    score,
    lives,
    questions,
    quizTitle,
    selectAnswer,
    nextQuestion,
    skipQuestion,
    updateTimeRemaining,
  } = useQuizStore();

  const [timer, setTimer] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const progressPercentage = Math.round(progress);

  useEffect(() => {
    if (currentQuestion?.timeLimit) {
      setTimer(currentQuestion.timeLimit);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentQuestionIndex, currentQuestion]);

  useEffect(() => {
    updateTimeRemaining(timer);
  }, [timer, updateTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const quizStructuredData = quizTitle
    ? getQuizStructuredData({
        title: quizTitle,
        description: `Take the ${quizTitle} quiz`,
        id: id || "",
        questions: questions.length,
      })
    : undefined;

  if (!currentQuestion || questions.length === 0) {
    return (
      <>
        <SEO
          title="Quiz Not Found"
          description="The quiz you're looking for doesn't exist or is no longer available."
          url={`/quiz/${id}`}
        />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xl">Quiz not found or no questions available</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={quizTitle || "Take Quiz"}
        description={`Take the ${quizTitle || "quiz"} - ${totalQuestions} questions. Test your knowledge and track your progress.`}
        url={`/quiz/${id}`}
        structuredData={quizStructuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Quiz Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <ArrowBackIcon />
              </button>
              <h1 className="text-2xl font-bold">{quizTitle}</h1>
              <div className="text-sm font-medium">{progressPercentage}% Complete</div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="px-4 py-2 bg-purple-600 rounded-full text-sm font-medium">
                  {currentQuestion.points} points
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <AccessTimeIcon fontSize="small" />
                    <span className="font-mono">{formatTime(timer)}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold leading-relaxed">{currentQuestion.question}</h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAnswer === index
                      ? "border-purple-600 bg-purple-600/10"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        selectedAnswer === index
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={skipQuestion}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2 border border-gray-700"
              >
                <FlagIcon fontSize="small" />
                <span>Skip</span>
              </button>
              <button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Next Question &gt;
              </button>
            </div>
          </div>

          {/* Quiz Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-6">
              <h3 className="text-xl font-bold mb-6">Quiz Stats</h3>
              <div className="space-y-4">
                {/* Score */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-sm text-gray-400 mb-1">Score</p>
                  <p className="text-2xl font-bold text-purple-400">{score}</p>
                </div>

                {/* Lives */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-sm text-gray-400 mb-2">Lives</p>
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <FavoriteIcon
                        key={index}
                        className={`${index < lives ? "text-red-500" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-sm text-gray-400 mb-1">Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {currentQuestionIndex + 1}/{totalQuestions}
                  </p>
                </div>

                {/* Position */}
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <p className="text-sm text-gray-400 mb-1">Position</p>
                  <p className="text-2xl font-bold text-purple-400">2nd</p>
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

export default QuizPage;
