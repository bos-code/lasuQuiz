import { StrictMode, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@mui/material/styles";
import { ClerkProvider } from "@clerk/clerk-react";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { buildMuiTheme } from "./theme/muiTheme";
import { useAdminStore } from "./Admin/store/adminStore";
import { AuthProvider } from "./components/Auth/AuthProvider";

const queryClient = new QueryClient();
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY for Clerk");
}

const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const appearance = useAdminStore((s) => s.appearance);
  const [systemMode, setSystemMode] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const fontSizeMap = useMemo(
    () => ({
      Small: "14px",
      Medium: "16px",
      Large: "18px",
    }),
    []
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) =>
      setSystemMode(event.matches ? "dark" : "light");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const resolvedMode: "light" | "dark" =
    appearance.theme === "System"
      ? systemMode
      : appearance.theme === "Light"
        ? "light"
        : "dark";

  const theme = useMemo(
    () => buildMuiTheme(resolvedMode, appearance.colorScheme),
    [appearance.colorScheme, resolvedMode]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-color-scheme", appearance.colorScheme);
    document.documentElement.setAttribute("data-theme-mode", resolvedMode);
    document.documentElement.style.setProperty("--app-font-size", fontSizeMap[appearance.fontSize]);
  }, [appearance.colorScheme, appearance.fontSize, fontSizeMap, resolvedMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/sign-in">
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AppThemeProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </AppThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </BrowserRouter>
      </ClerkProvider>
    </HelmetProvider>
  </StrictMode>
);
