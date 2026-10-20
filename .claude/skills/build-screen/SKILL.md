---
name: build-screen
description: Build or recreate a page in the acmeco-ds design system: a screen from a screenshot or a description. Use when asked to recreate, prototype, mock up or build a screen or page with the system. Works in src/screens/ with the catalogue, the layout primitives and fixture data, checks the result and writes a gap log.
---

# Build a screen with the system

You are building a page from acmeco-ds components only. The rules are in `docs/BUILDING-SCREENS.md`; this skill is the order to work in. The goal is a faithful screen *and* an honest record of what the system couldn't do: a gap you log is a success, a gap you patch is a failure.

## 1. Read before you build

- `docs/BUILDING-SCREENS.md`: the rules (no CSS in screens, layout only through the primitives, the shell, headings, fixtures, the prototype label).
- `docs/catalog.json`: every component's import, props, choices, defaults and when to use it, plus types and the fixtures in `src/data`. Look props up here; don't guess them.
- `src/screens/PageShell/`: the worked example. Start from a copy of it.
- Earlier gap logs in `docs/screens/`, so you don't rediscover a known gap.

## 2. Understand the reference

- **A screenshot or sketch:** work from it.
- **A new screen:** restate the brief in a few lines and confirm it.

Listing content (addresses, prices, people, photos) is never copied. It's replaced by fixtures from `src/data`.

## 3. Map it before you write code

Write a table, top of the page to the bottom, one row per region:

| Region | What it is on the reference | System component(s) and props | Data from | Gap? |
|---|---|---|---|---|

Show the table to the owner and wait for a go-ahead before building. Treat a row with no component as a gap; don't plan a workaround.

## 4. Build

- `src/screens/<Name>/<Name>.tsx`, a component named after the folder, starting from the page shell (GlobalHeader, `main id="main" tabIndex={-1}`, Footer).
- Layout: PageContainer, Stack, Grid, Section, with named gaps only.
- One h1. Pass `headingLevel` down to components that contain headings.
- State a real page would hold (open dialogs, saved listings, filters) with `useState`.
- At each gap, use the closest thing or leave it out, and leave `{/* Gap N: … */}` in the code.
- `src/screens/<Name>/<Name>.stories.tsx`, titled `Screens/<Name in words>`:
  - `layout: 'fullscreen'`, and a `RouterProvider` decorator so links don't unload the page;
  - a desktop story and a `Phone` story (viewport `mobile1`);
  - a play test for the landmarks, the one h1 and the screen's main interaction. End by blurring whatever you focused.

## 5. Check

Run, and fix anything that fails in the screen, not in the checks:

```
npm run check:boundaries
npm run check:tokens
npm run typecheck
npx vitest run --project=storybook src/screens/<Name>
```

The story tests include the accessibility test (axe, set to fail).

## 6. Look at it

- Storybook runs on port 6007 (the "storybook" launch configuration). Open `iframe.html?id=screens-<name>--<story>&viewMode=story`.
- Screenshot it at desktop width and at 375px. Measure spacing and type with the browser's computed styles rather than judging by eye.
- Put it side by side with the reference. Every difference is one of:
  - a recorded decision (e.g. an accessibility fix from `docs/GOVERNANCE.md`);
  - fixture content;
  - a gap.

## 7. Write the gap log

`docs/screens/<name>-gaps.md`, in the page shell log's format:
- the reference;
- a table of gaps (Needed · What the system has · Done meanwhile · Proposed fix · Blocks other screens?);
- what worked;
- a recommendation for what the system should build next.

If there were no gaps, say so.

## 8. Report

Tell the owner, in plain language:
- what was built;
- where to see it (the story);
- the checks' results, including anything that failed;
- the top gaps.

Then follow the repo's workflow for the PR (`CLAUDE.md`).
