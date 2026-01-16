import type { ReactNode } from "react";
import { motion } from "framer-motion";
import MenuBookIcon from "@mui/icons-material/MenuBook";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

// Shared layout with branded gradient + subtle grid
const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-50 flex items-center justify-center relative overflow-hidden">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-5xl px-4 sm:px-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <MenuBookIcon className="text-white" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              QuizOS
            </p>
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
            {subtitle && <p className="text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const BackgroundPattern = () => (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.15),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.12),transparent_35%)]" />
    <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:48px_48px]" />
  </>
);

export default AuthLayout;
