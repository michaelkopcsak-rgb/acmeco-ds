## Overview

AcmeCo's site header, once per page: the logo (a neutral placeholder mark and the name, decision 35) and the search links (For Lease, For Sale, Auctions, Businesses For Sale) on the left; the **globe** (language, region and currency), **Sign In**, **Advertise** and the **menu** on the right, on white under AcmeCo's 2px dark blue line. A **Skip to main content** link comes first. On phones (450px and below) the header is the logo, the globe and the menu: the search links, Sign In and Advertise live in the menu, as on AcmeCo's phones (decisions 35, 36 and 42). On a phone listing, `back` adds a back arrow before the logo, and `pageActions` swaps the globe and menu for the listing's save and share once its actions row has scrolled under the header (decision 51).

## When to use

- At the top of every page, before `main`. Give `main` an id (default `main`) and `tabIndex={-1}`, so the skip link can move focus to it.
- Pass the search links with the current one marked (`isCurrent`), the menu's links, the language and currency choices with the current ones, and the sign-in slides. Screens get them from `src/data/`.

## When not to use

- Not over a photo hero: the transparent homepage header isn't in v1.
- Not as a sticky bar: it scrolls with the page, as on AcmeCo's search results.
- Don't add or remove actions per page: Advertise is on every page, in the header from 451px and in the menu on phones (the owner's decisions 36 and 42).

## Accessibility

- A `header` landmark (banner). The **skip link** is the first thing Tab reaches: it appears over the header's corner and moves focus to `main` (AcmeCo's core site has none).
- The logo link is named "AcmeCo home"; the mark is hidden from screen readers.
- The search links are a named navigation ("Search"); the current page is announced and underlined.
- The **globe** is named "Language and region" and opens the LocaleDialog; **Sign In** is a real button (AcmeCo's is a `div`) that opens the SignInDialog; the **menu** button is named "Menu" (AcmeCo's globe and menu buttons have no names). Every dialog and panel returns focus to its button.
- Text is ink on white (17.04:1).

## Content

- Keep AcmeCo's labels and order: "For Lease", "For Sale", "Auctions", "Businesses For Sale", then the globe, "Sign In", "Advertise", the menu.
- The logo is a placeholder in this prototype; AcmeCo's own logo goes back in production.

## Evidence

- OBSERVED (audit F33, 30 instances; live site, 2026-10-10, signed out, 1440 / 1024 / 768px): 64px tall, 16px padding, white, a 2px #123a7a line along the top; logo 135 × 32; search links; then a 24px globe button, Sign In (a `div`), Advertise (a link) and a 24px hamburger, at every width checked; on phones the search links leave the header.
- Now (decisions 35 and 36): the same order and look; a skip link; named globe and menu buttons opening LocaleDialog and SiteMenu; Sign In wired to SignInDialog; 24px gaps (8px on phones); on phones (450px and below) only the logo, the globe and the menu, as AcmeCo's phone header (a reference screenshot, decision 42; earlier the globe gave way to Sign In and Advertise).
- OBSERVED (a phone recording of a live listing, 2026-10-11): a back arrow before the logo with a thin line after it; once the location, share and save row under the photo scrolls away, a heart and a share icon replace the globe and the menu, and scrolling back up brings them back. Now: `back` and `pageActions` (phones only; desktop unchanged).
