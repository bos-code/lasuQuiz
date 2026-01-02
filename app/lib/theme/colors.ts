/**
 * Centralized color definitions
 * These colors are used in both MUI theme and CSS variables
 */

export const colors = {
  // Primary Colors
  primary: "#fa8555",
  primaryLight: "#ffb08a",
  primaryDark: "#e04e2f",
  primaryContrast: "#ffffff",

  // Secondary Colors
  secondary: "#6366f1",
  secondaryLight: "#818cf8",
  secondaryDark: "#4f46e5",
  secondaryContrast: "#ffffff",

  // Semantic Colors
  error: "#ef4444",
  errorLight: "#f87171",
  errorDark: "#dc2626",
  
  warning: "#f59e0b",
  warningLight: "#fbbf24",
  warningDark: "#d97706",
  
  info: "#3b82f6",
  infoLight: "#60a5fa",
  infoDark: "#2563eb",
  
  success: "#10b981",
  successLight: "#34d399",
  successDark: "#059669",

  // Neutral Colors
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  gray950: "#030712",

  // Background & Surface Colors
  background: "#ffffff",
  backgroundDark: "#111827",
  surface: "#ffffff",
  surfaceDark: "#1f2937",
  surfaceVariant: "#f9fafb",
  surfaceVariantDark: "#374151",

  // Text Colors
  textPrimary: "#111827",
  textPrimaryDark: "#f9fafb",
  textSecondary: "#6b7280",
  textSecondaryDark: "#d1d5db",
  textDisabled: "#9ca3af",
  textDisabledDark: "#4b5563",

  // Border Colors
  border: "#e5e7eb",
  borderDark: "#374151",
  borderLight: "#f3f4f6",
  borderDarkVariant: "#1f2937",
} as const;

