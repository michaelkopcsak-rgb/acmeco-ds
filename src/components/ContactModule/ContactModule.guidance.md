## Overview

The contact box beside a listing (AcmeCo's property detail sidebar): the broker's phone number, a **Message** button that opens the ContactForm, the brokers with their photos, the company logo, and **Share** and **Save** for the listing.

## When to use

- Once per listing page, in the sidebar (340px on AcmeCo), near the top so it stays in reach.
- Pass the listing's brokers and company; the phone defaults to the lead broker's.
- Pass `onSaveChange` to show Save and `onContactSubmit` to receive messages.

## When not to use

- Not in search results: cards link to the listing instead.
- Don't add more actions to the Share / Save row; it's two halves by design.

## Accessibility

- A labelled landmark ("Contact about Larkspur Commons"), so screen-reader users can jump to it.
- The phone number is a real `tel:` link, read as "Call (469) 324-4030".
- **Message** opens the contact form in a dialog; closing it returns focus to Message.
- "Contact" is a heading whose level the page sets (`headingLevel`, h3 by default).
- Share and Save are named for the listing ("Share Larkspur Commons"); Save announces pressed or not.
- Broker initials are hidden from screen readers; the names follow them.

## Content

- The phone number as people write it: "(469) 324-4030".
- Keep "Message" and "Contact" as AcmeCo has them.

## Evidence

- **Observed (audit capture of the office property detail page):** a white 340px box with a 1px `#e5e5e5` border, 4px corners and a 0 2px 15px shadow; a centred 24px light phone number with a phone icon; a dark blue 50px "Message"; "Contact" as an h3 at 22px; an 80px broker photo with an 18px name; a 119 × 70px company logo; Share and Favorite Property as 61px icon buttons (named) split by a line.
- **Now (decision 30):** the same order on the system's tokens: 8px corners (decision 26), the raised shadow, 24px padding, regular weights, a 48px Message button, a callable phone link, 56px Share and Save.
