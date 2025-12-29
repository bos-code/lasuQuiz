import type { Route } from "./+types/dashboard";
import { requireAdmin } from "../../lib/utils/route-guards";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Admin Dashboard - LASU Quiz" },
    { name: "description", content: "Admin dashboard" },
  ];
}

export async function loader() {
  await requireAdmin();
  // In a real app, fetch statistics from Supabase
  return {
    stats: {
      totalQuizzes: 12,
      totalStudents: 150,
      totalAttempts: 450,
      averageScore: 75,
    },
  };
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const { stats } = loaderData;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of quiz application statistics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalQuizzes}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Quizzes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalStudents}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Students</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalAttempts}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quiz Attempts</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.averageScore}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average Score</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <Link
            to="/admin/quizzes"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Manage Quizzes
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}



