import { useEffect, useRef } from "react";

/**
 * Hook to detect potential infinite loops in components
 * Logs a warning if component renders more than threshold times in quick succession
 * 
 * @param componentName - Name of the component for debugging
 * @param threshold - Number of renders before warning (default: 50)
 */
export const useInfiniteLoopDetector = (
  componentName: string,
  threshold: number = 50
) => {
  // Only run in development
  const isDev = process.env.NODE_ENV === "development";
  
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const warningShown = useRef(false);

  useEffect(() => {
    if (!isDev) return;
    
    // Reset counter every second
    const interval = setInterval(() => {
      renderCount.current = 0;
    }, 1000);

    return () => clearInterval(interval);
  }, [isDev]);

  if (!isDev) return;

  const now = Date.now();
  const timeSinceLastRender = now - lastRenderTime.current;
  lastRenderTime.current = now;

  // If renders are happening very quickly (< 10ms apart), increment counter
  if (timeSinceLastRender < 10) {
    renderCount.current++;
  } else {
    renderCount.current = 1; // Reset if enough time has passed
  }

  if (renderCount.current > threshold && !warningShown.current) {
    console.error(
      `⚠️ Possible infinite loop detected in "${componentName}"`,
      `\nRendered ${renderCount.current} times in quick succession.`,
      `\nCheck for:`,
      `\n  - Zustand selectors returning new arrays/objects`,
      `\n  - Missing useMemo for computed values`,
      `\n  - setState calls during render`,
      `\n  - useEffect dependencies causing loops`
    );
    console.trace();
    warningShown.current = true;
  }
};

