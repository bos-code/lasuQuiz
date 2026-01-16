import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type RequireAuthProps = { children: React.ReactElement };

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
