// Runs INSIDE Figma (use_figma), in the file the screens are in. Render with:
//   node scripts/figma/render-components.mjs screen-docs <docs id>
// Builds the documentation frame for a set of screens (scripts/figma/screens/<docs id>.mjs):
// the states and transitions read from the screens' specs, the agreed rules, every library
// part the screens use as an instance, the layout variables (bars sized by the variables) and
// colour variables (swatches bound to them), accessibility from the components' guidance,
// and links to the clickable prototypes. Library text styles and variables only.
/* __INPUT__ */
const D = INPUT.docs, K = INPUT.keys
await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' })
await figma.loadFontAsync({ family: 'Outfit', style: 'SemiBold' })
const varCache = {}, setCache = {}, styleCache = {}, iconCache = {}
const V = async (name) => { if (!varCache[name]) varCache[name] = await figma.variables.importVariableByKeyAsync(K.variables[name]); return varCache[name] }
async function resolvedOf(v) { let cur = v; for (let i = 0; i < 10; i++) { const raw = Object.values(cur.valuesByMode)[0]; if (raw && raw.type === 'VARIABLE_ALIAS') cur = await figma.variables.getVariableByIdAsync(raw.id); else return raw } }
async function paint(name) { const v = await V(name); const c = await resolvedOf(v); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }, 'color', v) }
const setOf = async (n) => { if (!setCache[n]) setCache[n] = await figma.importComponentSetByKeyAsync(K.sets[n]); return setCache[n] }
const styleOf = async (n) => { if (!styleCache[n]) styleCache[n] = await figma.importStyleByKeyAsync(K.styles[n]); return styleCache[n] }
const iconOf = async (n) => { if (!iconCache[n]) iconCache[n] = await figma.importComponentByKeyAsync(K.icons[n]); return iconCache[n] }
const keyOf = (inst, name) => Object.keys(inst.componentProperties).find((k) => k.split('#')[0] === name)
async function fonts(node) { for (const t of node.type === 'TEXT' ? [node] : node.findAll((x) => x.type === 'TEXT')) for (const f of t.getRangeAllFontNames(0, t.characters.length)) await figma.loadFontAsync(f) }
async function setProps(inst, m) {
  const set = {}
  for (const [k, v] of Object.entries({ ...(m.props ?? {}), ...(m.text ?? {}), ...(m.bools ?? {}) })) if (keyOf(inst, k)) set[keyOf(inst, k)] = v
  if (Object.keys(set).length) inst.setProperties(set)
}
async function text(chars, style, colour = 'Semantic/color/text/default', width) {
  const t = figma.createText(); t.characters = chars
  await t.setTextStyleIdAsync((await styleOf(style)).id); t.fills = [await paint(colour)]
  if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height) }
  return t
}
function stack(name, dir = 'VERTICAL', gap = 8) { const f = figma.createAutoLayout(dir, { name, itemSpacing: gap }); f.fills = []; return f }
const W = 1312 // inside 64px padding of a 1440 frame

// The frame, replaced on every run.
const page = figma.root.children.find((p) => p.name === D.page)
await figma.setCurrentPageAsync(page)
for (const n of page.children.filter((n) => n.name === D.name)) n.remove()
const doc = figma.createAutoLayout('VERTICAL', { name: D.name, itemSpacing: 48, paddingTop: 64, paddingBottom: 64, paddingLeft: 64, paddingRight: 64 })
doc.fills = [await paint('Semantic/color/surface/default')]
doc.strokes = [await paint('Semantic/color/border/default')]; doc.strokeWeight = 1; doc.cornerRadius = 8
page.appendChild(doc); doc.x = D.at.x; doc.y = D.at.y
doc.resize(1440, doc.height); doc.primaryAxisSizingMode = 'AUTO'; doc.counterAxisSizingMode = 'FIXED'
async function section(title, intro) {
  const s = stack(title, 'VERTICAL', 16); doc.appendChild(s)
  s.appendChild(await text(title, 'heading-2'))
  if (intro) s.appendChild(await text(intro, 'body', 'Semantic/color/text/subtle', W))
  return s
}

