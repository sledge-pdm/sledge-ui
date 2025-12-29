/**
 * CSS Custom Properties (CSS Variables) constants
 * These correspond to the variables defined in the theme CSS files
 */

// Colors
export const color = {
  background: 'var(--color-background)',
  controls: 'var(--color-controls)',
  surface: 'var(--color-surface)',
  canvasArea: 'var(--color-canvas-area)',
  canvas: 'var(--color-canvas)',
  canvasBorder: 'var(--color-canvas-border)',
  onBackground: 'var(--color-on-background)',
  onBackgroundSecondary: 'var(--color-on-background-secondary)',
  selectionBorder: 'var(--color-selection-border)',
  selectionFill: 'var(--color-selection-fill)',
  border: 'var(--color-border)',
  borderSecondary: 'var(--color-border-secondary)',
  accent: 'var(--color-accent)',
  active: 'var(--color-active)',
  enabled: 'var(--color-enabled)',
  muted: 'var(--color-muted)',
  error: 'var(--color-error)',
  warn: 'var(--color-warn)',
  overlay: 'var(--color-overlay)',
  button: {
    bg: 'var(--color-button-bg)',
    hover: 'var(--color-button-hover)',
    active: 'var(--color-button-active)',
    text: 'var(--color-button-text)',
    textOnAccent: 'var(--color-button-text-on-accent)',
    border: 'var(--color-button-border)',
  },
};

// Sizes
export const size = {
  bottomInfo: 'var(--size-bottom-info)',
  dialogRadius: 'var(--size-dialog-radius)',
  buttonRadius: 'var(--size-button-radius)',
};

// Spacing
export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
};

// Text sizes
export const text = {
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)',
};

// Fonts
export const font = {
  body: 'var(--font-body)',
};

/**
 * Gets a CSS var() function call for the given variable
 * @param varName - The CSS variable name (with or without --)
 * @param fallback - Optional fallback value
 */
export function cssVar(varName: string, fallback?: string): string {
  const name = varName.startsWith('--') ? varName : `--${varName}`;
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`;
}

/**
 * Type-safe CSS variable getter
 */
export function getCSSVar(path: string): string {
  return cssVar(path);
}

/**
 * Sets a CSS custom property on the document root
 * @param property - The CSS property name (with or without --)
 * @param value - The value to set
 */
export function setCSSProperty(property: string, value: string): void {
  const propName = property.startsWith('--') ? property : `--${property}`;
  document.documentElement.style.setProperty(propName, value);
}

/**
 * Gets a CSS custom property value from the document root
 * @param property - The CSS property name (with or without --)
 */
export function getCSSProperty(property: string): string {
  const propName = property.startsWith('--') ? property : `--${property}`;
  return getComputedStyle(document.documentElement).getPropertyValue(propName).trim();
}
