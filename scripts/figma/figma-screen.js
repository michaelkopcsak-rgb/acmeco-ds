// Runs INSIDE Figma (use_figma), in the file the screen goes to. Render with:
//   node scripts/figma/render-components.mjs screen <id>
// Builds a screen from figma/screens/<id>.json (scripts/figma/screen-spec.mjs): library
// instances (imported by key from figma/library-keys.json) placed where the rendered page
// puts them, with their variants, text and pictures; backgrounds and text in the library's
// variables and text styles; numbered notes beside it. Re-running replaces the screen.
// Returns, per instance, any size that differs from the page's (the parity check).
/* __INPUT__ */
// Hotspots: a transparent layer over a control that opens another frame in prototype mode
// (the map / gallery interaction model). Wired after every frame exists (INPUT.wire).
async function wire(frame, links) {
  for (const n of frame.children.filter((c) => c.name.startsWith('Hotspot'))) n.remove()
  const missing = []
  for (const l of links) {
    // back: Figma's Back action, to the frame the visitor came from (the map placement last used).
    const to = l.back ? null : figma.currentPage.children.find((n) => n.type === 'FRAME' && n.name === l.to)
    if (!l.back && !to) { missing.push(l.to); continue }
    const r = figma.createRectangle(); r.name = l.back ? 'Hotspot → back' : `Hotspot → ${l.to}`
    r.resize(l.box.w, l.box.h); r.x = l.box.x; r.y = l.box.y
    r.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    frame.appendChild(r)
    await r.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [l.back ? { type: 'BACK' } : { type: 'NODE', destinationId: to.id, navigation: 'NAVIGATE', transition: null, preserveScrollPosition: false }] }])
  }
  return missing
}
if (INPUT.wire) {
  const page = figma.root.children.find((p) => p.name === INPUT.page)
  await figma.setCurrentPageAsync(page)
  const out = {}
  for (const w of INPUT.wire) {
    const frame = page.children.find((n) => n.type === 'FRAME' && n.name === w.name)
    out[w.name] = frame ? { missing: await wire(frame, w.links) } : 'no frame'
  }
  // Prototype mode starts on the first screen (map on the left).
  const start = page.children.find((n) => n.type === 'FRAME' && n.name === INPUT.wire[0].name)
  if (start) page.flowStartingPoints = [{ nodeId: start.id, name: 'Search results: map and gallery' }]
  return out
}
const S = INPUT.spec, K = INPUT.keys
await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' })
await figma.loadFontAsync({ family: 'Outfit', style: 'SemiBold' })
const varCache = {}, setCache = {}, styleCache = {}, iconCache = {}
const V = async (name) => { if (!varCache[name]) { if (!K.variables[name]) throw new Error('no key for variable ' + name); varCache[name] = await figma.variables.importVariableByKeyAsync(K.variables[name]) } return varCache[name] }
// A paint bound to a library variable; the resolved colour is stored as its fallback.
async function paint(name) {
  const v = await V(name)
  let cur = v, c
  for (let i = 0; i < 10; i++) { const raw = Object.values(cur.valuesByMode)[0]; if (raw && raw.type === 'VARIABLE_ALIAS') cur = await figma.variables.getVariableByIdAsync(raw.id); else { c = raw; break } }
  return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }, 'color', v)
}
const setOf = async (name) => { if (!setCache[name]) { if (!K.sets[name]) throw new Error('no key for set ' + name); setCache[name] = await figma.importComponentSetByKeyAsync(K.sets[name]) } return setCache[name] }
const styleOf = async (name) => { if (!styleCache[name]) styleCache[name] = await figma.importStyleByKeyAsync(K.styles[name]); return styleCache[name] }
const iconOf = async (name) => { if (!iconCache[name]) iconCache[name] = await figma.importComponentByKeyAsync(K.icons[name]); return iconCache[name] }
const keyOf = (inst, name) => Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === name)
async function fonts(node) { for (const t of node.type === 'TEXT' ? [node] : node.findAll((x) => x.type === 'TEXT')) for (const f of t.getRangeAllFontNames(0, t.characters.length)) await figma.loadFontAsync(f) }
async function setProps(inst, m) {
  const set = {}
  for (const [k, v] of Object.entries(m.props ?? {})) if (keyOf(inst, k)) set[keyOf(inst, k)] = v
  for (const [k, v] of Object.entries(m.text ?? {})) if (keyOf(inst, k)) set[keyOf(inst, k)] = v
  for (const [k, v] of Object.entries(m.bools ?? {})) if (keyOf(inst, k)) set[keyOf(inst, k)] = v
  for (const [k, v] of Object.entries(m.icons ?? {})) if (keyOf(inst, k)) set[keyOf(inst, k)] = (await iconOf(v)).id
  if (Object.keys(set).length) inst.setProperties(set)
}

