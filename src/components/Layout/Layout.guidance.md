## Overview

The layout primitives: **Main**, **PageContainer**, **Stack**, **Grid**, **Section**, for a search page **StickyTop** and **SplitView**, and **Sticky** and **Dock**. Screens use them for every width, gap and column, so a screen never writes layout CSS and stays on the 4px grid and AcmeCo's own layout values (decision 34). Gaps are named steps (`2xs` 4px … `3xl` 64px, plus AcmeCo's fluid `block` and `section` gaps), never numbers.

| Primitive | What it does |
|---|---|
| Main | The page's main landmark: the skip link's target, with space above and below the content (decision 38) |
| PageContainer | Centres content at 1440px with the 16px gutter |
| Stack | One direction, a gap between items; alignment and wrapping |
| Grid | Equal columns per breakpoint, or `main-aside` (content + 340px sidebar) |
| Section | A named `section` whose blocks sit a block gap apart |
| StickyTop | Keeps the header (and a search page's filter bar) at the top while the page scrolls (decision 40) |
| Sticky | Keeps something (a listing's contact box) in view below the StickyTop from 1024px (decision 41) |
| Hide | Shows its content only at some widths (a phone's filter bar, a desktop's Sort); adds no box (decision 42) |
| Divider | A thin line across, or a short one between items in a row ("Save \| Map") (decision 42) |
| Bleed | Takes its content to the screen's edges on phones (a results list, cards edge to edge) (decision 42) |
| Dock | Fixes something (the AI assistant) to the window's bottom-right corner (decision 41) |
| SplitView | AcmeCo's results layout: an aside (the map) filling the window below the StickyTop and staying put, beside a 670px list that scrolls (decision 40) |

## When to use

- **Main** once per page, between GlobalHeader and Footer, with a PageContainer inside it. `paddingBlock` (default `xl`, 32px) sets the space under the header and above the footer.
- **PageContainer** once per band of the page (header, main, footer), around the content that should line up with the page edges.
- **Stack** for anything in a line: fields in a form (`md`), cards in a list (`lg`), a row of buttons (`horizontal`, `xs`), sections of a page (`section`).
- **Grid** for columns that collapse: result cards (`columns={{ base: 1, md: 2, xl: 3 }}`), the property detail page's content and contact sidebar (`template="main-aside"`).
- **Section** for each titled part of a page; pass the heading's id as `labelledBy`.
- **StickyTop** around GlobalHeader and a search page's filter bar, so they stay at the top as on AcmeCo's results. Give the bar a PageContainer with `paddingBlock="xs"`.
- **Sticky** as the aside of Grid's `main-aside` (it must be the grid's direct child), around the contact box.
- **Band** for a strip across the window: a white title band or filter bar (`divider` adds the line under it), or AcmeCo's grey results bar (`tone="subtle"`). Put a PageContainer inside it.
- **PageContainer** `width="gallery"` for the gallery results (cards two by two, about 1,032px wide).
- **SplitView** `placement="top"` puts the map in a 360px band above a full-width list that stays in view while the cards scroll beneath it (a proposal, decision 45); give the list a Grid so the cards sit in rows.
- **Dock** once per page, after the Footer, around the Assistant (with `clearBar` when the page has a bar); `placement="bar"` for a phone's bar of actions fixed to the bottom (a listing's Call and Message), which keeps the page's end clear of it.
- **StickyTop** `fixedOnPhones` keeps a listing's header and title bar at the top on phones too.
- **Hide** `as="span"` hides part of a line, such as a heading's address on phones.
- **Stack** options: `fill="first"` gives the first child the space left (a search box beside a button); `scrollBelow="md"` keeps a phone's pills on one line, scrolling sideways; `gap={{ base: 'none', md: 'lg' }}` changes the gap from 768px.
- **Hide** when a phone needs a different arrangement of the same controls (`below="md"` / `above="md"`); hidden content is gone for screen readers too, so each width must still have every control.
- **StickyTop** is fixed from 768px only; on phones it scrolls away so the list has the screen. **SplitView** `compactAside="hidden"` hides the map on phones until a Map link shows it.
- **SplitView** straight inside Main (full width, not in a PageContainer) with `aside={<MapPlaceholder …/>}` and the results as its children. Below 1024px the aside is a 240px band above the list.

## When not to use

- Not inside components: they bring their own layout and tokens. The primitives are for screens.
- Don't nest Stacks to fake columns; use Grid.
- Don't use StickyTop on ordinary pages: a fixed band takes room from the content, a third of a phone's screen when a filter bar wraps.
- Don't add a margin or a `style` to space things out; pick a gap. If no step fits, that's a gap in the system: log it (see the screen-building guide).

## Accessibility

- Main renders the page's `main` landmark with `id="main"` (GlobalHeader's skip link points there) and takes focus when the skip link is used, with no ring, since it isn't a control.
- The other primitives add no roles of their own: choose the element with `as` (`main`, `nav`, `ul`, `form`), so the page's landmarks and lists are real.
- Section renders `section` with `aria-labelledby`, which makes it a region named by its heading; without `labelledBy` it's a plain grouping.
- Visual order follows source order (no reordering), so keyboard and reading order match what's on screen. In `main-aside`, the sidebar comes after the content on narrow screens, as in the source.
- Nothing is hidden or clipped by the primitives, so text can grow (200% zoom) and wrap.

## Content

- One `h1` per page, then headings in order; the primitives don't set heading levels.
- Group by meaning, not by look: a Section is a part of the page someone could name.

## Evidence

- LEGACY-NAMED: `--legacy-container-max` (1440px), `--legacy-container-gutter` (15px, became 16px for the 4px grid), `--legacy-block-gap` (clamp(40px, 5vw, 72px)) and `--legacy-section-gap` (clamp(48px, 8vw, 96px)) from AcmeCo's own CSS; breakpoints 450, 768, 1024 and 1280px observed on the core site.
- OBSERVED: the property detail page's contact sidebar is 340px wide (ContactModule, decision 30).
- OBSERVED: on AcmeCo's results the header and filter bar stay at the top, the map fills the window beside a 670px list and stays put while the list scrolls (owner's review, 2026-10-10; audit capture).
- PROPOSED: Main's 32px space under the header and above the footer (found missing by the page shell pilot, gap 3 and 4).
- PROPOSED: the gap names, and `main-aside` stacking below 1024px. The audit found 25–34% of interior-page spacing on the 4px grid; named steps are how screens built on the system keep to it.
