## Overview

AcmeCo's "Log In/Sign Up" dialog: enter an email to log in or create a free account, or continue with another service, beside a short promo carousel saying why to sign up. It opens when an action needs an account, such as **Save results** on search results or **Log in** in the contact form.

## When to use

- When someone tries something that needs an account (save results, save a search, track a property).
- Put it in a `DialogTrigger` with the control that opens it, or control it with `isOpen` / `onOpenChange`.
- `onContinue(email)` receives a valid address; the next step (password or new account) is the caller's. `onProvider(name)` receives the chosen option; `providers` lists the options with their placeholder marks.

## When not to use

- Not before someone has asked for something that needs an account: don't open it on page load.
- Not for contacting a broker: guests can send the contact form without an account (the benchmark lesson 10).

## Accessibility

- The email field has a real label and is announced as required (AcmeCo's "Email" is plain text above the box). Continue checks it, explains a problem under the field and moves focus there.
- **Other options keep AcmeCo's round buttons**, each named "Continue with Google", "Continue with LinkedIn", "Continue with Apple" (AcmeCo's have no names, so screen readers say "link"). The marks in the circles are neutral placeholders: each provider's artwork is licensed only for sites that really offer its sign-in (Apple's licence also requires an Apple Developer Program membership), so it stays out of this prototype; AcmeCo's production buttons use it.
- **The carousel** is a labelled region ("Why sign up"); each dot is a named button ("Slide 4 of 4: Access secure data") with a 24px target around its 8px mark (AcmeCo's are 8px buttons with no names); the current dot is marked for screen readers and is a wider pill, so it isn't shown by colour alone. Changing slides reads the new one. **It never rotates by itself**, so nothing moves while someone types.
- The pictures are decorative: each slide's title and text carry its meaning.
- The form comes first in reading order; on wide screens the promo sits to its left. On phones (full screen) the promo moves below the form.
- Clicking outside doesn't close it (it holds a form, decision 28); Escape and Close do, and focus returns to what opened it.

## Content

- Keep the promo to a title and one sentence per slide; four slides at most.
- The intro says both things it does: log in or create a free account.

## Evidence

- **Observed (audit capture of the sign-in page; a reference screenshot from "Save results"):** the 768px dialog with a centred "Log In/Sign Up" title; a #f3f3f3 promo half with four slides (18px title, a 275 × 250px picture, 16px light text, 8px dots in #b2b2b2 and #4f5254); "Enter your email to login or create a free account", Email \*, a dark blue 48px Continue, "or continue with" and three round 50 × 48px logo buttons with no names; on a phone the dialog runs off the screen.
- **Now (decision 31):** the same parts on Dialog `lg` (left-aligned title, a proposed polish, decision 28), a labelled email field with validation, AcmeCo's round option buttons with names and neutral placeholder marks, an accessible carousel with 24px targets and no rotation, full screen on phones with the promo below the form.
