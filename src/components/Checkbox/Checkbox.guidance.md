## Overview

Checkboxes let people pick any number of options (space use, amenities), or confirm one thing ("Email me new listings like this"). It's already AcmeCo's most consistent control, so its look is kept; the border is darkened to pass contrast, and checked becomes the dark blue fill with a white check. **CheckboxGroup** gives a set of checkboxes one label, hint and error.

## When to use

- Any number of options from a short list: a CheckboxGroup with a label ("Space use").
- A single yes/no choice that takes effect when a form is sent: one Checkbox.
- "Select all" over a partly checked list: `isIndeterminate` shows a dash.

## When not to use

- Exactly one choice from a few: a TabSelector, or a radio group (later).
- Exactly one choice from many: Select.
- A setting that takes effect immediately: a switch (not in v1).

## Accessibility

- Built on React Aria: a real checkbox input inside a label, so the whole label is clickable and Space toggles it.
- In a group, screen readers hear the group's label with each option ("Space use, group. Office, checkbox, checked").
- Checked is the dark blue fill **and** the white check mark, not colour alone; indeterminate is a dash and is announced as "mixed".
- Contrast: the unchecked border is 3.81:1 against white (AcmeCo's current `#b1b3b0` is 2.11:1, below the 3:1 needed); checked dark blue 10.98:1; check mark 10.98:1 or more.
- Each row is at least 24px tall (WCAG 2.5.8).
- A group error shows an icon and a message linked to the group, and every box gets a red border.

## Content

- Labels are short and parallel: "Office", "Retail", "Industrial".
- For a single checkbox, say what checking it does: "Email me new listings like this".
- Group errors say what's needed: "Choose at least one space use".

## Evidence

- **Observed (audit family F09):** 94 instances, 1 variant: a grey outline (`#b1b3b0`) at 3px corners. The team already holds this standard.
- **Accessibility:** that grey is 2.11:1 against white, below the 3:1 a checkbox boundary needs.
- **Now:** the same look with a 3.81:1 border and 4px corners; checked, indeterminate, hover, pressed, focus, invalid and disabled all defined.
