import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import SocialButtons from "../components/SocialButtons";
import { useAuth } from "../../components/Auth/AuthProvider";
import { useNotification } from "../../components/NotificationProvider";

const Login = () => {
  const navigate = useNavigate();
  const { signInWithProvider } = useAuth();
  const notify = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Welcome back. Redirecting...");
      setTimeout(() => navigate("/admin"), 500);
    }, 900);
  };

  const handleProvider = async (provider: "google") => {
    setError("");
    setSuccess("Redirecting to provider...");
    try {
      await signInWithProvider(provider);
    } catch (err) {
      const message = (err as Error).message;
      setSuccess("");
      setError(message);
      notify({ message, severity: "error" });
    }
  };

  const shake = error ? { x: [-6, 6, -4, 4, 0] } : undefined;

  return (
    <AuthLayout
      title="Secure Login"
      subtitle="Access your exams dashboard with confidence."
    >
      <AuthCard>
        <div className="hidden lg:flex flex-col justify-between rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Your progress</p>
            <h2 className="text-3xl font-bold text-white mt-2">Stay exam-ready.</h2>
            <p className="text-slate-300 mt-3">
              Track quizzes, continue attempts, and keep results secure.
            </p>
          </div>
          <div className="space-y-3 text-slate-200">
            <InfoChip label="Session verified" />
            <InfoChip label="Proctor-ready UI" />
            <InfoChip label="Fast resume after pause" />
          </div>
        </div>

        <motion.form
          onSubmit={onSubmit}
          animate={shake}
          className="rounded-2xl bg-slate-900/80 border border-white/10 p-8 backdrop-blur shadow-xl shadow-purple-500/5 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">Login</h3>
              <p className="text-slate-400 text-sm">Use your university email.</p>
            </div>
            <div className="text-xs text-slate-400">
              <Link to="/signup" className="text-purple-300 hover:text-purple-200 font-semibold">
                Create account
              </Link>
            </div>
          </div>

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            error={error && !email ? "Email required" : ""}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error && !password ? "Password required" : ""}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300">
              <input type="checkbox" className="accent-purple-500" /> Remember me
            </label>
            <Link to="/forgot" className="text-purple-300 hover:text-purple-200 font-semibold">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2"
                >
                  <Spinner />
                  Signing in...
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Continue to dashboard
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {success && <p className="text-emerald-400 text-sm">{success}</p>}
          {error && !success && <p className="text-rose-400 text-sm">{error}</p>}

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-400">or sign in with</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <SocialButtons onClick={handleProvider} />
        </motion.form>
      </AuthCard>
    </AuthLayout>
  );
};

const InfoChip = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
    {label}
  </div>
);

const Spinner = () => (
  <motion.span
    className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full inline-block"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
  />
);

export default Login;
