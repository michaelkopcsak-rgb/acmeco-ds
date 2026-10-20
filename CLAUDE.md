# CLAUDE.md

## What this repo is

`acmeco-ds` is a working model of an AI-ready design system for **AcmeCo**, a fictional brand. Tokens, accessible React components, Storybook and a Figma library are all built from one source of truth (this repo), with the governance that lets an AI coding agent build with the system without drifting from it.

- **AcmeCo is fictional.** Listings, people, companies and photos in the stories are made up.
- **The idea:** a design system structured as machine-readable infrastructure, not just a component library:
  - tokens carry semantic meaning;
  - components carry guidance on when and why to use them;
  - AI agents read the system directly, alongside people;
  - contributing means adding to the grammar (the rules for combining parts), not just the vocabulary (the parts).
- **Governance:** `docs/GOVERNANCE.md` sets what an agent may do on its own, what needs a designer's approval, and the checks that keep code and Figma in step. Read it before changing anything.

## How to work

- **Plan before building.** For a new component, a new token or a change to an existing one, propose the approach and wait for approval before writing code (see `docs/GOVERNANCE.md`).
- **Explain in plain language:** what each file is for, what changed and why. When something breaks, fix it and say what caused it.
- **Verify, don't assume.** Check contrast with the script, render Storybook, run the tests, read Figma back after writing to it. Report results faithfully, including failures.
- **Keep the glossary** in `docs/NOTES.md` as new terms come up.
- **Record decisions** in the decision log in `docs/GOVERNANCE.md`: date, the options, the choice and why.

## Evidence labels (keep them)

Every token starts its `$description` with a label saying where its value came from. `npm run check:tokens` fails without one.

| Label | Meaning |
|---|---|
| **OBSERVED** | Measured on AcmeCo's existing product, the one this system consolidates |
| **LEGACY-NAMED** | A CSS custom property the existing product already exposes (`--legacy-*`) |
| **PROPOSED** | Our rationalisation; a hypothesis to validate |
| **BENCHMARK-INFORMED** | An enhancement motivated by comparison with a benchmark product |
| **REFERENCE-OBSERVED** | Measured on a reference product, for a feature AcmeCo doesn't have yet |

When a value changes from what was observed, say what was observed, what it became, and why (for example contrast or the 4px grid).

## The workflow (the repo is the source of truth)

1. **Tokens:** DTCG JSON in `tokens/` (primitives → semantic → component), built by Style Dictionary into CSS variables. Components use semantic or component tokens only, never primitives or raw values.
2. **Components:** React + TypeScript on React Aria, each with:
   - a guidance file;
   - Storybook stories and autodocs;
   - the accessibility addon and interaction tests.
3. **Catalogue:** `npm run catalog` writes `docs/catalog.json` and `docs/CATALOG.md`. They list every component's import, props, options, defaults, usage, stories and Figma set. An agent looks props up here instead of guessing, and CI fails if the catalogue is out of date.
4. **Review:** every change goes through a pull request on a branch.
   - GitHub Actions runs lint, the type check, the token, contrast and boundary checks, the catalogue drift check, the tests and the Storybook build.
   - Changesets record semver impact.
5. **Figma is a downstream mirror,** synced from the repo by the scripts in `scripts/figma/`. Components are never drawn by hand in Figma. The scripts cover:
   - variables in three collections, plus text and effect styles;
   - icons;
   - component sets bound to component variables;
   - documentation from the guidance files;
   - a parity check against the rendered code.

## Stack

- Vite + React + TypeScript, Node version pinned in `.nvmrc`
- Style Dictionary 5 (`scripts/build-tokens.mjs`, `outputReferences: true`)
- Storybook 10:
  - addons: `@storybook/addon-docs`, `@storybook/addon-a11y`, `storybook-addon-pseudo-states`;
  - tests through `@storybook/addon-vitest`, with axe set to fail;
  - published to GitHub Pages (`.github/workflows/pages.yml`).
- Changesets (`privatePackages.version: true`)
- Figma: the official Figma MCP and `use_figma`, driven by `scripts/figma/`

## Lessons learned

- **Theme attribute on `<html>`.** Component tokens defined on `:root` resolve their `var()` there, so `data-theme` must sit on `<html>`, in the app and in Storybook's decorator.
- **A token can't also be a group.** Name it `color.x.default` from the start, so `.hover` and `.pressed` can sit beside it. Renaming a token later is a breaking change.
- **Each state moves away from the page background:** darker in light mode. Check text contrast for every variant × state with the script (`tokens/contrast-pairs.json`).
- **Pseudo-states:** use story-level `globals: { pseudo: … }`, not `parameters`, or the forced state leaks into other stories.
- **Play functions** that click must `blur()` at the end, or the story keeps a stray focus ring.
- **React Aria renders collection items a moment after the container.** Tests wait with `findBy…` or `waitFor`.
- **Don't run `npm ci` while Storybook is running.** It replaces `node_modules` and breaks the running server.
- **Figma:**
  - Opacity variables are percentages (40 = 0.4 in CSS).
  - When binding a paint to a variable, store the resolved colour as the fallback.
  - Strokes count toward size only with `strokesIncludedInLayout`.
  - Rebuilding a component set changes its key; edit in place to keep instances linked.
- **Figma stores descriptions as HTML** (`'` comes back as `&#39;`): decode before comparing.
- **Generated docs are only as good as the guidance file.** Write structured sections (When to use, When not to use, Accessibility, Content).

## Rules

- **Secrets never go in files** (API keys, tokens). They live in GitHub Secrets or are typed in a terminal.
- **Brand:** AcmeCo is fictional.
  - The typeface is Outfit (400 and 600).
  - The brand and action colour is dark blue (`color.brand.700`, #123a7a); errors use a separate red.
- **Commits:** small and focused, with messages that say why. Never push straight to `main`.

## Where things are

| Path | Purpose |
|---|---|
| `docs/GOVERNANCE.md` | What an agent may do alone, what needs approval, the checks, the decision log |
| `docs/CATALOG.md` / `docs/catalog.json` | Every component's import, props, usage, stories and Figma name (`npm run catalog`) |
| `docs/BUILDING-SCREENS.md` | The rules for building a screen from the system; the `build-screen` skill (`.claude/skills/build-screen/`) runs them |
| `docs/NOTES.md` | Glossary and lessons |
| `tokens/` | DTCG tokens and the contrast pairs |
| `src/components/` | Components, each with a guidance file and stories |
| `scripts/` | Token build, checks (with self-tests), catalogue, Figma sync and generators |
