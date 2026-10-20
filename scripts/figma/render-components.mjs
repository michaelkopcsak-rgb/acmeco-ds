// Prepares the Figma scripts for the component pages, with figma/components.json
// inlined (a Figma script is limited to 50,000 characters, so big sets build in groups).
//
//   node scripts/figma/render-components.mjs icons
//   node scripts/figma/render-components.mjs component <id> build <group>
//   node scripts/figma/render-components.mjs component <id> combine
//   node scripts/figma/render-components.mjs component <id> docs
//   node scripts/figma/render-components.mjs report    (parity for every set, in chunks, and one lint for every page)
//   node scripts/figma/render-components.mjs cover     (the Cover's status and contents, from the repo)
// writes figma/.rendered/<...>.js to run with the Figma MCP use_figma tool.
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const data = JSON.parse(await readFile('figma/components.json', 'utf8'))
const [kind, name, mode, group] = process.argv.slice(2)
const strip = (src) => src.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).join('\n')
// Keep only the mode a script runs (build or combine), so it stays well under Figma's limit.
const onlyMode = (src, mode) => {
  const other = mode === 'build' ? 'combine' : 'build'
  if (mode === 'all') return src
  const start = src.indexOf(`if (INPUT.mode === '${other}' || INPUT.mode === 'all') {`)
  if (start < 0) return src
  const end = src.indexOf('\n}\n', start) + 3
  return src.slice(0, start) + src.slice(end)
}
async function render(script, input, out) {
  const code = strip(onlyMode((await readFile(`scripts/figma/${script}`, 'utf8')), input.mode).replace('/* __INPUT__ */', () => `const INPUT = ${JSON.stringify(input)}`)) // a function: see the build script below
  if (code.length > 50000) throw new Error(`${out}: ${code.length} characters; Figma's limit is 50,000`)
  await mkdir('figma/.rendered', { recursive: true })
  await writeFile(`figma/.rendered/${out}.js`, code)
  console.log(`✔ figma/.rendered/${out}.js (${code.length} characters)`)
}

