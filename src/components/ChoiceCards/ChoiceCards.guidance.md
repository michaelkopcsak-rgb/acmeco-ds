## Overview

One choice from a handful of options, drawn as cards: AcmeCo's language-and-region and currency choices ("English / United Kingdom", "Euro / EUR €"). A radio group underneath, so the choice is announced, not just shown in blue. The selected card keeps AcmeCo's light blue fill and 2px blue border (decision 36).

## When to use

- Four to about twelve options where a second line helps tell them apart (a language and its region).
- Where all the options should be visible at once, in a grid.

## When not to use

- Two to four short options in one line: a TabSelector.
- Long lists: a Select.
- Several choices at once: a CheckboxGroup.
- Actions or links: each card sets a value, it doesn't navigate.

## Accessibility

- React Aria RadioGroup: one Tab stop, arrow keys move the choice, Space selects; each card is announced as a radio button with both its lines ("English, United States, radio button, checked").
- The group is named by `label` (shown or not). AcmeCo's cards are buttons that never say which one is selected.
- The selected card is marked by a 2px border as well as the fill, so it isn't colour alone. Every card keeps a 2px border (transparent until selected), so the text doesn't shift when chosen, as it does on AcmeCo.
- Text is ink on white, grey (hover) and light blue (selected): 15.35:1 or more.

## Content

- The label is what's chosen ("English"), the description what tells it apart ("Canada").
- Write each option in its own language where it is a language ("Español", "Français").

## Evidence

- OBSERVED (live site, 2026-10-10): 160 × 70px buttons in three columns, 8px padding, 4px corners; the language at 16/24 weight 400 over the region at weight 100, both black; selected #dbedff with a 2px #0874e7 border, the others with no border.
- Now (decision 36): label semibold over a regular description (two weights, decision 4), the system's light blue (blue.100) and link blue (blue.700), a 16px grid gap, two columns at 450px and below.
