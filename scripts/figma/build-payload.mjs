// Builds figma/payload.json from tokens/*.json: everything the Figma file should
// contain (variables, text styles, effect styles, the motion reference page).
// The Figma scripts (apply.js, verify.js) read this payload; nothing about Figma
// is decided anywhere else. CI rebuilds it and fails if the committed copy is stale.
//
// Why our own converter (docs/proposals/PHASE-2-FIGMA-VARIABLES.md): the
// import-tokens-figma parser ignores group-level $type (colours became strings)
// and its apply script can't alias across collections.
//
// Run with: npm run figma:payload
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises'
import { flatten, resolve } from '../../src/lib/contrast.ts'

const read = async (f) => JSON.parse(await readFile(f, 'utf8'))
const primitivesTree = await read('tokens/primitives.json')
const semanticTree = await read('tokens/semantic-light.json')
const all = { ...flatten(primitivesTree), ...flatten(semanticTree) }

/** Walks a DTCG tree, inheriting $type from groups (as Style Dictionary does). */
function walk(tree, prefix = '', inherited, out = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || typeof node !== 'object' || node === null) continue
    const path = prefix ? `${prefix}.${key}` : key
    const type = node.$type ?? tree.$type ?? inherited
    if ('$value' in node) out.push({ path, type, value: node.$value, description: node.$description ?? '' })
    else walk(node, path, type, out)
  }
  return out
}

const cssVar = (path) => `var(--${path.replaceAll('.', '-')})`
const figmaName = (path) => path.replaceAll('.', '/')
const isRef = (v) => typeof v === 'string' && /^\{.+\}$/.test(v)
const refPath = (v) => v.slice(1, -1)
const px = (v) => Number(String(v).replace(/px$/, ''))

// Tokens Figma variables can't hold. They go on the reference page instead (decision 15).
// A reference counts by what it resolves to: layout.gap.section points at a clamp() value.
const notVariable = (t) =>
  ['shadow', 'duration', 'cubicBezier'].includes(t.type) ||
  (t.type === 'dimension' && !/^-?\d*\.?\d+px$/.test(String(isRef(t.value) ? resolve(refPath(t.value), all) : t.value)))

const FIGMA_TYPE = { color: 'COLOR', dimension: 'FLOAT', fontWeight: 'FLOAT', fontFamily: 'STRING', number: 'FLOAT' }

// Which property pickers a semantic variable appears in. Primitives get none (decision 14).
function semanticScopes(path) {
  // Action foreground and feedback colours also draw outlines (secondary button, error field).
  if (/^color\.(feedback|action\.foreground)\./.test(path)) return ['TEXT_FILL', 'STROKE_COLOR']
  if (/^color\.(text|action\.text)\./.test(path)) return ['TEXT_FILL']
  if (/^color\.(surface|action\.background|promo)\./.test(path) || path === 'color.overlay') return ['FRAME_FILL', 'SHAPE_FILL']
  if (/^color\.(border|focus)\./.test(path)) return ['STROKE_COLOR']
  if (path.endsWith('.font-size')) return ['FONT_SIZE']
  if (path.endsWith('.line-height')) return ['LINE_HEIGHT']
  if (path.endsWith('.font-weight')) return ['FONT_WEIGHT']
  throw new Error(`No scope rule for semantic token ${path}: add one to semanticScopes()`)
}

