import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateQuizStore, type QuizQuestion } from "./store/createQuizStore";
import QuizPreviewModal from "./QuizPreviewModal";
import { useNotification } from "../components/NotificationProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const AddQuestions = () => {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const notify = useNotification();
  const showBulkModal = useCreateQuizStore(s => s.showBulkModal);
  const setShowBulkModal = useCreateQuizStore(s => s.setShowBulkModal);
  const [bulkText, setBulkText] = useState("");
  const {
    quizTitle,
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
    setCorrectAnswer,
    addBulkQuestions,
  } = useCreateQuizStore();

  const handleSaveDraft = () => {
    notify({ message: "Draft saved!", severity: "success" });
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handlePrev = () => {
    navigate("/admin/quizzes/create");
  };

  const handleNext = () => {
    // Navigate to next step (e.g., review/publish)
    navigate("/admin/quizzes/create/review");
  };

  const handleBulkAdd = () => {
    setShowBulkModal(true);
  };

  const parseBulkQuestions = (text: string): QuizQuestion[] => {
    if (!text || !text.trim()) {
      return [];
    }
    
    const lines = text.split("\n").filter((line) => line.trim());
    const parsedQuestions: QuizQuestion[] = [];
    let currentQuestion: Partial<QuizQuestion> | null = null;
    let currentOptions: { id: string; text: string }[] = [];
    let questionNumber = questions.length + 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line is a question (starts with number or Q)
      if (/^\d+\.|^Q\d+\.|^Question\s+\d+/i.test(line)) {
        // Save previous question if exists
        if (currentQuestion && currentOptions.length >= 2) {
          parsedQuestions.push({
            id: `q-${Date.now()}-${questionNumber}`,
            question: currentQuestion.question || "",
            options: currentOptions,
            correctAnswer: currentQuestion.correctAnswer || currentOptions[0]?.id || "",
            points: currentQuestion.points || 10,
          });
          questionNumber++;
        }

        // Start new question
        const questionText = line.replace(/^\d+\.|^Q\d+\.|^Question\s+\d+/i, "").trim();
        currentQuestion = {
          question: questionText,
          points: 10,
        };
        currentOptions = [];
      }
      // Check if line is an option (starts with A, B, C, D or a, b, c, d)
      else if (/^[A-Da-d][\.\)]\s*/.test(line)) {
        const optionText = line.replace(/^[A-Da-d][\.\)]\s*/, "").trim();
        if (optionText) {
          currentOptions.push({
            id: `opt-${Date.now()}-${currentOptions.length}`,
            text: optionText,
          });
        }
      }
      // Check if line indicates correct answer (starts with "Correct:" or "Answer:")
      else if (/^(Correct|Answer):\s*[A-Da-d]/i.test(line)) {
        const match = line.match(/^(Correct|Answer):\s*([A-Da-d])/i);
        if (match && currentQuestion) {
          const answerIndex = match[2].toUpperCase().charCodeAt(0) - 65;
          if (currentOptions[answerIndex]) {
            currentQuestion.correctAnswer = currentOptions[answerIndex].id;
          }
        }
      }
      // Otherwise, treat as continuation of question or option
      else if (line) {
        if (currentQuestion && !currentQuestion.question) {
          currentQuestion.question = line;
        } else if (currentOptions.length > 0) {
          // Append to last option
          const lastOption = currentOptions[currentOptions.length - 1];
          lastOption.text += " " + line;
        }
      }
    }

    // Save last question
    if (currentQuestion && currentOptions.length >= 2) {
      parsedQuestions.push({
        id: `q-${Date.now()}-${questionNumber}`,
        question: currentQuestion.question || "",
        options: currentOptions,
        correctAnswer: currentQuestion.correctAnswer || currentOptions[0]?.id || "",
        points: currentQuestion.points || 10,
      });
    }

    return parsedQuestions;
  };

  const handleBulkSubmit = () => {
    if (!bulkText.trim()) {
      notify({ message: "Please enter questions in the text area", severity: "warning" });
      return;
    }

    try {
      const parsedQuestions = parseBulkQuestions(bulkText);
      if (parsedQuestions.length === 0) {
        notify({ message: "No valid questions found. Please check the format.", severity: "warning" });
        return;
      }

      addBulkQuestions(parsedQuestions);
      setBulkText("");
      setShowBulkModal(false);
      notify({ message: `Added ${parsedQuestions.length} question(s).`, severity: "success" });
    } catch (error) {
      notify({ message: "Error parsing questions. Please check the format and try again.", severity: "error" });
      console.error("Bulk add error:", error);
    }
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
                <h1 className="text-3xl font-bold text-white mb-2">Add Questions</h1>
                <p className="text-gray-400">Create questions and set correct answers for your quiz</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleBulkAdd}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 border border-gray-700"
                >
                  <UploadFileIcon fontSize="small" />
                  <span>Bulk Add</span>
                </button>
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <VisibilityIcon fontSize="small" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quiz Title Display */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Quiz Title</p>
            <p className="text-lg font-semibold text-white">{quizTitle}</p>
          </div>

          {/* Questions List */}
          <div className="space-y-6 mb-8">
            {questions.length === 0 ? (
              <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 border-dashed text-center">
                <p className="text-gray-400 mb-4">No questions added yet</p>
                <button
                  onClick={addQuestion}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <AddIcon fontSize="small" />
                  <span>Add Question</span>
                </button>
              </div>
            ) : (
              questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-lg font-semibold text-white">
                          Question {questionIndex + 1}
                        </span>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              points: Number(e.target.value),
                            })
                          }
                          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          placeholder="Points"
                          min="1"
                        />
                        <span className="text-sm text-gray-400">points</span>
                      </div>
                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(question.id, { question: e.target.value })
                        }
                        placeholder="Enter your question here..."
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={3}
                      />
                    </div>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <DeleteIcon />
                      </button>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Options</label>
                      <button
                        onClick={() => addOption(question.id)}
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <AddIcon fontSize="small" />
                        <span>Add Option</span>
                      </button>
                    </div>
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                      >
                        <button
                          onClick={() => setCorrectAnswer(question.id, option.id)}
                          className="flex-shrink-0"
                        >
                          {question.correctAnswer === option.id ? (
                            <CheckCircleIcon className="text-green-400" />
                          ) : (
                            <RadioButtonUncheckedIcon className="text-gray-400" />
                          )}
                        </button>
                        <span className="text-gray-300 font-medium">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            updateOption(question.id, option.id, e.target.value)
                          }
                          placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {question.options.length > 2 && (
                          <button
                            onClick={() => removeOption(question.id, option.id)}
                            className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Question Button */}
          {questions.length > 0 && (
            <div className="mb-8">
              <button
                onClick={addQuestion}
                className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <AddIcon />
                <span>Add Question</span>
              </button>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button
              onClick={handlePrev}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
            >
              &lt; Prev
            </button>
            <button
              onClick={handleNext}
              disabled={questions.length === 0}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Bulk Add Questions</h2>
                <p className="text-gray-400 text-sm">
                  Enter questions in the format below. Each question should start with a number or "Q".
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkText("");
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <CloseIcon className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <p className="text-sm text-gray-300 mb-2 font-medium">Format Example:</p>
                <pre className="text-xs text-gray-400 whitespace-pre-wrap">
{`1. What is the capital of France?
A. London
B. Berlin
C. Paris
D. Madrid
Correct: C

2. Which planet is closest to the Sun?
A. Venus
B. Mercury
C. Earth
D. Mars
Answer: B`}
                </pre>
              </div>

              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste your questions here..."
                className="w-full h-96 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkText("");
                }}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSubmit}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Questions
              </button>
            </div>
          </div>
        </div>
      )}

      <QuizPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
};

export default AddQuestions;
