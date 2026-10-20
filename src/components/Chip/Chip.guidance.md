## Overview

Chips show values someone has chosen, such as states in a location filter or active filters above results, and let them remove each one. They keep AcmeCo's look (the light-blue tag with a small ×, as in the expanded filters panel), measured from the live site's CSS.

## When to use

- Selected values in a multi-select field ("Colorado ×", "Texas ×").
- Active filters above results, so people can see and undo them.

## When not to use

- Labels that can't be removed: use a Badge.
- Choosing options: Checkbox, Select or TabSelector. Chips show what's already chosen.
- Actions: use a Button.

## Accessibility

- Built on React Aria's TagGroup: a list with a name ("Selected states"); arrow keys move between chips; **Delete** or **Backspace** removes the focused chip.
- Each × is a real button labelled "Remove Colorado", with a 24px target (WCAG 2.5.8). AcmeCo's × is a bare character.
- Ink text on the light-blue tint is 15.73:1 (AcmeCo's thin weight-100 text is now regular). The light-blue edge is decorative; the text and the × identify the chip.
- Focus shows the blue ring around the focused chip.

## Content

- The value as people chose it: "Colorado", "Office", "Under $1M".
- Keep chips short; long values truncate badly.

## Evidence

- **Observed (audit F14, the multi-select chip):** 12 instances: `#eef7ff` fill, a light-blue 40% border, 3px corners, 25px tall, 14px text at weight 100, a bare "×".
- **Note:** the audit's F14 family also contains the dark blue "Virtual Tour" label (64 instances); it isn't interactive, so it's a Badge here.
- **Now:** the same chip at 24px with 4px corners (it sits inside fields, so it takes the field radius), regular-weight ink text, and a labelled remove button (decision 25).
