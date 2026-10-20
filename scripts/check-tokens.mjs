// Two checks that keep the token system honest. Fails (exit 1) if either finds a problem.
//
// 1. Evidence labels: every token in tokens/ has a $description that starts with
//    one or more evidence labels, e.g. "OBSERVED, LEGACY-NAMED: --legacy-color-brand."
// 2. Token usage: component CSS (src/components/**/*.css) uses only semantic or
//    component tokens. It fails on raw colours (#hex, rgb(), hsl()), raw px values
//    (allowed only in @media and @container conditions, where CSS variables
//    can't be used) and
//    primitive variables (var(--color-brand-700)).
// 3. Icon registry: nothing outside src/icons/ imports lucide-react directly, so
//    src/icons/index.ts stays the complete list of icons in use (phase 5 builds
//    the Figma Icons page from it).
//
// Run with: npm run check:tokens
// Self-test: npm run check:tokens -- --self-test  (proves each rule catches a
// deliberately bad fixture and passes a good one)
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { flatten } from '../src/lib/contrast.ts'

const LABELS = ['OBSERVED', 'LEGACY-NAMED', 'PROPOSED', 'BENCHMARK-INFORMED', 'REFERENCE-OBSERVED']
const LABEL_RE = new RegExp(`^(${LABELS.join('|')})(, (${LABELS.join('|')}))*:`)

const read = async (f) => JSON.parse(await readFile(f, 'utf8'))

async function filesIn(dir, ext) {
  let entries
  try {
    entries = await readdir(dir, { recursive: true, withFileTypes: true })
  } catch {
    return [] // folder doesn't exist yet
  }
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(ext))
    .map((e) => join(e.parentPath, e.name))
}

// ---- 1. Evidence labels --------------------------------------------------
function walkTokens(tree, prefix = '', out = []) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || typeof node !== 'object' || node === null) continue
    const path = prefix ? `${prefix}.${key}` : key
    if ('$value' in node) out.push({ path, description: node.$description })
    else walkTokens(node, path, out)
  }
  return out
}

function labelProblems(tree, file) {
  return walkTokens(tree)
    .filter(({ description }) => typeof description !== 'string' || !LABEL_RE.test(description))
    .map(({ path }) => `${file}: ${path} has no evidence label (start its $description with ${LABELS.join(' / ')} and a colon)`)
}

// ---- 2. Token usage in component CSS -------------------------------------
function usageProblems(css, file, primitiveVars) {
  const problems = []
  const lines = css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).split('\n')
  lines.forEach((line, i) => {
    const where = `${file}:${i + 1}`
    if (/#[0-9a-f]{3,8}\b/i.test(line) || /\b(rgba?|hsla?)\(/i.test(line)) problems.push(`${where} raw colour: ${line.trim()}`)
    if (!/^\s*@(media|container)/.test(line) && /(?<![\w-])\d*\.?\d+px\b/.test(line)) problems.push(`${where} raw px value: ${line.trim()}`)
    for (const [, name] of line.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (primitiveVars.has(name)) problems.push(`${where} primitive token ${name}: use a semantic or component token`)
    }
  })
  return problems
}

// ---- 3. Icon imports outside the registry ---------------------------------
function iconImportProblems(source, file) {
  return /from\s+['"]lucide-react['"]/.test(source)
    ? [`${file} imports lucide-react directly: import icons from src/icons (the registry) instead`]
    : []
}

const primitives = await read('tokens/primitives.json')
const primitiveVars = new Set(Object.keys(flatten(primitives)).map((p) => '--' + p.replaceAll('.', '-')))

if (process.argv.includes('--self-test')) {
  const bad = usageProblems(await readFile('scripts/fixtures/bad-component.css', 'utf8'), 'bad', primitiveVars)
  const good = usageProblems(await readFile('scripts/fixtures/good-component.css', 'utf8'), 'good', primitiveVars)
  const unlabelled = labelProblems(await read('scripts/fixtures/unlabelled-tokens.json'), 'fixture')
  const iconImport = iconImportProblems(await readFile('scripts/fixtures/bad-icon-import.tsx.txt', 'utf8'), 'fixture')
  const checks = [
    ['catches a raw hex colour', bad.some((p) => p.includes('raw colour') && p.includes('#'))],
    ['catches a raw rgb() colour', bad.some((p) => p.includes('raw colour') && p.includes('rgb'))],
    ['catches a raw px value', bad.some((p) => p.includes('raw px'))],
    ['catches a primitive token', bad.some((p) => p.includes('primitive token --color-brand-700'))],
    ['allows px inside @media', !good.some((p) => p.includes('@media'))],
    ['allows px inside @container', !good.some((p) => p.includes('@container'))],
    ['passes a correct component', good.length === 0],
    ['catches a missing evidence label', unlabelled.length === 2],
    ['catches a direct lucide-react import', iconImport.length === 1],
  ]
  for (const [name, ok] of checks) console.log(`${ok ? '✔' : '✖'} ${name}`)
  if (good.length) console.log(good.join('\n'))
  if (checks.some(([, ok]) => !ok)) process.exit(1)
  console.log('Self-test passed.')
  process.exit(0)
}

const tokenFiles = ['tokens/primitives.json', 'tokens/semantic-light.json', ...(await filesIn('tokens/components', '.json'))]
const problems = []
let tokenCount = 0
for (const f of tokenFiles) {
  const tree = await read(f)
  tokenCount += walkTokens(tree).length
  problems.push(...labelProblems(tree, f))
}
const cssFiles = await filesIn('src/components', '.css')
for (const f of cssFiles) problems.push(...usageProblems(await readFile(f, 'utf8'), f, primitiveVars))
const sourceFiles = [...(await filesIn('src', '.tsx')), ...(await filesIn('src', '.ts'))].filter((f) => !f.startsWith('src/icons/'))
for (const f of sourceFiles) problems.push(...iconImportProblems(await readFile(f, 'utf8'), f))

console.log(`Checked ${tokenCount} tokens in ${tokenFiles.length} files, ${cssFiles.length} component CSS files and ${sourceFiles.length} source files.`)
if (problems.length) {
  console.error(problems.map((p) => `✖ ${p}`).join('\n'))
  console.error(`✖ ${problems.length} problem(s).`)
  process.exit(1)
}
console.log('✔ Every token is labelled; component CSS uses only semantic and component tokens; icons come from the registry.')
