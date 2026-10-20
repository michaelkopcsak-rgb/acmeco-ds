// Runs INSIDE Figma (use_figma). Render with:
//   node scripts/figma/render-components.mjs component <Name> build <group>
//   node scripts/figma/render-components.mjs component <Name> combine
//   node scripts/figma/render-components.mjs component <Name> all   (both, when it fits)
// build:   creates one group of variants (e.g. all "primary" Buttons) as components in
//          a staging frame on the component's page. Big sets are built a group at a
//          time because a Figma script is limited to 50,000 characters.
// combine: joins every staged variant into the component set, adds its properties
//          (text, boolean, instance swap), lays it out as the agreed labelled grid
//          (columns = sizes, rows grouped by variant, one row per state) and writes its
//          description. Replaces the previous generated set.
// Every fill, stroke, radius, gap, padding, size and font value is bound to a variable.
// The tree format is described at the top of scripts/figma/components/button.mjs.
/* __INPUT__ */
await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' })
await figma.loadFontAsync({ family: 'Outfit', style: 'SemiBold' })
const collections = await figma.variables.getLocalVariableCollectionsAsync()
const nameOf = Object.fromEntries(collections.map((c) => [c.id, c.name]))
const vars = await figma.variables.getLocalVariablesAsync()
const byName = Object.fromEntries(vars.map((v) => [`${nameOf[v.variableCollectionId]}/${v.name}`, v]))
const V = (name) => { const v = byName[name.includes('/') && /^(Primitives|Semantic|Component)\//.test(name) ? name : 'Component/' + name]; if (!v) throw new Error('missing variable ' + name); return v }
function resolved(v) { let cur = v; for (let i = 0; i < 10; i++) { const col = collections.find((c) => c.id === cur.variableCollectionId); const raw = cur.valuesByMode[col.modes[0].modeId]; if (raw && raw.type === 'VARIABLE_ALIAS') cur = vars.find((x) => x.id === raw.id); else return raw } }
// Bound paint, with the resolved colour stored as its fallback (a lesson from an earlier build).
const paint = (name) => { const v = V(name); const c = resolved(v); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }, 'color', v) }
const bind = (node, field, name) => { if (name) node.setBoundVariable(field, V(name)) }
// A CSS linear-gradient as a Figma paint: { gradient: [colour names], angle: CSS degrees }.
// Each stop is bound to its variable (stored colour as fallback), spread evenly as CSS does.
// The angle follows CSS (0deg = up, 90deg = to the right), measured on a square box.
function gradientPaint(g) {
  const a = ((g.angle ?? 180) - 90) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  const gradientStops = g.gradient.map((name, i) => {
    const v = V(name), col = resolved(v)
    return { position: i / (g.gradient.length - 1), color: { r: col.r, g: col.g, b: col.b, a: col.a ?? 1 }, boundVariables: { color: figma.variables.createVariableAlias(v) } }
  })
  return { type: 'GRADIENT_LINEAR', gradientTransform: [[c, s, 0.5 - 0.5 * c - 0.5 * s], [-s, c, 0.5 + 0.5 * s - 0.5 * c]], gradientStops }
}
const anyPaint = (x) => (typeof x === 'object' ? gradientPaint(x) : paint(x))

let page = figma.root.children.find((p) => p.name === INPUT.page)
if (!page) {
  page = figma.createPage(); page.name = INPUT.page
  // Component pages sit alphabetically after the "Components" divider.
  const pages = figma.root.children, divider = pages.findIndex((p) => p.name.includes('Components'))
  let at = divider + 1
  while (at < pages.length && pages[at] !== page && pages[at].name.localeCompare(INPUT.page) < 0) at++
  figma.root.insertChild(at, page)
}
await page.loadAsync()
const iconsPage = figma.root.children.find((p) => p.name === 'Icons')
await iconsPage.loadAsync()
const iconComponents = Object.fromEntries(iconsPage.findAllWithCriteria({ types: ['COMPONENT'] }).map((c) => [c.name, c]))
const effectStyles = Object.fromEntries((await figma.getLocalEffectStylesAsync()).map((st) => [st.name, st]))
// Component sets on other pages, for nested instances (a dialog's Close and footer buttons).
const sets = {}
for (const name of (typeof SPEC !== 'undefined' && SPEC.uses) || []) {
  const p = figma.root.children.find((x) => x.name === name)
  await p.loadAsync()
  sets[name] = p.findOne((x) => x.type === 'COMPONENT_SET' && x.name === name)
}

