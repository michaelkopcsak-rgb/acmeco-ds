// The layer boundary from docs/GOVERNANCE.md phase 4: AcmeCo components are built only
// from the system, so every listing card, contact box or assistant gets the same
// accessibility and tokens as the foundations underneath.
//
// An AcmeCo component is any folder in src/components whose stories sit under
// "AcmeCo/" in Storybook, so a new one is checked without being listed here.
// Its source files (not stories) may import only:
//   - react
//   - other components (src/components/*), icons (src/icons), hooks (src/hooks)
//   - data types and formatters (src/data/types, src/data/format)
//   - their own files (CSS modules, siblings)
// They may not import react-aria-components (use the foundation components
// built on it) or fixture data (take data as props), or any other package.
// Exceptions live in scripts/boundary-exceptions.json, each with a reason.
//
// Screens (src/screens/<Name>/, decision 37) are held to the same layer and stricter
// still, so a screen is built only from the system (docs/BUILDING-SCREENS.md):
//   - imports: react, components, icons, hooks and src/data (fixtures included); not
//     react-aria-components, other packages or another screen
//   - no styling of their own: no CSS files, no style={…}, no className (except the
//     global "sr-only"). What the system can't do is logged as a gap, not patched here.
//   - each screen has <Name>.stories.tsx under "Screens/", so the accessibility test runs on it
// Screens have no exceptions.
//
// Prototypes (src/prototypes/<Name>/, decision 49) wire screens together for a clickable
// demo. They follow the screen rules, except that they may import screens and React Aria's
// RouterProvider (to send the screens' links to the right page); a story under "Prototypes/".
//
// Run with: npm run check:boundaries
// Self-test: npm run check:boundaries -- --self-test
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, normalize, relative } from 'node:path'

