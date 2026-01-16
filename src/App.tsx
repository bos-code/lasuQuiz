import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Admin/AdminLayout";
import AdminRoutes from "./Admin/AdminRoutes";
import QuizPage from "./features/Quiz/QuizPage";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";
import ForgotPassword from "./auth/pages/ForgotPassword";
import ResetPassword from "./auth/pages/ResetPassword";
import "./App.css";
import { NotificationProvider } from "./components/NotificationProvider";
import RequireAuth from "./components/Auth/RequireAuth";

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminRoutes />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route path="/quiz/:id" element={<QuizPage />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