// ---- one layer tree ----
// A value is a variable name (bound) or a plain number (a fixed value the CSS also hard-codes).
// A number, a variable, or { sub: [a, b] } / { add: [a, b] } (also as an abs inset: the map's badge sits inside its border).
const num = (x) => (typeof x === 'number' ? x : typeof x === 'object' ? (x.sub ? num(x.sub[0]) - num(x.sub[1]) : num(x.add[0]) + num(x.add[1])) : resolved(V(x)))
// { sub: [a, b] } / { add: [a, b] }: a value the CSS computes with calc(); set as the resolved number.
const bindOrSet = (node, field, x) => { if (x == null) return; if (typeof x === 'number') node[field] = x; else if (typeof x === 'object') node[field] = x.sub ? num(x.sub[0]) - num(x.sub[1]) : num(x.add[0]) + num(x.add[1]); else bind(node, field, x) }
const ALIGN = { start: 'MIN', center: 'CENTER', end: 'MAX', between: 'SPACE_BETWEEN' }
async function configureFrame(f, n) {
  f.layoutMode = n.dir === 'V' ? 'VERTICAL' : 'HORIZONTAL'
  f.primaryAxisAlignItems = ALIGN[n.align ?? 'center']; f.counterAxisAlignItems = ALIGN[n.cross ?? 'center']
  // Width and height: fixed (bound) when the spec gives one, otherwise hug the content.
  const vertical = n.dir === 'V'
  const fixW = n.width ?? n.size, fixH = n.height ?? n.size
  f.primaryAxisSizingMode = (vertical ? fixH : fixW) != null ? 'FIXED' : 'AUTO'
  f.counterAxisSizingMode = (vertical ? fixW : fixH) != null ? 'FIXED' : 'AUTO'
  if (fixW != null || fixH != null) f.resize(fixW != null ? num(fixW) : f.width, fixH != null ? num(fixH) : f.height)
  if (typeof fixW === 'string') bind(f, 'width', fixW)
  if (typeof fixH === 'string') bind(f, 'height', fixH)
  bindOrSet(f, 'minHeight', n.minHeight)
  bindOrSet(f, 'paddingLeft', n.padLeft ?? n.padX); bindOrSet(f, 'paddingRight', n.padRight ?? n.padX)
  bindOrSet(f, 'paddingTop', n.padTop ?? n.padY); bindOrSet(f, 'paddingBottom', n.padBottom ?? n.padY)
  bindOrSet(f, 'itemSpacing', n.gap)
  // wrap: a row that wraps onto more lines when narrow (CSS flex-wrap), gap apart both ways.
  // wrapGap: a different gap between the lines (CSS row-gap with column-gap: the footer's app links).
  if (n.wrap) { f.layoutWrap = 'WRAP'; bindOrSet(f, 'counterAxisSpacing', n.wrapGap ?? n.gap) }
  // radius: all corners; radii: [top-left, top-right, bottom-right, bottom-left], as CSS lists them.
  const corners = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius']
  corners.forEach((corner, i) => bindOrSet(f, corner, n.radii ? n.radii[i] : n.radius))
  // image: a placeholder photo by listing id (figma/images; IMAGES is inlined by the renderer),
  // over the frame's own fill, as a photo covers its grey box.
  f.fills = [...(n.fill ? [anyPaint(n.fill)] : []), ...(n.image ? [{ type: 'IMAGE', imageHash: IMAGES[n.image], scaleMode: 'FILL' }] : [])]
  // Outlines take layout space, as a CSS border does (Figma's strokesIncludedInLayout). A
  // 'transparent' one keeps that space without showing, like CSS's transparent border.
  const strokePaint = n.stroke === 'transparent' ? { type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 } : n.stroke && anyPaint(n.stroke)
  if (n.stroke) { f.strokes = [strokePaint]; f.strokeAlign = 'INSIDE'; bindOrSet(f, 'strokeWeight', n.strokeWidth) } else f.strokes = []
  // strokeSides: an outline on some sides only (CSS border-bottom: 0, border-top only).
  if (n.stroke && n.strokeSides) for (const side of ['Top', 'Right', 'Bottom', 'Left']) bindOrSet(f, `stroke${side}Weight`, n.strokeSides[side.toLowerCase()] ?? 0)
  // strokesInLayout: false when a child reaches over the border (the chip's remove button).
  if (n.strokesInLayout === false) f.strokesIncludedInLayout = false
  // Re-bind a fixed size once the outline is on: an outline that takes layout space can grow a
  // frame thinner than it (Tabs' 1px line came out 2px) and drop the size's binding.
  if (n.stroke && typeof fixW === 'string') bind(f, 'width', fixW)
  if (n.stroke && typeof fixH === 'string') bind(f, 'height', fixH)
  f.effects = []
  // effect: one effect style, or a list (the assistant panel's raised shadow and glow), whose
  // effects are copied in order: a layer can link to only one effect style.
  if (Array.isArray(n.effect)) f.effects = n.effect.flatMap((name) => effectStyles[name].effects)
  else if (n.effect) await f.setEffectStyleIdAsync(effectStyles[n.effect].id)
  // clip: the CSS's overflow: hidden (a dialog's footer follows its corners).
  f.clipsContent = !!n.clip
}
// stretch: fill the parent's width (a vertical parent) or the space left (a horizontal one).
function place(node, n) {
  if (n.hidden) node.visible = false // optional parts off by default (a BOOLEAN property turns them on)
  if (n.abs) {
    positionAbs(node, n)
    // behind: drawn under the other layers (a frame's own outline draws over its children,
    // so Tabs' line is a layer of its own, under the selected tab's underline as in the CSS).
    if (n.behind) node.parent.insertChild(0, node)
    return
  }
  if (n.stretch) {
    node.layoutSizingHorizontal = 'FILL'
    if (node.type === 'TEXT') node.textAutoResize = 'HEIGHT'
  }
  // fillHeight: fill the parent's height (a photo beside a column of text, as a CSS grid row).
  if (n.fillHeight) node.layoutSizingVertical = 'FILL'
  // aspect: keep width : height as built, as the CSS's aspect-ratio (a card's photo follows the card's width).
  if (n.aspect) node.lockAspectRatio()
}
// abs: placed on top of the parent at fixed insets, as CSS position: absolute (a photo's
// save button and arrows). { left | right, top | bottom | centerY: true }, values are insets.
function positionAbs(node, n) {
  const p = node.parent, a = n.abs
  node.layoutPositioning = 'ABSOLUTE'
  // left and right both: the layer spans the parent and stretches with it (Tabs' line).
  if (a.left != null && a.right != null) node.resize(p.width - num(a.left) - num(a.right), node.height)
  node.x = a.left != null ? num(a.left) : p.width - node.width - num(a.right)
  node.y = a.top != null ? num(a.top) : a.bottom != null ? p.height - node.height - num(a.bottom) : (p.height - node.height) / 2
  node.constraints = { horizontal: a.left != null && a.right != null ? 'STRETCH' : a.left != null ? 'MIN' : 'MAX', vertical: a.top != null ? 'MIN' : a.bottom != null ? 'MAX' : 'CENTER' }
}
// fr: children share the width left over in proportion, as CSS grid fr columns (tier 3: 2fr | 3fr | auto).
function applyFr(f, built) {
  const frs = built.filter(([, c]) => c.fr)
  if (!frs.length) return
  const flow = built.filter(([, c]) => !c.abs)
  const fixed = flow.filter(([, c]) => !c.fr).reduce((t, [node]) => t + node.width, 0)
  // The frame's own outline counts too when it takes layout space (a card's 1px border).
  const border = f.strokes.length && f.strokesIncludedInLayout ? 2 * f.strokeWeight : 0
  const available = f.width - f.paddingLeft - f.paddingRight - border - f.itemSpacing * (flow.length - 1) - fixed
  const total = frs.reduce((t, [, c]) => t + c.fr, 0)
  // A text with a share of the width wraps inside it (a fact's long value), as in CSS.
  for (const [node, c] of frs) { node.layoutSizingHorizontal = 'FIXED'; node.resize(available * c.fr / total, node.height); if (node.type === 'TEXT') node.textAutoResize = 'HEIGHT' }
}
async function buildChildren(f, n) {
  const built = []
  for (const c of n.children ?? []) built.push([await buildNode(c, f), c])
  applyFr(f, built)
  if (n.gridColumns) toGrid(f, n.gridColumns, built.map(([node]) => node))
}
// gridColumns: one row of fr columns (CSS grid-template-columns: 1fr 1fr) that keep their shares
// when the instance is resized, which fixed fr widths and Figma's fill (padding counts) can't.
function toGrid(f, columns, kids) {
  f.layoutMode = 'GRID'
  f.gridAutoTracks = 'NONE'
  f.gridRowCount = 1
  f.gridColumnCount = columns.length
  f.gridRowSizes[0].type = 'HUG'
  columns.forEach((v, i) => { const c = f.gridColumnSizes[i]; c.type = 'FLEX'; c.value = v })
  kids.forEach((k, i) => { k.setGridChildPosition(0, i); k.layoutSizingHorizontal = 'FILL'; k.layoutSizingVertical = 'FILL' })
}
async function buildNode(n, parent) {
  if (n.k === 'text') {
    const t = figma.createText(); t.name = n.name
    t.fontName = { family: 'Outfit', style: 'Regular' }
    t.characters = n.chars
    const len = n.chars.length
    for (const [field, name] of [['fontSize', n.fontSize], ['lineHeight', n.lineHeight], ['fontWeight', n.fontWeight]]) if (name) t.setRangeBoundVariable(0, len, field, V(name))
    t.fills = [paint(n.fill)]
    // text-transform: uppercase, and letter-spacing in em (Figma: percent of the font size).
    if (n.textAlign) t.textAlignHorizontal = n.textAlign.toUpperCase()
    if (n.textCase) t.textCase = n.textCase
    if (n.letterSpacingEm) t.letterSpacing = { unit: 'PERCENT', value: n.letterSpacingEm * 100 }
    // An underline as the CSS draws it (text-decoration thickness and offset).
    if (n.underline) {
      t.textDecoration = 'UNDERLINE'
      t.textDecorationThickness = { unit: 'PIXELS', value: num(n.underline.thickness) }
      t.textDecorationOffset = { unit: 'PIXELS', value: num(n.underline.offset) }
    }
    // links: words inside the sentence styled as an inline link ("Already a member? Log in"),
    // each { text, fill, underline }, as the code nests a Link in a paragraph.
    for (const l of n.links ?? []) {
      const at = n.chars.indexOf(l.text), end = at + l.text.length
      if (at < 0) throw new Error(`${n.name}: no "${l.text}" to link`)
      t.setRangeFills(at, end, [paint(l.fill)])
      t.setRangeTextDecoration(at, end, 'UNDERLINE')
      t.setRangeTextDecorationThickness(at, end, { unit: 'PIXELS', value: num(l.underline.thickness) })
      t.setRangeTextDecorationOffset(at, end, { unit: 'PIXELS', value: num(l.underline.offset) })
    }
    if (n.transparent) t.opacity = 0
    parent.appendChild(t); place(t, n)
    // maxLines: cut to a few lines with an ellipsis (CSS line-clamp).
    if (n.maxLines) { t.maxLines = n.maxLines; t.textTruncation = 'ENDING' }
    return t
  }
  if (n.k === 'icon') {
    const inst = iconComponents['icon/' + n.icon].createInstance(); inst.name = n.name
    parent.appendChild(inst)
    const s = num(n.size); inst.resize(s, s); bindOrSet(inst, 'width', typeof n.size === 'string' ? n.size : null); bindOrSet(inst, 'height', typeof n.size === 'string' ? n.size : null)
    // Lucide strokes are in the 24px drawing's units, so they thin with the icon (2 → 1.33px
    // at 16px). Figma scales the shapes but not the stroke, so set it (strokeWeight overrides 2).
    for (const v of inst.findAll((x) => 'strokes' in x && x.strokes.length)) {
      v.strokes = [paint(n.color)]
      v.strokeWeight = ((n.strokeWeight ?? 2) * s) / 24
    }
    // iconFill: the shapes filled (a selected toggle's solid icon; the clear button's disc).
    if (n.iconFill) for (const v of inst.findAll((x) => x.type !== 'INSTANCE' && 'fills' in x)) v.fills = [paint(n.iconFill)]
    // rotate: turned in degrees, as the CSS's transform (an open disclosure's chevron points up).
    if (n.rotate) inst.rotation = n.rotate
    if (n.transparent) inst.opacity = 0
    if (n.boolProp) inst.visible = false // the boolean property's default (no icon)
    return inst
  }
  if (n.k === 'instance') {
    // A variant of another component set (Button, Icon button), with text and icon overrides.
    const variant = sets[n.set].children.find((c) => Object.entries(n.props).every(([k, v]) => c.variantProperties[k] === v))
    if (!variant) throw new Error(`no ${n.set} variant ${JSON.stringify(n.props)}`)
    const inst = variant.createInstance(); inst.name = n.name
    parent.appendChild(inst)
    const defs = inst.componentProperties, key = (name) => Object.keys(defs).find((k) => k.split('#')[0] === name)
    const set = {}
    for (const [name, value] of Object.entries(n.text ?? {})) set[key(name)] = value
    for (const [name, icon] of Object.entries(n.icons ?? {})) set[key(name)] = iconComponents['icon/' + icon].id
    for (const [name, on] of Object.entries(n.bools ?? {})) set[key(name)] = on
    if (Object.keys(set).length) inst.setProperties(set)
    // image: the instance's own photo (a card showing its listing's picture).
    if (n.image) inst.fills = inst.fills.map((fl) => (fl.type === 'IMAGE' ? { ...fl, imageHash: IMAGES[n.image] } : fl))
    // overrides: a layer inside the instance (also inside its nested instances) given its own
    // text, visibility, line limit or photo, for content that differs per use (a card's price).
    for (const o of n.overrides ?? []) {
      const node = inst.findAll((x) => x.name === o.layer)[0] // findOne can miss layers in nested instances
      if (!node) throw new Error(`${n.name}: no layer ${o.layer} to override`)
      if (o.chars != null) node.characters = o.chars
      if (o.visible != null) node.visible = o.visible
      if (o.maxLines) { node.maxLines = o.maxLines; node.textTruncation = 'ENDING' }
      if (o.image) node.fills = node.fills.map((fl) => (fl.type === 'IMAGE' ? { ...fl, imageHash: IMAGES[o.image] } : fl))
    }
    place(inst, n)
    return inst
  }
  if (n.k === 'spinner') {
    // A three-quarter ring in the text colour, centred on top (Button's loading spinner).
    const e = figma.createEllipse(); e.name = n.name
    const s = resolved(V(n.size)), w = resolved(V(n.stroke))
    e.resize(s, s); e.arcData = { startingAngle: 0, endingAngle: 1.5 * Math.PI, innerRadius: 1 - (2 * w) / s }
    e.fills = [paint(n.color)]
    parent.appendChild(e)
    e.layoutPositioning = 'ABSOLUTE'; e.constraints = { horizontal: 'CENTER', vertical: 'CENTER' }
    bind(e, 'width', n.size); bind(e, 'height', n.size)
    return e
  }
  const f = figma.createFrame(); f.name = n.name ?? 'Frame'
  parent.appendChild(f); await configureFrame(f, n); place(f, n)
  // rotate: a frame turned in degrees, as the CSS's transform (a map pin's rotated square).
  if (n.rotate) f.rotation = n.rotate
  await buildChildren(f, n)
  if (n.insetBorder) addInsetBorder(f, n)
  if (n.focus) addFocusRings(f, n)
  return f
}
// A thicker border that doesn't move the content: the CSS draws it as an inset box-shadow
// inside the 1px border (invalid fields), so here it's a second outline just inside it.
function addInsetBorder(f, n) {
  const w = num(n.insetBorder.total) - f.strokeWeight
  const r = figma.createRectangle(); r.name = 'Inset border'
  r.fills = []; r.strokes = [paint(n.insetBorder.color)]; r.strokeAlign = 'INSIDE'; r.strokeWeight = w
  r.cornerRadius = Math.max(0, (n.radius != null ? num(n.radius) : 0) - f.strokeWeight)
  f.appendChild(r); r.layoutPositioning = 'ABSOLUTE'
  r.resize(f.width - 2 * f.strokeWeight, f.height - 2 * f.strokeWeight); r.x = f.strokeWeight; r.y = f.strokeWeight
  r.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }
}
// The focus ring as the code draws it (outline + outline-offset, or box-shadow rings): a
// separate outline the ring's width, the offset away from the edge, following the corners.
// A layer rather than a shadow: Figma draws no shadow on a frame without a fill.
// focus: one ring { ring, width, offset } or a list (IconButton's overlay double ring).
function addFocusRings(f, n) {
  const rings = Array.isArray(n.focus) ? n.focus : [n.focus]
  rings.forEach((ring, i) => {
    const gap = num(ring.offset), width = num(ring.width), out = gap + width
    const r = figma.createRectangle(); r.name = i === 0 ? 'Focus ring' : 'Focus ring (outer)'
    r.fills = []; r.strokes = [paint(ring.ring)]; r.strokeAlign = 'INSIDE'; bindOrSet(r, 'strokeWeight', ring.width)
    // The outline follows each corner: rounded corners grow by the offset; square ones stay square.
    const radii = n.radii ? n.radii.map(num) : [0, 0, 0, 0].map(() => (n.radius != null ? num(n.radius) : 0))
    ;['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'].forEach((c, k) => { r[c] = radii[k] > 0 ? radii[k] + out : 0 })
    f.appendChild(r); r.layoutPositioning = 'ABSOLUTE'
    r.resize(f.width + 2 * out, f.height + 2 * out); r.x = -out; r.y = -out
    r.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' }
  })
  f.clipsContent = false
}
const variantName = (props) => Object.entries(props).map(([k, v]) => `${k}=${v}`).join(', ')

