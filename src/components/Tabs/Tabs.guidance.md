## Overview

Switches between panels of related content in the same place: AcmeCo's "Language and Region" and "Currency" in the globe dialog. The current tab is in ink with AcmeCo's 2px dark blue underline; the others are grey, over a 1px line (decision 36).

## When to use

- Two to five panels of the same kind, where people look at one at a time (language or currency; overview, spaces, documents).
- Inside a dialog or a page section; the tabs' label names the set for screen readers.

## When not to use

- **To set a value** (For Sale / For Lease / Auctions as a search mode): that's a TabSelector, which is a radio group.
- For navigation to other pages: use links (NavigationBar).
- When people need to compare panels side by side: show them together.

## Accessibility

- React Aria Tabs: the tab list is one Tab stop; arrow keys move between tabs (and select them); Home and End jump to the first and last.
- Each tab says it's a tab, its position ("1 of 2") and whether it's selected; each panel is named by its tab.
- The current tab is marked by the underline and the colour change, not by colour alone. AcmeCo's tabs are plain text that a keyboard can't reach and screen readers don't announce as tabs.
- Text: 5.77:1 for the other tabs, 17.04:1 for the current one; the underline is 10.98:1 against white.

## Content

- Short labels, in title case as AcmeCo writes them ("Language and Region").
- Say what the panel holds, not what to do ("Currency", not "Choose currency").

## Evidence

- OBSERVED (live site, 2026-10-10, the globe's dialog): 18px labels, the current one at weight 400 in black with a 2px #123a7a underline, the other at 300 in #4f5254, 24px apart, over a 1px #ddd line; plain `li` / `span` elements with no tab roles and no keyboard access. Audit F18 Tab set: 34 instances in 6 experiences, lines of 1px #ddd or 2px #e5e5e5.
- Now (decision 36): the same look on the system's tokens (both weights 400, the other tabs in the secondary grey, one border grey), as real tabs.
