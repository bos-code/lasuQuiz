import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import AdminLayout from "./Admin/AdminLayout";
import AdminRoutes from "./Admin/AdminRoutes";
import QuizPage from "./features/Quiz/QuizPage";
import Home from "./pages/Home";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import "./App.css";
import { NotificationProvider } from "./components/NotificationProvider";
import { useAuth } from "./components/Auth/AuthProvider";
import MouseOrb from "./components/MouseOrb";

const Protected = ({ children }: { children: React.ReactElement }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <Navigate to="/sign-in" replace />
    </SignedOut>
  </>
);

const AdminOnly = ({ children }: { children: React.ReactElement }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">
        Checking permissions...
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <NotificationProvider>
      <MouseOrb />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/auth/*" element={<Navigate to="/sign-in" replace />} />
        <Route path="/login" element={<Navigate to="/sign-in" replace />} />
        <Route path="/signup" element={<Navigate to="/sign-up" replace />} />
        <Route path="/forgot" element={<Navigate to="/sign-in" replace />} />
        <Route path="/reset" element={<Navigate to="/sign-in" replace />} />
        <Route
          path="/admin/*"
          element={
            <Protected>
              <AdminOnly>
                <AdminLayout>
                  <AdminRoutes />
                </AdminLayout>
              </AdminOnly>
            </Protected>
          }
        />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;
