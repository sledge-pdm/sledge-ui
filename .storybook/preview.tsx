/** @jsxImportSource solid-js */
import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import { createJSXDecorator, definePreview } from 'storybook-solidjs-vite';
import '../src/theme/global.css';
import { applyTheme } from '../src/theme/Theme';

export const solidDecorator = createJSXDecorator((Story, context) => {
  applyTheme(context.globals.theme);
  return (
    <main>
      <Story />
    </main>
  );
});

export default definePreview({
  addons: [addonDocs(), addonA11y()],
  parameters: {
    // automatically create action args for all props that start with 'on'
    actions: {
      argTypesRegex: '^on.*',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  // All components will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs'],
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'dark-gy-flip', title: 'Dark (GY Flip)' },
          { value: 'black', title: 'Black' },
          { value: 'os', title: 'OS' },
        ],
      },
    },
  },
  decorators: [solidDecorator],
});
