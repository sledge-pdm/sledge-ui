/**
 * @vitest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyBuiltinTheme, applyTheme, applyUserTheme, getCurrentBuiltinTheme, watchOSTheme, type UserTheme } from '../src/Theme';
import { getCSSProperty } from '../src/vars';

// Mock for matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

describe('Theme System', () => {
  beforeEach(() => {
    // Reset CSS properties
    document.documentElement.style.cssText = '';
    // Reset adopted stylesheets
    document.adoptedStyleSheets = [];

    // Default matchMedia mock
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('applyBuiltinTheme', () => {
    it('should apply light theme correctly', () => {
      applyBuiltinTheme('light');

      expect(getCSSProperty('--color-background')).toBe('#fdfdfd');
      expect(getCSSProperty('--color-accent')).toBe('#0080ff');
    });

    it('should apply dark theme correctly', () => {
      applyBuiltinTheme('dark');

      expect(getCSSProperty('--color-background')).toBe('#202020');
      expect(getCSSProperty('--color-accent')).toBe('#ffff00');
    });

    it('should apply dark-gy-flip theme correctly', () => {
      applyBuiltinTheme('dark-gy-flip');

      expect(getCSSProperty('--color-background')).toBe('#202020');
      expect(getCSSProperty('--color-accent')).toBe('#00ff00');
      expect(getCSSProperty('--color-active')).toBe('#ffff00');
    });

    it('should apply black theme correctly', () => {
      applyBuiltinTheme('black');

      expect(getCSSProperty('--color-background')).toBe('#141414');
      expect(getCSSProperty('--color-accent')).toBe('#ff00ff');
    });

    it('should handle os theme based on system preference', () => {
      // Test light OS theme
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      applyBuiltinTheme('os');
      expect(getCSSProperty('--color-background')).toBe('#fdfdfd');

      // Test dark OS theme
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      applyBuiltinTheme('os');
      expect(getCSSProperty('--color-background')).toBe('#202020');
    });
  });

  describe('applyUserTheme', () => {
    it('should apply user-defined CSS theme', () => {
      const customCSS = `
        :root {
          --color-background: #ff0000;
          --color-accent: #00ffff;
        }
      `;

      applyUserTheme(customCSS);

      expect(document.adoptedStyleSheets.length).toBe(1);
      // Note: In jsdom, we can't easily test CSS custom property values from adopted stylesheets
      // But we can test that the stylesheet was added
    });

    it('should replace existing user theme', () => {
      const firstCSS = ':root { --color-background: #ff0000; }';
      const secondCSS = ':root { --color-background: #00ff00; }';

      applyUserTheme(firstCSS);
      expect(document.adoptedStyleSheets.length).toBe(1);

      applyUserTheme(secondCSS);
      expect(document.adoptedStyleSheets.length).toBe(1);
    });
  });

  describe('applyTheme', () => {
    it('should handle builtin theme string', () => {
      applyTheme('dark');
      expect(getCSSProperty('--color-background')).toBe('#202020');
    });

    it('should handle user theme object', () => {
      const userTheme: UserTheme = {
        name: 'Custom Red',
        css: ':root { --color-background: #ff0000; }',
      };

      applyTheme(userTheme);
      expect(document.adoptedStyleSheets.length).toBe(1);
    });
  });

  describe('getCurrentBuiltinTheme', () => {
    it('should detect light theme', () => {
      applyBuiltinTheme('light');
      expect(getCurrentBuiltinTheme()).toBe('light');
    });

    it('should detect dark theme', () => {
      applyBuiltinTheme('dark');
      expect(getCurrentBuiltinTheme()).toBe('dark');
    });

    it('should detect dark-gy-flip theme', () => {
      applyBuiltinTheme('dark-gy-flip');
      expect(getCurrentBuiltinTheme()).toBe('dark-gy-flip');
    });

    it('should detect black theme', () => {
      applyBuiltinTheme('black');
      expect(getCurrentBuiltinTheme()).toBe('black');
    });

    it('should return null for unknown theme', () => {
      // Set unknown background color
      document.documentElement.style.setProperty('--color-background', '#123456');
      expect(getCurrentBuiltinTheme()).toBe(null);
    });
  });

  describe('watchOSTheme', () => {
    it('should setup and teardown event listener', () => {
      const mockAddEventListener = vi.fn();
      const mockRemoveEventListener = vi.fn();
      const callback = vi.fn();

      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      });

      const stopWatching = watchOSTheme(callback);

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      stopWatching();

      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should call callback on theme change', () => {
      const callback = vi.fn();
      let changeHandler: (e: MediaQueryListEvent) => void;

      const mockAddEventListener = vi.fn((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      });

      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: vi.fn(),
      });

      watchOSTheme(callback);

      // Simulate theme change
      changeHandler!({ matches: true } as MediaQueryListEvent);

      expect(callback).toHaveBeenCalledWith(true);
    });
  });
});
