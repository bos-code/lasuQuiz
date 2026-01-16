import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password || !confirm) {
      setError("Fill both fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Password updated. You can now sign in.");
    }, 900);
  };

  const shake = error ? { x: [-6, 6, -4, 4, 0] } : undefined;

  return (
    <AuthLayout title="Set a new password" subtitle="Keep it secure and memorable.">
      <AuthCard width="md">
        <motion.form
          onSubmit={onSubmit}
          animate={shake}
          className="rounded-2xl bg-slate-900/80 border border-white/10 p-8 backdrop-blur shadow-xl shadow-purple-500/5 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">Reset password</h3>
              <p className="text-slate-400 text-sm">Enter and confirm a new password.</p>
            </div>
            <Link to="/login" className="text-purple-300 hover:text-purple-200 text-sm font-semibold">
              Back to login
            </Link>
          </div>

          <InputField
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error && !password ? "Password required" : ""}
          />
          <InputField
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            error={error && password !== confirm ? "Passwords must match" : ""}
          />

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
                  Updating...
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Update password
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {success && <p className="text-emerald-400 text-sm">{success}</p>}
          {error && !success && <p className="text-rose-400 text-sm">{error}</p>}
        </motion.form>
      </AuthCard>
    </AuthLayout>
  );
};

const Spinner = () => (
  <motion.span
    className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full inline-block"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, ease: "linear", duration: 0.8 }}
  />
);

export default ResetPassword;
