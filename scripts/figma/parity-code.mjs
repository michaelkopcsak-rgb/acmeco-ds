// The code side of the Figma parity check: opens a component's States matrix in the
// running Storybook (port 6007), reads the computed styles of every cell, and writes
// figma/parity/<id>-code.json. figma-parity.js then reads the same fields from the
// Figma component set and compares them.
//
//   node scripts/figma/parity-code.mjs <id> [<id> ...]     (Storybook must be running)
//
// What to read comes from the spec's `parity`: the story, the cell order (the matrix's
// rows and columns, as variant properties) and the parts: a CSS selector inside a cell,
// the Figma layer it corresponds to (none = the variant itself) and which fields to read.
import { writeFile, mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const ids = process.argv.slice(2)
if (!ids.length) { console.error('Usage: parity-code.mjs <id> [<id> ...]'); process.exit(1) }

// Runs in the page: one record per table cell, in document order.
function measureCells({ parts, cells, tableCells }) {
  const hex = (c) => {
    if (!c || c === 'none' || c === 'transparent') return null
    const m = c.match(/rgba?\(([^)]+)\)/)
    if (!m) return c
    const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number)
    if (a === 0) return null
    const h = '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')
    return a < 1 ? h + Math.round(a * 255).toString(16).padStart(2, '0') : h
  }
  const px = (v) => Math.round(parseFloat(v) * 100) / 100
  // Box shadows as [colour, x, y, blur, spread, inset].
  const shadows = (cs) => cs.boxShadow === 'none' ? [] : cs.boxShadow.split(/,(?![^(]*\))/).map((s) => {
    const colour = (s.match(/rgba?\([^)]+\)/) || [null])[0]
    const nums = s.replace(/rgba?\([^)]+\)/, '').match(/-?[\d.]+px/g).map(px)
    return { colour: hex(colour), spread: nums[3] ?? 0, flat: nums[0] === 0 && nums[1] === 0 && (nums[2] ?? 0) === 0, inset: s.includes('inset') }
  })
  const field = (el, f, root) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect()
    switch (f) {
      case 'bg': return hex(cs.backgroundColor)
      case 'border': {
        const w = px(cs.borderTopWidth), c = hex(cs.borderTopColor)
        if (!w || cs.borderTopStyle === 'none' || !c) return null
        // An inset shadow in the border colour thickens it without moving the content (invalid fields).
        return [c, w + shadows(cs).filter((s) => s.inset && s.flat).reduce((t, s) => t + s.spread, 0)]
      }
      case 'ring': {
        if (cs.outlineStyle !== 'none' && px(cs.outlineWidth) > 0) return [[hex(cs.outlineColor), px(cs.outlineWidth), px(cs.outlineOffset)]]
        const rings = shadows(cs).filter((s) => !s.inset && s.flat && s.spread > 0).sort((a, b) => a.spread - b.spread)
        if (!rings.length) return null
        return rings.map((s, i) => [s.colour, s.spread - (i ? rings[i - 1].spread : 0), i ? rings[i - 1].spread : 0])
      }
      case 'radius': return px(cs.borderTopLeftRadius)
      case 'opacity': return Number(cs.opacity)
      // Untransformed size for anything rotated or scaled (a spinning spinner's box grows as it turns).
      case 'w': return cs.transform !== 'none' && el.offsetWidth ? el.offsetWidth : Math.round(r.width * 100) / 100
      case 'h': return cs.transform !== 'none' && el.offsetHeight ? el.offsetHeight : Math.round(r.height * 100) / 100
      case 'padT': return px(cs.paddingTop)
      case 'padB': return px(cs.paddingBottom)
      case 'borderTop': return px(cs.borderTopWidth) && cs.borderTopStyle !== 'none' && hex(cs.borderTopColor) ? [hex(cs.borderTopColor), px(cs.borderTopWidth)] : null
      case 'borderBottom': return px(cs.borderBottomWidth) && cs.borderBottomStyle !== 'none' && hex(cs.borderBottomColor) ? [hex(cs.borderBottomColor), px(cs.borderBottomWidth)] : null
      case 'borderLeft': return px(cs.borderLeftWidth) && cs.borderLeftStyle !== 'none' && hex(cs.borderLeftColor) ? [hex(cs.borderLeftColor), px(cs.borderLeftWidth)] : null
      case 'align': return ({ start: 'LEFT', left: 'LEFT', end: 'RIGHT', right: 'RIGHT', center: 'CENTER' })[cs.textAlign] ?? cs.textAlign
      case 'case': return cs.textTransform === 'uppercase' ? 'UPPER' : 'ORIGINAL'
      case 'tracking': return cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing)
      case 'padL': return px(cs.paddingLeft)
      case 'padR': return px(cs.paddingRight)
      case 'gap': { const g = cs.flexDirection.startsWith('column') ? cs.rowGap : cs.columnGap; return g === 'normal' ? 0 : px(g) }
      case 'font': return [px(cs.fontSize), px(cs.lineHeight), Number(cs.fontWeight)]
      case 'color': return el.tagName === 'INPUT' && !el.value ? hex(getComputedStyle(el, '::placeholder').color) : hex(cs.color)
      case 'underline': return cs.textDecorationLine.includes('underline') ? px(cs.textDecorationThickness) : null
      case 'icon': return [hex(cs.stroke), Math.round(r.width * 100) / 100, hex(cs.fill), Math.round(parseFloat(cs.strokeWidth) * 100) / 100]
      // Distances from the variant's edges to the part's (box model: border + padding; the hero
      // Search button's inset).
      case 'startInset': return Math.round((r.left - root.getBoundingClientRect().left) * 100) / 100
      case 'endInset': return Math.round((root.getBoundingClientRect().right - r.right) * 100) / 100
      case 'topInset': return Math.round((r.top - root.getBoundingClientRect().top) * 100) / 100
      case 'bottomInset': return Math.round((root.getBoundingClientRect().bottom - r.bottom) * 100) / 100
      default: throw new Error('unknown field ' + f)
    }
  }
  // ':scope' = the cell itself (when a cell is the component, not a table cell around it).
  const find = (cell, css) => (css === ':scope' ? cell : cell.querySelector(css))
  return [...document.querySelectorAll(cells)].map((td) => {
    // Insets are measured from the component itself: its part with no Figma layer; else, in a
    // States matrix, the first part; else (the component is the cell) the cell.
    const rootPart = parts.find((p) => p.layer == null) ?? (tableCells ? parts[0] : null)
    const root = (rootPart && find(td, rootPart.css)) ?? td
    return Object.fromEntries(parts.map((p) => {
      const el = find(td, p.css)
      // A part that isn't rendered (or is display: none) is null; Figma must not have it either.
      if (!el || !el.getClientRects().length) return [p.name, null]
      return [p.name, Object.fromEntries(p.fields.map((f) => [f, field(el, f, root)]))]
    }))
  })
}

