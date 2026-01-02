import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

// Create a theme instance
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: colors.primaryContrast,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      dark: colors.secondaryDark,
      contrastText: colors.secondaryContrast,
    },
    error: {
      main: colors.error,
      light: colors.errorLight,
      dark: colors.errorDark,
    },
    warning: {
      main: colors.warning,
      light: colors.warningLight,
      dark: colors.warningDark,
    },
    info: {
      main: colors.info,
      light: colors.infoLight,
      dark: colors.infoDark,
    },
    success: {
      main: colors.success,
      light: colors.successLight,
      dark: colors.successDark,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
      disabled: colors.textDisabled,
    },
    divider: colors.border,
    grey: {
      50: colors.gray50,
      100: colors.gray100,
      200: colors.gray200,
      300: colors.gray300,
      400: colors.gray400,
      500: colors.gray500,
      600: colors.gray600,
      700: colors.gray700,
      800: colors.gray800,
      900: colors.gray900,
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: "dark",
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: colors.primaryContrast,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      dark: colors.secondaryDark,
      contrastText: colors.secondaryContrast,
    },
    error: {
      main: colors.error,
      light: colors.errorLight,
      dark: colors.errorDark,
    },
    warning: {
      main: colors.warning,
      light: colors.warningLight,
      dark: colors.warningDark,
    },
    info: {
      main: colors.info,
      light: colors.infoLight,
      dark: colors.infoDark,
    },
    success: {
      main: colors.success,
      light: colors.successLight,
      dark: colors.successDark,
    },
    background: {
      default: colors.backgroundDark,
      paper: colors.surfaceDark,
    },
    text: {
      primary: colors.textPrimaryDark,
      secondary: colors.textSecondaryDark,
      disabled: colors.textDisabledDark,
    },
    divider: colors.borderDark,
  },
});