// Header and the prototypes.
{
  const h = stack('Header', 'VERTICAL', 8); doc.appendChild(h)
  h.appendChild(await text('Prototype · AcmeCo is a fictional brand', 'label', 'Semantic/color/text/subtle'))
  h.appendChild(await text(D.name.replace(' (documentation)', ''), 'heading-1'))
  h.appendChild(await text(D.intro, 'body', 'Semantic/color/text/subtle', W))
}
{
  const s = await section('Clickable prototypes')
  for (const p of D.prototypes) {
    const row = stack(p.label, 'VERTICAL', 2); s.appendChild(row)
    row.appendChild(await text(p.label, 'label'))
    if (p.url) {
      const link = await text(p.url, 'body', 'Semantic/color/text/link/default')
      link.setRangeHyperlink(0, p.url.length, { type: 'URL', value: p.url })
      link.textDecoration = 'UNDERLINE'
      row.appendChild(link)
    }
    if (p.note) row.appendChild(await text(p.note, 'body-small', 'Semantic/color/text/subtle', W))
  }
}

// States, transitions and rules.
{
  const s = await section('The three states', 'Each frame above is one state. In prototype mode the controls named under "Opens" are clickable.')
  const row = stack('States', 'HORIZONTAL', 24); s.appendChild(row)
  for (const st of INPUT.states) {
    const c = figma.createAutoLayout('VERTICAL', { name: st.name, itemSpacing: 8, paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 })
    c.fills = [await paint('Semantic/color/surface/subtle')]; c.cornerRadius = 8
    row.appendChild(c)
    c.appendChild(await text(st.name, 'heading-3', 'Semantic/color/text/default', 384))
    c.appendChild(await text(st.caption, 'body-small', 'Semantic/color/text/default', 384))
    c.appendChild(await text(`Opens: ${st.links.join(' · ')}`, 'caption', 'Semantic/color/text/subtle', 384))
  }
}
{
  const s = await section('How a visitor moves between them')
  for (const t of INPUT.transitions) s.appendChild(await text(`${t.from}  →  ${t.to}`, 'body', 'Semantic/color/text/default', W))
}
{
  const s = await section('The rules', D.rulesSource)
  for (const [k, r] of D.rules) {
    const row = stack(`Rule ${k}`, 'HORIZONTAL', 12); s.appendChild(row)
    row.appendChild(await text(k, 'heading-3'))
    row.appendChild(await text(r, 'body', 'Semantic/color/text/default', W - 40))
  }
}