// The page, and a fresh screen frame on it.
let page = figma.root.children.find((p) => p.name === S.page)
if (!page) { page = figma.createPage(); page.name = S.page; figma.root.insertChild(0, page) }
await figma.setCurrentPageAsync(page)
for (const n of page.children.filter((n) => [`${S.name}: notes`, `${S.name}: title`, `${S.name}: caption`].includes(n.name))) n.remove()
const { width: W, height: H } = S.viewport
// An existing screen is emptied and refilled, so links to it (and prototype links) keep working.
let screen = page.children.find((n) => n.type === 'FRAME' && n.name === S.name)
if (screen) for (const c of [...screen.children]) c.remove()
else { screen = figma.createFrame(); screen.name = S.name }
// A screen is placed by coordinates: auto layout (Shift+A by accident) would line its layers up in a row.
screen.layoutMode = 'NONE'
screen.resize(W, H); screen.clipsContent = true
screen.fills = [await paint('Semantic/color/surface/default')]
page.appendChild(screen); screen.x = S.at.x; screen.y = S.at.y

// Backgrounds: bands, the list column, a line under a band.
for (const f of S.frames) {
  const r = figma.createRectangle(); r.name = `Background: ${f.fill.split('/').slice(-2).join(' ')}`
  r.resize(f.box.w, Math.max(1, f.box.h)); r.x = f.box.x; r.y = f.box.y
  r.fills = [await paint(f.fill)]; screen.appendChild(r)
  if (f.divider) {
    const line = figma.createRectangle(); line.name = 'Divider'; line.resize(f.box.w, 1); line.x = f.box.x; line.y = f.box.y + f.box.h - 1
    line.fills = [await paint('Component/layout/divider/color')]; screen.appendChild(line)
  }
}

// Instances, in reading order.
const report = []
for (const m of S.instances) {
  // A set the library hasn't published (yet) can't be imported: reported, not drawn.
  let set
  try { set = await setOf(m.set) } catch { report.push({ set: m.set, notPublished: true }); continue }
  const variant = set.children.find((c) => Object.entries(m.props).every(([k, v]) => c.variantProperties[k] === v))
  if (!variant) { report.push({ set: m.set, missingVariant: m.props }); continue }
  let x = m.box.x
  // A Link with an icon (Figma's Link has none): the icon, then the link.
  if (m.before) {
    const ic = (await iconOf(m.before)).createInstance(); ic.name = `Icon: ${m.before}`
    ic.resize(16, 16); screen.appendChild(ic); ic.x = x; ic.y = m.box.y + (m.box.h - 16) / 2
    for (const v of ic.findAll((n) => 'strokes' in n && n.strokes.length)) { v.strokes = [await paint('Semantic/color/text/link/default')]; v.strokeWeight = 2 * 16 / 24 }
    x += 22
  }
  const inst = variant.createInstance(); inst.name = m.set
  screen.appendChild(inst); inst.x = x; inst.y = m.box.y
  await fonts(inst)
  await setProps(inst, m)
  for (const [layer, n] of Object.entries(m.nested ?? {})) {
    const child = inst.findAll((c) => c.type === 'INSTANCE' && c.name === layer)[0]
    if (child) { await fonts(child); await setProps(child, n) }
  }
  await fonts(inst)
  // A layer by name, or by a path through named layers ('Labels>Label': the type badge, not the feature badge).
  for (const [path, chars] of Object.entries(m.layers ?? {})) {
    const names = path.split('>')
    let scope = [inst]
    for (const name of names.slice(0, -1)) scope = scope.flatMap((n) => n.findAll((c) => c.name === name))
    for (const t of scope.flatMap((n) => n.findAll((c) => c.type === 'TEXT' && c.name === names.at(-1)))) { await fonts(t); t.characters = chars }
  }
  // The listing's own photo, on the media layer.
  if (m.image && INPUT.images[m.image]) {
    const media = inst.findAll((c) => c.name === 'Media')[0] ?? inst
    if ('fills' in media) media.fills = media.fills.map((fl) => (fl.type === 'IMAGE' ? { ...fl, imageHash: INPUT.images[m.image] } : fl))
  }
  // Width as on the page (a card in a 638px column, a field that fills its share of the bar).
  const w = m.box.w - (m.before ? 22 : 0)
  // Only sets that fill their space take the page's width; the rest size to their content
  // (Figma's text runs a little wider than the browser's, and a forced width would wrap a chip).
  const STRETCH = ['Search field', 'Property card', 'Map placeholder', 'Global header', 'Footer']
  if (Math.abs(inst.width - w) > 1 && STRETCH.includes(m.set)) inst.resize(w, inst.height)
  // A row-shaped part narrower or wider than the page's (a chip with longer text) hugs its text, as in the code.
  else if (Math.abs(inst.width - w) > 1 && inst.layoutMode === 'HORIZONTAL') inst.primaryAxisSizingMode = 'AUTO'
  if (m.set === 'Map placeholder') inst.resize(m.box.w, m.box.h)
  const dw = Math.round((inst.width - w) * 10) / 10, dh = Math.round((inst.height - m.box.h) * 10) / 10
  if ((Math.abs(dw) > 1 && STRETCH.includes(m.set)) || Math.abs(dh) > 1) report.push({ set: m.set, at: [Math.round(m.box.x), Math.round(m.box.y)], width: [Math.round(w), Math.round(inst.width)], height: [Math.round(m.box.h), Math.round(inst.height)] })
}

