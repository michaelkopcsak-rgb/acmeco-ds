# Governance: how people and AI agents change this system

*Prototype · AcmeCo is a fictional brand.*

This design system is meant to be read and used by AI coding agents as well as by people. That only works if it is clear what an agent may do on its own, when a designer must approve, and what catches drift automatically. This page sets those rules. `CLAUDE.md` points every Claude Code session here.

## 1. Who decides what

| Change | An agent may do it alone | Needs a designer's approval first | Why |
|---|---|---|---|
| Build a screen or prototype **from existing components** (`docs/BUILDING-SCREENS.md`) | ✓ after the region map is approved | The region map (what goes where) | Screens are ideation: fast, disposable, built only from the system |
| Log a gap (something the system can't do) | ✓ | | A logged gap is a success; a patched gap is drift |
| Fix a failing check in a component's own code | ✓ | | The checks define correct |
| Add or change a **component** | | ✓ a written proposal (anatomy, props, tokens, states, accessibility, evidence) | Components are the vocabulary; every screen inherits them |
| Add or change a **token** | | ✓ with its evidence label and contrast pairs | Tokens are the grammar's values; a wrong one spreads everywhere |
| Add a boundary exception | | ✓ with a reason in `scripts/boundary-exceptions.json` | Exceptions are debts; each is revisited |
| Write to the **Figma library** | | ✓ (the sync runs from a merged commit) | Figma mirrors the repo; it never leads it |

Every change, approved or not, goes through a pull request. Nothing is pushed straight to `main`.

## 2. What catches drift automatically

| Check | Command | Fails when |
|---|---|---|
| Token labels and usage | `npm run check:tokens` | A token has no evidence label; component CSS uses a primitive or a raw colour; an icon is imported around the registry |
| Contrast | `npm run check:contrast` | Any pair in `tokens/contrast-pairs.json` (every variant × state) misses WCAG AA |
| Layer boundaries | `npm run check:boundaries` | A product component imports React Aria or fixture data directly; a screen adds its own CSS, `style` or `className`, or imports something outside the system |
| Catalogue drift | `npm run catalog` in CI | `docs/catalog.json` no longer matches the components' props |
| Tests and accessibility | `npm test` | An interaction test fails, or axe finds a violation in any story |
| Types and lint | `npm run typecheck`, `npm run lint` | |
| Figma parity | `node scripts/figma/render-components.mjs component <id> parity` | A Figma component's sizes, colours, type or spacing differ from the rendered code |
| Figma variables | `scripts/figma/render.mjs … expect` | The Figma variables' digest differs from the repo's |

Each check script has a self-test (`--self-test`) with known-good and known-bad fixtures, so a check that silently stops checking fails too.

## 3. How an agent uses the system

1. Reads `CLAUDE.md` and this page.
2. Looks components and props up in `docs/catalog.json`, never guesses them.
3. Builds only from components, layout primitives and named tokens.
4. Where the system falls short, uses the closest part and writes the gap down (`docs/screens/<name>-gaps.md`), rather than adding CSS.
5. Runs the checks, renders the result, and reports faithfully, failures included.
6. Proposes system changes (from the gap logs) for a designer to approve, as a pull request.

## 4. Decision log

Decisions are numbered; code comments cite them as "decision N". Each records the options considered and the choice.

| # | Decision |
|---|---|
| 1 | One action colour, dark blue (`color.brand.700`), for every action and for checked and selected states |
| 2 | Light mode only for v1 |
| 3 | React Aria Components for accessible primitives |
| 4 | Outfit at weights 400 and 600 |
| 5 | Values rationalised to a 4px grid; radii 4 / 8 / 16 / pill; control borders `#808386` (3:1) |
| 6 | Lucide icons through one registry (`src/icons`) |
| 7 | Errors use a separate red (`color.red.700`), always with an icon and a message |
| 8 | Branch protection: every change through a pull request with CI |
| 9 | Line heights kept at 1.5× |
| 10 | Component tokens are written with each component |
| 11 | One card shadow (`shadow.raised`) |
| 12 | Explicit disabled greys instead of opacity |
| 13–15 | One Figma file; primitives hidden from Figma pickers; motion and fluid-layout tokens documented as text |
| 16–19 | Button: neutral tertiary, label weight 400, a loading state; IconButton plain / overlay / primary |
| 20–25 | Link variants; TabSelector (grey folder tabs, radio-group behaviour); Badge and Chip shapes |
| 26 | Shape follows role: pill = floats or filters; 4px = act or type; 8px = surfaces; 16px = dialogs; square = edge-attached |
| 27 | PropertyCard in three tiers that set its layout; a stretched title link with a card-wide focus ring |
| 28 | Dialog: 8px corners and `shadow.raised`, sizes 500 / 768px, full screen at 768px and below |
| 29 | Assistant (AI chat): launcher, docked and expanded panel, announced replies |
| 30 | Product components are built only from the system (`check:boundaries`); exceptions listed with reasons |
| 31 | SignInDialog: text sign-in options; promo below the form on phones |
| 33 | Figma library: a Component variable collection; components generated from specs, checked for parity |
| 34 | Layout primitives and a page shell; screens use only them |
| 35–36 | Page shell: header, navigation bar, site menu, locale dialog, footer |
| 37 | The AI usage layer: a generated catalogue, a screen-building guide and skill, boundary rules for screens |
| 38 | Heading, Text and Main as components |
| 39 | A drawn map placeholder instead of map tiles |
| 40–45 | Filter buttons, fixed and split layouts, phone layouts, gallery and map views |
| 47 | Breadcrumbs, Card with FactList, Table |
| 50–51 | List; phone footer links; listing header actions |

New decisions are added at the end with a date, the options and the reason.