if (kind === 'images') {
  // The holder for the placeholder photos (scripts/figma/build-images.mjs); the PNGs go up with upload_assets.
  const manifest = JSON.parse(await readFile('figma/images/manifest.json', 'utf8')).images
  await render('figma-images.js', { page: 'Property media', images: manifest }, 'images')
} else if (kind === 'lint') {
  // node scripts/figma/render-components.mjs lint "<Page name>"
  await render('figma-lint.js', { page: name }, `lint-${name.toLowerCase().replace(/\W+/g, '-')}`)
} else if (kind === 'report') {
  // The library-wide check behind figma/REPORT.md: every set's parity, packed into as few
  // scripts as Figma's limit allows, and the lint over every component page in one script.
  const engine = strip(await readFile('scripts/figma/figma-parity.js', 'utf8'))
  const chunks = [[]]
  let size = engine.length
  for (const c of data.components) {
    const code = JSON.parse(await readFile(`figma/parity/${c.id}-code.json`, 'utf8'))
    const one = { name: c.name, page: c.page, axes: c.axes, code: { parts: code.parts.map(({ name, layer, fields, only }) => ({ name, layer, fields, only })), variants: code.variants } }
    const len = JSON.stringify(one).length + 1
    if (size + len > 48000 && chunks.at(-1).length) { chunks.push([]); size = engine.length }
    chunks.at(-1).push(one); size += len
  }
  for (const [i, sets] of chunks.entries()) await render('figma-parity.js', { sets }, `report-parity-${i + 1}`)
  await render('figma-lint.js', { pages: ['Icons', ...new Set(data.components.map((c) => c.page))] }, 'report-lint')
} else if (kind === 'cover') {
  const parity = JSON.parse(await readFile('figma/reports/parity.json', 'utf8'))
  const lint = JSON.parse(await readFile('figma/reports/lint.json', 'utf8'))
  const rb = parity.readBack, fmt = (n) => n.toLocaleString('en-US')
  const matched = parity.sets.reduce((t, x) => t + x.matched, 0), checked = parity.sets.reduce((t, x) => t + x.checked, 0)
  // The two groups the components fall into: the foundations and AcmeCo's own (by code path).
  const acmeco = (c) => /Property|Broker|Contact|SignIn|Assistant|NavigationBar|GlobalHeader|SiteMenu|LocaleDialog|Footer/.test(c.code)
  const lines = (list) => { const names = list.map((c) => c.name), out = []; for (let i = 0; i < names.length; i += 3) out.push(names.slice(i, i + 3).join(' · ')); return out }
  await render('figma-cover.js', {
    status: `Status: phase 6a, the page shell (${parity.date}). Variables (Primitives ${rb.variables.Primitives}, Semantic ${rb.variables.Semantic}, Component ${rb.variables.Component}), ${rb.textStyles} text styles, ${rb.effectStyles} effect styles, ${rb.icons} icons and ${rb.sets} component sets (${rb.variants} variants) are generated from the code repository and checked against it.`,
    columns: [
      { title: 'Foundations', lines: ['Foundations (verification): colour, type, space, radius, elevation, bound to variables', 'Motion and Fluid Layout tokens: durations, easing, fluid sizes (as text: Figma has no variables for them)', `Icons: ${rb.icons} Lucide icons, the code's registry`] },
      { title: 'Components', lines: [...lines(data.components.filter((c) => !acmeco(c))), 'Each page: the set in a labelled grid, then its documentation (anatomy, specs, accessibility, contrast, evidence).'] },
      { title: 'AcmeCo components', lines: lines(data.components.filter(acmeco)) },
    ],
    sections: [
      { title: 'Checks', text: `Parity with the rendered code: ${fmt(matched)} of ${fmt(checked)} fields match. Lint: ${lint.pages.reduce((t, p) => t + p.hardCoded, 0)} hard-coded colours, ${lint.pages.reduce((t, p) => t + p.defaultNames, 0)} default layer names, ${lint.pages.reduce((t, p) => t + p.contrastFailures, 0)} text contrast failures on all ${lint.pages.length} pages. Details per set: figma/REPORT.md in the repo.` },
      { title: 'Where it comes from', subtle: true, text: "The repo is the source of truth: tokens/ (DTCG), src/components/ (React + React Aria, with guidance files), scripts/figma/ (the generator, parity and lint). Edit the repo and regenerate; don't edit these pages by hand. Every value carries its evidence label (OBSERVED, LEGACY-NAMED, PROPOSED, BENCHMARK-INFORMED, REFERENCE-OBSERVED). Placeholder photos, people and logos only." },
    ],
  }, 'cover')
} else if (kind === 'screen') {
  // node scripts/figma/render-components.mjs screen <id>: a screen for the file named in its config.
  const spec = JSON.parse(await readFile(`figma/screens/${name}.json`, 'utf8'))
  const keys = JSON.parse(await readFile('figma/library-keys.json', 'utf8'))
  const images = Object.fromEntries(Object.entries(JSON.parse(await readFile('figma/images/manifest.json', 'utf8')).images).map(([id, i]) => [id, i.hash]))
  const used = new Set(spec.instances.map((i) => i.set))
  const pick = (o, names) => Object.fromEntries(Object.entries(o).filter(([k]) => names(k)))
  await render('figma-screen.js', { spec, images, keys: { sets: pick(keys.sets, (k) => used.has(k)), styles: keys.styles, icons: keys.icons, variables: keys.variables } }, `screen-${name}`)
} else if (kind === 'screen-docs') {
  // node scripts/figma/render-components.mjs screen-docs <docs id>: the documentation frame for a set of screens.
  const { docs } = await import(`./screens/${name}.mjs`)
  const keys = JSON.parse(await readFile('figma/library-keys.json', 'utf8'))
  const specs = await Promise.all(docs.screens.map(async (id) => JSON.parse(await readFile(`figma/screens/${id}.json`, 'utf8'))))
  // Every distinct part (set + variant + text) the screens use, in order of first use.
  const parts = new Map()
  for (const sp of specs) for (const i of sp.instances) {
    const k = JSON.stringify([i.set, i.props, i.before ?? null]) // one example per variant (a Link with an icon counts apart)
    if (!parts.has(k)) parts.set(k, { set: i.set, props: i.props, text: i.text, bools: i.bools, nested: i.nested, layers: i.layers, before: i.before, screens: [] })
    if (!parts.get(k).screens.includes(sp.name)) parts.get(k).screens.push(sp.name)
  }
  const access = docs.accessibilityFrom.map((id) => { const c = data.components.find((x) => x.id === id); return { name: c.name, lines: (c.docs.sections.find((s) => s.title === 'Accessibility')?.lines ?? []).slice(0, 3) } })
  const states = specs.map((sp) => ({ name: sp.name, caption: sp.caption, sets: [...new Set(sp.instances.map((i) => i.set))], links: (sp.links ?? []).map((l) => (l.back ? 'Back' : l.to)) }))
  const transitions = specs.flatMap((sp) => (sp.links ?? []).map((l, i) => ({ from: sp.name, to: l.back ? 'the placement last used (Back)' : l.to })))
  const usedVars = [...docs.layoutVariables, ...docs.colourVariables].map(([n]) => n)
  const allKeys = { ...keys.variables, ...JSON.parse(await readFile('figma/library-keys.json', 'utf8')).layoutVariables }
  await render('figma-screen-docs.js', { docs, states, transitions, parts: [...parts.values()], access, images: Object.fromEntries(Object.entries(JSON.parse(await readFile('figma/images/manifest.json', 'utf8')).images).map(([id, i]) => [id, i.hash])), keys: { sets: keys.sets, styles: keys.styles, icons: keys.icons, variables: Object.fromEntries(Object.entries(allKeys).filter(([n]) => usedVars.includes(n) || n.startsWith('Semantic/'))) } }, `screen-docs-${name}`)
} else if (kind === 'screen-links') {
  // node scripts/figma/render-components.mjs screen-links <id,id,...>: re-wire every frame's hotspots once all exist.
  const specs = await Promise.all(name.split(',').map(async (id) => JSON.parse(await readFile(`figma/screens/${id}.json`, 'utf8'))))
  await render('figma-screen.js', { page: specs[0].page, wire: specs.map((sp) => ({ name: sp.name, links: sp.links ?? [] })) }, 'screen-links')
} else if (kind === 'icons') {
  await render('figma-icons.js', { lucideVersion: data.lucideVersion, icons: data.icons }, 'icons')
} else if (kind === 'component') {
  const c = data.components.find((x) => x.id === name || x.name === name)
  if (!c) throw new Error(`No component ${name} in figma/components.json`)
  const base = { name: c.name, page: c.page }
  // The Figma description: the guidance's structured sections, as plain text.
  const pick = ['When to use', 'When not to use', 'Accessibility', 'Content']
  const description = [`${c.name}. Code: ${c.code}. Storybook: ${c.storybook}.`, ...c.docs.sections.filter((s) => pick.includes(s.title)).map((s) => `${s.title}\n${s.lines.join('\n')}`)].join('\n\n')
  const combineInput = { axes: c.axes, grid: c.grid, gridNote: c.gridNote, properties: c.properties, expectedVariants: c.variants.length, description }
  if (mode === 'build' || mode === 'all') {
    // The spec module itself goes to Figma (a few thousand characters) and generates the
    // variants there, exactly as it does here; far smaller than the expanded trees.
    const specFile = `scripts/figma/components/${c.id}.mjs`
    const specSrc = (await readFile(specFile, 'utf8')).replace(/^export const (\w+) =/m, 'const SPEC =')
    // Placeholder photos by listing id → Figma image hash (uploaded once with upload_assets).
    const images = Object.fromEntries(Object.entries(JSON.parse(await readFile('figma/images/manifest.json', 'utf8')).images).map(([id, m]) => [id, m.hash]))
    const input = { ...base, mode, group: group ?? null, groupAxis: c.buildGroups, ...(mode === 'all' ? combineInput : {}) }
    // A function, not a string: in a replacement string "$'" means "the text after the match",
    // and the Locale dialog's currency labels ('USD $') pasted the engine in again.
    const code = strip(onlyMode(await readFile('scripts/figma/figma-component.js', 'utf8'), mode)
      .replace('/* __INPUT__ */', () => `const IMAGES = ${JSON.stringify(images)}\n${specSrc}\nconst INPUT = ${JSON.stringify(input)}\nINPUT.variants = SPEC.variants.filter((v) => !INPUT.group || v.props[INPUT.groupAxis] === INPUT.group)`))
    if (code.length > 50000) throw new Error(`build script is ${code.length} characters; pass a group to split it`)
    await mkdir('figma/.rendered', { recursive: true })
    const out = `figma/.rendered/${c.id}-${mode}${group ? '-' + group : ''}.js`
    await writeFile(out, code)
    console.log(`✔ ${out} (${code.length} characters)`)
  } else if (mode === 'combine') {
    await render('figma-component.js', { ...base, mode: 'combine', ...combineInput }, `${c.id}-combine`)
  } else if (mode === 'docs') {
    await render('figma-docs.js', { ...base, status: c.status, storybook: c.storybook, code: c.code, docs: c.docs, specsBy: c.specsBy, anatomyVariant: c.anatomyVariant }, `${c.id}-docs`)
  } else if (mode === 'parity') {
    // The code's computed styles (scripts/figma/parity-code.mjs), compared in Figma field by field.
    const code = JSON.parse(await readFile(`figma/parity/${c.id}-code.json`, 'utf8'))
    await render('figma-parity.js', { ...base, axes: c.axes, code: { parts: code.parts, variants: code.variants } }, `${c.id}-parity`)
  } else throw new Error('mode: build <group> | combine | all | docs | parity')
} else {
  console.error('Usage: render-components.mjs icons | lint <Page> | component <id> <build <group>|combine|all|docs|parity>')
  process.exit(1)
}
