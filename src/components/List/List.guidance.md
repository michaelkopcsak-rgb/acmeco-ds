## Overview

A bullet list with AcmeCo's dark blue bullets: a listing's Highlights and its Features and Amenities. It closes the property page's list gap (decision 50).

## When to use

- For short points about one thing, in no particular order: a listing's highlights, the amenities of a building.
- `columns={{ base: 1, md: 2 }}` for longer points (AcmeCo's Highlights: two columns on desktop, one on phones); more columns for single words (amenities).

## When not to use

- Not for steps in order: those need a numbered list.
- Not for label / value pairs: that's FactList.
- Not for navigation links: those are a NavigationBar or the Footer.

## Accessibility

- A real list (`ul`, with `role="list"` so Safari still announces it after the bullets move to CSS): screen readers say how many points there are.
- The dark blue dots are decorative (10.98:1 on white all the same); the text is ink (17.04:1).
- In columns the points run down the first column and on to the next, so reading order matches the order on screen.

## Content

- Lead each point with its strongest fact ("Turnkey location…"); keep it to one or two sentences.
- No full stops after single words.

## Evidence

- OBSERVED (retail property page, 1700px and 400px): two lists side by side (608px each, 40px apart), one column on the phone; 20/25px text at weight 100; an 8px dark blue dot (#123a7a) on the first line, the text 20px in; 15px under each point.
- Now: 18/27 at 400 (decisions 4 and 9), 16px under each point, 32px between columns; one list in columns instead of two lists.
