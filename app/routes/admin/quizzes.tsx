import type { Route } from "./+types/quizzes";
import { requireAdmin } from "../../lib/utils/route-guards";

export function meta() {
  return [
    { title: "Manage Quizzes - LASU Quiz" },
    { name: "description", content: "Admin quiz management" },
  ];
}

export async function loader() {
  await requireAdmin();
  // In a real app, fetch quizzes from Supabase
  return {
    quizzes: [
      { id: "1", title: "Introduction to Programming", questions: 10, createdAt: "2024-01-15" },
      { id: "2", title: "Data Structures", questions: 15, createdAt: "2024-01-20" },
    ],
  };
}

export default function AdminQuizzes({ loaderData }: Route.ComponentProps) {
  const { quizzes } = loaderData;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Quizzes</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create, edit, and manage quizzes
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Create New Quiz
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {quiz.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {quiz.questions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {quiz.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-4">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 dark:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



