## Overview

AcmeCo's search-bar pills. **FilterButton** is the pill: a filter's name (or its value once set), an optional icon and count (All Filters: sliders and a blue "2"), and a chevron when it opens a panel. **FilterMenu** is a FilterButton that opens a panel of choices (a Popover) and, once set, shows its value and clears in place ("Office, Coworking ✕"). Same height, shape and type as the compact Select beside them, so the whole bar is one family (decision 40). Found missing by the search results screen (gaps 1–3).

## When to use

- **FilterMenu** for each filter in a search bar: a list of choices (CheckboxGroup), a range (two TextFields), a single choice.
- Pass `value` once it's set: one choice by name ("Office"), **"Multiple"** for two or more (the chips under the bar list them), a range with its unit ("$20–$40 /SF/YR"), and `onClear` so the pill clears in place.
- **FilterButton** with `count` and `hasMenu={false}` for All Filters, opening a Dialog with every filter; on phones use `iconOnly` (a round button with the count over its corner, as AcmeCo's).
- Below 768px every pill is AcmeCo's phone size (40px, 16px text, no chevron); put them in a Stack with `scrollBelow="md"` so they stay on one line and scroll sideways.

## When not to use

- Not for choosing one value from a short list where a Select fits ("For Lease"): use the compact Select.
- Not as a page's main action: use Button.
- Don't put more than a few words in a set pill; the chips under the bar can list everything.

## Accessibility

- A real button that says it opens a panel and whether it's open (React Aria); the panel is named by the filter's label, takes focus, and Escape or a click outside closes it and returns focus to the pill.
- The clear button is its own button ("Clear Rent"), beside the pill's text, 24px (the target minimum).
- The count is read as part of the name ("All Filters, 2 applied"); the blue circle itself is hidden from screen readers.
- A set pill is marked by its dark border and its value, not by colour alone. Contrast: text 17.04:1 on white and 15.35:1 on the light grey; the border 3.81:1; the count's white on blue 6.80:1.

## Content

- Name filters as AcmeCo does: "Space Use", "Rent", "Size", "All Filters".
- A set value stays short: one choice by name, "Multiple" for several (AcmeCo joins them with commas, which outgrows the pill; the chips say which), ranges with a dash and the unit ("$20–$40 /SF/YR", "5,000+ SF").

## Evidence

- OBSERVED (audit capture of the search results bar; a reference screenshot of the live bar, 2026-10-10): 40px pills, fully rounded, 1px #b2b2b2 border, 14/21 text, 4px gaps, chevrons; a set filter on light grey (#f3f3f3) with a 1px ink border; "Office, Coworking ✕"; All Filters with a sliders icon and a blue count.
- OBSERVED (a phone screenshot, 2026-10-11): on phones 40px pills with 16px text and no chevrons, in one row; All Filters as a round sliders button with the count over its edge (decision 42).
- OBSERVED (owner's desktop screenshots, 2026-10-11): 40px pills with 16px text on desktop too (decision 45).
- Now: 40px pills with 16px text at every width, as the compact Select (decision 45; decision 40 had made both 32px / 14px); the control border (#808386, 3:1); weight 400 (decision 4); a 24px clear button; panels 280px.
