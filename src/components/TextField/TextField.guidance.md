## Overview

A labelled field for typing: a name, an email address, a message to a broker. One shape (outlined, 4px corners) replaces the five AcmeCo uses today. It shares its label, hint, error and border with every other form control, so they all look and behave alike.

## When to use

- Short text: name, email, phone (`type` sets the right mobile keyboard).
- Longer text: set `multiline` for a message, and `maxLength` to show a live count.
- Read-only values someone may want to copy: set `isReadOnly`.
- The **pill** shape and `lg` size are for the hero location search only.

## When not to use

- Choosing from a known list: use Select.
- Searching: use SearchField, which adds a clear button and Escape to clear.
- Don't use the placeholder as the label: it disappears as soon as someone types.

## Accessibility

- The label is always present and is the field's accessible name. `hideLabel` hides it visually only, and only where the purpose is obvious from context.
- Built on React Aria: the hint and error are linked to the field, so screen readers read them when it's focused.
- Errors use three cues, not colour alone: the error red, a thicker border, and an icon with a message.
- Required fields show an asterisk; screen readers hear "required" from the field itself.
- Text is 16px or larger (which also stops iOS zooming in on focus); placeholder 5.77:1; the border 3.81:1 against white (WCAG 1.4.11).
- The character counter is visual; the limit is announced once, in the hint, not on every keystroke.

## Content

- Labels are short nouns: "Email", "Phone (optional)". Mark optional fields, not just required ones, when most are required.
- Hints say what's expected: "We'll only use this to reply to you."
- Error messages say how to fix it: "Enter an email address like name@company.com", not "Invalid input".

## Evidence

- **Observed (audit family F08):** 177 instances, 5 variants, 9 distinct designs: a grey outline at 2px corners (108), a white square, a grey-outlined pill at 40px, a white pill at 48px (hero search), and a grey fill at 4px, 38px tall.
- **Accessibility:** the observed control border `#b1b3b0` is 2.11:1 against white, below the 3:1 a field boundary needs.
- **Now:** one outlined shape at 4px with a 3.81:1 border, 40 and 48px heights, the pill kept only for the hero, and every state defined (hover, focus, invalid, disabled, read-only).
