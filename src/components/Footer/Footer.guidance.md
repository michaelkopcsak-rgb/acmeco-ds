## Overview

AcmeCo's site footer, once per page after `main`: five columns of links (Search, Products & Services, Marketplace, Resources, Company), then the mark, "Connect with us", the social links, the copyright and the app links, on AcmeCo's light grey under a 2px line (decision 35).

## When to use

- At the end of every page, outside `main`. Pass the columns, social links and app links (screens get them from `src/data/footer.ts`).
- Add `disclaimer` where a page needs one (the search pages).

## When not to use

- Don't use a second footer design for some pages: AcmeCo's search pages built a flat-list footer; it folds into this one (decision 35, D).
- Don't put page actions here.

## Accessibility

- A real `footer` landmark (contentinfo), outside `main`. On 25 of 31 AcmeCo pages the footer is a `section` inside `main`, so there's no footer landmark.
- Each column is a heading (level set by the page, h2 by default) and a list of links, so screen readers can jump by heading and hear how many links each has.
- Social links are named ("AcmeCo on LinkedIn") and say they open a new tab; AcmeCo's have no names. Marketplace links show the external-link icon and say so, as AcmeCo's own menu does for Marketing Center.
- Links are the secondary grey on light grey (5.20:1); headings and text are ink (15.35:1).
- The columns reflow (5, then 3), and on phones `phoneLinks` gives AcmeCo's single list of links, with lines between them, in their place; the brand block is centred there, with the disclaimer last (decision 51). Without `phoneLinks` the columns go to two on phones, so nothing goes off screen.

## Content

- AcmeCo's links in its order and words.
- The social marks, app links and copyright are placeholders in this prototype: the networks' and stores' artwork is licensed, and the copyright line says it's a prototype (decision 35, E and F).

## Evidence

- OBSERVED (live site, 2026-10-10, 1440 and 375px; audit F34, 31 instances): #f3f3f3 with a 2px #e5e5e5 top line; 48px padding (24 / 32px on phones); five 256px columns 16px apart, headings 16px at 400 in ink, links 16/24 at 400 in #63666a on a 32px pitch; below them the logo, "Connect with us" and the copyright (weight 300), five 24px social icons and two app badges; on a 375px phone the columns stay side by side and Company is off screen.
- Now (decision 35): the same layout and colours, weight 400 throughout, reflowing columns, a footer landmark, headings and lists, named placeholder marks and text app links.
- OBSERVED (a phone recording of a live listing, 2026-10-11): on the phone the footer is one list of 12 links (About Us … Licensing) with thin lines between them, edge to edge, then the logo, "Connect with us", the social icons, the copyright and the app badges, centred, and the disclaimer. Now: that list with `phoneLinks`, 8px above and below each link (38px rows), the links 16px in (decision 51).
