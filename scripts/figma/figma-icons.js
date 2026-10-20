// Runs INSIDE Figma (use_figma). Render with: node scripts/figma/render-components.mjs icons
// Builds the "Icons" page: one component per registry icon, from the same lucide-react
// shapes the code draws. Re-running replaces the generated frame and moves the existing
// components into it untouched: only new icons are drawn. (Redrawing an existing icon's
// shapes wipes the colour and stroke every instance sets on them: found in phase 6d, when
// a refresh turned every icon in the library back to ink.) Pass INPUT.redraw with an
// icon's name to redraw it on purpose (a new lucide version), then rebuild the sets.
/* __INPUT__ */
await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' })
await figma.loadFontAsync({ family: 'Outfit', style: 'SemiBold' })
const collections = await figma.variables.getLocalVariableCollectionsAsync()
const nameOf = Object.fromEntries(collections.map((c) => [c.id, c.name]))
const vars = await figma.variables.getLocalVariablesAsync()
const V = (name) => { const v = vars.find((x) => `${nameOf[x.variableCollectionId]}/${x.name}` === name); if (!v) throw new Error('missing variable ' + name); return v }
function resolved(v) { let cur = v; for (let i = 0; i < 10; i++) { const col = collections.find((c) => c.id === cur.variableCollectionId); const raw = cur.valuesByMode[col.modes[0].modeId]; if (raw && raw.type === 'VARIABLE_ALIAS') cur = vars.find((x) => x.id === raw.id); else return raw } }
const paint = (name) => { const v = V(name); const c = resolved(v); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }, 'color', v) }
const styles = await figma.getLocalTextStylesAsync()
const style = (n) => styles.find((s) => s.name === n).id

// Page: after the Motion page, before the components.
let page = figma.root.children.find((p) => p.name === 'Icons')
if (!page) { page = figma.createPage(); page.name = 'Icons' }
await page.loadAsync()
const existing = Object.fromEntries(page.findAllWithCriteria({ types: ['COMPONENT'] }).map((c) => [c.name, c]))
const oldFrames = page.children.filter((n) => n.name.startsWith('Generated:'))

const root = figma.createAutoLayout('VERTICAL', { name: 'Generated: Icons', itemSpacing: 24, paddingTop: 64, paddingBottom: 64, paddingLeft: 64, paddingRight: 64 })
root.fills = [paint('Semantic/color/surface/default')]
root.x = 100; root.y = 100
page.appendChild(root)
async function text(chars, st, colour = 'Semantic/color/text/default', width) {
  const t = figma.createText(); t.characters = chars; await t.setTextStyleIdAsync(style(st)); t.fills = [paint(colour)]
  if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height) }
  return t
}
root.appendChild(await text('Prototype · AcmeCo is a fictional brand', 'label'))
root.appendChild(await text('Icons', 'heading-1'))
root.appendChild(await text(`One component per icon the system uses, generated from src/icons/index.ts and lucide-react ${INPUT.lucideVersion} (the same shapes the code draws). Components' icon slots swap between these. Colour comes from where an icon is used; the stroke here is the ink text colour.`, 'body', 'Semantic/color/text/subtle', 880))
const grid = figma.createAutoLayout('HORIZONTAL', { name: 'Grid', itemSpacing: 16, counterAxisSpacing: 24 })
grid.layoutWrap = 'WRAP'; grid.fills = []
root.appendChild(grid)
grid.layoutSizingHorizontal = 'FIXED'; grid.resize(880, grid.height)

const result = { created: [], kept: [], redrawn: [] }
for (const icon of INPUT.icons) {
  let comp = existing[icon.name]
  const redraw = comp && (INPUT.redraw ?? []).includes(icon.name)
  if (comp && !redraw) {
    result.kept.push(icon.name)
  } else {
    const drawn = figma.createNodeFromSvg(icon.svg)
    if (comp) { for (const ch of [...comp.children]) ch.remove(); result.redrawn.push(icon.name) }
    else { comp = figma.createComponent(); comp.name = icon.name; result.created.push(icon.name) }
    comp.resize(24, 24); comp.fills = []; comp.clipsContent = false
    // Layers named for what they are (Figma's import calls them 'Vector'; the lint flags default names).
    for (const ch of [...drawn.children]) { ch.name = ch.type === 'ELLIPSE' ? 'circle' : ch.type === 'RECTANGLE' ? 'rect' : 'stroke'; comp.appendChild(ch) }
    drawn.remove()
    // Strokes bound to the ink text colour; an instance can override it.
    for (const n of comp.findAll((n) => 'strokes' in n && n.strokes.length)) n.strokes = [paint('Semantic/color/text/default')]
    comp.description = `${icon.name.replace('icon/', '')}: lucide "${icon.lucide}" (lucide-react ${INPUT.lucideVersion}). Code: import from src/icons/index.ts.`
  }
  const cell = figma.createAutoLayout('VERTICAL', { name: 'cell: ' + icon.name.replace('icon/', ''), itemSpacing: 8, paddingTop: 16, paddingBottom: 16, paddingLeft: 8, paddingRight: 8, counterAxisAlignItems: 'CENTER' })
  cell.fills = []; cell.strokes = [paint('Semantic/color/border/default')]; cell.strokeWeight = 1; cell.cornerRadius = 8
  grid.appendChild(cell)
  cell.resize(104, cell.height); cell.layoutSizingHorizontal = 'FIXED'
  cell.appendChild(comp)
  cell.appendChild(await text(icon.name.replace('icon/', ''), 'caption', 'Semantic/color/text/subtle'))
}
for (const n of oldFrames) n.remove() // after the components moved into the new grid
result.page = page.id
result.components = Object.fromEntries(page.findAllWithCriteria({ types: ['COMPONENT'] }).map((c) => [c.name, c.id]))
return result