const browser = await chromium.launch()
try {
  for (const id of ids) {
    const mod = await import(`./components/${id}.mjs`)
    const spec = Object.values(mod)[0]
    if (!spec.parity) throw new Error(`${id}: no parity section in its spec`)
    // A States matrix's table cells by default; or the component itself (cells), in one or
    // more stories (a dialog opens outside the story's canvas, one size per story).
    const cellsCss = spec.parity.cells ?? '#storybook-root tbody td'
    const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } })
    const cells = []
    // A story is an id, or { id, width, clicks }: measured at another window width (a phone
    // layout), or after pressing some buttons (a menu that opens only when asked).
    for (const entry of [spec.parity.story].flat()) {
      const story = typeof entry === 'string' ? { id: entry } : entry
      await page.setViewportSize({ width: story.width ?? 1400, height: 1200 })
      await page.goto(`http://localhost:6007/iframe.html?id=${story.id}&viewMode=story`)
      for (const css of story.clicks ?? []) { await page.click(css); await page.waitForTimeout(300) }
      await page.waitForSelector(cellsCss)
      await page.waitForTimeout(800) // ForceState re-applies forced states after late renders
      cells.push(...(await page.evaluate(measureCells, { parts: spec.parity.parts, cells: cellsCss, tableCells: !spec.parity.cells })))
    }
    const order = spec.parity.order
    if (cells.length !== order.length) throw new Error(`${id}: ${cells.length} cells in the matrix, ${order.length} in parity.order`)
    const variants = Object.fromEntries(order.map((props, i) => [Object.keys(spec.axes).map((k) => props[k]).join('|'), cells[i]]))
    await mkdir('figma/parity', { recursive: true })
    await writeFile(`figma/parity/${id}-code.json`, JSON.stringify({
      $description: `Computed styles of every ${spec.name} variant, read from the rendered Storybook States matrix (getComputedStyle) by scripts/figma/parity-code.mjs: the code side of the Figma parity check. null = transparent, none or not rendered.`,
      parts: spec.parity.parts,
      variants,
    }, null, 1) + '\n')
    const checks = Object.values(variants).reduce((t, v) => t + Object.values(v).reduce((u, p) => u + (p ? Object.keys(p).length : 1), 0), 0)
    console.log(`✔ figma/parity/${id}-code.json: ${order.length} variants, ${checks} fields`)
    await page.close()
  }
} finally {
  await browser.close()
}
