import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useNotification } from "../components/NotificationProvider";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotification();

  useEffect(() => {
    const handleCallback = async () => {
      const codePayload = location.hash || location.search;

      if (codePayload) {
        const { error } = await supabase.auth.exchangeCodeForSession(codePayload);
        if (error) {
          notify({ message: error.message, severity: "error" });
          navigate("/auth", { replace: true });
          return;
        }
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        notify({ message: sessionError.message, severity: "error" });
        navigate("/auth", { replace: true });
        return;
      }

      if (data.session) {
        notify({ message: "Signed in successfully", severity: "success" });
        navigate("/admin", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    };
    void handleCallback();
  }, [location.hash, location.search, navigate, notify]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      Completing sign-in...
    </div>
  );
};

export default AuthCallback;
