## Overview

Buttons start actions: send an inquiry, save a search, apply filters. Three variants set the emphasis, from the dark blue **primary** to the quiet **tertiary**. Three sizes (32, 40 and 48px) replace the three heights and two corner radii AcmeCo uses today.

## When to use

- **Primary:** the one main action in a region, such as "Contact broker" on a listing. Use at most one per region.
- **Secondary:** an alternative to the primary action, such as "Save search" beside "Search".
- **Tertiary:** low-emphasis actions, such as "Clear filters", or actions repeated in lists.
- **With `href`:** when the button takes the user somewhere ("View documents"). It renders a real link, so it opens in a new tab and screen readers announce it as a link.

## When not to use

- For navigation inside text, use a link instead.
- For an icon on its own, use IconButton, which requires an accessible label.
- Don't put two primary buttons side by side; make one secondary.
- Don't disable a button to stop a form being sent before it's complete. Let the user press it and show what's missing.

## Accessibility

- Built on React Aria's Button: Enter and Space press it; mouse, touch and keyboard all fire `onPress`.
- The label is the accessible name. Icons are hidden from screen readers.
- Focus shows a 2px blue ring, offset 2px so it never touches dark blue.
- Loading keeps keyboard focus, ignores presses and tells screen readers the button is busy. It never uses the `disabled` attribute, which would drop focus mid-action.
- Disabled buttons can't be focused, so explain nearby why the action isn't available.
- Every variant and state meets WCAG AA contrast (checked in CI): primary text 10.98:1 at rest, secondary 10.98:1, tertiary 17.04:1.
- Targets are 32px or taller, above the 24px minimum (WCAG 2.5.8).

## Content

- Start with a verb and say what happens: "Contact broker", not "Submit" or "OK".
- Sentence case. No more than three or four words.
- Keep the same label for the same action everywhere.

## Evidence

- **Observed (audit family F03):** 207 instances, 12 variants, 26 distinct designs. The dark blue primary appears in 3 heights (33, 43 and 48px) and 2 radii (2 and 4px), with grey-filled, outlined and blue text-only variants alongside.
- **legacy-named:** `--legacy-cta-font-size` 18px, `--legacy-cta-font-weight` 400, `--legacy-cta-line-height` 1.5, `--legacy-cta-padding-inline` 16px, `--legacy-cta-radius` 4px, `--legacy-cta-transition` 0.15s, `--legacy-color-brand-hover`. All kept.
- **Now:** 3 variants × 3 sizes, one radius, and every state defined (hover, pressed, focus, disabled, loading), none of which were captured on the live site.
