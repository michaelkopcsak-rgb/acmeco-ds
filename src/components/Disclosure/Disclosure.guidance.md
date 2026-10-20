## Overview

A button that shows or hides a group: the Search group in AcmeCo's menu (For Lease, For Sale, Auctions, Businesses, Find a Broker), and later accordions. A 40px row in semibold with a chevron that turns when open (decision 36).

## When to use

- A group of links or content that most people don't need every time (a menu's sub-links, an FAQ answer, extra details).
- With `headingLevel` when each group is a section of the page (an accordion), so it appears in the page outline.

## When not to use

- Navigating to another page: a link.
- Switching between panels of the same kind: Tabs.
- Hiding something everyone needs (prices, contact details).

## Accessibility

- A real button that says whether it's open ("Search, collapsed"); Enter or Space toggles it (React Aria), as AcmeCo's Search button does.
- The chevron turns, so the state isn't shown by colour.
- The panel follows the button in reading order; nothing inside is reachable while it's closed.

## Content

- The button names the group ("Search"), not an action ("Show search links").

## Evidence

- OBSERVED (live site and a reference screenshot, 2026-10-10): in the header menu, "Search" is a button (16px, weight 500, ink, 40px row, `aria-expanded`) with a chevron at the end that points up when open; its five links sit at weight 300, aligned with its text.
- Now (decision 36): semibold over regular links (two weights, decision 4), the same chevron, no indent.