// Which property pickers a component variable appears in (decision 33). Read from the
// last part of its name, so a new component token is classified without editing this list;
// one that matches no rule stops the build, rather than landing in every picker.
function componentScopes(t) {
  const name = t.path.split('.').slice(1).join('.')
  const last = name.split('.').pop()
  if (t.type === 'fontWeight' || /font-weight/.test(last)) return ['FONT_WEIGHT']
  if (/font-size/.test(last)) return ['FONT_SIZE'] // also name-font-size-lg
  if (/line-height/.test(last)) return ['LINE_HEIGHT']
  if (t.type === 'number') return [] // ratios and counts: reference only, nothing in Figma binds to them
  if (t.type === 'color') {
    const parent = name.split('.').slice(0, -1).join('.')
    // The last part of the name decides first ("divider.text" is text); then the group it's in.
    if (/(border|divider|outline|ring|line|stripe)/.test(last)) return ['STROKE_COLOR']
    if (/(text|label)/.test(last)) return ['TEXT_FILL']
    if (/(^|\.)(dots?|mark)$/.test(parent)) return ['SHAPE_FILL'] // carousel and thinking dots
    if (/(focus-ring|border|outline|indicator|line|divider)$/.test(parent)) return ['STROKE_COLOR'] // tabs.indicator.color, tabs.line.color, site-menu.divider.color
    if (/(background|surface|fill|backdrop|tint|track)/.test(last) || /background/.test(name)) return ['FRAME_FILL', 'SHAPE_FILL']
    if (/(icon|check|light|start|end|avatar)/.test(last)) return ['SHAPE_FILL', 'STROKE_COLOR', 'TEXT_FILL']
    if (/(^|\.)band/.test(name) || /(^|\.)(pin|bullet)\.color$/.test(name)) return ['FRAME_FILL', 'SHAPE_FILL'] // layout.band.color-subtle, property-card.band-color, map.pin.color, list.bullet.color
    return ['TEXT_FILL']
  }
  if (t.type === 'dimension') {
    if (/radius$/.test(last)) return ['CORNER_RADIUS']
    if (/border-width|spinner-width/.test(last) || (/(stroke|width)$/.test(last) && /border|stroke|edge|ring|line|divider|indicator|stripe/.test(name))) return ['STROKE_FLOAT']
    if (/(gap|gutter|padding|inset|margin|spacing|offset)/.test(last) || /padding|gap/.test(name)) return ['GAP']
    if (/(size|width|height|target|min-height|max-height|travel)/.test(last)) return ['WIDTH_HEIGHT']
    if (/(^|\.)width\./.test(name) || /line$/.test(last)) return ['WIDTH_HEIGHT'] // dialog.width.md, a 3px header line
    if (/thickness/.test(last)) return ['STROKE_FLOAT'] // link underline weight
  }
  unscoped.push(t.path)
  return []
}
const unscoped = []

const primitivePaths = new Set(Object.keys(flatten(primitivesTree)))
const semanticPaths = new Set(Object.keys(flatten(semanticTree)))
const collectionOf = (path) => (primitivePaths.has(path) ? 'Primitives' : semanticPaths.has(path) ? 'Semantic' : 'Component')

function toVariable(t, collection) {
  const type = FIGMA_TYPE[t.type]
  if (!type) throw new Error(`No Figma type for ${t.path} ($type ${t.type})`)
  let value
  if (isRef(t.value)) value = { alias: { collection: collectionOf(refPath(t.value)), name: figmaName(refPath(t.value)) } }
  else if (type === 'FLOAT') value = typeof t.value === 'number' ? t.value : px(t.value)
  else if (type === 'STRING') value = String(t.value).split(',')[0].trim() // Figma holds one family, not a stack
  else value = String(t.value).toLowerCase()
  return {
    name: figmaName(t.path),
    type,
    value,
    scopes: collection === 'Primitives' ? [] : collection === 'Semantic' ? semanticScopes(t.path) : componentScopes(t),
    description: t.description,
    codeSyntax: { WEB: cssVar(t.path) },
  }
}

const primitiveTokens = walk(primitivesTree)
const semanticTokens = walk(semanticTree)
const componentFiles = (await readdir('tokens/components')).filter((f) => f.endsWith('.json')).sort()
const componentTokens = (await Promise.all(componentFiles.map(async (f) => walk(await read(`tokens/components/${f}`))))).flat()

const collections = [
  { name: 'Primitives', mode: 'Value', variables: primitiveTokens.filter((t) => !notVariable(t)).map((t) => toVariable(t, 'Primitives')) },
  { name: 'Semantic', mode: 'Light', variables: semanticTokens.filter((t) => !notVariable(t)).map((t) => toVariable(t, 'Semantic')) },
  // Component tokens (decision 33). Shadows point at the effect styles; motion goes on the reference page.
  { name: 'Component', mode: 'Light', variables: componentTokens.filter((t) => !notVariable(t)).map((t) => toVariable(t, 'Component')) },
]

