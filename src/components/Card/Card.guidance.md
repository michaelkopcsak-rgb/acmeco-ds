## Overview

A surface that groups related content: AcmeCo's grey-edged panels. The broker page puts its Property Types and Markets, Bio and Listings in them; the property page puts small facts in outlined boxes. The three screens' gap logs asked for it (decision 47).

## When to use

- To group content that belongs together and sits beside other groups: a broker's panels (`appearance="raised"`), a listing's facts or one space (`appearance="outline"`).
- With `heading` when the group has a name: the card becomes a section named by it.
- With `actions` for what to do with the content ("Details").

## When not to use

- Not for a listing in a results list: that's PropertyCard.
- Not around a whole page section that already has a heading and sits on the page: a card around everything is no grouping at all.
- Don't nest cards.
- Don't make the whole card a link or button; put the action in `actions`.

## Accessibility

- With a heading, the card is a section labelled by it, so screen readers list it among the page's regions and read its name. Set `headingLevel` to fit the page's outline; the look doesn't change.
- The edge is decorative (#e5e5e5): the heading and the content carry the meaning, so it needs no contrast ratio.
- The raised card's shadow is decoration too; the edge stays, so the card's shape doesn't rely on the shadow.

## Content

- Keep headings short and plain ("Bio", "Property Facts", "Suite 300").
- Put the most useful line first; a card is scanned, not read.

## Evidence

- OBSERVED (broker page, 1700px and 400px): AcmeCo's own `lnc-card`: white, 1px #eeeeee edge, 4px corners, 30px padding (20px on the phone), a soft shadow (rgba(119,119,119,0.07) 0 2px 22px 10px), 15px between cards, 22px headings.
- OBSERVED (property page, F26.4): outlined boxes with a 1px #e5e5e5 edge, 8px corners and 16px padding.
- Now: one edge grey (#e5e5e5), 8px corners (decision 26: surfaces), 32px / 16px padding (the 4px grid and the gutter), the system's card shadow (decision 11), 20px headings (heading-3).
