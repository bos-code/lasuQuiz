import { useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { motion } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type InputFieldProps = {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  success?: string;
  autoFocus?: boolean;
};

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  success,
  autoFocus,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const displayType = isPassword && showPassword ? "text" : type;

  const ringClasses = useMemo(() => {
    if (error) return "focus:ring-2 focus:ring-rose-500 border-rose-500/60";
    if (success) return "focus:ring-2 focus:ring-emerald-500 border-emerald-500/60";
    return "focus:ring-2 focus:ring-purple-500 border-transparent";
  }, [error, success]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-200">{label}</label>
      <div className="relative">
        <motion.input
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          type={displayType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${ringClasses} text-white placeholder:text-slate-500 outline-none transition-all`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </button>
        )}
      </div>
      <div className="min-h-[18px] text-sm">
        {error && <motion.p className="text-rose-400" initial={{ x: -4 }} animate={{ x: 0 }}>{error}</motion.p>}
        {!error && success && (
          <motion.p className="text-emerald-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {success}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default InputField;
