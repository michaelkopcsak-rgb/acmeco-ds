## Overview

An icon-only button for compact, familiar actions: save a listing, go to the next photo, share, close. It always has an accessible name: `label` is required, and the code won't compile without it. Three variants cover where it sits: **plain** in toolbars and cards, **overlay** on photos, **primary** for the search submit.

## When to use

- **Plain:** familiar actions in toolbars, cards and headers (share, close).
- **Overlay:** controls on top of photos (carousel arrows, save on a listing photo). The translucent white circle keeps the icon readable on any image.
- **Primary:** the search submit inside the location field. Use `shape="circle"` inside a pill-shaped field (the hero search), where square corners would poke past the curve.
- **As a toggle** (`isSelected` + `onChange`): actions that switch on and off, like save. The icon turns dark blue and fills when on, and screen readers hear "pressed".
- **With `href`:** when it navigates. It renders a real link.

## When not to use

- When the icon isn't universally understood. Use a Button with a label instead.
- For the main action in a region. Use a primary Button: words beat icons for important actions.
- Don't use a toggle for actions that happen once (like "share"); use a plain button.

## Accessibility

- `label` is required and becomes the accessible name ("Save listing", "Next photo"). Say what it does, not what it shows ("Close", not "X").
- Built on React Aria: Enter and Space press it. Toggles use `aria-pressed`, so screen readers announce "pressed" or "not pressed".
- Focus: the blue 2px ring for plain and primary; over photos, AcmeCo's own double ring (white inside, ink outside) so it shows on any image.
- Selected isn't shown by colour alone: the icon also fills (WCAG 1.4.1).
- Icons meet 3:1 against their background in every state (checked in CI), down to 4.07:1 for a saved icon on the overlay over the darkest photo.
- Targets are 32, 40 or 48px, above the 24px minimum (WCAG 2.5.8).
- Sighted mouse users don't see the label. A tooltip component would show it on hover; that's planned for later, so keep to universally understood icons until then.

## Content

- Labels start with a verb or name the action: "Save listing", "Next photo", "Share listing", "Close dialog".
- Include what it acts on when the screen has several: "Save 233 S Wacker Dr", not just "Save".
- For a toggle, keep the same label in both states; the pressed state is announced for you.

## Evidence

- **Observed (audit family F04):** 107 instances, 14 variants, 14 distinct designs. No-container icons in five greys and blacks plus a failing blue (`#0888ba`, 4.0:1); translucent white circles at 85% and 60%; grey-outlined pills; dark blue filled.
- **Accessibility:** 481 of 533 icon-only buttons on AcmeCo had no `aria-label` (other naming methods weren't measured). Here a missing label is a compile error, tested in `IconButton.typetest.tsx`.
- **AcmeCo's own focus ring** (white 2px inside, ink 2px outside) was captured in the audit's shadow data and is used for the overlay variant.
- **Now:** 3 variants × 3 sizes, one ink colour, 85% white over photos, and every state defined, including selected.
