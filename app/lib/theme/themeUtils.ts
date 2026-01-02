/**
 * Theme utilities for integrating MUI and Tailwind CSS
 * 
 * This file provides utilities to ensure consistent theming
 * between MUI components and Tailwind CSS classes.
 */

import { colors } from "./colors";

/**
 * Get color value (for inline styles or direct usage)
 * Returns the actual color value from the colors object
 */
export const getColor = (colorPath: keyof typeof colors): string => {
  return colors[colorPath];
};

/**
 * Get MUI theme color as CSS variable
 * Useful for using MUI colors in Tailwind classes
 */
export const getThemeColor = (colorPath: string): string => {
  const colorMap: Record<string, string> = {
    'primary': 'var(--color-primary)',
    'primary-light': 'var(--color-primary-light)',
    'primary-dark': 'var(--color-primary-dark)',
    'secondary': 'var(--color-secondary)',
    'secondary-light': 'var(--color-secondary-light)',
    'secondary-dark': 'var(--color-secondary-dark)',
    'error': 'var(--color-error)',
    'warning': 'var(--color-warning)',
    'info': 'var(--color-info)',
    'success': 'var(--color-success)',
    'background': 'var(--color-background)',
    'surface': 'var(--color-surface)',
    'text-primary': 'var(--color-text-primary)',
    'text-secondary': 'var(--color-text-secondary)',
  };
  
  return colorMap[colorPath] || colorPath;
};

/**
 * Tailwind color classes that map to MUI theme colors
 * Use these in className for consistency
 */
export const themeColors = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-secondary-contrast)]',
  error: 'bg-[var(--color-error)] text-white',
  warning: 'bg-[var(--color-warning)] text-white',
  info: 'bg-[var(--color-info)] text-white',
  success: 'bg-[var(--color-success)] text-white',
  surface: 'bg-[var(--color-surface)] text-[var(--color-text-primary)]',
  background: 'bg-[var(--color-background)] text-[var(--color-text-primary)]',
} as const;

/**
 * Get Tailwind-compatible color class
 */
export const getColorClass = (color: keyof typeof themeColors): string => {
  return themeColors[color];
};

