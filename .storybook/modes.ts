// Chromatic "modes": each story is snapshotted once per mode listed in
// preview.tsx. A mode sets globals, here the `theme` global the decorator reads.
// Light only in v1; add `dark: { theme: 'dark' }` when a dark theme exists.
export const allModes = {
  light: { theme: 'light' },
} as const
