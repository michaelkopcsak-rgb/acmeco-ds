## Overview

AcmeCo's header menu: a Menu button that opens a 280px panel in four groups with a line between each: "Log In/Sign Up" (in dark blue); Explore Marketing Solutions, Advertise and Marketing Center (opens in a new window); a Search group that opens in place (For Lease, For Sale, Auctions, Businesses, Find a Broker); Preferences and Help Center. Built from Popover, Disclosure, Link and SignInDialog (decision 36).

## When to use

- Once, at the end of the header (GlobalHeader), at every width.
- Pass the links (screens get them from `src/data/site-menu.ts`) and the sign-in slides.

## When not to use

- Not for actions on the page; it's site-wide navigation.
- Don't add groups beyond Search without a reason: every item is one more thing to scan.

## Accessibility

- The Menu button is named (AcmeCo's is an unnamed `div`); the panel is named "Menu" and holds a navigation named "Site" with its links in a list.
- Focus moves into the panel; Escape or a click outside closes it and returns focus to Menu.
- Search is a disclosure that says whether it's open, as AcmeCo's does.
- Marketing Center says it opens in a new tab, and shows the external-link icon.
- "Log In/Sign Up" opens the sign-in dialog; when that closes, focus returns to Menu.
- Rows are 40px tall.

## Content

- AcmeCo's labels, in its order and spelling ("Log In/Sign Up").

## Evidence

- OBSERVED (live site and a reference screenshot, 2026-10-10): a 280px panel about 5px under the hamburger, white, 8px corners, a 1px 0 25px 2px shadow at 30%; "Log In/Sign Up" in dark blue; 40px rows at weight 500 in ink; 1px #ddd lines between groups; Marketing Center with an external-link icon, opening a new window; "Search" a button (announced as expanded or collapsed) showing five links at weight 300, aligned with its text.
- Now (decision 36): the Popover look (shadow.raised, a 1px line), semibold rows over regular sub-links (two weights, decision 4), a named button, panel and navigation.
