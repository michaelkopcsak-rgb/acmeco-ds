## Overview

AcmeCo's grey folder tabs, used to make one choice, as in **For Sale / For Lease / Auctions** at the top of the expanded filters panel. The selected tab is white and opens into the panel below. It keeps AcmeCo's look, measured from the live site's own CSS, and replaces the other two ways the site makes the same choice (blue text links that fail contrast, and a dropdown, which Select now covers).

## When to use

- Choosing the search mode or listing type at the top of a panel whose content depends on it.
- Two to four short options, where all of them should be visible.
- `fullWidth` when the tabs should span the panel.

## When not to use

- More than four options, or long labels: use Select.
- Several choices at once: use a CheckboxGroup.
- Moving between sections of a page with different content (Overview / Spaces / Location): true tabs (later), which also manage the panels.
- Inside a filter bar: use a compact Select ("For Sale ⌄"), as AcmeCo already does there.

## Accessibility

- It looks like tabs but behaves as a radio group, because it sets a value rather than switching page sections: one tab stop; arrow keys move the selection; screen readers hear "Listing type, radio group, For Sale, 1 of 3, selected".
- The label ("Listing type") is always the group's accessible name, and is usually hidden visually.
- Selected is shown three ways: white, a darker edge and a semibold label. AcmeCo's current white-on-grey is only 1.10:1 and its `#ddd` outline 1.35:1, below the 3:1 a selected state needs (WCAG 1.4.11); the darker edge is 3.81:1 against the page and 3.43:1 against the grey tabs.
- Labels are ink: 15.35:1 on grey tabs, 17.04:1 on the selected tab.
- Focus shows the blue ring around the focused tab.

## Content

- One or two words, parallel in form: "For Sale", "For Lease", "Auctions".
- Keep AcmeCo's order, most-used first.

## Evidence

- **Observed (audit family F16):** 34 instances, built three ways. The tabs: 25 instances in the expanded filters panel (desktop, tablet, mobile). Blue `#0888ba` text links: 9, in the filters-open state, failing AA. A "For Sale ⌄" dropdown pill: in the results filter bar and on Auctions.
- **AcmeCo's tab CSS (captured):** unselected `#f3f3f3`, 1px `#dddddd` outline on top and sides, 4px top corners, 16px at weight 300, 13 × 21px padding (46px tall); selected white with a 2px white bottom joining the panel, weight 400, 48px tall; 20px between tabs.
- **Now:** the same tabs at 48px, 24px padding, 16px apart, weights 400 / 600, and a darker edge on the selected tab so the state passes 3:1 (decision 24).
