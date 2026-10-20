// Runs INSIDE Figma (use_figma). Render with:
//   node scripts/figma/render-components.mjs component <Name> docs
// Builds the documentation beside a component's grid, from the repo: its guidance file
// (the same text as its Storybook docs page), anatomy, token specs, and contrast for
// every pair from tokens/contrast-pairs.json. Replaces the previous generated docs.
/* __INPUT__ */
await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' })
await figma.loadFontAsync({ family: 'Outfit', style: 'SemiBold' })
const collections = await figma.variables.getLocalVariableCollectionsAsync()
const nameOf = Object.fromEntries(collections.map((c) => [c.id, c.name]))
const vars = await figma.variables.getLocalVariablesAsync()
const byName = Object.fromEntries(vars.map((v) => [`${nameOf[v.variableCollectionId]}/${v.name}`, v]))
function resolved(v) { let cur = v; for (let i = 0; i < 10; i++) { const col = collections.find((c) => c.id === cur.variableCollectionId); const raw = cur.valuesByMode[col.modes[0].modeId]; if (raw && raw.type === 'VARIABLE_ALIAS') cur = vars.find((x) => x.id === raw.id); else return raw } }
const paint = (name) => { const v = byName[name]; const c = resolved(v); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }, 'color', v) }
const styles = await figma.getLocalTextStylesAsync()
const style = (n) => styles.find((s) => s.name === n).id
const INK = 'Semantic/color/text/default', SUBTLE = 'Semantic/color/text/subtle'

const page = figma.root.children.find((p) => p.name === INPUT.page)
await page.loadAsync()
const grid = page.children.find((n) => n.name === `Generated: ${INPUT.name}`)
const set = grid.findOne((n) => n.type === 'COMPONENT_SET')
for (const n of page.children.filter((n) => n.name === `Generated: ${INPUT.name} docs`)) n.remove()

const W = 720
async function text(chars, st, colour = INK, width = W) {
  const t = figma.createText(); t.characters = chars; await t.setTextStyleIdAsync(style(st)); t.fills = [paint(colour)]
  t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); return t
}
function column(name, gap = 12) { const f = figma.createAutoLayout('VERTICAL', { name, itemSpacing: gap }); f.fills = []; return f }
const docs = figma.createAutoLayout('VERTICAL', { name: `Generated: ${INPUT.name} docs`, itemSpacing: 48, paddingTop: 48, paddingBottom: 48, paddingLeft: 48, paddingRight: 48 })
docs.fills = [paint('Semantic/color/surface/default')]
docs.strokes = [paint('Semantic/color/border/default')]; docs.strokeWeight = 1; docs.cornerRadius = 8
docs.x = grid.x + grid.width + 80; docs.y = grid.y
page.appendChild(docs)

// Header
const header = column('Header', 8)
docs.appendChild(header)
header.appendChild(await text('Prototype · AcmeCo is a fictional brand', 'label'))
header.appendChild(await text(INPUT.name, 'heading-1'))
header.appendChild(await text(`Status: ${INPUT.status}\nStorybook: ${INPUT.storybook}\nCode: ${INPUT.code}\nGenerated from the repo by scripts/figma (guidance, tokens, contrast pairs); edit the repo, not this frame.`, 'body-small', SUBTLE))

async function section(title, lines) {
  const s = column(title)
  docs.appendChild(s)
  s.appendChild(await text(title, 'heading-2'))
  if (lines.length) s.appendChild(await text(lines.join('\n'), 'body'))
  return s
}
const sec = Object.fromEntries(INPUT.docs.sections.map((s) => [s.title, s.lines]))
for (const t of ['Overview', 'When to use', 'When not to use']) if (sec[t]) await section(t, sec[t])

