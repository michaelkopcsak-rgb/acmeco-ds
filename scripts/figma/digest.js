// Fingerprints ("digests") of what the Figma file contains, computed the same way
// from the payload (in Node) and from Figma's actual state (inside Figma).
// If the two digests match, Figma matches the repo exactly, even if a pasted
// payload had a copying mistake. render.mjs inlines this file into sync.js.

/** FNV-1a 32-bit hash: short, deterministic, no dependencies. */
export function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

/** '#123a7a' or {r,g,b,a} (0–1) → '#123a7aff'. */
export function hex8(c) {
  if (typeof c === 'string') return (c.length === 7 ? c + 'ff' : c).toLowerCase()
  const b = (v) => Math.round(v * 255).toString(16).padStart(2, '0')
  return '#' + b(c.r) + b(c.g) + b(c.b) + b(c.a === undefined ? 1 : c.a)
}

export const num = (v) => String(Math.round(Number(v) * 1000) / 1000)

// A printable separator, so canonical lines stay readable when debugging.
const SEP = ' |~| '

/** Figma stores descriptions as HTML (an apostrophe comes back as &#39;), so both
 *  sides compare the decoded plain text. Found when the first digests disagreed. */
export function plainText(s) {
  return String(s ?? '')
    .replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

/** One canonical line per variable; value is already canonical ('#..ff', '16', 'alias:Primitives/color/brand/700'). */
export function variableLine(v) {
  return [v.name, v.type, v.value, v.scopes.slice().sort().join(','), v.codeWeb, plainText(v.description)].join(SEP)
}

export function textStyleLine(s) {
  return [s.name, s.fontFamily, s.fontStyle, num(s.fontSize), num(s.lineHeight), plainText(s.description),
    s.bind.fontFamily, s.bind.fontSize, s.bind.lineHeight, s.bind.fontWeight].join(SEP)
}

export function effectStyleLine(s) {
  return [s.name, plainText(s.description), ...s.effects.map((e) =>
    [e.type, hex8(e.color), num(e.offset.x), num(e.offset.y), num(e.radius), num(e.spread)].join(','))].join(SEP)
}

export function digestOf(lines) {
  return fnv1a(lines.slice().sort().join('\n'))
}
