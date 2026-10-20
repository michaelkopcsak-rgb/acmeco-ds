## Overview

AcmeCo's guest contact form ("Contact Broker"): first and last name, email, phone with an optional extension, an optional space size, and a message prefilled with the listing's name. It opens in a Dialog that a stray click can't close (decision 28), and anyone can send it without an account (the benchmark lesson 10). After sending, it confirms who the message went to.

## When to use

- From a listing: the **Message** button in the ContactModule, or "Contact broker" anywhere a listing offers it.
- Put it in a `DialogTrigger` with the button that opens it, or control it with `isOpen` / `onOpenChange`.
- Connect `onSubmit` to the real service; it receives the values only when they're valid.

## When not to use

- Not as a sign-up form, and don't make signing in a condition for sending (the benchmark's sign-up wall is a weakness, not a model).
- Don't add fields: every extra one is a reason not to send. Each addition is a product decision.

## Accessibility

- **Every field has a real label** (AcmeCo's names are bold text that isn't connected to its box, so screen readers announce "edit text").
- **Required and optional are both said in words:** required fields are announced as required (the asterisk is visual only), optional ones say "(optional)" in their label.
- On send, each problem appears under its field and is read with it; focus moves to the first field with a problem; nothing typed is cleared. A fixed field clears its message as you type.
- The confirmation is announced and takes focus; **Done** closes the dialog and returns focus to the button that opened it.
- The message counter is announced ("84 / 400").

## Content

- Keep AcmeCo's field names and order; "First name" in sentence case.
- Error messages say what to do: "Enter your phone number.", "Enter an email address like name@example.com."
- The terms note and links are placeholder wording here; AcmeCo's legal team owns the real text. The reCAPTCHA disclosure is left out (a third-party service).
- **Open question for AcmeCo:** phone is required, as today (decision 30). Asking for fewer details may bring more messages; that's a business decision.

## Evidence

- **Observed (audit capture of the contact broker dialog):** First Name \* and Last Name \* side by side (222px each); Email \*; Phone \* (302px) and Ext (optional, 142px); "How much space do you need? (optional)" with "Select Size"; Message \* prefilled, "84 out of 400"; the automatic-account note with Terms of Use and Privacy Notice; a reCAPTCHA disclosure; a dark blue 47px "Contact Broker" in a sticky footer. No `<label>` elements; required shown only by a dark blue asterisk; 42px inputs with thin (100) text and `#b2b2b2` borders (2.2:1).
- **Now (decision 30):** the same fields, order and layout on the system's fields (40px, 3:1 borders, regular text), real labels, required and optional in words, validation with focus, a "Message sent" state (PROPOSED), in the 500px dialog with its sticky footer.
