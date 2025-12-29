import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { useMemo } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  mode?: "light" | "dark";
}

export function ThemeProvider({ children, mode = "light" }: ThemeProviderProps) {
  const currentTheme = useMemo(() => {
    return mode === "dark" ? theme : theme; // You can switch to darkTheme when needed
  }, [mode]);

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

