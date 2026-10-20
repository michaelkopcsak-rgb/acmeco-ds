## Overview

Links take people somewhere: another page, a section, an outside site. Four variants replace the 21 link styles on AcmeCo today. Links take their size and weight from the text around them, so they add no new type styles.

## When to use

- **Inline:** inside sentences ("See the **building's floor plans**"). Always underlined.
- **Standalone:** on its own line or beside a heading ("View all office listings").
- **Subtle:** listing titles in cards and navigation items, where the context already says "this is clickable". Ink colour, underlined on hover. Keeps AcmeCo's familiar bold black titles.
- **Inverse:** on dark surfaces such as the auction banner or a dark footer.
- **External:** set `external` when the link leaves AcmeCo or opens a new tab.
- With `icon`, a view switch that has its own address: the search results' "Map" (map icon) and "Gallery" (grid icon). The icon is decorative; the text names the link.

## When not to use

- For actions that change something (save, send, apply), use a Button.
- For a link that should look like a button ("View documents"), use a Button with `href`.
- Don't use subtle links inside body text: without the underline and colour, they're invisible there.

## Accessibility

- A real link (`<a href>`), built on React Aria: Enter follows it, and it works with middle-click and "open in new tab".
- Inline links are always underlined. Link blue is only 2.50:1 against ink body text, below the 3:1 that would let colour alone mark a link (WCAG 1.4.1), so the underline does that job.
- Link text meets AA everywhere it's used: blue 6.80:1 on white and 6.13:1 on grey, ink 17.04:1, white 12.71:1 on the navy banner.
- Focus shows the 2px blue ring, or a white ring on dark surfaces (the blue is only 1.87:1 on navy).
- External links add an icon and "(opens in a new tab)" for screen readers, so the new tab isn't a surprise.

## Content

- Say where the link goes: "View all office listings in Chicago", not "Click here" or "More".
- Keep link text unique on a page when the destinations differ: several "Learn more" links read the same to a screen reader listing the page's links.
- Don't put a full stop inside the link text.

## Evidence

- **Observed (audit family F01):** 3,295 instances, 21 variants, 44 distinct designs: the highest volume and the most variation in the audit after the property card.
- **Link colours observed:** four blues (`#0559b3`, `#0888ba` failing AA at 4.0:1, `#0c6cc4`, `#0056b6`), plus near-black bold links, greys, white and dark blue.
- **Now:** one blue (`#0559b3`, the most used, 1,007 elements in 11 experiences), ink for subtle links, white for inverse, and every state defined.
