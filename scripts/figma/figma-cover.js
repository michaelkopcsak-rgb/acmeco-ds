// Runs INSIDE Figma (use_figma). Render with:
//   node scripts/figma/render-components.mjs cover
// Writes the Cover page's status line and contents from the repo: the component list from
// figma/components.json and the check totals from figma/reports/. Replaces the previous
// generated block, so the Cover never says more (or less) than the repo does.
/* __INPUT__ */
const cover = figma.root.children.find((p) => p.name === 'Cover')
await cover.loadAsync()
await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' }); await figma.loadFontAsync({ family: 'Outfit', style: 'SemiBold' })
const frame = cover.children.find((n) => n.name === 'Cover')
const collections = await figma.variables.getLocalVariableCollectionsAsync(); const nameOf = Object.fromEntries(collections.map((c) => [c.id, c.name])); const vars = await figma.variables.getLocalVariablesAsync()
const byName = Object.fromEntries(vars.map((v) => [`${nameOf[v.variableCollectionId]}/${v.name}`, v]))
function resolved(v) { let cur = v; for (let i = 0; i < 10; i++) { const col = collections.find((c) => c.id === cur.variableCollectionId); const raw = cur.valuesByMode[col.modes[0].modeId]; if (raw && raw.type === 'VARIABLE_ALIAS') cur = vars.find((x) => x.id === raw.id); else return raw } }
const paint = (name) => { const v = byName[name]; const c = resolved(v); return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }, 'color', v) }
const styles = await figma.getLocalTextStylesAsync(); const style = (n) => styles.find((s) => s.name === n).id
async function text(chars, st, width, colour = 'Semantic/color/text/default') { const t = figma.createText(); t.characters = chars; await t.setTextStyleIdAsync(style(st)); t.fills = [paint(colour)]; t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); return t }
const group = (name, gap) => { const f = figma.createAutoLayout('VERTICAL', { name, itemSpacing: gap }); f.fills = []; return f }

const status = frame.findAllWithCriteria({ types: ['TEXT'] }).find((t) => t.characters.startsWith('Status:'))
await status.setTextStyleIdAsync(style('body'))
status.characters = INPUT.status
for (const n of frame.children.filter((n) => n.name === 'Cover contents')) n.remove()
const block = group('Cover contents', 40); frame.appendChild(block)
block.x = status.x; block.y = status.y + status.height + 40
const cols = figma.createAutoLayout('HORIZONTAL', { name: 'Columns', itemSpacing: 48 }); cols.fills = []; block.appendChild(cols)
for (const c of INPUT.columns) { const g = group(c.title, 8); cols.appendChild(g); g.appendChild(await text(c.title, 'heading-3', 288)); g.appendChild(await text(c.lines.join('\n'), 'body-small', 288)) }
for (const s of INPUT.sections) { const g = group(s.title, 8); block.appendChild(g); g.appendChild(await text(s.title, 'heading-3', 960)); g.appendChild(await text(s.text, 'body', 960, s.subtle ? 'Semantic/color/text/subtle' : 'Semantic/color/text/default')) }
frame.resize(frame.width, block.y + block.height + 96)
return { status: status.id, block: block.id, height: Math.round(frame.height) }
