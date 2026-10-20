// SearchField's Figma spec. Mirrors src/components/Field/Field.module.css and
// src/components/SearchField/SearchField.module.css rule for rule (tree format: see
// button.mjs). Its label is visually hidden (it's still the accessible name), so the
// component is the control box, at a representative 320px (in use it fills its container).

const SIZES = ['md', 'lg']
const STATES = ['Empty', 'Hover', 'Focus', 'Filled', 'Disabled', 'Hero', 'Results', 'Results (AcmeCo today)']

export const searchField = {
  id: 'search-field',
  name: 'Search field',
  page: 'Search field',
  storybook: 'Components / SearchField',
  code: 'src/components/SearchField/SearchField.tsx',
  guidance: 'src/components/SearchField/SearchField.guidance.md',
  tokens: 'tokens/components/field.json',
  tokenPrefix: 'field.control.clear',
  status: 'Ready',
  axes: { Size: SIZES, State: STATES },
  grid: { columns: 'Size', rowGroups: null, rows: 'State' },
  gridNote: 'The label is visually hidden but names the field. Hero = the pill shape with the dark blue Search button, as on the home page. Results = the field on the search results as proposed: a location arrow and the dark blue Search button of the hero (decision 45). Results (AcmeCo today) = what AcmeCo shows: a location arrow and a plain dark blue magnifier (decision 42). Shown 320px wide.',
  properties: [],
  variants: SIZES.flatMap((Size) => STATES.map((State) => {
    const empty = State === 'Empty' || State === 'Hover' || State === 'Disabled'
    const hero = State === 'Hero'
    // Results: the proposed results field (the hero's dark blue button); Results (AcmeCo today): the plain magnifier.
    const today = State === 'Results (AcmeCo today)'
    const results = State === 'Results' || today
    const submit = Size === 'lg' ? 'md' : 'sm' // the Search button is one size down, so it sits 4px inside
    return {
      props: { Size, State },
      tree: {
        k: 'frame', name: 'Control', dir: 'H', align: 'start', width: 320,
        height: `field/control/${Size}/height`, padX: `field/control/${Size}/padding-x`, gap: 'field/control/gap',
        // The Search button sits 4px (field/gap) from the outer edge, as at the top and bottom:
        // the CSS's calc, field/gap minus the border (the outline takes layout space).
        padRight: hero || (results && !today) ? { sub: ['field/gap', 'field/control/border-width'] } : undefined,
        radius: hero || results ? 'field/control/pill-radius' : 'field/control/radius',
        fill: State === 'Disabled' ? 'field/control/background/disabled' : 'field/control/background/default',
        stroke: { Hover: 'field/control/border/hover', Disabled: 'field/control/border/disabled' }[State] ?? 'field/control/border/default',
        strokeWidth: 'field/control/border-width',
        focus: State === 'Focus' ? { ring: 'field/control/focus-ring/color', width: 'field/control/focus-ring/width', offset: 'field/control/focus-ring/offset' } : null,
        children: [
          ...(results ? [{ k: 'icon', name: 'Start icon', icon: 'navigation', size: 'field/control/start-icon-size', color: 'field/control/start-icon-color' }] : []),
          { k: 'text', name: 'Value', chars: empty ? 'City, ZIP or address' : 'Chicago, IL', fontSize: `field/control/${Size}/font-size`, lineHeight: `field/control/${Size}/line-height`, fill: empty ? 'field/control/text/placeholder' : 'field/control/text/default', stretch: true },
          // AcmeCo's clear button: a filled dark circle with a white cross; none while empty.
          ...(empty ? [] : [{
            k: 'frame', name: 'Clear', dir: 'H', size: 'field/control/clear-size', radius: 'field/control/pill-radius',
            children: [{ k: 'icon', name: 'Clear icon', icon: 'circle-x', size: 'field/control/clear-icon-size', color: 'field/control/clear/icon', iconFill: 'field/control/clear/background' }],
          }]),
          ...(hero || (results && !today) ? [{
            k: 'frame', name: 'Search button', dir: 'H', size: `icon-button/${submit}/size`, radius: 'icon-button/radius', fill: 'icon-button/primary/background/default',
            children: [{ k: 'icon', name: 'Search icon', icon: 'search', size: `icon-button/${submit}/icon-size`, color: 'icon-button/primary/icon' }],
          }] : []),
          ...(today ? [{
            k: 'frame', name: 'Search button', dir: 'H', size: 'field/control/clear-size', radius: 'field/control/pill-radius',
            children: [{ k: 'icon', name: 'Search icon', icon: 'search', size: 'field/control/search-icon-size', color: 'field/control/search-icon-color' }],
          }] : []),
        ],
      },
    }
  })),
  anatomy: [
    { part: 'Control', tokens: 'the shared field control (see Text field): field/control/{size}/height, padding, radius, border; hero: field/control/pill-radius', at: 'left' },
    { part: 'Text', tokens: 'field/control/{size}/font-size, field/control/{size}/line-height; placeholder field/control/text/placeholder', layer: 'Value', at: 'top' },
    { part: 'Clear button', tokens: 'field/control/clear-size (24px target), field/control/clear-icon-size, field/control/clear/background, field/control/clear/icon; hidden while empty', layer: 'Clear', at: 'top' },
    { part: 'Results', tokens: 'a location arrow first (field/control/start-icon-size, field/control/start-icon-color) and then the dark blue Search button of the hero (proposed), or, as AcmeCo today, a plain dark blue magnifier (field/control/search-icon-size, field/control/search-icon-color in a field/control/clear-size target); see the Results rows', at: 'right' },
    { part: 'Search button (hero)', tokens: 'an Icon button, primary, round (icon-button/radius), one size down; field/gap from the edge', layer: 'Search button', at: 'top' },
  ],
  anatomyVariant: { Size: 'lg', State: 'Hero' },
  // Parity with the code: the States matrix (rows = states, columns = sizes). The hero's
  // end padding is compared as the Search button's inset (the CSS gets it from a negative margin).
  parity: {
    story: 'components-searchfield--states-matrix',
    order: STATES.flatMap((State) => SIZES.map((Size) => ({ Size, State }))),
    parts: [
      { name: 'Control', css: "[data-part='control']", layer: null, fields: ['bg', 'border', 'radius', 'h', 'padL', 'gap', 'ring'] },
      { name: 'Value', css: 'input', layer: 'Value', fields: ['font', 'color', 'startInset'] },
      { name: 'Clear', css: "button[aria-label='Clear search']", layer: 'Clear', fields: ['w', 'h', 'radius'] },
      { name: 'Clear icon', css: "button[aria-label='Clear search'] svg", layer: 'Clear icon', fields: ['icon'] },
      { name: 'Search button', css: "button[aria-label='Search']", layer: 'Search button', fields: ['bg', 'w', 'h', 'radius', 'endInset'] },
      { name: 'Search icon', css: "button[aria-label='Search'] svg", layer: 'Search icon', fields: ['icon'] },
      { name: 'Start icon', css: "[data-part='control'] > span[aria-hidden] svg", layer: 'Start icon', fields: ['icon'] },
    ],
  },
  specsBy: 'Size',
  specs: (size) => [`field/control/${size}/height`, `field/control/${size}/padding-x`, `field/control/${size}/font-size`, 'field/control/clear-size', 'field/control/clear-icon-size', 'field/control/pill-radius', 'field/gap'],
}
