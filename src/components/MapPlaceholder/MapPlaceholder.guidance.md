## Overview

A stand-in where a screen shows a map: a drawn map (roads, a river, parks) with the listings as dark blue pins and a visible **Map placeholder** label. The prototype has no live map provider, and map tiles are licensed artwork, so screens show this instead and still look complete (decision 39, amending decision 32). On wide screens it fills the window's height beside the list and stays put while the list scrolls, as AcmeCo's results map does; below 1024px it's a 240px band above the list.

## When to use

- Where AcmeCo shows a map: beside the search results, on a property's location section.
- Pass a pin per listing from the fixtures (each listing has a map position) and `image={mapIllustration()}`.

## When not to use

- Not as a real map: it doesn't pan, zoom, cluster or link. Don't add controls that would suggest it does.
- Not for anything a person needs to complete a task: the list next to it carries the same listings.

## Accessibility

- One image named by `label` ("Map of 8 listings in Denver (placeholder)"); the pins and the drawing are part of that image, not separate items.
- Nothing in it can be focused, so keyboard users go straight from the filters to the list.
- Pins are dark blue with a white edge (3:1 or more against the map's grey).

## Content

- Say in the label what a real map would show and that it's a placeholder.
- Keep the visible "Map placeholder" badge: the prototype shouldn't pass for a live map.

## Evidence

- OBSERVED: AcmeCo's results map fills the window's height to the left of the list, stays put while the list scrolls, and marks listings with dark blue pins about 24px tall; on phones it hides behind a "Map" link.
- PROPOSED: the drawn placeholder and its badge; the 240px band below 1024px (the map / list toggle isn't in the system yet).
