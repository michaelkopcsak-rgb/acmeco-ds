## Overview

Short labels on listings: the property type on a photo ("Office", "Coworking"), an auction marker, and the dark blue "Virtual Tour" label attached to a photo's corner. Badges are labels, not controls: they can't be clicked or focused. They keep AcmeCo's look (pills over photos, a square dark blue corner label), measured from the live site's CSS.

## When to use

- **Neutral:** over photos, for the property type or a short fact.
- **Subtle:** the same label on a white or grey surface.
- **Auction:** to mark auction listings.
- **Feature:** a highlighted listing feature ("Virtual Tour"), placed flush in a photo corner.

## When not to use

- For something people can remove or click, such as a selected filter: use a Chip.
- For status messages ("Inquiry sent"): use an alert (later).
- More than one or two per photo: they compete with the image.

## Accessibility

- Plain text inside the content, read in order. Not focusable, because it doesn't do anything.
- Over photos, the background is white at 85%: ink stays 12.07:1 even over a black photo. AcmeCo's current 50% white drops to 4.31:1 over dark photos, below 4.5.
- The feature label's text is 12px, the system's minimum (AcmeCo's is 10px); white on dark blue is 10.98:1.
- Meaning never relies on colour alone: the text says what the badge means.

## Content

- One or two words, as written: "Office", "Virtual Tour". Only the feature label is shown in capitals, by style.
- Use the same words as the filters ("Coworking", not "Shared office").

## Evidence

- **Observed, photo label (audit F13):** 48 instances on the homepage: a pill, white at 50%, ink 14/21, 4 × 8px padding.
- **Observed, "Virtual Tour" (filed by the audit under F14 chip):** 64 instances: dark blue `#123a7a`, white 10px uppercase, square, 5 × 15px padding, attached to the photo's bottom-left corner.
- **Now:** pills over photos at 85% white; the square dark blue label at 12px; plus subtle and auction tones. Shape follows the rule "pills float over content; edge-attached labels are square" (decision 25).
