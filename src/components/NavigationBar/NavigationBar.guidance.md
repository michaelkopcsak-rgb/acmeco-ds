## Overview

A labelled row of navigation links: AcmeCo's search links in the header (For Lease, For Sale, Auctions, Businesses For Sale), and the same links as a list in the phone menu. One component so every site navigation shares its type, spacing, current-page marking and focus ring (decision 35).

## When to use

- The header's search links (GlobalHeader uses it), horizontal.
- The phone menu, vertical: 40px rows, easy to tap.
- Other site navigation later (a detail page's section links), each with its own label.

## When not to use

- Not for actions (Sign In, Save): those are buttons.
- Not for a list of links in body text or a footer column; use a list of Links (the Footer has its own).
- Not for tabs that switch content in place: that's a different pattern (not in v1).

## Accessibility

- A `nav` landmark with a name (`label`, e.g. "Search"). AcmeCo's 36 navs have no names, so screen readers list several identical "navigation" landmarks.
- The links are a real list, so screen readers say how many there are.
- The current page is announced ("current page") and underlined, not marked by colour alone.
- Links are ink on white (17.04:1), underlined on hover, with the system's focus ring.

## Content

- Short labels in AcmeCo's words, title case as AcmeCo writes them ("Businesses For Sale").
- Four to six links; more belongs in a menu.

## Evidence

- OBSERVED (audit F32, 36 instances, 5 designs): on the core site, `nav.main-navigation` inside the header: 30px tall, links 16/24 at weight 400 in #1c1c1c with no underline, 16–24px apart; 14/21 on phones, where the links are hidden. Active, hover and focus states weren't captured; no nav was labelled.
- Now: 24px apart (on the grid), a name, current page underlined (PROPOSED), the links kept on phones in the menu.
