## Overview

A few icon buttons where exactly one is chosen, for a view or layout setting that applies at once: the search results' **map placement** (map on the left, or map on top). It's a proposal for AcmeCo (decision 45). Map placement is a choice between two tasks: reading listings beside a tall map, or seeing more of a wide map with cards in rows below it. It's drawn in AcmeCo's own selected style, the same light blue fill and 2px link-blue border as ChoiceCards.

## When to use

- Two to four settings that change how something is shown, where an icon reads quickly (a layout, a view density).
- Where the change applies straight away and can be undone by choosing again.

## When not to use

- Settings that need words to tell apart: a TabSelector or ChoiceCards.
- Moving to another page or view with its own address: a Link (the results' "Map" / "Gallery" switch is a link).
- Filtering content: FilterButton / FilterMenu.
- Several settings on at once: a CheckboxGroup.

## Accessibility

- React Aria ToggleButtonGroup with single selection, which it exposes as a radio group named by `label`: one Tab stop, arrow keys move between the buttons and Space or Enter chooses, so looking at another option doesn't change the layout; each button is a radio named by its option's `label` and announced as checked when chosen.
- One is always chosen (`disallowEmptySelection`): pressing the chosen button again leaves it chosen.
- Each label also shows as a tooltip on hover and keyboard focus, so sighted users don't have to guess what an icon means. Without it, the names would reach screen readers only.
- The chosen button has a 2px border as well as the fill, so it isn't shown by colour alone (blue border 6.80:1 on white). Icons are ink: 15.35:1 or more on white, grey and light blue.

## Content

- Name the result, not the icon: "Map on the left", "Map on top".
- Keep the icons from one family (the registry's `panel-left`, `panel-top`).

## Evidence

- BENCHMARK-INFORMED (reference screenshots, 2026-10-11): the benchmark switches its map between the side and the top with 40px square icon buttons and a tooltip.
- Here (decision 45): AcmeCo's selected style (ChoiceCards), the system's focus ring, 4px corners (decision 26: something to act on), tooltips for the names.
