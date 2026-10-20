// Runs INSIDE Figma (use_figma). Render with: node scripts/figma/render-components.mjs images
// Makes the holder for the placeholder photos on the Property media page: one labelled
// rectangle per photo. The PNGs (figma/images/*.png) are then uploaded into those
// rectangles with the Figma MCP's upload_assets tool (raw bytes, no base64 in scripts),
// and their image hashes are compared with figma/images/manifest.json.
/* __INPUT__ */
let page = figma.root.children.find((p) => p.name === INPUT.page)
if (!page) {
  page = figma.createPage(); page.name = INPUT.page
  const pages = figma.root.children, divider = pages.findIndex((p) => p.name.includes('Components'))
  let at = divider + 1
  while (at < pages.length && pages[at] !== page && pages[at].name.localeCompare(INPUT.page) < 0) at++
  figma.root.insertChild(at, page)
}
await page.loadAsync()
await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' })
for (const n of page.children.filter((n) => n.name === 'Placeholder photos')) n.remove()
const holder = figma.createAutoLayout('HORIZONTAL', { name: 'Placeholder photos', itemSpacing: 16, paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 })
holder.fills = []; holder.x = 100; holder.y = -800
page.appendChild(holder)
const ids = {}
for (const [id, img] of Object.entries(INPUT.images)) {
  const r = figma.createRectangle(); r.name = `Photo: ${img.title} (${id})`
  r.resize(300, 198); r.fills = []
  holder.appendChild(r)
  ids[id] = r.id
}
const note = figma.createText(); note.characters = 'Placeholder photos: the illustrations from src/data/illustrations.ts (no real photography). Layers use them as image fills.'; note.fontSize = 12
// Bound to a variable like every other colour, so the lint finds no hard-coded paint.
const subtle = (await figma.variables.getLocalVariablesAsync('COLOR')).find((v) => v.name === 'color/text/subtle')
note.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0.36, g: 0.36, b: 0.36 } }, 'color', subtle)]
holder.appendChild(note)
return { page: page.id, holder: holder.id, rectangles: ids }
