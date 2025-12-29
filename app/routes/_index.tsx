import type { Route } from "./+types/_index";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "LASU Quiz App - Home" },
    { name: "description", content: "Welcome to the Computer Science Quiz Application" },
  ];
}

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl w-full mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Welcome to LASU Quiz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Computer Science Department Quiz Application
          </p>

          <div className="flex gap-4 justify-center mt-12">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