const result = {}
if (INPUT.mode === 'build' || INPUT.mode === 'all') {
  let staging = page.children.find((n) => n.name === `Generated: ${INPUT.name} staging`)
  if (!staging) { staging = figma.createFrame(); staging.name = `Generated: ${INPUT.name} staging`; staging.fills = []; staging.x = 0; staging.y = 4000; page.appendChild(staging) }
  const names = new Set(INPUT.variants.map((v) => variantName(v.props)))
  for (const c of staging.children.filter((c) => names.has(c.name))) c.remove()
  let y = staging.children.reduce((m, c) => Math.max(m, c.y + c.height + 16), 0)
  const created = []
  for (const v of INPUT.variants) {
    const comp = figma.createComponent(); comp.name = variantName(v.props)
    staging.appendChild(comp)
    if (v.tree.rotate) {
      // A turned shape (the map pin): the component holds the turned frame, sized to its
      // bounding box, so instances place by what's visible.
      comp.fills = []; comp.clipsContent = false
      const shape = await buildNode({ ...v.tree, name: v.tree.name ?? 'Pin' }, comp)
      const bb = () => shape.absoluteBoundingBox, cb = comp.absoluteBoundingBox
      comp.resize(Math.ceil(bb().width), Math.ceil(bb().height))
      shape.x += (comp.width - bb().width) / 2 - (bb().x - cb.x)
      shape.y += (comp.height - bb().height) / 2 - (bb().y - cb.y)
      comp.x = 0; comp.y = y; y += comp.height + 16
      created.push(comp.id)
      continue
    }
    await configureFrame(comp, v.tree)
    await buildChildren(comp, v.tree)
    // Centre a spinner now that the content has its size.
    for (const s of comp.findAll((x) => x.name === 'Spinner')) { s.x = (comp.width - s.width) / 2; s.y = (comp.height - s.height) / 2 }
    if (v.tree.insetBorder) addInsetBorder(comp, v.tree)
    if (v.tree.focus) addFocusRings(comp, v.tree)
    comp.x = 0; comp.y = y; y += comp.height + 16
    created.push(comp.id)
  }
  staging.resize(Math.max(400, ...staging.children.map((c) => c.width)), Math.max(100, y))
  result.created = created.length
  result.staged = staging.children.length
}

