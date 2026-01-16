import type { ReactNode } from "react";
import { motion } from "framer-motion";

type AuthCardProps = {
  children: ReactNode;
  width?: "md" | "lg";
};

const AuthCard = ({ children, width = "md" }: AuthCardProps) => {
  const maxWidth = width === "lg" ? "max-w-5xl" : "max-w-3xl";
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`w-full ${maxWidth} mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6`}
    >
      {children}
    </motion.div>
  );
};

export default AuthCard;
