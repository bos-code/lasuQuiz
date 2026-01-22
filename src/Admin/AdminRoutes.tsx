import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Quizzes from "./Quizzes";
import Students from "./Students";
import Settings from "./Settings";
import QuizDetail from "./QuizDetail";
import CreateQuiz from "./CreateQuiz";
import AddQuestions from "./AddQuestions";
import ReviewQuiz from "./ReviewQuiz";
import CategoryDetail from "./CategoryDetail";
import Categories from "./Categories";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="quizzes" element={<Quizzes />} />
      <Route path="quizzes/create" element={<CreateQuiz />} />
      <Route path="quizzes/create/questions" element={<AddQuestions />} />
      <Route path="quizzes/create/review" element={<ReviewQuiz />} />
      <Route path="quizzes/:id" element={<QuizDetail />} />
      <Route path="categories" element={<Categories />} />
      <Route path="categories/:category" element={<CategoryDetail />} />
      <Route path="students" element={<Students />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;




