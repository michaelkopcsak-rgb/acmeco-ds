## Overview

An AI assistant people can type or talk to about listings. A floating **launcher** ("AcmeCo AI") opens a short **connecting** bar, then a **panel** with the conversation, a text box, Voice Mode and End chat; **expand** grows the same panel taller, with a header and a collapse button. AcmeCo doesn't have this today: it's modelled on the assistant AcmeCo runs publicly on a reference product, in AcmeCo's navy and blue, on AcmeCo's shape rule (decision 29). **Prototype:** replies are scripted and voice is simulated.

## When to use

- Once per page, floating near the content it helps with (search results, a listing), usually bottom right.
- `launcherSize="lg"` beside the homepage search; `md` elsewhere.
- Pass `respond` to connect it to a real service; the component handles states, focus and announcements.
- With `question`, opened from elsewhere on the page: a result card's "Ask AcmeCo" (decision 45) passes `{ id, text }`, and the assistant opens if needed and asks it. A new id asks again.

## When not to use

- Not as a replacement for search filters or the contact form: people must be able to do everything without it.
- Not more than one per page.
- Don't put the launcher where it covers a listing's price, title or primary action.

## Accessibility

- The launcher is a real button; the panel is a labelled region ("AcmeCo AI"), not a modal, so the page stays usable beside it.
- The conversation is a `log`: screen readers hear new messages as they arrive, each starting with who it's from ("You:", "AcmeCo AI:"). When it's long enough to scroll, it can take keyboard focus for arrow-key scrolling.
- "AcmeCo AI is thinking" is announced once; the bouncing dots are decoration.
- The text box has a real label ("Message AcmeCo AI") and a readable placeholder; Enter sends. the reference product's placeholder is 1.8:1 and seems to be its only label.
- Voice Mode is a toggle that announces on or off. The microphone button says what it will do ("Mute microphone" / "Unmute microphone").
- Focus moves to the text box when the panel opens and back to the launcher when it closes. Escape collapses the panel and keeps the conversation; End chat clears it.
- The greeting appears once (a reference product repeats it).
- The moving edge, the dots and the fade stop for people who ask for reduced motion.

## Content

- Name: "AcmeCo AI" (the final name is AcmeCo's call).
- Greeting: one short line that says what it can help with.
- Replies: plain sentences; link to the listing or search rather than repeating long details.
- Say clearly when an answer is uncertain, and never invent prices or availability.

## Evidence

- **REFERENCE-OBSERVED (the reference product's public CSS, `--ref-ai-*`, read 2026-10-09 without opening the chat; reference screenshots):** 40/48px launcher pill with a 2px gradient border; a 440px bar with a gradient edge sliding over 4s; a white panel with 16px corners and a 0 6px 16px shadow; grey user bubbles (`#f5f5f5`, 10px, max 75%); 32px Voice Mode and End pills with 14px text; three 10px dots bouncing over 1.2s; placeholder `#bfbfbf`.
- **Now (decision 29):** navy-to-blue accent instead of green; panel 8px and controls 4px per the shape rule; ink text; a 3:1 control outline (observed `#d2d2d2`, 1.5:1); labelled text box, log announcements, toggles, focus handling.
