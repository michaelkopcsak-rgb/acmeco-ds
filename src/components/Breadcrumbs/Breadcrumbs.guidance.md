## Overview

Where a page sits in the site: a trail of links from the widest page to the current one, which comes last and isn't a link. AcmeCo shows one under a listing's title and at the end of the search results; its broker page has a one-step version back to the listing. The three screens' gap logs all asked for it (decision 47).

## When to use

- At the top of a listing (`appearance="strip"`, AcmeCo's light grey strip), and at the end of a results list.
- On a page reached from another one, to go back a level (a broker's page: the listing, then the broker), with `appearance="plain"`.

## When not to use

- Not as the site's main navigation: that's the GlobalHeader's NavigationBar.
- Not for steps in a process (a form in parts): that's a step indicator, which the system doesn't have yet.
- Don't add the current page as a link to itself.

## Accessibility

- A navigation named "Breadcrumb" holding an ordered list, built on React Aria's Breadcrumbs: screen readers announce how many items there are and where the reader is.
- The current page is plain text, marked with aria-current="page", so it's announced as the current page. AcmeCo links the ZIP code inside the current item; here the current item is text only, so the trail never ends in a link to somewhere else.
- The slashes are drawn by CSS with empty alternative text, so they aren't read out.
- Links are AcmeCo's blue, underlined on hover; text on the strip passes AA: link blue 6.46:1, the grey current page 5.48:1 and the ink slashes 16.18:1 on #f9f9f9.

## Content

- Use the names AcmeCo uses: the space type ("Office Spaces"), the state, the city, then the page itself (an address, or "Office Spaces for Lease in Denver, CO").
- Keep each label short; the current page may be longer and wraps on phones.

## Evidence

- OBSERVED (audit captures, property detail at 1700px and 400px): a #f9f9f9 strip with 1px #dddddd lines above and below, 14/18 text, blue links (#0559b3) without underlines, ink slashes about 4px from the words, the current address in grey (#63666a); on the phone the address wraps onto its own line.
- OBSERVED (map search, the list column's end): the same strip, 15px text, the current page in black. Now one size (14px) and one colour (grey) for both (decision 47).
- Now: 14/21 (decision 9), the system's default border (#e5e5e5) and page gutter (16px).
