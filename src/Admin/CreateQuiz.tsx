import { useNavigate } from "react-router-dom";
import { useCreateQuizStore } from "./store/createQuizStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const {
    quizTitle,
    description,
    category,
    difficultyLevel,
    timeLimit,
    passingScore,
    randomizeQuestions,
    immediateResults,
    setQuizTitle,
    setDescription,
    setCategory,
    setDifficultyLevel,
    setTimeLimit,
    setPassingScore,
    setRandomizeQuestions,
    setImmediateResults,
  } = useCreateQuizStore();

  const categories = ["Science", "Mathematics", "History", "English", "Geography"];
  const difficultyLevels: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];

  const handleSaveDraft = () => {
    // Save draft logic here
    alert("Draft saved!");
  };

  const handlePreview = () => {
    // Preview logic here
    alert("Preview functionality");
  };

  const handleNext = () => {
    // Navigate to next step (e.g., add questions)
    navigate("/admin/quizzes/create/questions");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/admin/quizzes")}
              className="mb-4 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <ArrowBackIcon />
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Create New Quiz</h1>
                <p className="text-gray-400">Add questions, set answers and configure quiz settings</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Two Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Panel: Quiz Details */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Quiz Details</h2>
                <p className="text-gray-400 text-sm">Basic information about your quiz</p>
              </div>

              <div className="space-y-6">
                {/* Quiz Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Title</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter quiz title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Enter quiz description"
                  />
                </div>

                {/* Category and Difficulty Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <KeyboardArrowDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                    <div className="relative">
                      <select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value as "Easy" | "Medium" | "Hard")}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10"
                      >
                        {difficultyLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <KeyboardArrowDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Quiz Settings */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Quiz Settings</h2>
                <p className="text-gray-400 text-sm">Configure how your quiz works</p>
              </div>

              <div className="space-y-6">
                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Limit</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <AccessTimeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
                      <input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                    </div>
                    <span className="text-gray-400">minutes</span>
                  </div>
                </div>

                {/* Passing Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Passing Score</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <CheckCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
                      <input
                        type="number"
                        value={passingScore}
                        onChange={(e) => setPassingScore(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                        max="100"
                      />
                    </div>
                    <span className="text-gray-400">%</span>
                  </div>
                </div>

                {/* Randomize Questions */}
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white mb-1">Randomize Questions</label>
                    <p className="text-xs text-gray-400">Show questions in random order</p>
                  </div>
                  <button
                    onClick={() => setRandomizeQuestions(!randomizeQuestions)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      randomizeQuestions ? "bg-purple-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        randomizeQuestions ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>

                {/* Immediate Results */}
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white mb-1">Immediate Results</label>
                    <p className="text-xs text-gray-400">Show results for each question</p>
                  </div>
                  <button
                    onClick={() => setImmediateResults(!immediateResults)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      immediateResults ? "bg-purple-600" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        immediateResults ? "translate-x-7" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              disabled
              className="px-6 py-2 bg-gray-800 text-gray-500 rounded-lg font-medium cursor-not-allowed border border-gray-700"
            >
              &lt; Prev
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQuiz;