// Text in the library's type styles.
for (const t of S.texts) {
  const node = figma.createText(); node.name = t.chars.slice(0, 40)
  node.characters = t.chars
  await node.setTextStyleIdAsync((await styleOf(t.style)).id)
  node.fills = [await paint(t.color)]
  node.textAlignHorizontal = t.align
  screen.appendChild(node); node.x = t.box.x; node.y = t.box.y
  node.textAutoResize = 'HEIGHT'; node.resize(Math.ceil(t.box.w) + 2, node.height)
}

// Numbered callouts on the screen, and the notes beside it.
async function badge(n) {
  const b = figma.createAutoLayout('HORIZONTAL', { name: `Note ${n}`, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' })
  b.resize(28, 28); b.primaryAxisSizingMode = 'FIXED'; b.counterAxisSizingMode = 'FIXED'; b.cornerRadius = 14
  b.fills = [await paint('Semantic/color/surface/inverse')]
  b.strokes = [await paint('Semantic/color/surface/default')]; b.strokeWeight = 2
  const t = figma.createText(); t.fontName = { family: 'Outfit', style: 'SemiBold' }; t.characters = String(n); t.fontSize = 14
  t.fills = [await paint('Semantic/color/text/inverse')]; b.appendChild(t)
  return b
}
for (const n of S.notes) {
  const b = await badge(n.n); screen.appendChild(b)
  b.x = Math.min(W - 30, n.box.x + n.box.w - 12); b.y = Math.max(2, n.box.y - 16)
}
async function text(chars, style, colour, width) {
  const t = figma.createText(); t.characters = chars; await t.setTextStyleIdAsync((await styleOf(style)).id); t.fills = [await paint(colour)]
  t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); return t
}
if (S.caption) {
  const cap = figma.createAutoLayout('VERTICAL', { name: `${S.name}: caption`, itemSpacing: 4 }); cap.fills = []
  page.appendChild(cap); cap.x = S.at.x; cap.y = S.at.y - 76
  cap.appendChild(await text(S.name, 'heading-3', 'Semantic/color/text/default', W))
  cap.appendChild(await text(S.caption, 'body-small', 'Semantic/color/text/subtle', W))
}
if (S.title) {
  const title = figma.createAutoLayout('VERTICAL', { name: `${S.name}: title`, itemSpacing: 8 }); title.fills = []
  page.appendChild(title); title.x = S.at.x; title.y = S.at.y - 200 - 160
  title.appendChild(await text('Prototype · AcmeCo is a fictional brand', 'label', 'Semantic/color/text/subtle', 960))
  title.appendChild(await text(S.name, 'heading-1', 'Semantic/color/text/default', 960))
  title.appendChild(await text(S.intro, 'body', 'Semantic/color/text/subtle', 960))
}
if (S.notes.length) {
  const panel = figma.createAutoLayout('VERTICAL', { name: `${S.name}: notes`, itemSpacing: 24, paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32 })
  panel.fills = [await paint('Semantic/color/surface/subtle')]; panel.cornerRadius = 8
  page.appendChild(panel); panel.x = S.at.x + W + 80; panel.y = screen.y
  panel.appendChild(await text('The proposals', 'heading-2', 'Semantic/color/text/default', 456))
  for (const n of S.notes) {
    const card = figma.createAutoLayout('VERTICAL', { name: `Note ${n.n}: ${n.title}`, itemSpacing: 8, paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 })
    card.fills = [await paint('Semantic/color/surface/default')]; card.cornerRadius = 8
    panel.appendChild(card)
    const head = figma.createAutoLayout('HORIZONTAL', { name: 'Heading', itemSpacing: 12, counterAxisAlignItems: 'CENTER' }); head.fills = []
    card.appendChild(head); head.appendChild(await badge(n.n)); head.appendChild(await text(n.title, 'heading-3', 'Semantic/color/text/default', 376))
    for (const [label, body] of [['Problem', n.problem], ['Proposal', n.proposal], ['Why', n.why]]) {
      card.appendChild(await text(label, 'label', 'Semantic/color/text/default', 416))
      card.appendChild(await text(body, 'body-small', 'Semantic/color/text/default', 416))
    }
    card.appendChild(await text(n.evidence, 'caption', 'Semantic/color/text/subtle', 416))
  }

}
const unwired = await wire(screen, S.links ?? [])
return { page: page.id, screen: screen.id, instances: S.instances.length, sizeDifferences: report, linksWaitingForFrames: unwired }
