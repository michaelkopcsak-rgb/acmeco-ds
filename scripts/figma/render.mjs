// Prepares a sync script to run in Figma, and the digest Figma should report.
//
//   node scripts/figma/render.mjs <primitives|semantic|component-N|styles|pages> <apply|verify>
//   node scripts/figma/render.mjs component-delta-N apply [since-commit]
//     only the Component variables that are new or changed since a payload already synced
//     (default: the last commit recorded as synced in figma/sync-log.md, passed explicitly),
//     in as many chunks as they need; the digest after the last chunk still covers the whole
//     collection, so a missed variable shows up as a mismatch.
//     writes figma/.rendered/<part>-<mode>.js: sync.js with digest.js and one part
//     of figma/payload.json inlined (a Figma script is limited to 50,000 characters)
//   node scripts/figma/render.mjs expect
//     prints the digest each part should produce, computed from the payload alone
//
// After a sync, Figma's reported digest must equal the expected one: that proves
// Figma matches the repo, independent of the pasted payload.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { digestOf, effectStyleLine, hex8, num, textStyleLine, variableLine } from './digest.js'

const payload = JSON.parse(await readFile('figma/payload.json', 'utf8'))
const [part, mode] = process.argv.slice(2)

// The Component collection is too big for one script (50,000 characters), so it's
// split into chunks of whole variables. Chunks are independent: component tokens alias
// only Primitives and Semantic, never each other. Each chunk reports the digest of the
// whole collection, which equals `expect`'s "component" line once every chunk has run.
const componentCollection = payload.collections.find((c) => c.name === 'Component')
const BUDGET = 24000 // characters of payload per chunk; the script itself adds about 18,000
const chunks = [[]]
for (const v of componentCollection.variables) {
  const size = JSON.stringify(chunks.at(-1)).length + JSON.stringify(v).length
  if (size > BUDGET && chunks.at(-1).length) chunks.push([])
  chunks.at(-1).push(v)
}
const componentParts = Object.fromEntries(chunks.map((vars, i) => [
  `component-${i + 1}`,
  { kind: 'variables', chunk: `${i + 1} of ${chunks.length}`, collection: { ...componentCollection, variables: vars } },
]))

// Delta: compare with an earlier payload (a commit whose digests matched Figma).
const since = process.argv[4]
const deltaParts = {}
if (since) {
  const { execFileSync } = await import('node:child_process')
  const old = JSON.parse(execFileSync('git', ['show', `${since}:figma/payload.json`], { encoding: 'utf8' }))
  const before = new Map((old.collections.find((c) => c.name === 'Component')?.variables ?? []).map((v) => [v.name, JSON.stringify(v)]))
  const changed = componentCollection.variables.filter((v) => before.get(v.name) !== JSON.stringify(v))
  const removed = [...before.keys()].filter((n) => !componentCollection.variables.some((v) => v.name === n))
  if (removed.length) throw new Error(`variables removed since ${since}: ${removed.join(', ')}; run the full component chunks instead`)
  const dchunks = [[]]
  for (const v of changed) {
    if (JSON.stringify(dchunks.at(-1)).length + JSON.stringify(v).length > BUDGET && dchunks.at(-1).length) dchunks.push([])
    dchunks.at(-1).push(v)
  }
  dchunks.forEach((vars, i) => { deltaParts[`component-delta-${i + 1}`] = { kind: 'variables', chunk: `delta ${i + 1} of ${dchunks.length} (${changed.length} new or changed since ${since})`, collection: { ...componentCollection, variables: vars } } })
}

const parts = {
  ...componentParts,
  ...deltaParts,
  primitives: { kind: 'variables', collection: payload.collections.find((c) => c.name === 'Primitives') },
  semantic: { kind: 'variables', collection: payload.collections.find((c) => c.name === 'Semantic') },
  styles: { kind: 'styles', textStyles: payload.textStyles, effectStyles: payload.effectStyles },
  pages: {
    kind: 'pages',
    referencePage: payload.referencePage,
    sheetPage: 'Foundations (verification)',
    colours: payload.collections.find((c) => c.name === 'Semantic').variables.filter((v) => v.type === 'COLOR').map((v) => v.name),
    textStyles: payload.textStyles.map((s) => s.name),
  },
}

const ref = (r) => `${r.collection}/${r.name}`
function expected(p) {
  if (p.kind === 'variables') {
    return digestOf(p.collection.variables.map((t) => variableLine({
      name: t.name, type: t.type, scopes: t.scopes, codeWeb: t.codeSyntax.WEB, description: t.description,
      value: t.value.alias ? `alias:${ref(t.value.alias)}` : t.type === 'COLOR' ? hex8(t.value) : t.type === 'FLOAT' ? num(t.value) : String(t.value),
    })))
  }
  return digestOf([
    ...p.textStyles.map((s) => 'T' + textStyleLine({ ...s, bind: Object.fromEntries(Object.entries(s.bind).map(([k, r]) => [k, ref(r)])) })),
    ...p.effectStyles.map((s) => 'E' + effectStyleLine(s)),
  ])
}

if (part === 'expect') {
  for (const [name, p] of Object.entries(parts)) if (p.kind !== 'pages' && !p.chunk) console.log(`${name.padEnd(10)} ${expected(p)}`)
  console.log(`${'component'.padEnd(10)} ${expected({ kind: 'variables', collection: componentCollection })}  (after all ${chunks.length} chunks: ${Object.keys(componentParts).join(', ')})`)
  process.exit(0)
}
if (!parts[part] || !['apply', 'verify'].includes(mode)) {
  console.error(`Usage: node scripts/figma/render.mjs <primitives|semantic|${Object.keys(componentParts).join('|')}|styles|pages> <apply|verify>  |  expect`)
  process.exit(1)
}

const digestSrc = (await readFile('scripts/figma/digest.js', 'utf8')).replace(/^export /gm, '')
const input = `const MODE = ${JSON.stringify(mode)}\nconst PART = ${JSON.stringify(parts[part])}`
const code = (await readFile('scripts/figma/sync.js', 'utf8'))
  .replace('/* __INLINE_DIGEST__ */', digestSrc)
  .replace('/* __INLINE_INPUT__ */', input)

if (code.length > 50000) throw new Error(`Rendered script is ${code.length} characters; Figma's limit is 50,000. Split the part.`)
await mkdir('figma/.rendered', { recursive: true })
const out = `figma/.rendered/${part}-${mode}.js`
await writeFile(out, code)
const target = parts[part].chunk ? { kind: 'variables', collection: componentCollection } : parts[part]
console.log(`✔ ${out} (${code.length} characters).` + (parts[part].kind === 'pages' ? '' : ` Expected digest${parts[part].chunk ? ' after the last chunk' : ''}: ${expected(target)}`))
