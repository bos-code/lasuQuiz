import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { requireStudent } from "../../lib/utils/route-guards";

export function meta() {
  return [
    { title: "Student Dashboard - LASU Quiz" },
    { name: "description", content: "Student dashboard" },
  ];
}

export async function loader() {
  await requireStudent();
  // In a real app, you'd fetch available quizzes here
  return {
    quizzes: [
      { id: "1", title: "Introduction to Programming", description: "Basic programming concepts" },
      { id: "2", title: "Data Structures", description: "Arrays, lists, and trees" },
    ],
  };
}

export default function StudentDashboard({ loaderData }: Route.ComponentProps) {
  const { quizzes } = loaderData;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Select a quiz to begin or view your results
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {quiz.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{quiz.description}</p>
            <Link
              to={`/student/quiz/${quiz.id}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Start Quiz
            </Link>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No quizzes available at the moment.</p>
        </div>
      )}
    </div>
  );
}



