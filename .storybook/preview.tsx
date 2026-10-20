import type { Preview } from '@storybook/react-vite'

// Load the same global CSS the app loads, so components render with real
// token values (and the page font and background) inside Storybook.
import '../src/tokens.css'
import '../src/index.css'
import './preview.css'
import { allModes } from './modes'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Chromatic snapshots every story once per mode. v1 is light only
    // (docs/GOVERNANCE.md, decision 2); a dark mode is one line here later.
    chromatic: {
      modes: {
        light: allModes.light,
      },
    },
    options: {
      storySort: {
        order: ['Start here', 'Foundations', ['Colour', 'Typography', 'Shape', 'Icons', 'Motion', 'Contrast'], 'Components', 'AcmeCo', 'Patterns'],
      },
    },

    // Accessibility checks run as part of every story test. 'error' fails the
    // test (and CI) on any violation: the acceptance rule is 0 violations.
    a11y: {
      test: 'error',
    },
  },

  // The theme is a "global": one setting shared by every story. There's no
  // toolbar menu yet because there's only one theme to pick.
  globalTypes: {
    theme: { description: 'Token theme' },
  },
  initialGlobals: {
    theme: 'light',
  },

  // A decorator wraps every story. This one applies the theme the same way the
  // app does: data-theme on <html>. It must be <html>, not a wrapper <div>,
  // because component tokens are defined on :root and resolve there.
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme
      return <Story />
    },
  ],
}

export default preview