// Every part the screens use, as library instances.
{
  const s = await section('The parts', 'Every library component the three screens use, in the variant they use it (larger parts shown smaller). Edit the library, not these copies.')
  const grid = figma.createAutoLayout('HORIZONTAL', { name: 'Parts', itemSpacing: 24, counterAxisSpacing: 32 })
  grid.fills = []; grid.layoutWrap = 'WRAP'; s.appendChild(grid); grid.resize(W, grid.height); grid.primaryAxisSizingMode = 'FIXED'
  for (const p of INPUT.parts) {
    const cell = stack(`${p.set}: ${Object.values(p.props).join(', ')}`, 'VERTICAL', 8); grid.appendChild(cell)
    const holder = stack('Part', 'HORIZONTAL', 6); holder.counterAxisAlignItems = 'CENTER'; cell.appendChild(holder)
    if (p.before) {
      const ic = (await iconOf(p.before)).createInstance(); ic.resize(16, 16); holder.appendChild(ic)
      for (const v of ic.findAll((n) => 'strokes' in n && n.strokes.length)) { v.strokes = [await paint('Semantic/color/text/link/default')]; v.strokeWeight = 2 * 16 / 24 }
    }
    const set = await setOf(p.set)
    const variant = set.children.find((c) => Object.entries(p.props).every(([k, v]) => c.variantProperties[k] === v))
    const inst = variant.createInstance(); holder.appendChild(inst)
    await fonts(inst); await setProps(inst, p)
    for (const [layer, n] of Object.entries(p.nested ?? {})) { const child = inst.findAll((c) => c.type === 'INSTANCE' && c.name === layer)[0]; if (child) { await fonts(child); await setProps(child, n) } }
    await fonts(inst)
    for (const [path, chars] of Object.entries(p.layers ?? {})) {
      const names = path.split('>'); let scope = [inst]
      for (const name of names.slice(0, -1)) scope = scope.flatMap((n) => n.findAll((c) => c.name === name))
      for (const t of scope.flatMap((n) => n.findAll((c) => c.type === 'TEXT' && c.name === names.at(-1)))) { await fonts(t); t.characters = chars }
    }
    if (inst.width > 420) inst.rescale(420 / inst.width)
    cell.appendChild(await text(p.set, 'label'))
    cell.appendChild(await text(Object.entries(p.props).map(([k, v]) => `${k}: ${v}`).join(' · '), 'caption', 'Semantic/color/text/subtle', Math.max(200, Math.min(420, holder.width))))
    cell.appendChild(await text(`In: ${p.screens.map((n) => n.replace('Proposed search results', 'Search results').replace(' (desktop, 1440)', '')).join('; ')}`, 'caption', 'Semantic/color/text/subtle', Math.max(200, Math.min(420, holder.width))))
  }
}

// Layout and colour variables.
{
  const s = await section('Layout variables', 'Each bar is sized by its library variable.')
  for (const [name, use] of D.layoutVariables) {
    const row = stack(name, 'VERTICAL', 4); s.appendChild(row)
    const v = await V(name), value = await resolvedOf(v)
    row.appendChild(await text(`${name.replace('Component/', '')}  ·  ${value}px`, 'label'))
    row.appendChild(await text(use, 'body-small', 'Semantic/color/text/subtle'))
    const bar = figma.createRectangle(); bar.name = `Bar: ${name}`; bar.resize(value, 8); bar.cornerRadius = 4
    bar.fills = [await paint('Semantic/color/border/default')]; row.appendChild(bar); bar.setBoundVariable('width', v)
  }
}
{
  const s = await section('Colour variables', 'The backgrounds the screens draw themselves; every other colour comes from the components.')
  const row = stack('Swatches', 'HORIZONTAL', 24); s.appendChild(row)
  for (const [name, use] of D.colourVariables) {
    const c = stack(name, 'VERTICAL', 8); row.appendChild(c)
    const sw = figma.createRectangle(); sw.name = `Swatch: ${name}`; sw.resize(200, 64); sw.cornerRadius = 4
    sw.fills = [await paint(name)]; sw.strokes = [await paint('Semantic/color/border/default')]; sw.strokeWeight = 1; c.appendChild(sw)
    c.appendChild(await text(name.replace('Component/', ''), 'label', 'Semantic/color/text/default', 280))
    c.appendChild(await text(use, 'caption', 'Semantic/color/text/subtle', 280))
  }
}

// Accessibility from the guidance files, and the known difference.
{
  const s = await section('Accessibility', 'From the components\' guidance (the same text as their Storybook pages).')
  for (const a of INPUT.access) {
    const row = stack(a.name, 'VERTICAL', 4); s.appendChild(row)
    row.appendChild(await text(a.name, 'heading-3'))
    row.appendChild(await text(a.lines.join('\n'), 'body-small', 'Semantic/color/text/default', W))
  }
}
{
  const s = await section('Known difference')
  s.appendChild(await text(D.knownDifference, 'body', 'Semantic/color/text/default', W))
}
return { doc: doc.id, size: [Math.round(doc.width), Math.round(doc.height)], parts: INPUT.parts.length }
