## Overview

Paragraphs and inline text in the system's type styles: **body** (16/24), **body-large** (18/27), **body-small** (14/21) and **caption** (12/18), in two tones, **default** (ink) and **subtle** (the secondary grey). No margins: the layout primitives set the space between paragraphs. Bold inside it uses the loaded semibold. Found missing by the page shell pilot (gap 2, decision 38).

## When to use

- **body** for most text on a page.
- **body-large** for a short introduction under a page title.
- **body-small** for secondary detail (a note under a form, a listing's description in a list).
- **caption** for fine print (disclaimers, photo credits).
- **subtle** for supporting text that shouldn't compete with the main text.
- **Per width:** `size={{ base: 'body-small', md: 'body-large' }}`, and `align="center"` for a centred line (a title bar).
- **as="span"** inside a line, **as="div"** for a block that holds other elements.

## When not to use

- Not for headings: use Heading, so the page has an outline.
- Not for labels of controls: fields, buttons and links bring their own text.
- Don't use subtle for anything people must read to act (prices, errors, instructions).
- Don't space paragraphs with margins or empty lines; put them in a Stack.

## Accessibility

- Every size and tone meets 4.5:1 on white and the light grey (subtle: 5.77:1 and 5.20:1); checked in CI.
- Line heights 1.5x, so text can grow to 200% and wrap.
- `<strong>` inside Text is semibold (600), the weight that's loaded; the browser's default bold would be a faux 700.

## Content

- Plain sentences, in AcmeCo's words where they exist.
- Captions and fine print are still read: keep them short and specific.

## Evidence

- OBSERVED: 16/400/24 is AcmeCo's most common text style (11 experiences); 18/27, 14/21 and 12px also observed; secondary text in #63666a.
- PROPOSED: the four sizes and two tones as one component; semibold for emphasis (decision 4); no margins (spacing from the primitives).
