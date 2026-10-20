## Overview

A panel that opens from a button and sits next to it: AcmeCo's header menu now, the filter dropdowns later. White, 8px corners, the raised shadow and a 1px line, the same as the Select's list, so every panel in the system looks the same (decision 36).

## When to use

- A short set of links or controls that belongs to one button (the site menu, a filter's options).
- When the page should stay in view around it.

## When not to use

- A task with its own title and actions (a form, a confirmation): a Dialog.
- Choosing one value from a list: a Select (it has its own list).
- Content people need while they work on the page: put it on the page.

## Accessibility

- The button says it opens a panel and whether it's open (React Aria).
- The panel is named (`label`), focus moves into it, and Escape or a click outside closes it and returns focus to the button.
- Its contents keep their own semantics: put links in a list, actions as buttons.

## Content

- Keep it short; if it scrolls a lot, it's probably a page or a dialog.
- Name it for what it holds ("Menu", "Price").

## Evidence

- OBSERVED (live site, 2026-10-10): the header menu, a 280px panel about 5px under its button, white, 8px corners, a 1px 0 25px 2px shadow at 30%; its button is an unnamed `div`.
- Now (decision 36): shadow.raised, 4px from the button, a 1px line as on the Select's list; a named button and panel with focus handling.
