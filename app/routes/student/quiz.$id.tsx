import { Form, useLoaderData, useNavigation } from "react-router";
import type { Route } from "./+types/quiz.$id";
import { requireStudent } from "../../lib/utils/route-guards";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Quiz ${params.id} - LASU Quiz` },
    { name: "description", content: "Take the quiz" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  await requireStudent();
  
  // In a real app, fetch quiz data from Supabase
  const quizId = params.id;
  
  // Mock quiz data
  return {
    quiz: {
      id: quizId,
      title: "Sample Quiz",
      description: "This is a sample quiz",
      duration: 30,
      questions: [
        {
          id: "1",
          text: "What is React?",
          type: "multiple-choice",
          options: [
            { id: "a", text: "A library" },
            { id: "b", text: "A framework" },
            { id: "c", text: "A language" },
          ],
          correctAnswer: "a",
          points: 10,
        },
      ],
    },
  };
}

export default function Quiz({ loaderData }: Route.ComponentProps) {
  const { quiz } = loaderData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{quiz.description}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Duration: {quiz.duration} minutes
        </p>
      </div>

      <Form method="post" className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {index + 1}. {question.text}
            </h3>

            {question.type === "multiple-choice" && question.options && (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      className="mr-3"
                      required
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </Form>
    </div>
  );
}