// Anatomy: a real instance with numbered callouts.
{
  const s = await section('Anatomy', [])
  const stage = figma.createFrame(); stage.name = 'Anatomy example'; stage.fills = [paint('Semantic/color/surface/subtle')]; stage.cornerRadius = 8
  s.appendChild(stage)
  const sample = set.children.find((c) => Object.entries(INPUT.anatomyVariant).every(([k, v]) => c.variantProperties[k] === v))
  const inst = sample.createInstance()
  // Wider than the stage (the 768px sign-in dialog): shown scaled down to fit, and said so.
  const scale = Math.min(1, (W - 96) / inst.width)
  if (scale < 1) inst.rescale(scale)
  // The stage is 160px tall, or taller for a big component (a dialog), with room for callouts.
  const H = Math.max(160, Math.ceil(inst.height) + 96)
  stage.resize(W, H)
  // Every optional part shown (boolean properties on), so each can be pointed at.
  const bools = Object.entries(inst.componentProperties).filter(([, p]) => p.type === 'BOOLEAN').map(([k]) => [k, true])
  if (bools.length) inst.setProperties(Object.fromEntries(bools))
  stage.appendChild(inst); inst.x = (W - inst.width) / 2; inst.y = (H - inst.height) / 2 + 12
  // Callouts by layer name (no layer = the whole instance): left, top, right, end or bottom of it.
  const box = (layer) => {
    if (!layer) return { x: inst.x, y: inst.y, w: inst.width, h: inst.height }
    // findAll, not findOne: findOne can miss layers inside nested instances.
    const c = inst.findAll((x) => x.name === layer)[0]
    if (!c) throw new Error('anatomy: no layer ' + layer)
    return { x: inst.x + c.absoluteTransform[0][2] - inst.absoluteTransform[0][2], y: inst.y + c.absoluteTransform[1][2] - inst.absoluteTransform[1][2], w: c.width * scale, h: c.height * scale }
  }
  const marks = INPUT.docs.anatomy.map((a) => {
    const b = box(a.layer)
    if (a.at === 'left') return [b.x - 28, b.y + b.h / 2 - 12]
    if (a.at === 'right') return [b.x + b.w + 8, b.y - 20]                 // beside its top-right corner
    if (a.at === 'end') return [b.x + b.w + 8, b.y + b.h / 2 - 12]         // right of it, centred
    if (a.at === 'bottom') return [b.x + b.w / 2 - 12, b.y + b.h + 8]
    return [b.x + b.w / 2 - 12, Math.min(b.y, inst.y) - 36]
  })
  marks.forEach(([mx, my], i) => {
    const m = figma.createAutoLayout('HORIZONTAL', { name: `callout ${i + 1}`, primaryAxisAlignItems: 'CENTER', counterAxisAlignItems: 'CENTER' })
    m.resize(24, 24); m.primaryAxisSizingMode = 'FIXED'; m.counterAxisSizingMode = 'FIXED'; m.cornerRadius = 12
    m.fills = [paint('Semantic/color/surface/inverse')]
    const n = figma.createText(); n.fontName = { family: 'Outfit', style: 'SemiBold' }; n.characters = String(i + 1); n.fontSize = 12; n.fills = [paint('Semantic/color/text/inverse')]
    m.appendChild(n); stage.appendChild(m); m.x = mx; m.y = my
  })
  s.appendChild(await text((scale < 1 ? `Shown at ${Math.round(scale * 100)}% to fit.\n` : '') + INPUT.docs.anatomy.map((a, i) => `${i + 1}.  ${a.part}: ${a.tokens}`).join('\n'), 'body-small'))
}

// Specs: token names and values, by size.
{
  const s = await section('Specs', [])
  const row = figma.createAutoLayout('HORIZONTAL', { name: 'Specs by size', itemSpacing: 24 }); row.fills = []
  s.appendChild(row)
  for (const g of INPUT.docs.specs) {
    // One column per value of the specs axis (usually Size), or one wide column.
    const width = INPUT.docs.specs.length > 1 ? 224 : W
    const title = INPUT.specsBy ? `${INPUT.specsBy}: ${g.value}` : 'Every variant'
    const c = column(title, 4)
    row.appendChild(c)
    c.appendChild(await text(title, 'label', INK, width))
    c.appendChild(await text(g.rows.map((r) => `${r.token}  ${r.value}`).join('\n'), 'body-small', INK, width))
  }
}

// Accessibility: the guidance, then contrast for every pair the CI checks.
{
  const s = await section('Accessibility', sec.Accessibility ?? [])
  s.appendChild(await text('Contrast (from tokens/contrast-pairs.json; checked in CI)', 'label'))
  s.appendChild(await text(INPUT.docs.contrast.length ? INPUT.docs.contrast.map((p) => `${p.pass ? '✓' : '✗'}  ${p.note}: ${p.ratio}:1 (needs ${p.min}:1)   ${p.fg} on ${p.bg}`).join('\n') : 'No colour pairs of its own: its parts (instances) carry them.', 'body-small'))
}
for (const t of ['Content', 'Evidence']) if (sec[t]) await section(t, sec[t])

return { docs: docs.id, sections: docs.children.map((c) => c.name), size: [Math.round(docs.width), Math.round(docs.height)] }
