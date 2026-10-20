// Builds figma/components.json: what the Figma component pages should contain.
//   - icons: one SVG per registry icon (src/icons/index.ts), drawn from the same
//     lucide-react data the code renders, so shapes match exactly
//   - components: each spec in scripts/figma/components/, with its guidance text
//     (the component's *.guidance.md, the same file as its Storybook docs page),
//     its tokens' resolved values and its contrast pairs with measured ratios
// The Figma scripts (figma-icons.js, figma-component.js, figma-docs.js) read this
// file; render-components.mjs inlines parts of it. CI checks it isn't stale.
//
// Run with: npm run figma:components
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { checkPair, flatten, resolve } from '../../src/lib/contrast.ts'
import { assistant } from './components/assistant.mjs'
import { badge } from './components/badge.mjs'
import { brokerIdentity } from './components/broker-identity.mjs'
import { button } from './components/button.mjs'
import { checkbox } from './components/checkbox.mjs'
import { choiceCards } from './components/choice-cards.mjs'
import { chip } from './components/chip.mjs'
import { contactForm } from './components/contact-form.mjs'
import { contactModule } from './components/contact-module.mjs'
import { dialog } from './components/dialog.mjs'
import { disclosure } from './components/disclosure.mjs'
import { iconButton } from './components/icon-button.mjs'
import { link } from './components/link.mjs'
import { popover } from './components/popover.mjs'
import { propertyCard } from './components/property-card.mjs'
import { propertyFacts } from './components/property-facts.mjs'
import { propertyHeader } from './components/property-header.mjs'
import { propertyMedia } from './components/property-media.mjs'
import { propertyPrice } from './components/property-price.mjs'
import { searchField } from './components/search-field.mjs'
import { filterButton } from './components/filter-button.mjs'
import { toggleButtonGroup } from './components/toggle-button-group.mjs'
import { mapPlaceholder } from './components/map-placeholder.mjs'
import { mapPin } from './components/map-pin.mjs'
import { breadcrumbs } from './components/breadcrumbs.mjs'
import { factList } from './components/fact-list.mjs'
import { card } from './components/card.mjs'
import { table } from './components/table.mjs'
import { list } from './components/list.mjs'
import { select } from './components/select.mjs'
import { selectList } from './components/select-list.mjs'
import { signInDialog } from './components/sign-in-dialog.mjs'
import { tabSelector } from './components/tab-selector.mjs'
import { tabs } from './components/tabs.mjs'
import { footer } from './components/footer.mjs'
import { globalHeader } from './components/global-header.mjs'
import { localeDialog } from './components/locale-dialog.mjs'
import { navigationBar } from './components/navigation-bar.mjs'
import { siteMenu } from './components/site-menu.mjs'
import { textField } from './components/text-field.mjs'

const SPECS = [button, iconButton, link, breadcrumbs, textField, searchField, filterButton, toggleButtonGroup, checkbox, select, selectList, tabSelector, badge, chip, dialog, propertyPrice, propertyHeader, propertyFacts, brokerIdentity, propertyMedia, propertyCard, factList, card, table, list, mapPlaceholder, mapPin, contactForm, contactModule, signInDialog, assistant, tabs, choiceCards, popover, disclosure, navigationBar, globalHeader, siteMenu, localeDialog, footer]
const read = async (f) => JSON.parse(await readFile(f, 'utf8'))

// ---- Icons ---------------------------------------------------------------
const registry = await readFile('src/icons/index.ts', 'utf8')
const block = registry.slice(registry.indexOf('export const icons = {'), registry.indexOf('} as const'))
// Icons renamed on import (`Map as MapIcon`, so it doesn't hide JavaScript's Map) resolve to their lucide name.
const importLine = registry.match(/^import \{([^}]+)\} from 'lucide-react'/m)[1]
const aliases = Object.fromEntries([...importLine.matchAll(/([A-Za-z0-9]+) as ([A-Za-z0-9]+)/g)].map((m) => [m[2], m[1]]))
const entries = [...block.matchAll(/^\s+'?([a-z0-9-]+)'?: ([A-Za-z0-9]+),/gm)].map((m) => ({ name: m[1], lucide: aliases[m[2]] ?? m[2] }))
const kebab = (s) => s.replace(/([a-z])([A-Z0-9])/g, '$1-$2').replace(/([0-9])([A-Z])/g, '$1-$2').toLowerCase()
const lucideVersion = JSON.parse(await readFile('node_modules/lucide-react/package.json', 'utf8')).version
const icons = []
for (const e of entries) {
  // The icon's shapes exactly as lucide-react stores them: [tag, attributes] pairs.
  const mod = await import(`../../node_modules/lucide-react/dist/esm/icons/${kebab(e.lucide)}.mjs`)
  const shapes = mod.__iconData.node
  const body = shapes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('')
  // Lucide's fixed drawing rules (its default attributes): 24px box, 2px round strokes, no fill.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
  icons.push({ name: `icon/${e.name}`, lucide: kebab(e.lucide), svg })
}