const ALLOWED_PACKAGES = new Set(['react'])
const ALLOWED_DIRS = ['src/components/', 'src/icons', 'src/hooks/', 'src/data/types', 'src/data/format']
const IMPORT_RE = /^\s*(?:import|export)\s[^'"]*?from\s+['"]([^'"]+)['"]|^\s*import\s+['"]([^'"]+)['"]/gm

/** Problems in one AcmeCo component source file. */
export function boundaryProblems(source, file, exceptions = []) {
  const problems = []
  for (const match of source.matchAll(IMPORT_RE)) {
    const spec = match[1] ?? match[2]
    const excepted = exceptions.some((e) => e.file === file && e.import === spec)
    if (excepted) continue
    if (!spec.startsWith('.')) {
      if (!ALLOWED_PACKAGES.has(spec)) problems.push(`${file}: imports "${spec}" (AcmeCo components use foundation components, not packages directly)`)
      continue
    }
    const target = normalize(join(dirname(file), spec))
    if (target.startsWith(dirname(file))) continue // its own files
    if (target.startsWith('src/data/fixtures')) {
      problems.push(`${file}: imports fixture data "${spec}" (take the data as props)`)
      continue
    }
    if (!ALLOWED_DIRS.some((d) => target.startsWith(d))) problems.push(`${file}: imports "${spec}" (outside components, icons, hooks and data types/formatters)`)
  }
  return problems
}

const SCREEN_DIRS = ['src/components/', 'src/icons', 'src/hooks/', 'src/data/']

/** Problems in one screen (or, with prototype, prototype) source file (not its story). */
export function screenProblems(source, file, { prototype = false } = {}) {
  const problems = []
  for (const match of source.matchAll(IMPORT_RE)) {
    const spec = match[1] ?? match[2]
    if (/\.css$/.test(spec)) { problems.push(`${file}: imports a stylesheet "${spec}" (screens have no CSS; log the gap)`); continue }
    if (!spec.startsWith('.')) {
      if (!ALLOWED_PACKAGES.has(spec) && !(prototype && spec === 'react-aria-components' && /import\s*\{\s*RouterProvider\s*\}/.test(match[0]))) problems.push(`${file}: imports "${spec}" (screens use system components, not packages)`)
      continue
    }
    const target = normalize(join(dirname(file), spec))
    if (target.startsWith(dirname(file))) continue // its own files
    if (target.startsWith('src/screens/') && !prototype) { problems.push(`${file}: imports another screen "${spec}" (share it through the system instead)`); continue }
    if (!SCREEN_DIRS.some((d) => target.startsWith(d)) && !(prototype && target.startsWith('src/screens/'))) problems.push(`${file}: imports "${spec}" (outside components, icons, hooks and data)`)
  }
  // JSX attributes, ignoring comments.
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  if (/\sstyle=\{/.test(code)) problems.push(`${file}: uses style={…} (screens have no styling of their own; log the gap)`)
  for (const m of code.matchAll(/\sclassName=(\{[^}]*\}|"[^"]*"|'[^']*')/g)) {
    if (!/^["']sr-only["']$/.test(m[1])) problems.push(`${file}: uses className=${m[1]} (only "sr-only" is allowed in screens; log the gap)`)
  }
  return problems
}

/** Problems with a screen (or prototype) folder as a whole: stylesheets, and its story. */
export async function screenFolderProblems(dir, { prototype = false } = {}) {
  const problems = []
  const name = dir.split('/').pop()
  const files = await readdir(dir)
  for (const f of files.filter((x) => x.endsWith('.css'))) problems.push(`${join(dir, f)}: a stylesheet in a screen (screens have no CSS; log the gap)`)
  const story = files.find((f) => f === `${name}.stories.tsx`)
  if (!story) problems.push(`${dir}: no ${name}.stories.tsx (every screen has a story, so the accessibility test runs on it)`)
  else if (!(prototype ? /title:\s*'Prototypes\// : /title:\s*'Screens\//).test(await readFile(join(dir, story), 'utf8'))) problems.push(`${join(dir, story)}: its title should start with "${prototype ? 'Prototypes/' : 'Screens/'}"`)
  return problems
}

async function acmecoComponentDirs() {
  const dirs = []
  for (const entry of await readdir('src/components', { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const dir = join('src/components', entry.name)
    for (const f of await readdir(dir)) {
      if (f.endsWith('.stories.tsx') && /title:\s*'AcmeCo\//.test(await readFile(join(dir, f), 'utf8'))) {
        dirs.push(dir)
        break
      }
    }
  }
  return dirs
}

const exceptions = JSON.parse(await readFile('scripts/boundary-exceptions.json', 'utf8')).exceptions

if (process.argv.includes('--self-test')) {
  const file = 'src/components/Fixture/Fixture.tsx'
  const bad = boundaryProblems(await readFile('scripts/fixtures/bad-boundary.tsx.txt', 'utf8'), file)
  const good = boundaryProblems(await readFile('scripts/fixtures/good-boundary.tsx.txt', 'utf8'), file)
  const excepted = boundaryProblems("import { ToggleButton } from 'react-aria-components'", file, [{ file, import: 'react-aria-components', reason: 'test' }])
  const checks = [
    ['catches a react-aria-components import', bad.some((p) => p.includes('"react-aria-components"'))],
    ['catches a fixture data import', bad.some((p) => p.includes('fixture data'))],
    ['catches another package', bad.some((p) => p.includes('"lodash"'))],
    ['catches an import from outside the allowed folders', bad.some((p) => p.includes('"../../storybook/ForceState"'))],
    ['passes a correct component', good.length === 0],
    ['honours a listed exception', excepted.length === 0],
  ]
  const screen = 'src/screens/Fixture/Fixture.tsx'
  const badScreen = screenProblems(await readFile('scripts/fixtures/bad-screen.tsx.txt', 'utf8'), screen)
  const goodScreen = screenProblems(await readFile('scripts/fixtures/good-screen.tsx.txt', 'utf8'), screen)
  checks.push(
    ['screens: catches a react-aria-components import', badScreen.some((p) => p.includes('"react-aria-components"'))],
    ['screens: catches a stylesheet', badScreen.some((p) => p.includes('stylesheet'))],
    ['screens: catches another screen', badScreen.some((p) => p.includes('another screen'))],
    ['screens: catches style={…}', badScreen.some((p) => p.includes('style={'))],
    ['screens: catches a className', badScreen.some((p) => p.includes('className='))],
    ['screens: allows fixture data and sr-only', goodScreen.length === 0],
    ['prototypes: may import a screen and RouterProvider', screenProblems("import { RouterProvider } from 'react-aria-components'\nimport { SearchResults } from '../../screens/SearchResults/SearchResults'", 'src/prototypes/Fixture/Fixture.tsx', { prototype: true }).length === 0],
    ['prototypes: still catch a stylesheet and other React Aria parts', screenProblems("import './x.css'\nimport { Button } from 'react-aria-components'", 'src/prototypes/Fixture/Fixture.tsx', { prototype: true }).length === 2],
  )
  for (const [name, ok] of checks) console.log(`${ok ? '✔' : '✖'} ${name}`)
  if (good.length) console.log(good.join('\n'))
  if (goodScreen.length) console.log(goodScreen.join('\n'))
  if (checks.some(([, ok]) => !ok)) process.exit(1)
  console.log('Self-test passed.')
  process.exit(0)
}

const dirs = await acmecoComponentDirs()
const problems = []
let fileCount = 0
for (const dir of dirs) {
  for (const f of await readdir(dir)) {
    if (!/\.(ts|tsx)$/.test(f) || /\.(stories|typetest|test)\.tsx?$/.test(f)) continue
    const file = join(dir, f)
    fileCount++
    problems.push(...boundaryProblems(await readFile(file, 'utf8'), relative('.', file), exceptions))
  }
}
// Screens.
const screenDirs = []
for (const entry of await readdir('src/screens', { withFileTypes: true }).catch(() => [])) if (entry.isDirectory()) screenDirs.push(join('src/screens', entry.name))
for (const dir of screenDirs) {
  problems.push(...(await screenFolderProblems(dir)))
  for (const f of await readdir(dir)) {
    if (!/\.(ts|tsx)$/.test(f) || /\.(stories|test)\.tsx?$/.test(f)) continue
    fileCount++
    problems.push(...screenProblems(await readFile(join(dir, f), 'utf8'), relative('.', join(dir, f))))
  }
}
// Prototypes.
const prototypeDirs = []
for (const entry of await readdir('src/prototypes', { withFileTypes: true }).catch(() => [])) if (entry.isDirectory()) prototypeDirs.push(join('src/prototypes', entry.name))
for (const dir of prototypeDirs) {
  problems.push(...(await screenFolderProblems(dir, { prototype: true })))
  for (const f of await readdir(dir)) {
    if (!/\.(ts|tsx)$/.test(f) || /\.(stories|test)\.tsx?$/.test(f)) continue
    fileCount++
    problems.push(...screenProblems(await readFile(join(dir, f), 'utf8'), relative('.', join(dir, f)), { prototype: true }))
  }
}
// An exception for a file or import that no longer exists should be removed.
for (const e of exceptions) {
  const source = await readFile(e.file, 'utf8').catch(() => '')
  if (!source.includes(`'${e.import}'`)) problems.push(`boundary-exceptions.json: "${e.import}" in ${e.file} is no longer imported; remove the exception`)
}

console.log(`Checked ${fileCount} files in ${dirs.length} AcmeCo component folders (${dirs.map((d) => d.split("/").pop()).join(", ")}), ${screenDirs.length} screen(s) (${screenDirs.map((d) => d.split('/').pop()).join(', ') || 'none yet'}) and ${prototypeDirs.length} prototype(s) (${prototypeDirs.map((d) => d.split('/').pop()).join(', ') || 'none yet'}); ${exceptions.length} listed exception(s).`)
if (problems.length) {
  console.error(problems.map((p) => `✖ ${p}`).join('\n'))
  console.error(`✖ ${problems.length} problem(s).`)
  process.exit(1)
}
console.log('✔ AcmeCo components and screens import only the system; screens have no styling of their own.')
