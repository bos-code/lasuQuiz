import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthProvider";
import { useNotification } from "../components/NotificationProvider";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GoogleIcon from "@mui/icons-material/Google";

const AuthPage = () => {
  const { signInWithMagicLink, signInWithProvider } = useAuth();
  const notify = useNotification();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMagicLink = async () => {
    if (!email) {
      notify({ message: "Please enter an email.", severity: "warning" });
      return;
    }
    setSending(true);
    try {
      await signInWithMagicLink(email);
      notify({ message: "Check your email for the sign-in link.", severity: "info" });
    } catch (error) {
      notify({ message: (error as Error).message, severity: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleProvider = async (provider: "google") => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      notify({ message: (error as Error).message, severity: "error" });
    }
  };

  const from = (location.state as { from?: Location })?.from?.pathname || "/admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 lg:p-10 bg-gradient-to-br from-purple-600/20 via-gray-900 to-gray-900">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-6">
            <MenuBookIcon className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Welcome back</h1>
          <p className="text-gray-300 mb-6">
            Sign in with a magic link or continue with Google.
          </p>
          <div className="space-y-3">
            <AuthTile
              title="Secure & Passwordless"
              body="Magic links keep accounts safe without passwords."
            />
            <AuthTile
              title="SSO Ready"
              body="Let users join with the identity they already trust."
            />
            <AuthTile
              title="Role-aware"
              body="We’ll mark chidera9713@gmail.com as admin automatically."
            />
          </div>
        </div>

        <div className="p-8 lg:p-10 bg-gray-900">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleMagicLink}
              disabled={sending}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {sending ? "Sending link..." : "Send magic link"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-700" />
              <span className="text-gray-400 text-sm">or continue with</span>
              <div className="h-px flex-1 bg-gray-700" />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleProvider("google")}
                className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <GoogleIcon fontSize="small" />
                <span className="text-sm font-semibold">Continue with Google</span>
              </button>
            </div>

            <button
              onClick={() => navigate(from)}
              className="w-full px-4 py-2 text-gray-400 hover:text-white text-sm underline"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthTile = ({ title, body }: { title: string; body: string }) => (
  <div className="p-4 bg-gray-800/70 border border-gray-700 rounded-lg">
    <p className="text-white font-semibold">{title}</p>
    <p className="text-gray-300 text-sm mt-1">{body}</p>
  </div>
);

export default AuthPage;
