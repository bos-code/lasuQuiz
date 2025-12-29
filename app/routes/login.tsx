import { Form, useActionData, useNavigation, Link, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import { signIn, signInWithOAuth } from "../lib/supabase/auth";
import { redirect } from "react-router";
import { getCurrentUser } from "../lib/supabase/auth";
import { useApp } from "../context/AppContext";
import { useEffect } from "react";

function OAuthButton({ provider }: { provider: "google" | "apple" }) {
  const { showError } = useApp();
  
  const handleOAuth = async () => {
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      console.error(`Failed to sign in with ${provider}:`, error);
      showError(
        error instanceof Error
          ? error.message
          : `Failed to sign in with ${provider}. Please try again.`
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleOAuth}
      className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      {provider === "google" ? (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.56-.6-2.94-.9-4.17-.37-1.15.5-1.99 1.4-2.59 2.73-.29.65-.54 1.34-.76 2.03-.32.99-.55 1.9-.77 2.79-.23.92-.15 1.78.23 2.58.38.8 1.05 1.48 1.99 1.91.95.43 1.99.57 3.04.5 1.88-.13 3.7-.7 5.45-1.6 1.74-.9 3.18-2.08 4.3-3.5.3-.38.57-.78.8-1.2-.63-.58-1.23-1.2-1.8-1.87zM12.03.02c-.21 0-.4.01-.59.02C10.88.03 10.5 0 10.12 0c-.38 0-.76.03-1.13.05-.37.02-.73.05-1.08.1C6.5.2 5.7.4 4.95.7c-.75.3-1.45.7-2.1 1.2-.65.5-1.2 1.1-1.65 1.8-.45.7-.8 1.5-1.05 2.35-.25.85-.4 1.75-.45 2.7-.05.95 0 1.95.15 3 .15 1.05.4 2.15.75 3.3.35 1.15.8 2.3 1.35 3.45.55 1.15 1.2 2.3 1.95 3.45.75 1.15 1.6 2.25 2.55 3.3.95 1.05 2 2 3.15 2.85 1.15.85 2.4 1.55 3.75 2.1 1.35.55 2.8.95 4.35 1.2 1.55.25 3.2.3 4.95.15.88-.08 1.73-.25 2.55-.5.82-.25 1.6-.6 2.35-1.05.75-.45 1.4-1 2-1.65.6-.65 1.1-1.4 1.5-2.25.4-.85.7-1.75.9-2.7.2-.95.3-1.95.3-3 0-1.05-.1-2.1-.3-3.15-.2-1.05-.5-2.05-.9-3-.4-.95-.9-1.8-1.5-2.55-.6-.75-1.3-1.4-2.1-1.95-.8-.55-1.7-1-2.7-1.35-1-.35-2.1-.6-3.3-.75-1.2-.15-2.5-.2-3.9-.15z" />
        </svg>
      )}
      {provider === "google" ? "Google" : "Apple"}
    </button>
  );
}

export function meta() {
  return [
    { title: "Login - LASU Quiz" },
    { name: "description", content: "Login to your account" },
  ];
}

export async function loader() {
  // Redirect if already logged in
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "admin") {
      throw redirect("/admin/dashboard");
    }
    throw redirect("/student/dashboard");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { session } = await signIn({ email, password });
    if (session) {
      // Get user to determine redirect
      const user = await getCurrentUser();
      if (user?.role === "admin") {
        return redirect("/admin/dashboard");
      }
      return redirect("/student/dashboard");
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to login",
    };
  }

  return { error: "Invalid credentials" };
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const { showError, showSuccess } = useApp();
  const isSubmitting = navigation.state === "submitting";
  const registered = searchParams.get("registered") === "true";
  const verified = searchParams.get("verified") === "true";

  // Show notifications from URL params
  useEffect(() => {
    if (registered) {
      showSuccess("Account created successfully! Please sign in.");
    }
    if (verified) {
      showSuccess("Email verified successfully! Please sign in.");
    }
    
    // Handle error query params from auth callback
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        auth_failed: "Authentication failed. Please try again.",
        user_not_found: "User not found. Please try signing in again.",
        profile_creation_failed: "Failed to create user profile. Please contact support.",
      };
      showError(errorMessages[errorParam] || "An error occurred. Please try again.");
    }
  }, [registered, verified, searchParams, showSuccess, showError]);

  // Show error from form action
  useEffect(() => {
    if (actionData?.error) {
      showError(actionData.error);
    }
  }, [actionData?.error, showError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in with Email"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <OAuthButton provider="google" />
              <OAuthButton provider="apple" />
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Don't have an account? Register
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}



