## Overview

A search box: a TextField with a clear button (AcmeCo's filled dark circle with a white cross), Escape to clear and Enter to search. With `showSubmit` it adds the dark blue Search button inside its end edge, as in the hero location search.

## When to use

- Location and keyword searches.
- The hero search: `size="lg"`, `shape="pill"`, `showSubmit`, and `hideLabel` (the purpose is obvious there).
- **The results search, proposed** (decision 45): `shape="pill"`, `showSubmit` and `startIcon={<Navigation />}`: the location arrow and the hero's dark blue Search button, so searching again is as obvious on the results as on the home page.
- **The results search as AcmeCo has it today** (decision 42): the same with `submitAppearance="icon"` (a plain dark blue magnifier). Use it to show AcmeCo as it is.

## When not to use

- Filtering a short list that's already on screen: a Select or Chips may be clearer.
- Free text that isn't a search (a message): use TextField.

## Accessibility

- Built on React Aria's SearchField: it's announced as a search box; Escape clears it; Enter runs the search.
- The clear button is labelled "Clear search" and only appears when there's text to clear. Its target is 24px (WCAG 2.5.8).
- The submit button is an IconButton labelled "Search".
- Same label, border, focus and contrast rules as TextField.

## Content

- Label or placeholder says what can be searched: "City, ZIP or address".
- Keep the placeholder as an example, not as the only label.

## Evidence

- **Observed (audit family F19):** 29 instances, 2 variants: a plain white field, and one with an icon button. The hero search is a white pill at 48px (F08).
- **AcmeCo's clear button:** a filled dark circle with a white cross, kept (decision 6 addendum: Lucide `CircleX`, drawn filled).
- **Now:** the same field as TextField, plus clear, Escape and an optional dark blue submit, at 40 or 48px, pill only in the hero.
