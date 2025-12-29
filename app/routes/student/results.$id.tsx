import { useLoaderData } from "react-router";
import type { Route } from "./+types/results.$id";
import { requireStudent } from "../../lib/utils/route-guards";
import { Link } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Quiz Results ${params.id} - LASU Quiz` },
    { name: "description", content: "View your quiz results" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  await requireStudent();
  
  // In a real app, fetch results from Supabase
  const attemptId = params.id;
  
  // Mock results data
  return {
    result: {
      attemptId,
      quizId: "1",
      quizTitle: "Sample Quiz",
      score: 8,
      totalPoints: 10,
      percentage: 80,
      submittedAt: new Date().toISOString(),
      answers: [
        { questionId: "1", answer: "a", isCorrect: true },
      ],
    },
  };
}

export default function Results({ loaderData }: Route.ComponentProps) {
  const { result } = loaderData;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{result.quizTitle}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {result.score}/{result.totalPoints}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {result.percentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Percentage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.percentage >= 70 ? "Pass" : "Fail"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Answer Review
            </h2>
            <div className="space-y-4">
              {result.answers.map((answer, index) => (
                <div
                  key={answer.questionId}
                  className={`p-4 rounded ${
                    answer.isCorrect
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Question {index + 1}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        answer.isCorrect
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Your answer: {answer.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/student/dashboard"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}



