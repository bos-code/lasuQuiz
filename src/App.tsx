import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Admin/AdminLayout";
import AdminRoutes from "./Admin/AdminRoutes";
import QuizPage from "./features/Quiz/QuizPage";
import Home from "./pages/Home";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/*"
        element={
          <AdminLayout>
            <AdminRoutes />
          </AdminLayout>
        }
      />
      <Route path="/quiz/:id" element={<QuizPage />} />
    </Routes>
  );
}

export default App;
