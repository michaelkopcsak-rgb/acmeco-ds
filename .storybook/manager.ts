// Customises Storybook's own interface (the sidebar and toolbar around stories).
// The brand title sits at the top of the sidebar on every page, so the
// "not affiliated" label is always visible without appearing inside component
// snapshots in Chromatic.
import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'acmeco-ds · Prototype · AcmeCo is a fictional brand',
    brandTarget: '_self',
  }),
})
