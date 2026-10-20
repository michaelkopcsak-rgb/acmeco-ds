## Overview

Rows of the same facts, compared column by column: AcmeCo's All Available Spaces. The audit found five designs for this one table on property pages and listing options (F24); this is one. It closes the property page's spaces gap (decision 47). A row can open its details: the property page opens a Dialog with the space's facts.

## When to use

- To compare several things fact by fact: the spaces in a building (Space, Size, Rental Rate, Space Use, Available).
- With `onRowAction` when each row has more to show: pressing the row, or its Details button, opens it.

## When not to use

- Not for facts about one thing: that's FactList.
- Not on phones: five columns don't fit 375px. Show each row as a Card with a FactList there, as AcmeCo's phone listing does.
- Not for layout. A table is for data with column headings.

## Accessibility

- Built on React Aria's Table: real column headings, and one row-header column (Space), so as a screen reader moves between cells it announces the column heading and the row's name (its Space) with each value. AcmeCo's version is built from lists with no headings, and its chevron can't take focus.
- Arrow keys move between rows and cells; Enter on a row opens it, as pressing it does. The Details button is a real button inside the row, named for its row ("Details for Floor 2, Suite 200": the space's name is screen-reader-only text).
- Name the table with `labelledBy` (its section heading's id) or `label`.
- The header bar is ink on #ededed (14.55:1), rows are ink on white, and a hovered row is ink on #f3f3f3 (15.35:1). The focus ring sits inside the row (6.13:1 on the hover grey).

## Content

- Use AcmeCo's column headings ("Space", "Size", "Rental Rate", "Space Use", "Available").
- Keep cells short: the details belong in the opened view.

## Evidence

- OBSERVED (office property page, 1700px): a #ebebeb header bar with 4px corners, 18/28 headings at 400; 44px rows with 1px #dddddd lines at the sides and below, values at weight 100; 20px at the row's ends; a blue chevron at the end of each row that opens the space's notes, Term and highlights in place.
- Now: 18/27 at 400 (decisions 4 and 9), #ededed and #e5e5e5 from the scale, 16px ends (the gutter), a grey hover (PROPOSED). Details open in a Dialog rather than in the row: React Aria's Table has no public way to open a free-form panel under a row (decision 47).
