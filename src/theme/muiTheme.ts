import { createTheme } from "@mui/material/styles";
import { themeColors, colors } from "./colors";

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: themeColors.primary.main,
      light: themeColors.primary.light,
      dark: themeColors.primary.dark,
      contrastText: themeColors.primary.contrastText,
    },
    secondary: {
      main: themeColors.secondary.main,
      light: themeColors.secondary.light,
      dark: themeColors.secondary.dark,
      contrastText: themeColors.secondary.contrastText,
    },
    background: {
      default: themeColors.background.default,
      paper: themeColors.background.paper,
    },
    text: {
      primary: themeColors.text.primary,
      secondary: themeColors.text.secondary,
      disabled: themeColors.text.disabled,
    },
    divider: themeColors.border.default,
    success: {
      main: colors.success[500],
      light: colors.success[400],
      dark: colors.success[600],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[400],
      dark: colors.warning[600],
    },
    error: {
      main: colors.error[500],
      light: colors.error[400],
      dark: colors.error[600],
    },
    info: {
      main: colors.info[500],
      light: colors.info[400],
      dark: colors.info[600],
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.background.paper,
          borderColor: themeColors.border.default,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.5rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: themeColors.background.elevated,
            "& fieldset": {
              borderColor: themeColors.border.default,
            },
            "&:hover fieldset": {
              borderColor: themeColors.border.light,
            },
            "&.Mui-focused fieldset": {
              borderColor: themeColors.primary.main,
            },
          },
          "& .MuiInputLabel-root": {
            color: themeColors.text.secondary,
            "&.Mui-focused": {
              color: themeColors.primary.light,
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: themeColors.background.paper,
          borderRight: `1px solid ${themeColors.border.default}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.background.paper,
          borderBottom: `1px solid ${themeColors.border.default}`,
        },
      },
    },
  },
});

// Export theme type for useTheme hook
export type AppTheme = typeof muiTheme;




