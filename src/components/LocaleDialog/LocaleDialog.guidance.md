## Overview

AcmeCo's language, region and currency dialog, opened by the header's globe: two tabs ("Language and Region", "Currency") of choice cards, and "View My Preferences" at the bottom. Built from Dialog, Tabs, ChoiceCards and Link (decision 36).

## When to use

- From the header's globe button (GlobalHeader), in a DialogTrigger, or controlled with `isOpen` / `onOpenChange`.
- Pass the current locale and currency and handle `onLocaleChange` / `onCurrencyChange`; the prototype changes nothing else.

## When not to use

- Not for other preferences (alerts, saved searches): those live on the preferences page ("View My Preferences").
- Not as a page: it's a quick switch.

## Accessibility

- A dialog named by its title, "Language and currency" (AcmeCo's has no name); focus moves in and returns to the globe; Escape and Close work, and Close is named.
- Real tabs (arrow keys, announced), and each set of choices is a radio group: the current one is announced as checked. AcmeCo's "tabs" can't be reached by keyboard, and its options never say which one is selected.
- **Choosing:** with a pointer, a choice applies and the dialog closes. With the keyboard, arrow keys apply each choice as they move and the dialog stays open, so it doesn't close on the first arrow press (WCAG 3.2.2); Enter confirms and closes.

## Content

- Each language in its own words ("Español", "Français"), with its region below.
- Currencies with their code and symbol ("Euro / EUR €").

## Evidence

- OBSERVED (live site, 2026-10-10): 580 × 309px, 4px corners, a 0 0 8px shadow; tabs as the title (18px, the current one with a 2px dark blue underline); six language choices and five currencies as 160 × 70px buttons (selected #dbedff with a 2px #0874e7 border); a 1px #ddd line and "View My Preferences" (14px link) at the bottom. No name, no tab or radio roles, an unnamed Close, focus left behind.
- Now (decision 36): Dialog md (500px, three columns fit every label) with a visible title; Tabs and ChoiceCards; the footer link.
