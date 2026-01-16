import { useParams, useNavigate } from "react-router-dom";
import { useAdminStore } from "./store/adminStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";

const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quizzes = useAdminStore(s => s.quizzes);
  const quiz = quizzes.find((q) => q.id === id);

  // Mock data for quiz details
  const quizStats = {
    totalCompletions: 28,
    completionTime: "12:45",
    averageScore: 78.5,
    topScore: 95,
  };

  const recentCompletions = [
    { student: "Alex Johnson", score: 85, timeSpent: "15:24", completed: "2 hours ago" },
    { student: "Emma Wilson", score: 92, timeSpent: "18:24", completed: "2 hours ago" },
    { student: "Michael Cohen", score: 92, timeSpent: "18:24", completed: "2 hours ago" },
    { student: "Sophia Garcia", score: 92, timeSpent: "18:24", completed: "2 hours ago" },
  ];

  const questionPerformance = [
    { question: "1. What is the basic unit of life?", score: 92 },
    { question: "2. Which organelle is responsible for...?", score: 92 },
    { question: "3. What is the process of cell division...?", score: 92 },
    { question: "4. Which of the following is NOT a...?", score: 92 },
    { question: "5. What is the main function of mito...?", score: 92 },
  ];

  if (!quiz) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-white">Quiz not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header with Back Button and Actions */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/admin/quizzes")}
              className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowBackIcon fontSize="small" />
              <span>Back to Quizzes</span>
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
                <p className="text-gray-400">{quiz.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  <EditIcon fontSize="small" />
                  <span>Edit</span>
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  <ShareIcon fontSize="small" />
                  <span>Share</span>
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  <VisibilityIcon fontSize="small" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <MenuBookIcon className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Completions</p>
              <p className="text-3xl font-bold text-white">{quizStats.totalCompletions}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <AccessTimeIcon className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Completion Time</p>
              <p className="text-3xl font-bold text-white">{quizStats.completionTime}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <PeopleIcon className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Average Score</p>
              <p className="text-3xl font-bold text-white">{quizStats.averageScore}%</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <BarChartIcon className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Top Score</p>
              <p className="text-3xl font-bold text-white">{quizStats.topScore}%</p>
            </div>
          </div>

          {/* Recent Completions Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Recent Completions</h2>
                <p className="text-gray-400 text-sm">Users who recently completed this quiz</p>
              </div>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                View All Results
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Time Spent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentCompletions.map((completion, index) => (
                    <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{completion.student}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{completion.score}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{completion.timeSpent}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{completion.completed}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Question Performance Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Question Performance</h2>
              <p className="text-gray-400 text-sm">How students performed on each question</p>
            </div>
            <div className="space-y-4">
              {questionPerformance.map((item, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{item.question}</p>
                    <span className="text-gray-300 font-semibold">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share This Quiz Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Share This Quiz</h2>
              <p className="text-gray-400 text-sm">Share this quiz with students or colleagues</p>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <ShareIcon fontSize="small" />
                <span>Share Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default QuizDetail;



