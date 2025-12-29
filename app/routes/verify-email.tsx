import { Form, useActionData, useNavigation, useSearchParams } from "react-router";
import type { Route } from "./+types/verify-email";
import { verifyEmail, resendVerificationCode } from "../lib/supabase/auth";
import { redirect } from "react-router";
import { getCurrentUser } from "../lib/supabase/auth";
import { useState, useRef, useEffect } from "react";
import { DevCodeDisplay } from "../components/DevCodeDisplay";
import { useApp } from "../context/AppContext";

export function meta() {
  return [
    { title: "Verify Email - LASU Quiz" },
    { name: "description", content: "Verify your email address" },
  ];
}

export async function loader() {
  // Check if user is already verified and logged in
  const user = await getCurrentUser();
  if (user) {
    return redirect("/");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const code = formData.get("code") as string;
  const actionType = formData.get("action") as string;

  if (actionType === "resend") {
    const email = formData.get("email") as string;
    try {
      await resendVerificationCode(email);
      return { success: true, message: "Verification code resent!" };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to resend code",
      };
    }
  }

  try {
    const email = searchParams.get("email") || "";
    await verifyEmail(code, email);
    return redirect("/login?verified=true");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid verification code",
    };
  }
}

export default function VerifyEmail() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const { showError, showSuccess } = useApp();
  const email = searchParams.get("email") || "";
  const isSubmitting = navigation.state === "submitting";

  // Show notifications from form action
  useEffect(() => {
    if (actionData?.error) {
      showError(actionData.error);
    }
    if (actionData && "success" in actionData && actionData.success) {
      showSuccess(actionData.message || "Verification code resent!");
    }
  }, [actionData, showError, showSuccess]);

  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newCode = [...code];
    newCode[index] = value.replace(/\D/g, ""); // Only numbers
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const newCode = [...code];
    for (let i = 0; i < 4; i++) {
      newCode[i] = pastedData[i] || "";
    }
    setCode(newCode);
    inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
  };

  const codeString = code.join("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We sent a 4-digit verification code to
            <br />
            <span className="font-medium">{email || "your email"}</span>
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="code" value={codeString} />

          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || codeString.length !== 4}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
          </div>

          <div className="text-center">
            <Form method="post">
              <input type="hidden" name="action" value="resend" />
              <input type="hidden" name="email" value={email} />
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 disabled:opacity-50"
              >
                Didn't receive the code? Resend
              </button>
            </Form>
          </div>
        </Form>
        
        <DevCodeDisplay />
      </div>
    </div>
  );
}