if (INPUT.mode === 'combine' || INPUT.mode === 'all') {
  const staging = page.children.find((n) => n.name === `Generated: ${INPUT.name} staging`)
  const comps = staging.children.filter((c) => c.type === 'COMPONENT')
  const expected = INPUT.expectedVariants
  if (comps.length !== expected) throw new Error(`staged ${comps.length} variants, expected ${expected}: run every build group first`)
  for (const n of page.children.filter((n) => n.name === `Generated: ${INPUT.name}`)) n.remove()

  const wrap = figma.createFrame(); wrap.name = `Generated: ${INPUT.name}`; wrap.fills = [paint('Semantic/color/surface/default')]
  wrap.x = 100; wrap.y = 100; page.appendChild(wrap)
  const set = figma.combineAsVariants(comps, wrap); set.name = INPUT.name
  staging.remove()

  // Properties, each linked to the layers it controls (by layer name): TEXT → the text,
  // BOOLEAN → visibility, INSTANCE_SWAP → which icon.
  const refs = new Map()
  for (const p of INPUT.properties) {
    const def = p.type === 'INSTANCE_SWAP' ? iconComponents['icon/' + p.default].id : p.default
    const key = set.addComponentProperty(p.name, p.type, def)
    if (p.type === 'INSTANCE_SWAP') set.editComponentProperty(key, { preferredValues: Object.values(iconComponents).map((c) => ({ type: 'COMPONENT', key: c.key })) })
    const field = { TEXT: 'characters', BOOLEAN: 'visible', INSTANCE_SWAP: 'mainComponent' }[p.type]
    const layers = [p.layer].flat() // one property can drive several layers (Show arrows: Previous and Next)
    for (const variant of set.children) for (const n of variant.findAll((x) => layers.includes(x.name) && (p.type !== 'TEXT' || x.type === 'TEXT') && (p.type !== 'INSTANCE_SWAP' || x.type === 'INSTANCE'))) {
      refs.set(n, { ...(refs.get(n) ?? {}), [field]: key })
    }
  }
  for (const [n, r] of refs) n.componentPropertyReferences = r

  // The labelled grid: columns = one axis; rows = another, optionally grouped by a third.
  const G = INPUT.grid
  // columns: null stacks the variants in one column (wide components: a header at three widths).
  const cols = G.columns ? INPUT.axes[G.columns] : [null], groups = G.rowGroups ? INPUT.axes[G.rowGroups] : [null], rows = G.rows ? INPUT.axes[G.rows] : [null]
  const prop = (c, k) => (k ? c.variantProperties[k] : null)
  const rowKey = (c) => `${prop(c, G.rowGroups)}|${prop(c, G.rows)}`
  // Labels around the set (outside it: a set may only contain its variants).
  const label = (chars, size, bold) => { const t = figma.createText(); t.fontName = { family: 'Outfit', style: bold ? 'SemiBold' : 'Regular' }; t.characters = chars; t.fontSize = size; t.fills = [paint(bold ? 'Semantic/color/text/default' : 'Semantic/color/text/subtle')]; wrap.appendChild(t); return t }
  const colLabels = G.columns ? cols.map((cv) => label(`${G.columns}: ${cv}`, 14, true)) : []
  // A column is as wide as its widest variant, or its label if that's wider.
  const colW = cols.map((cv, i) => Math.max(colLabels[i]?.width ?? 0, ...set.children.filter((c) => prop(c, G.columns) === cv).map((c) => c.width)))
  // Backdrops: variants made for photos or dark panels sit on one, as in their stories.
  const backdropOf = (c) => (G.backdrops ?? []).find((b) => Object.entries(b.when).every(([k, v]) => prop(c, k) === v))
  const BP = G.backdrops ? 16 : 0
  const PAD = 40 + BP, GAP = 32 + 2 * BP, GROUP_GAP = 56, ROW_GAP = 24 + 2 * BP
  const colX = []; let x = PAD; for (const w of colW) { colX.push(x); x += w + GAP }
  let y = PAD; const rowY = {}
  for (const g of groups) {
    for (const r of rows) {
      const inRow = set.children.filter((c) => rowKey(c) === `${g}|${r}`)
      if (!inRow.length) continue
      rowY[`${g}|${r}`] = y; y += Math.max(...inRow.map((c) => c.height)) + ROW_GAP
    }
    y += GROUP_GAP - ROW_GAP
  }
  for (const c of set.children) { c.x = colX[cols.indexOf(prop(c, G.columns))]; c.y = rowY[rowKey(c)] }
  set.resize(x - GAP + PAD, y - GROUP_GAP + PAD)
  // No fill on the set, so the backdrops behind it show; the page frame is white.
  set.fills = []

  const LEFT = 200
  const title = label(INPUT.name, 32, true); title.x = 40; title.y = 32
  const sub = label(`${set.children.length} variants: ${Object.entries(INPUT.axes).map(([k, v]) => `${k} (${v.join(', ')})`).join(' × ')}.${INPUT.properties.length ? ` Properties: ${INPUT.properties.map((p) => p.name).join(', ')}.` : ''}${INPUT.gridNote ? ' ' + INPUT.gridNote : ''}`, 14, false); sub.x = 40; sub.y = 80
  sub.textAutoResize = 'HEIGHT'; sub.resize(LEFT + set.width - 80, sub.height)
  // The grid starts below the subtitle (it wraps to more lines when the set is narrow).
  const TOP = Math.max(168, Math.ceil(sub.y + sub.height + 44))
  set.x = LEFT; set.y = TOP
  for (const c of set.children) {
    const b = backdropOf(c)
    if (!b) continue
    const r = figma.createRectangle(); r.name = `Backdrop: ${b.label}`
    r.resize(c.width + 2 * BP, c.height + 2 * BP); r.x = LEFT + c.x - BP; r.y = TOP + c.y - BP; r.cornerRadius = 8
    r.fills = [paint(b.fill)]
    wrap.insertChild(0, r)
  }
  colLabels.forEach((t, i) => { t.x = LEFT + colX[i]; t.y = TOP - 28 })
  // Row labels (none when the grid has a single row: a one-axis set such as Badge).
  for (const g of groups) rows.filter((r) => rowY[`${g}|${r}`] != null && (g != null || r != null)).forEach((r, i) => {
    const t = label(g == null ? r : r == null ? g : i === 0 ? `${g}  ·  ${r}` : r, 14, g == null || r == null || i === 0); t.x = 40; t.y = TOP + rowY[`${g}|${r}`] + 8
  })
  wrap.resize(LEFT + set.width + 40, TOP + set.height + 40)
  set.description = INPUT.description
  result.set = set.id
  result.wrap = wrap.id
  result.variants = set.children.length
  result.properties = Object.keys(set.componentPropertyDefinitions)
  result.size = [Math.round(wrap.width), Math.round(wrap.height)]
}
return result
