import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

export type ColorScheme = "Purple" | "Blue" | "Green" | "Orange" | "Pink" | "Red";

const colorSchemeMap: Record<ColorScheme, { main: string; light: string; dark: string }> = {
  Purple: { main: colors.purple[600], light: colors.purple[500], dark: colors.purple[700] },
  Blue: { main: colors.info[500], light: colors.info[400], dark: colors.info[600] },
  Green: { main: colors.success[500], light: colors.success[400], dark: colors.success[600] },
  Orange: { main: colors.warning[500], light: colors.warning[400], dark: colors.warning[600] },
  Pink: { main: colors.pink[500], light: colors.pink[400], dark: colors.pink[600] },
  Red: { main: colors.error[500], light: colors.error[400], dark: colors.error[600] },
};

const backgroundPalette = {
  dark: {
    default: colors.gray[900],
    paper: colors.gray[800],
    elevated: colors.gray[700],
    border: colors.gray[700],
    borderLight: colors.gray[600],
  },
  light: {
    default: colors.gray[50],
    paper: colors.gray[100],
    elevated: colors.gray[200],
    border: colors.gray[200],
    borderLight: colors.gray[300],
  },
};

const textPalette = {
  dark: {
    primary: colors.gray[50],
    secondary: colors.gray[200],
    disabled: colors.gray[400],
  },
  light: {
    primary: colors.gray[900],
    secondary: colors.gray[700],
    disabled: colors.gray[500],
  },
};

export const buildMuiTheme = (mode: "light" | "dark", colorScheme: ColorScheme = "Purple") => {
  const primary = colorSchemeMap[colorScheme];
  const bg = backgroundPalette[mode];
  const text = textPalette[mode];

  return createTheme({
    palette: {
      mode,
      primary,
      secondary: colorSchemeMap.Pink, // keep playful secondary accent
      background: {
        default: bg.default,
        paper: bg.paper,
      },
      text,
      divider: bg.border,
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
            backgroundColor: bg.paper,
            borderColor: bg.border,
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
              backgroundColor: bg.elevated,
              "& fieldset": {
                borderColor: bg.border,
              },
              "&:hover fieldset": {
                borderColor: bg.borderLight,
              },
              "&.Mui-focused fieldset": {
                borderColor: primary.main,
              },
            },
            "& .MuiInputLabel-root": {
              color: text.secondary,
              "&.Mui-focused": {
                color: primary.light,
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: bg.paper,
            borderRight: `1px solid ${bg.border}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: bg.paper,
            borderBottom: `1px solid ${bg.border}`,
          },
        },
      },
    },
  });
};

export const muiTheme = buildMuiTheme("dark", "Purple");
export type AppTheme = typeof muiTheme;



