# Building screens with the system

*Prototype · AcmeCo is a fictional brand. The rules for building a screen or prototype from this design system (decisions 34 and 37). Claude Code follows them through the `build-screen` skill (`.claude/skills/build-screen/`); people can follow them by hand.*

## Before you start

1. **Read the catalogue:** [CATALOG.md](CATALOG.md) (or `catalog.json`). It lists every component with its import, props, the values each choice takes, when to use it and when not to, plus the types props take and the fixture data in `src/data`. Don't guess a prop: look it up.
2. **Have a reference:**
   - for a recreation, a screenshot;
   - for a new screen, a description or a sketch.

## Where a screen lives

- `src/screens/<Name>/<Name>.tsx`: the screen, a component named after the folder.
- `src/screens/<Name>/<Name>.stories.tsx`: its story, titled `Screens/<Name in words>`, with `layout: 'fullscreen'`. Add a `Phone` story with `globals: { viewport: { value: 'mobile1', isRotated: false } }`.
- `docs/screens/<name>-gaps.md`: its gap log (below).

The worked example is the page shell, `src/screens/PageShell/`. Start every screen from it.

## The rules

These are checked: `npm run check:boundaries` covers `src/screens/`, and every story runs the accessibility test.

1. **Only the system:** a screen imports React, components (`src/components`), icons (`src/icons`), hooks (`src/hooks`) and data (`src/data`, fixtures included). Not react-aria-components, not other packages, not another screen. The story may also use `RouterProvider` from react-aria-components, so pressing a link doesn't unload the test page.
2. **No styling of its own:**
   - no CSS file and no `style={…}`;
   - no `className` (except the global `sr-only`, for text only screen readers need);
   - layout only through the primitives:
     - `PageContainer` for the page's width and side gutters;
     - `Stack` for one thing after another (`gap` takes a named step: 2xs … 3xl, `block`, `section`);
     - `Grid` for columns (`columns` per breakpoint, or `template="main-aside"` for content beside a 340px aside);
     - `Section` for a part of the page named by its heading.
3. **The shell:** GlobalHeader first, then `main` with `id="main"` and `tabIndex={-1}` (the skip link moves focus there), then Footer. Their content comes from `src/data` (`navigation`, `site-menu`, `locales`, `sign-in`, `footer`).
4. **Headings:** one `h1` per page. Sections go down in order (h2, then h3), never skipping a level. Components that contain headings take a `headingLevel` prop: pass the level that fits where they sit.
5. **Fixture data only:** listings, brokers and photos from `src/data` (synthetic, illustrated). No real listings, people, photos, phone numbers or logos, and no AcmeCo logo.
6. **The prototype label:** keep the Footer's default copyright line. It says "Prototype · AcmeCo is a fictional brand".
7. **Interactive parts behave like the components do:** a dialog opens from a button (`DialogTrigger`), a link navigates (`href`), a button acts (`onPress`). A screen holds the state a real page would hold (the current locale, the open dialog, the saved listings), with `useState`.

## When the system has no answer

Don't invent one in the screen. A screen that patches a gap hides it, and the next screen patches it differently.

1. Use the closest thing the system has, or leave the part out.
2. Add a row to the screen's gap log, `docs/screens/<name>-gaps.md`:
   - **Needed:** what the screen needed.
   - **What the system has:** what the system offers instead.
   - **Done meanwhile:** what the screen did instead.
   - **Proposed fix:** a component, a prop or a token.
   - **Blocks 6c?:** whether other screens will hit it too.
3. Leave a short comment in the screen where the gap is (`{/* Gap 2: … */}`).

The logs decide what the system builds next. The page shell's log is the example: [page-shell-gaps.md](screens/page-shell-gaps.md).

## When it counts as done

- [ ] `npm run check:boundaries`, `npm run check:tokens` and `npm run typecheck` pass.
- [ ] The story's tests pass with 0 accessibility violations: `npx vitest run --project=storybook src/screens/<Name>`.
- [ ] It has been looked at in Storybook at desktop and phone widths.
- [ ] For a recreation, it has been compared with the reference side by side, and every difference is either a decision (a recorded change, such as an accessibility fix) or a gap.
- [ ] The gap log is written. If there were no gaps, say so.
- [ ] `npm run catalog` has been re-run if a component changed.

## Figma

Screens are built in code first, then generated into Figma from the rendered page (decision 46). Never draw them by hand.

1. Give the screen a still story (no clicks in its test) for each state you want in Figma.
2. Write a config in `scripts/figma/screens/<id>.mjs`: the story, the window size, the target file and page, where the frame goes, a caption, numbered notes if it's a proposal, and `links` (a control that opens another frame, or `back: true`).
3. `node scripts/figma/screen-spec.mjs <id>` reads the page into `figma/screens/<id>.json`: every component's marker (`src/components/ds.ts`) becomes a library instance with its box, variant and text.
4. `node scripts/figma/render-components.mjs screen <id>`, then run the script with `use_figma` in the target file. It imports the published library by key (`figma/library-keys.json`, written once the library is published), reuses an existing frame of the same name (links to it keep working) and reports every size that differs from the page.
5. Once every frame exists, `render-components.mjs screen-links <id,id,...>` wires the hotspots for prototype mode; `screen-docs <docs id>` builds a documentation frame.

The library must be published for another file to use a set, and a set rebuilt in the library gets a new key: publish, re-read the keys, and rebuild the screens.

## Clickable prototypes

A prototype wires finished screens together so someone can click through them. It lives in `src/prototypes/<Name>/`, with a story under "Prototypes/", and follows the screen rules (system only, no CSS, no style, no className except sr-only). It may also import screens and React Aria's RouterProvider, to send the screens' links to the right page.
