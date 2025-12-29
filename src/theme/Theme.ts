import { RGBAToHex, colorMatch, hexToRGBA, hexWithSharpToRGBA, type RGBA } from '@sledge/anvil';
import { getCSSProperty, setCSSProperty } from './vars';

export type Theme = 'os' | 'light' | 'dark' | 'dark-gy-flip' | 'black';

const themeColorVars = [
  '--color-background',
  '--color-controls',
  '--color-surface',
  '--color-canvas-area',
  '--color-canvas',
  '--color-canvas-border',
  '--color-on-background',
  '--color-on-background-secondary',
  '--color-selection-border',
  '--color-selection-fill',
  '--color-border',
  '--color-border-secondary',
  '--color-accent',
  '--color-active',
  '--color-enabled',
  '--color-muted',
  '--color-error',
  '--color-warn',
  '--color-overlay',
  '--color-button-bg',
  '--color-button-hover',
  '--color-button-active',
  '--color-button-text',
  '--color-button-text-on-accent',
  '--color-button-border',
] as const;

type ThemeColorVar = (typeof themeColorVars)[number];
export type ThemeColors = Partial<Record<ThemeColorVar, RGBA>>;
type BuiltinThemeColors = Record<ThemeColorVar, RGBA>;

export type UserTheme = { name: string; colors: ThemeColors; css?: never } | { name: string; css: string; colors?: never };

export const themeOptions = [
  { label: 'os theme', value: 'os' },
  { label: 'light', value: 'light' },
  { label: 'dark', value: 'dark' },
  { label: 'dark-gy-flip', value: 'dark-gy-flip' },
  { label: 'black', value: 'black' },
];

const clampToByte = (value: number): number => Math.min(255, Math.max(0, Math.round(value)));

const rgbaToCssValue = (color: RGBA): string => {
  const [r, g, b, a = 255] = color;
  const clamped: RGBA = [clampToByte(r), clampToByte(g), clampToByte(b), clampToByte(a)];
  const includeAlpha = clamped[3] !== 255;
  return RGBAToHex(clamped, { withSharp: true, excludeAlpha: !includeAlpha });
};

// Accepts #rrggbb, #rrggbbaa, rrggbb, rrggbbaa, rgb(), rgba()
const cssValueToRGBA = (value: string): RGBA | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 6 || hex.length === 8) {
      return hexWithSharpToRGBA(trimmed);
    }
    return null;
  }

  const hexMatch = trimmed.match(/^[0-9a-fA-F]{6,8}$/);
  if (hexMatch) {
    return hexToRGBA(trimmed);
  }

  const rgbaMatch = trimmed.match(/^rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*(?:,\s*([0-9]*\.?[0-9]+)\s*)?\)$/i);

  if (rgbaMatch) {
    const [, rRaw, gRaw, bRaw, aRaw] = rgbaMatch;
    const r = clampToByte(Number(rRaw));
    const g = clampToByte(Number(gRaw));
    const b = clampToByte(Number(bRaw));
    const a = aRaw === undefined ? 255 : clampToByte(Math.round(Number(aRaw) * 255));
    return [r, g, b, a];
  }

  return null;
};

const baseDark: BuiltinThemeColors = {
  '--color-background': [32, 32, 32, 255],
  '--color-controls': [39, 39, 39, 255],
  '--color-surface': [48, 48, 48, 255],
  '--color-canvas-area': [20, 20, 20, 255],
  '--color-canvas': [255, 255, 255, 255],
  '--color-canvas-border': [128, 128, 128, 128],
  '--color-on-background': [238, 238, 238, 255],
  '--color-on-background-secondary': [238, 238, 238, 144],
  '--color-selection-border': [128, 128, 128, 255],
  '--color-selection-fill': [128, 128, 128, 51],
  '--color-border': [80, 80, 80, 255],
  '--color-border-secondary': [64, 64, 64, 255],
  '--color-accent': [255, 255, 0, 255],
  '--color-active': [0, 255, 0, 255],
  '--color-enabled': [0, 255, 0, 255],
  '--color-muted': [255, 255, 255, 77],
  '--color-error': [255, 95, 95, 255],
  '--color-warn': [255, 251, 0, 255],
  '--color-overlay': [255, 255, 255, 128],
  '--color-button-bg': [34, 34, 34, 255],
  '--color-button-hover': [68, 68, 68, 255],
  '--color-button-active': [85, 85, 85, 255],
  '--color-button-text': [238, 238, 238, 255],
  '--color-button-text-on-accent': [34, 34, 34, 255],
  '--color-button-border': [187, 187, 187, 255],
};

