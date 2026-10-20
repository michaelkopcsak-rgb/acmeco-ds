## Overview

A listing in search results: AcmeCo's **card**. AcmeCo sells listing tiers, and the tier decides how much the card shows, so PropertyCard takes AcmeCo's own `tier` (1, 2, 3). Every tier shares the same parts (see **Property parts**), type scale, container and click behaviour.

| Tier | Layout |
|---|---|
| **1** | Header row, full-width photo, facts \| description, logo and up to three brokers |
| **2** | Header row, then photo \| facts, description, logo above the brokers. Stacks on narrow cards. |
| **3** | Compact: photo \| title, address, city, facts \| company logo. No description or broker photos. |

## On phones

Below 768px the card is flat and edge to edge, with a grey band under it (put the list in a Bleed with `gap={{ base: 'none', md: 'lg' }}`); on a narrow card the header stays side by side (the right column cut short with an ellipsis), the facts stay beside the description, and the brokers show as photos without names (still read out), as on AcmeCo's phone (decision 42).

## When to use

- Search results, in the list and the map sidebar.
- Anywhere a listing is offered as one item among many (saved listings, "similar listings").
- With `onAsk` (a proposal, decision 45), a sparkle button on the photo beside Save, named "Ask AcmeCo about {listing}": the page opens the Assistant with a question about the listing (Assistant `question`).

## When not to use

- The property detail page: use the parts on their own (`PropertyMedia`, `PropertyPrice`, `BrokerIdentity`).
- Auctions cards and the homepage "Trending" card: they aren't in v1 and need their own variants.
- Don't choose the tier for looks: it reflects what the advertiser bought.

## Accessibility

- **One link per card:** the title. It is stretched over the whole card, so clicking anywhere opens the listing, while keyboard and screen-reader users meet one link, not several anonymous ones. When it has focus, the whole card shows the focus ring.
- The save toggle and photo arrows sit above the link and work on their own ("Save Larkspur Commons", "Next photo").
- The card is an `article` named by its title, which is a heading (`headingLevel`, h3 by default under the results' h2). The title comes first in reading order in every tier, even where the photo comes first on screen.
- In tier 2 with several brokers only initials show, as AcmeCo shows only photos; the names are still read out.
- Layout follows the card's own width (container queries), so the same card works in the list, the map sidebar and on a phone.

## Content

- Title: the property's name, or its street address if it has none.
- Facts follow the price: "Built in 1963", "253 - 8,024 SF"; tier 3 adds "4 Spaces Available".
- Descriptions are cut to three lines; the full text belongs on the detail page.

## Evidence

- **Observed (audit F28, captured DOM of the results list and map view):** `card tier1/tier2/tier3` with `contact-count-1/2/3`; map view 670px wide: tier 1 photo 668 x 370px, tier 2 photo 360px beside 308px of details, tier 3 photo 290px with a 100px logo column; 1px `#e2e2e2` border, a 0 1px 4px 2px shadow and square corners; 20px side padding.
- **Now:** 8px corners (decision 26), 16px padding, one type scale in every view, the price first in the facts (decision 27), one stretched link and a card-wide focus ring, labelled photo controls.
- The full-width list view stretches the tier 1 photo into a 1703 x 212px banner; the card keeps the map view's shape at every width.
