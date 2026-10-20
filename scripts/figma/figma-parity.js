// Runs INSIDE Figma (use_figma). Render with:
//   node scripts/figma/render-components.mjs component <id> parity
// Reads the same fields as scripts/figma/parity-code.mjs from every variant of the
// component set and compares them with the code's (figma/parity/<id>-code.json, inlined).
// Returns the number of fields checked and matched, and every mismatch.
// INPUT is one set, or { sets: [...] } for the report run (render-components.mjs report).
/* __INPUT__ */
const hex = (p) => {
  if (!p || p.visible === false || p.type !== 'SOLID') return null
  const h = '#' + [p.color.r, p.color.g, p.color.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('')
  const a = p.opacity ?? 1
  return a === 0 ? null : a < 1 ? h + Math.round(a * 255).toString(16).padStart(2, '0') : h
}
const r2 = (x) => Math.round(x * 100) / 100
// A layer's top-left on the canvas, from its bounding box: a turned layer's transform starts at
// another corner (the open Disclosure's chevron, turned 180°).
const abs = (n) => [n.absoluteBoundingBox.x, n.absoluteBoundingBox.y]
function field(n, f, root) {
  switch (f) {
    case 'bg': return hex(n.fills?.[0])
    // An 'Inset border' layer thickens the border, as the CSS inset shadow does.
    case 'border': return n.strokes?.length && hex(n.strokes[0]) ? [hex(n.strokes[0]), n.strokeWeight + (n.children ?? []).filter((c) => c.name === 'Inset border').reduce((t, c) => t + c.strokeWeight, 0)] : null
    case 'ring': {
      const rings = n.children.filter((c) => c.name.startsWith('Focus ring')).sort((a, b) => a.width - b.width)
      return rings.length ? rings.map((c) => [hex(c.strokes[0]), c.strokeWeight, r2((c.width - n.width) / 2 - c.strokeWeight)]) : null
    }
    case 'radius': return n.topLeftRadius
    case 'opacity': return n.opacity
    case 'w': return r2(n.width)
    case 'h': return r2(n.height)
    case 'padT': return n.paddingTop
    case 'padB': return n.paddingBottom
    case 'borderTop': return n.strokes?.length && hex(n.strokes[0]) && n.strokeTopWeight ? [hex(n.strokes[0]), n.strokeTopWeight] : null
    case 'borderBottom': return n.strokes?.length && hex(n.strokes[0]) && n.strokeBottomWeight ? [hex(n.strokes[0]), n.strokeBottomWeight] : null
    case 'borderLeft': return n.strokes?.length && hex(n.strokes[0]) && n.strokeLeftWeight ? [hex(n.strokes[0]), n.strokeLeftWeight] : null
    case 'align': return n.textAlignHorizontal
    case 'case': return n.textCase === 'UPPER' ? 'UPPER' : 'ORIGINAL'
    case 'tracking': return n.letterSpacing.unit === 'PERCENT' ? r2((n.letterSpacing.value / 100) * n.fontSize) : n.letterSpacing.value
    case 'padL': return n.paddingLeft
    case 'padR': return n.paddingRight
    case 'gap': return n.itemSpacing
    case 'font': return [n.fontSize, n.lineHeight.value, n.fontWeight]
    // A sentence with an inline link has mixed fills: its own colour is the first character's.
    case 'color': return hex((n.fills === figma.mixed ? n.getRangeFills(0, 1) : n.fills)[0])
    case 'underline': return n.textDecoration === 'UNDERLINE' ? n.textDecorationThickness.value : null
    case 'icon': {
      const v = n.findAll((x) => 'strokes' in x && x.strokes.length)[0]
      return [hex(v.strokes[0]), r2(n.width), v.fills.length ? hex(v.fills[0]) : null, r2((v.strokeWeight * 24) / n.width)]
    }
    case 'startInset': return r2(abs(n)[0] - abs(root)[0])
    case 'endInset': return r2(abs(root)[0] + root.width - (abs(n)[0] + n.width))
    case 'topInset': return r2(abs(n)[1] - abs(root)[1])
    case 'bottomInset': return r2(abs(root)[1] + root.height - (abs(n)[1] + n.height))
  }
}
// Numbers match within half a pixel (rounding). Widths get a pixel: Figma rounds a text box's
// width up to a whole pixel, so a component that hugs its text can be up to 1px wider than the
// browser's fractional width. Strict (half-pixel) matches are counted too, and reported.
const same = (a, b, tol = 0.5) => {
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => same(x, b[i], tol))
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= tol
  return a === b
}
// Up to 1px where text width decides it: Figma and the browser measure the same words a
// fraction apart (a tab placed after "Language and Region": 198 vs 197.45).
const TOLERANCE = { w: 1, startInset: 1, endInset: 1 }
async function check(INPUT) {
const page = figma.root.children.find((p) => p.name === INPUT.page)
await page.loadAsync()
const set = page.findOne((n) => n.type === 'COMPONENT_SET' && n.name === INPUT.name)
const axes = Object.keys(INPUT.axes)
let checked = 0, matched = 0, strict = 0
const mismatches = [], missing = []
for (const [key, code] of Object.entries(INPUT.code.variants)) {
  const props = Object.fromEntries(key.split('|').map((v, i) => [axes[i], v]))
  const variant = set.children.find((c) => axes.every((k) => c.variantProperties[k] === props[k]))
  if (!variant) { missing.push(key); continue }
  for (const p of INPUT.code.parts) {
    // only: a part compared for some variants (the dialog footer exists in the md story only).
    if (p.only && !Object.entries(p.only).every(([k, v]) => [v].flat().includes(props[k]))) continue
    const node = p.layer ? variant.findAll((x) => x.name === p.layer)[0] : variant // findOne can miss layers in nested instances
    const present = node && node.visible !== false
    if (code[p.name] == null || !present) {
      checked++
      if ((code[p.name] == null) === !present) { matched++; strict++ }
      else mismatches.push({ key, part: p.name, code: code[p.name] ? 'rendered' : 'absent', figma: present ? 'present' : 'absent' })
      continue
    }
    for (const f of p.fields) {
      checked++
      const fig = field(node, f, variant), c = code[p.name][f]
      if (same(fig, c)) strict++
      if (same(fig, c, TOLERANCE[f])) matched++
      else mismatches.push({ key, part: p.name, field: f, code: c, figma: fig })
    }
  }
}
return { name: INPUT.name, variants: Object.keys(INPUT.code.variants).length, checked, matched, strict, missing, mismatches: mismatches.slice(0, 60), more: Math.max(0, mismatches.length - 60) }
}
if (!INPUT.sets) return await check(INPUT)
const results = []
for (const one of INPUT.sets) results.push(await check(one))
return results.map((r) => ({ name: r.name, variants: r.variants, checked: r.checked, matched: r.matched, strict: r.strict, missing: r.missing.length, mismatches: r.mismatches.slice(0, 5) }))
