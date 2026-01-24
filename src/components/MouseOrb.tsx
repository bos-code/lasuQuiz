import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";

/**
 * Premium animated mouse orb that follows the cursor with a soft, blended glow.
 * Absolutely positioned; pointer-events are disabled so it won't block UI.
 */
const MouseOrb = () => {
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20, mass: 0.4 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const gradientX = useTransform(smoothX, (val) => `calc(${val}px - 200px)`);
  const gradientY = useTransform(smoothY, (val) => `calc(${val}px - 200px)`);
  const background = useMotionTemplate`radial-gradient(260px at ${gradientX} ${gradientY}, rgba(120,80,255,0.25), rgba(46,110,255,0.15), transparent 60%)`;

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        mixBlendMode: "screen",
        opacity: mounted ? 1 : 0,
        background,
      }}
    />
  );
};

export default MouseOrb;
