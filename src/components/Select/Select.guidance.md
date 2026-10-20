## Overview

A button that opens a list to pick one option. Two appearances: **field**, for forms, looks and behaves like TextField (it shares its tokens); **compact**, a 32px pill for sort and filter triggers, sits beside filter chips. Every dropdown on AcmeCo today is custom-built; this one gets the keyboard and screen reader behaviour custom dropdowns usually miss.

## When to use

- One choice from about 5 to 15 options: property type, sort order, price range.
- **Field** in forms (with a label above). **Compact** for sorting and filtering results, where the trigger shows its label ("Sort") until a choice is made.

## When not to use

- Two to four options, all worth seeing at once: a TabSelector.
- Several choices: a CheckboxGroup.
- Very long lists that people search (cities, addresses): a search field with suggestions (later).
- Navigation menus: a menu button (later), not a Select.

## Accessibility

- Built on React Aria's Select: announced as a button that opens a list box; arrow keys move through options; typing a letter jumps to it; Enter or Space selects; Escape closes; focus returns to the trigger.
- The label is always the accessible name, even on compact triggers (where it's hidden visually and shown as the trigger text).
- The selected option is shown by a check mark and semibold text, not colour alone.
- Hint and error are linked to the trigger; errors use colour, a thicker border, an icon and a message.
- Options are 40px tall; the list scrolls after about eight.
- Contrast: option text 17.04:1, 15.35:1 on the hover row; the trigger border 3.81:1.

## Content

- Field labels are short nouns ("Property type"); compact labels say what they control ("Sort", "Price").
- Option labels are short, parallel and in a sensible order (by size, by price, or alphabetical).
- Placeholders are prompts ("Select a property type"), never the only label.

## Evidence

- **Observed (audit families F11 and F17):** one form select (grey outline `#b2b2b2` at 4px, 42px tall) and 70 filter dropdowns in 8 variants and 11 designs: text triggers in black, near-black or blue, grey outlines, and one blue outline. No native `<select>` anywhere: every dropdown is custom-built.
- **Now:** one field trigger matching TextField (40 or 48px, the 3.81:1 border) and one compact trigger (a 32px pill), with a single list style.