// ---- Components ----------------------------------------------------------
const primitives = await read('tokens/primitives.json')
const semantic = await read('tokens/semantic-light.json')
const componentFiles = (await readdir('tokens/components')).filter((f) => f.endsWith('.json')).map((f) => `tokens/components/${f}`)
const all = { ...flatten(primitives), ...flatten(semantic) }
for (const f of componentFiles) Object.assign(all, flatten(await read(f)))
const pairs = (await read('tokens/contrast-pairs.json')).pairs

/** "## Heading" sections of a guidance file, each as a list of paragraphs and bullets. */
function sections(md) {
  const out = []
  for (const chunk of md.split(/^## /m).slice(1)) {
    const [title, ...rest] = chunk.split('\n')
    const lines = rest.join('\n').trim().split('\n').filter((l) => l.trim())
    // Markdown to plain text: no **bold**, `code` or links; bullets keep a bullet.
    const plain = (l) => l.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\\\*/g, '*')
    // Tables become one line per row ("1: Header row, …"); the |---| row goes.
    const cells = (l) => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'))
    const row = (l) => (/^\|[\s:|-]+\|$/.test(l.trim()) ? null : cells(l).map(plain).join(': '))
    out.push({ title: title.trim(), lines: lines.map((l) => (l.startsWith('- ') ? '•  ' + plain(l.slice(2)) : l.trim().startsWith('|') ? row(l) : plain(l))).filter((l) => l != null) })
  }
  return out
}

// A Figma text property sets one text in every variant, so a TEXT property may only link
// layers whose text is the same everywhere (Badge's tones each say something different).
function checkTextProperties(spec) {
  const texts = (node, layer, out) => { if (node.name === layer && node.chars != null) out.push(node.chars); for (const c of node.children ?? []) texts(c, layer, out); return out }
  for (const p of spec.properties.filter((x) => x.type === 'TEXT')) {
    const found = new Set(spec.variants.flatMap((v) => texts(v.tree, p.layer, [])))
    if (found.size > 1) throw new Error(`${spec.name}: text property "${p.name}" links layers with different text (${[...found].join(' / ')}); Figma would set them all to one`)
  }
}

const components = []
for (const spec of SPECS) {
  checkTextProperties(spec)
  const md = await readFile(spec.guidance, 'utf8')
  const varName = (path) => path.replaceAll('/', '.')
  const value = (name) => { const v = resolve(varName(name), all); return typeof v === 'object' ? JSON.stringify(v) : String(v) }
  // The component's own pairs: either colour is one of its tokens.
  // tokenPrefix: one prefix, or several for a component built from others (the Locale dialog).
  const contrast = pairs.filter((p) => [p.fg, p.bg].some((t) => [spec.tokenPrefix].flat().some((prefix) => t.startsWith(prefix))))
    .map((p) => { const r = checkPair(p, all); return { note: p.note, fg: p.fg, bg: p.bg, ratio: Math.round(r.ratio * 100) / 100, min: p.min, pass: r.ratio >= p.min } })
  components.push({
    id: spec.id, name: spec.name, page: spec.page, status: spec.status, storybook: spec.storybook, code: spec.code,
    axes: spec.axes, grid: spec.grid, gridNote: spec.gridNote ?? null, properties: spec.properties, variants: spec.variants,
    // Big sets build in groups (a Figma script is limited to 50,000 characters).
    buildGroups: spec.buildGroups ?? spec.grid.rowGroups ?? null,
    specsBy: spec.specsBy ?? null,
    // The instance the anatomy points at: the spec's choice, else Focus, the largest size, the first of the rest.
    anatomyVariant: spec.anatomyVariant ?? Object.fromEntries(Object.entries(spec.axes).map(([k, v]) => [k, k === 'State' && v.includes('Focus') ? 'Focus' : k === 'Size' ? v[v.length - 1] : v[0]])),
    docs: {
      sections: sections(md),
      anatomy: spec.anatomy,
      specs: (spec.specsBy ? spec.axes[spec.specsBy] : [null]).map((v) => ({ value: v, rows: spec.specs(v).map((n) => ({ token: n, value: value(n) })) })),
      contrast,
    },
  })
}

const out = {
  $description: 'Generated by scripts/figma/build-components.mjs from the icon registry, lucide-react, the tokens, the component specs and guidance files. Do not edit by hand: run `npm run figma:components`.',
  lucideVersion,
  icons,
  components,
}
await writeFile('figma/components.json', JSON.stringify(out, null, 2) + '\n')
console.log(`Icons: ${icons.length} (lucide-react ${lucideVersion})`)
for (const c of components) console.log(`${c.name}: ${c.variants.length} variants, ${c.docs.sections.length} guidance sections, ${c.docs.contrast.length} contrast pairs (${c.docs.contrast.filter((p) => !p.pass).length} failing)`)
console.log('✔ figma/components.json')
