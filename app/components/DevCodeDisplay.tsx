/**
 * Development component to display verification code
 * Only shows in development mode
 */
export function DevCodeDisplay() {
  if (import.meta.env.PROD) return null;

  const stored = typeof window !== "undefined" 
    ? localStorage.getItem("last_verification_code")
    : null;

  if (!stored) return null;

  try {
    const { email, code, timestamp } = JSON.parse(stored);
    const isRecent = Date.now() - timestamp < 10 * 60 * 1000; // 10 minutes

    if (!isRecent) {
      localStorage.removeItem("last_verification_code");
      return null;
    }

    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 shadow-lg max-w-sm z-50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              🧪 DEV MODE - Verification Code
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
              {email}
            </p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {code}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              Check console (F12) for details
            </p>
          </div>
          <button
            onClick={() => localStorage.removeItem("last_verification_code")}
            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
          >
            ✕
          </button>
        </div>
      </div>
    );
  } catch {
    return null;
  }
}

