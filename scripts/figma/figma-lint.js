// Runs INSIDE Figma (use_figma). Render with:
//   node scripts/figma/render-components.mjs lint <Page name>
// A compact version of the lint-design-figma checks this phase relies on, for one page:
//   - hard-coded colours: a visible fill or stroke not bound to a variable (an invisible,
//     0% "transparent" outline is skipped: it only keeps a CSS border's space)
//   - default names: layers still called Frame, Rectangle, Vector, Ellipse, Group
//   - text contrast (WCAG 1.4.3) against the nearest filled ancestor: 4.5:1, or 3:1 for
//     18px+ / 14px+ semibold, against every stop of a gradient. Disabled variants and layers
//     marked "(disabled)" are reported apart (WCAG exempts them), and
//     text drawn over a backdrop sibling (not an ancestor) is reported as needing a look.
// INPUT is { page } or { pages: [...] } for the report run (render-components.mjs report).
/* __INPUT__ */
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
const visible = (p) => p.visible !== false && (p.opacity ?? 1) > 0
const solid = (paints) => (Array.isArray(paints) ? paints : []).filter((p) => p.type === 'SOLID' && visible(p))
// The nearest filled ancestor's colours: one for a solid fill, every stop for a gradient
// (the Assistant's Voice Mode button), so text is checked against its worst point.
function bgOf(node) {
  for (let cur = node.parent; cur; cur = cur.parent) {
    const f = (Array.isArray(cur.fills) ? cur.fills : []).find((p) => visible(p) && (p.type === 'SOLID' || p.type.startsWith('GRADIENT')))
    if (f) return { colours: f.type === 'SOLID' ? [f.color] : f.gradientStops.map((st) => st.color), from: cur }
  }
  return { colours: [{ r: 1, g: 1, b: 1 }], from: null }
}
async function lint(pageName) {
const page = figma.root.children.find((p) => p.name === pageName)
await page.loadAsync()
const roots = page.children.filter((n) => n.name.startsWith('Generated:'))
const variantOf = (n) => { for (let cur = n; cur; cur = cur.parent) if (cur.type === 'COMPONENT' && cur.parent?.type === 'COMPONENT_SET') return cur.name; return null }
const out = { hardCoded: [], defaultNames: [], contrast: [], contrastDisabled: [], contrastOverBackdrop: [], nodes: 0 }
const DEFAULT = /^(Frame|Rectangle|Vector|Ellipse|Group|Line)( \d+)?$/
for (const root of roots) {
  const backdrops = root.children.filter((c) => c.name.startsWith('Backdrop'))
  const all = [root, ...root.findAll(() => true)]
  for (const n of all) {
    // Instances' insides belong to their main component (the icons page); checked there.
    if (n.parent && n.parent.type === 'INSTANCE') continue
    out.nodes++
    if (DEFAULT.test(n.name)) out.defaultNames.push(`${n.name} in ${variantOf(n) ?? root.name}`)
    for (const [kind, paints] of [['fill', n.fills], ['stroke', n.strokes]]) {
      for (const p of solid(paints)) if (!p.boundVariables?.color) out.hardCoded.push(`${kind} of ${n.name} in ${variantOf(n) ?? root.name}`)
    }
    if (n.type === 'TEXT' && n.opacity > 0) {
      const fg = solid(n.fills)[0]
      if (!fg) continue
      const { colours, from } = bgOf(n)
      const size = n.fontSize, bold = n.fontWeight >= 600
      const need = size >= 18 || (size >= 14 && bold) ? 3 : 4.5
      const r = Math.round(Math.min(...colours.map((c) => ratio(fg.color, c))) * 100) / 100
      if (r >= need) continue
      const v = variantOf(n)
      // Is there a backdrop behind this text (drawn as a sibling of the set, not an ancestor)?
      const b = n.absoluteBoundingBox
      const over = backdrops.find((d) => { const a = d.absoluteBoundingBox; return b.x >= a.x && b.y >= a.y && b.x + b.width <= a.x + a.width && b.y + b.height <= a.y + a.height })
      if (over) { const r2 = Math.round(ratio(fg.color, solid(over.fills)[0].color) * 100) / 100; if (r2 < need) out.contrast.push(`${n.name} in ${v}: ${r2}:1 on its backdrop`); else out.contrastOverBackdrop.push(`${n.name} in ${v}: ${r2}:1 on the backdrop (passes)`); continue }
      const line = `${n.name} in ${v ?? root.name}: ${r}:1, needs ${need}:1${from ? '' : ' (no filled ancestor)'}`
      // Disabled: a Disabled variant, or a layer marked "(disabled)" (a disabled option in a list).
      if ((v && v.includes('Disabled')) || n.name.includes('(disabled)')) out.contrastDisabled.push(line); else out.contrast.push(line)
    }
  }
}
return {
  page: pageName, nodes: out.nodes,
  hardCoded: out.hardCoded.length, defaultNames: out.defaultNames.length, contrastFailures: out.contrast.length,
  disabledExempt: out.contrastDisabled.length, overBackdropPasses: out.contrastOverBackdrop.length,
  details: { hardCoded: out.hardCoded.slice(0, 10), defaultNames: out.defaultNames.slice(0, 10), contrast: out.contrast.slice(0, 10), disabled: out.contrastDisabled.slice(0, 3) },
}
}
if (!INPUT.pages) return await lint(INPUT.page)
const results = []
for (const name of INPUT.pages) { const r = await lint(name); results.push({ page: r.page, nodes: r.nodes, hardCoded: r.hardCoded, defaultNames: r.defaultNames, contrastFailures: r.contrastFailures, disabledExempt: r.disabledExempt, details: r.hardCoded || r.defaultNames || r.contrastFailures ? r.details : undefined }) }
return results