// Text styles: one per semantic typography style, bound to its variables.
const FONT_STYLE = { 400: 'Regular', 600: 'SemiBold' } // Outfit style names, checked in Figma
const styleNames = [...new Set(semanticTokens.filter((t) => t.path.startsWith('typography.')).map((t) => t.path.split('.')[1]))]
const textStyles = styleNames.map((name) => {
  const p = (prop) => `typography.${name}.${prop}`
  const weight = Number(resolve(p('font-weight'), all))
  if (!FONT_STYLE[weight]) throw new Error(`No Outfit style name for weight ${weight}`)
  const size = px(resolve(p('font-size'), all))
  const line = px(resolve(p('line-height'), all))
  return {
    name,
    fontFamily: String(resolve('font.family.brand', all)).split(',')[0].trim(),
    fontStyle: FONT_STYLE[weight],
    fontSize: size,
    lineHeight: line,
    bind: {
      fontFamily: { collection: 'Primitives', name: 'font/family/brand' },
      fontSize: { collection: 'Semantic', name: figmaName(p('font-size')) },
      lineHeight: { collection: 'Semantic', name: figmaName(p('line-height')) },
      fontWeight: { collection: 'Semantic', name: figmaName(p('font-weight')) },
    },
    description: `${size}/${line}/${weight}. Code: var(--typography-${name}-font-size), -line-height, -font-weight. Synced from tokens/semantic-light.json.`,
  }
})

// Effect styles: Figma has no shadow variables, so shadows become effect styles.
const hexToRgba = (hex) => {
  const m = hex.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i)
  const n = (i) => parseInt(m[1].slice(i, i + 2), 16) / 255
  return { r: n(0), g: n(2), b: n(4), a: m[2] ? Math.round((parseInt(m[2], 16) / 255) * 1000) / 1000 : 1 }
}
const effectStyles = primitiveTokens
  .filter((t) => t.type === 'shadow')
  .map((t) => ({
    name: figmaName(t.path),
    effects: [{
      type: 'DROP_SHADOW',
      color: hexToRgba(t.value.color),
      offset: { x: px(t.value.offsetX), y: px(t.value.offsetY) },
      radius: px(t.value.blur),
      spread: px(t.value.spread),
    }],
    description: `${t.description} Code: ${cssVar(t.path)}.`,
  }))

// The reference page for tokens Figma can't hold as variables (decision 15).
const referencePage = {
  name: 'Motion and Fluid Layout tokens',
  intro: 'Reference only: Figma variables cannot hold durations, easing curves or fluid clamp() values. Generated from tokens/primitives.json and tokens/components/*.json by scripts/figma/build-payload.mjs; do not edit by hand.',
  rows: [...primitiveTokens, ...componentTokens]
    .filter((t) => notVariable(t) && t.type !== 'shadow')
    .map((t) => ({
      token: t.path,
      cssVar: cssVar(t.path),
      value: (() => {
        // A component motion token points at a primitive: show the value and where it comes from.
        const v = isRef(t.value) ? resolve(refPath(t.value), all) : t.value
        const shown = Array.isArray(v) ? `cubic-bezier(${v.join(', ')})` : String(v)
        return isRef(t.value) ? `${shown} (${refPath(t.value)})` : shown
      })(),
      description: t.description,
    })),
}

if (unscoped.length) throw new Error(`No scope rule for ${unscoped.length} component token(s): add rules to componentScopes():\n  ${unscoped.join('\n  ')}`)

const payload = {
  $description: 'Generated by scripts/figma/build-payload.mjs from tokens/*.json. Do not edit by hand: change the tokens and run `npm run figma:payload`.',
  collections,
  textStyles,
  effectStyles,
  referencePage,
}

await mkdir('figma', { recursive: true })
await writeFile('figma/payload.json', JSON.stringify(payload, null, 2) + '\n')

// Summary for the dry run.
const count = (vars, key) => vars.reduce((m, v) => ((m[key(v)] = (m[key(v)] ?? 0) + 1), m), {})
for (const c of collections) {
  console.log(`${c.name} (${c.mode}): ${c.variables.length} variables`)
  console.log('  by type:  ', JSON.stringify(count(c.variables, (v) => v.type)))
  console.log('  by scopes:', JSON.stringify(count(c.variables, (v) => v.scopes.join('+') || 'hidden')))
  console.log('  aliases:  ', c.variables.filter((v) => v.value?.alias).length)
}
console.log(`Text styles: ${textStyles.length} (${textStyles.map((s) => s.name).join(', ')})`)
console.log(`Effect styles: ${effectStyles.length} (${effectStyles.map((s) => s.name).join(', ')})`)
console.log(`Reference page "${referencePage.name}": ${referencePage.rows.map((r) => r.token).join(', ')}`)
console.log('✔ figma/payload.json')