const builtinThemes: Record<Exclude<Theme, 'os'>, BuiltinThemeColors> = {
  light: {
    '--color-background': [254, 254, 254, 255],
    '--color-controls': [252, 252, 252, 255],
    '--color-surface': [240, 240, 240, 255],
    '--color-canvas-area': [242, 242, 242, 255],
    '--color-canvas': [255, 255, 255, 255],
    '--color-canvas-border': [3, 3, 3, 56],
    '--color-on-background': [52, 52, 52, 255],
    '--color-on-background-secondary': [52, 52, 52, 144],
    '--color-selection-border': [128, 128, 128, 255],
    '--color-selection-fill': [128, 128, 128, 51],
    '--color-border': [192, 192, 192, 255],
    '--color-border-secondary': [176, 176, 176, 255],
    '--color-accent': [0, 128, 255, 255],
    '--color-active': [255, 0, 255, 255],
    '--color-enabled': [0, 221, 0, 255],
    '--color-muted': [0, 0, 0, 89],
    '--color-error': [255, 0, 0, 255],
    '--color-warn': [255, 204, 0, 255],
    '--color-overlay': [0, 0, 0, 128],
    '--color-button-bg': [255, 255, 255, 255],
    '--color-button-hover': [229, 229, 229, 255],
    '--color-button-active': [224, 224, 224, 255],
    '--color-button-text': [32, 32, 32, 222],
    '--color-button-text-on-accent': [255, 255, 255, 255],
    '--color-button-border': [32, 32, 32, 222],
  },
  dark: baseDark,
  'dark-gy-flip': {
    ...baseDark,
    '--color-accent': [0, 255, 0, 255],
    '--color-active': [255, 255, 0, 255],
  },
  black: {
    '--color-background': [16, 16, 16, 255],
    '--color-controls': [21, 21, 21, 255],
    '--color-surface': [32, 32, 32, 255],
    '--color-canvas-area': [0, 0, 0, 255],
    '--color-canvas': [255, 255, 255, 255],
    '--color-canvas-border': [128, 128, 128, 128],
    '--color-on-background': [238, 238, 238, 255],
    '--color-on-background-secondary': [238, 238, 238, 144],
    '--color-selection-border': [128, 128, 128, 255],
    '--color-selection-fill': [128, 128, 128, 51],
    '--color-border': [80, 80, 80, 255],
    '--color-border-secondary': [57, 57, 57, 255],
    '--color-accent': [255, 0, 255, 255],
    '--color-active': [255, 0, 255, 255],
    '--color-enabled': [0, 255, 0, 255],
    '--color-muted': [255, 255, 255, 77],
    '--color-error': [255, 48, 48, 255],
    '--color-warn': [255, 251, 0, 255],
    '--color-overlay': [255, 255, 255, 82],
    '--color-button-bg': [34, 34, 34, 255],
    '--color-button-hover': [68, 68, 68, 255],
    '--color-button-active': [85, 85, 85, 255],
    '--color-button-text': [238, 238, 238, 255],
    '--color-button-text-on-accent': [16, 16, 16, 255],
    '--color-button-border': [170, 170, 170, 255],
  },
} as const;

let userThemeStyleSheet: CSSStyleSheet | null = null;

const setThemeColors = (colors: ThemeColors): void => {
  const entries = Object.entries(colors) as [ThemeColorVar, RGBA | undefined][];
  entries.forEach(([property, value]) => {
    if (!value) return;
    setCSSProperty(property, rgbaToCssValue(value));
  });
};

export function applyBuiltinTheme(theme: Theme): void {
  if (userThemeStyleSheet) {
    removeUserThemeStyleSheet();
  }

  const targetTheme = theme === 'os' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

  const themeVars = builtinThemes[targetTheme as Exclude<Theme, 'os'>];
  setThemeColors(themeVars);
}

// Accepts the new RGBA map format or legacy CSS string.
export function applyUserTheme(theme: ThemeColors | string): void {
  removeUserThemeStyleSheet();

  if (typeof theme === 'string') {
    userThemeStyleSheet = new CSSStyleSheet();
    userThemeStyleSheet.replaceSync(theme);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, userThemeStyleSheet];
    return;
  }

  setThemeColors(theme);
}

export function applyTheme(theme: Theme | UserTheme): void {
  if (typeof theme === 'string') {
    applyBuiltinTheme(theme);
    return;
  }

  if ('colors' in theme && theme.colors) {
    applyUserTheme(theme.colors);
  } else if ('css' in theme && theme.css) {
    applyUserTheme(theme.css);
  }
}

export function getCurrentBuiltinTheme(): Theme | null {
  const background = cssValueToRGBA(getCSSProperty('--color-background'));
  const accent = cssValueToRGBA(getCSSProperty('--color-accent'));
  if (!background || !accent) return null;

  const entries = Object.entries(builtinThemes) as [Exclude<Theme, 'os'>, BuiltinThemeColors][];
  for (const [themeName, colors] of entries) {
    const expectedBackground = colors['--color-background'];
    const expectedAccent = colors['--color-accent'];
    if (colorMatch(background, expectedBackground) && colorMatch(accent, expectedAccent)) {
      return themeName;
    }
  }

  return null;
}

function removeUserThemeStyleSheet(): void {
  if (userThemeStyleSheet) {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter((sheet) => sheet !== userThemeStyleSheet);
    userThemeStyleSheet = null;
  }
}

export function watchOSTheme(callback?: (isDark: boolean) => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback?.(e.matches);
  };

  mq.addEventListener('change', handler);

  return () => {
    mq.removeEventListener('change', handler);
  };
}
