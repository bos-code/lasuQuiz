import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme, darkTheme } from "./theme";
import { useMemo } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  mode?: "light" | "dark";
}

export function ThemeProvider({ children, mode = "light" }: ThemeProviderProps) {
  const currentTheme = useMemo(() => {
    return mode === "dark" ? darkTheme : theme;
  }, [mode]);

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

