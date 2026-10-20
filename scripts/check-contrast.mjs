// Fails if any colour pair in tokens/contrast-pairs.json is below its minimum.
// Reads the token JSON directly (not the CSS), resolves references to hex and
// measures with the WCAG 2.x formula in src/lib/contrast.ts.
// Run with: npm run check:contrast
import { readFile, readdir } from 'node:fs/promises'
import { checkPair, flatten } from '../src/lib/contrast.ts'

const read = async (f) => JSON.parse(await readFile(f, 'utf8'))
const componentFiles = (await readdir('tokens/components')).filter((f) => f.endsWith('.json'))
// Light theme only in v1 (decision 2). A dark theme would add a second run here.
// Component tokens are included so every variant x state can be checked.
const tokens = {
  ...flatten(await read('tokens/primitives.json')),
  ...flatten(await read('tokens/semantic-light.json')),
  ...Object.assign({}, ...(await Promise.all(componentFiles.map(async (f) => flatten(await read(`tokens/components/${f}`)))))),
}
const { pairs } = await read('tokens/contrast-pairs.json')

const results = pairs.map((p) => checkPair(p, tokens))
const width = Math.max(...results.map((r) => `${r.fg} on ${r.bg}`.length))
for (const r of results) {
  const mark = r.pass ? '✔' : '✖'
  const label = `${r.fg} on ${r.bg}`.padEnd(width)
  console.log(`${mark} ${label}  ${r.ratio.toFixed(2).padStart(5)} (min ${r.min}, ${r.kind})  ${r.fgHex} on ${r.bgHex}`)
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length} of ${results.length} pairs pass.`)
if (failed.length) {
  console.error(`✖ ${failed.length} pair(s) below their minimum. Fix the token, not the pair list.`)
  process.exit(1)
}
