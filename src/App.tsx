import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Admin/AdminLayout";
import AdminRoutes from "./Admin/AdminRoutes";
import QuizPage from "./features/Quiz/QuizPage";
import Home from "./pages/Home";
import "./App.css";
import { NotificationProvider } from "./components/NotificationProvider";

function App() {
  return (
    <NotificationProvider>
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
    </NotificationProvider>
  );
}

export default App;
