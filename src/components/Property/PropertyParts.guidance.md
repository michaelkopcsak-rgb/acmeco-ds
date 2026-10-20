## Overview

The building blocks of AcmeCo's listing card ("card"), each usable on its own so the property detail page and contact flow can reuse them: **PropertyMedia** (photos, previous / next, save, labels), **PropertyHeader** (title and address | size and city), **PropertyFacts** (price first, then facts, with an optional description), **PropertyPrice**, and **BrokerIdentity** (company logo and up to three brokers). PropertyCard composes them per listing tier.

## When to use

- Inside PropertyCard (most of the time).
- On their own where a page needs one piece: the price on the detail page (`PropertyPrice size="prominent"`), the broker block in the contact module, the photo carousel at the top of a listing.
- Layouts: PropertyHeader `row` or `compact` (tier 3, no size column); PropertyFacts puts the description `beside` or `below` the facts, and moves it below on its own when narrow; BrokerIdentity `row` or `stacked`.

## When not to use

- Don't rebuild a card from raw parts in a page: use PropertyCard, so every card stays consistent.
- Don't put interactive controls other than the save toggle, Ask AcmeCo (`onAsk`, a proposal, decision 45) and the photo arrows on the photo.

## Accessibility

- **Media** is a named carousel ("Photos of Larkspur Commons"); the arrows are labelled ("Previous photo", "Next photo"); the change is announced ("Photo 2 of 12"); the save toggle is named for the listing ("Save Larkspur Commons") and announced as pressed. Each photo has alt text. AcmeCo's arrow and heart have no accessible names today.
- **Header:** the title is a real heading (level set by the page) and the card's one link.
- **Price:** abbreviated units are spelled out for screen readers ("$28.50 per square foot per year"); "Price Upon Request" is grey (5.77:1) so real prices stand out.
- **Brokers** are a labelled list; placeholder initials are hidden from screen readers (the name follows). With `names="hidden"` (tier 2 with several brokers, as AcmeCo shows only photos) the names are still read out.
- All text is ink (17.04:1) or secondary grey (5.77:1).

## Content

- Use AcmeCo's wording: "8,024 SF Available", "Built in 1963", "253 - 8,024 SF", "Price Upon Request".
- Facts: three to five short lines, most useful first, after the price.
- Descriptions: one or two sentences; longer text belongs on the detail page.

## Evidence

- **Observed (audit F28, captured DOM of the search-results and map cards):** the header row in every tier; facts "Built in 1963 / 253 - 8,024 SF / Price Upon Request"; a 24px next arrow and heart on the photo with no `aria-label`; broker logo and up to three 50px broker photos.
- **Type changed by page on the same listing:** header 14px bold (list) vs 19px bold (map); facts 12px at weight 100 (list) vs 16px (map). Now one scale: header 18/27 semibold, facts 14/21 regular, everywhere.
- **Now:** labelled 32px photo controls, the price lifted to the first fact in semibold (decision 27), placeholders instead of real photos, people and logos.
