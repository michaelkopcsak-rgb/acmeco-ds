## Overview

A modal dialog: it blocks the page until it's closed. Header with a required title and a Close button, a body that scrolls, and an optional footer for actions. Two sizes; full screen on phones. Used by sign-in, the contact form and the filters panel.

## When to use

- A short task that must be finished or dismissed before going back to the page: contact a broker, sign in, set filters.
- Put it in a `DialogTrigger` with the button that opens it; or control it with `isOpen` and `onOpenChange`.
- `md` (500px) for single-column forms; `lg` (768px) for two columns or many controls (sign-in, filters).

## When not to use

- Anything that doesn't need to block the page: use inline content, a popover (Select) or a new page.
- Long reading or multi-step flows: give them a page.
- Not for confirmations or alerts yet (`alertdialog`): none were observed on AcmeCo; add one when a flow needs it.

## Accessibility

- The title names the dialog ("Contact broker, dialog"). AcmeCo's captured dialogs have no name, and 7 of 10 aren't marked as dialogs at all.
- Focus moves into the dialog, stays inside until it closes, then returns to the button that opened it. The page behind can't be scrolled, clicked or reached by screen readers.
- Escape and the **Close** button (labelled; AcmeCo's are unnamed icons) always close it. Clicking the backdrop closes it too, except where `isDismissable={false}`: use that for any dialog holding a form, so a stray click doesn't lose typed input (decision 28).
- The fade is skipped for people who ask for reduced motion.

## Content

- Title: what the dialog is for, in a few words ("Contact broker", "Log in or sign up"). Sentence case.
- Footer: one primary action, named for what it does ("Send message", not "OK"); a secondary action to its left if needed.
- Keep the body short; if it scrolls a lot, it may want to be a page.

## Evidence

- **Observed (audit F31; captured CSS of AcmeCo's sign-in, contact broker and filters dialogs):** one modal system styled three ways: 768px / 8px corners / soft shadow (sign-in, the newest), 500px / 4px / grey glow with a sticky footer (contact), 852px / 4px / grey border (filters); centred titles and a 60% black backdrop on all; on a phone, contact and filters go full screen while sign-in runs off the screen.
- **Now (decision 28):** the sign-in look for all (8px, `shadow.raised`), two sizes (500 / 768px), the title in the heading-3 style, **left-aligned as a proposed polish** (AcmeCo centres dialog titles; decision 28, C), a sticky footer, full screen at 768px and below, named dialog and Close button.
