import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import supabase from "../utils/supabase";
import { getCurrentUser } from "../lib/supabase/auth";

export function meta() {
  return [
    { title: "Authenticating - LASU Quiz" },
    { name: "description", content: "Completing authentication" },
  ];
}

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");

      if (code) {
        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Error exchanging code:", error);
          navigate("/login?error=auth_failed");
          return;
        }

        // Check if user needs email verification
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login?error=user_not_found");
          return;
        }

        // Check if user profile exists
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profile) {
          // Create profile for OAuth users (they're already verified)
          // Email verification is currently disabled, so create profile for all users
          const isOAuth = user.app_metadata?.provider !== "email";
          
          const { error: profileError } = await supabase
            .from("user_profiles")
            .insert({
              id: user.id,
              email: user.email,
              name: isOAuth
                ? user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0]
                : user.user_metadata?.name || user.email?.split("@")[0],
              role: "student",
            });

          if (profileError) {
            console.error("Failed to create profile:", profileError);
            navigate("/login?error=profile_creation_failed");
            return;
          }
        }

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        navigate("/login");
      }
    }

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}

