## Overview

The headings of a page and its sections in the system's type styles: **display** (hero), **heading-1**, **heading-2** and **heading-3**. The `level` (h1–h6) sets the page's outline, which screen readers navigate by; the `size` sets the look, so the two can differ (a section's h2 can look like heading-3). No margins: the layout primitives set the space around it. Found missing by the page shell pilot (gap 1, decision 38).

## When to use

- **Level 1, once per page:** the page's title (heading-1; display for a hero).
- **Levels 2 and 3** for sections and the parts inside them, in order.
- **Per width:** `size={{ base: 'heading-3', md: 'heading-2' }}` for a heading that's smaller on phones (a listing's title bar), and `align="center"` to centre its lines.
- **With Section:** give the heading an `id` and pass it to Section's `labelledBy`, so the section is a region named by its heading.

## When not to use

- Not for emphasis or a big number in body text: use Text (or a component such as PropertyPrice).
- Don't pick a level for its look: choose the level from the outline and set `size` for the look.
- Don't skip levels (h1 then h3); screen-reader users lose their place.
- Inside components that render their own headings (PropertyHeader, Dialog, Footer), pass `headingLevel` to them instead.

## Accessibility

- A real h1–h6, so headings appear in the screen reader's headings list and outline.
- Ink on white, 17.04:1 (15.35:1 on the light grey).
- Line heights are 1.25 or more and set in pixels from the tokens, so a two-line heading never overlaps; text can grow to 200% and wrap.

## Content

- Sentence case, as AcmeCo writes its headings ("Office space for lease in Denver").
- Say what the section holds; keep the page title close to what the person searched for.

## Evidence

- OBSERVED: headings at regular weight, 28–34px for section headings (heading-1, 32px), 24px and 20px for smaller ones; 48px hero headings.
- PROPOSED: heading-3 semibold (the bold role, decision 4); line heights on the 1.5x / 4px rhythm; display stepping down to 32px at 768px and below; no margins (spacing from the primitives).
