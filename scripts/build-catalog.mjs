// Writes the component catalogue: docs/catalog.json (for Claude Code) and docs/CATALOG.md
// (for people). One place that says, for every component, how to import it, its props,
// the values its choices take, when to use it, where to see it in Storybook and what it is
// called in Figma, so a screen can be built without reading every folder (decision 37).
//
// Read from the code itself, so it can't drift:
//   - props, types, defaults and descriptions: the TypeScript compiler (already installed)
//   - "When to use" / "When not to use": each folder's *.guidance.md
//   - stories: each *.stories.tsx (its title and exports, as Storybook names them)
//   - Figma set and variant properties: figma/components.json
//
//   npm run catalog            (CI regenerates it and fails if the committed copy differs)
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import ts from 'typescript'
import { storyNameFromExport, toId } from 'storybook/internal/csf'

const ROOT = 'src/components'
const folders = (await readdir(ROOT, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort()

// ---- TypeScript: every exported component and its props ----
const sourceFiles = []
for (const f of folders) for (const file of await readdir(`${ROOT}/${f}`)) {
  if (/\.tsx$/.test(file) && !/\.(stories|typetest|test)\.tsx$/.test(file)) sourceFiles.push(`${ROOT}/${f}/${file}`)
}
const dataFiles = (await readdir('src/data')).filter((f) => /\.tsx?$/.test(f)).sort().map((f) => `src/data/${f}`)
const { config } = ts.readConfigFile('tsconfig.app.json', ts.sys.readFile)
const { options } = ts.parseJsonConfigFileContent(config, ts.sys, '.')
const program = ts.createProgram([...sourceFiles, ...dataFiles], options)
const checker = program.getTypeChecker()

const docOf = (symbol) => ts.displayPartsToString(symbol?.getDocumentationComment(checker) ?? []).replace(/\s+/g, ' ').trim()
const isExported = (node) => node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)

// Defaults: from the destructured parameter (`{ size = 'md' }: Props`) or from a
// destructuring of the props object in the body (`const { size = 'md' } = props`).
function defaultsOf(fn) {
  const out = {}
  const take = (pattern) => { for (const el of pattern.elements) if (el.initializer && ts.isIdentifier(el.propertyName ?? el.name)) out[(el.propertyName ?? el.name).text] = el.initializer.getText() }
  const param = fn.parameters[0]
  if (!param) return out
  if (ts.isObjectBindingPattern(param.name)) take(param.name)
  else if (ts.isIdentifier(param.name) && fn.body) {
    const name = param.name.text
    for (const st of fn.body.statements) if (ts.isVariableStatement(st)) for (const d of st.declarationList.declarations) {
      if (ts.isObjectBindingPattern(d.name) && d.initializer && ts.isIdentifier(d.initializer) && d.initializer.text === name) take(d.name)
    }
  }
  return out
}

// The values a choice takes, when its type is a set of string literals ('sm' | 'md' | 'lg'),
// in the order the source writes them (the compiler keeps its own order).
function literalsOf(node) {
  if (node && ts.isUnionTypeNode(node)) { const parts = node.types.flatMap(literalsOf); return parts.every((x) => x != null) ? parts : [null] }
  if (node && ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) return [node.literal.text]
  if (node && ts.isLiteralTypeNode(node) && node.literal.kind === ts.SyntaxKind.UndefinedKeyword) return []
  if (node && node.kind === ts.SyntaxKind.UndefinedKeyword) return []
  return [null]
}
function optionsOf(type, typeNode) {
  // A named type (size?: ButtonSize): follow the name to where it's written.
  let node = typeNode
  if (node && ts.isTypeReferenceNode(node)) {
    let sym = checker.getSymbolAtLocation(node.typeName)
    if (sym && sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym)
    const decl = sym?.declarations?.[0]
    node = decl && ts.isTypeAliasDeclaration(decl) ? decl.type : null
  }
  const fromSource = literalsOf(node)
  if (fromSource.length > 1 && fromSource.every((x) => x != null)) return fromSource
  const parts = (type.isUnion() ? type.types : [type]).filter((t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)))
  return parts.length > 1 && parts.every((t) => t.isStringLiteral()) ? parts.map((t) => t.value) : undefined
}

function propsOf(fn) {
  const param = fn.parameters[0]
  if (!param) return []
  const type = checker.getTypeAtLocation(param)
  // A union of prop shapes (Button: as a button or as a link) lists every prop once; a prop
  // that only some shapes have is optional, and says which.
  const members = type.isUnion() ? type.types : [type]
  const byName = new Map()
  // A prop typed `undefined` in a shape only marks that shape (Button's `href?: undefined`): it
  // doesn't count as having the prop, and the real declaration comes from the other shape.
  const marker = (decl) => decl.type?.kind === ts.SyntaxKind.UndefinedKeyword
  const shapeOf = (decl) => (ts.isInterfaceDeclaration(decl.parent) ? decl.parent.name.text.replace(/^As/, '').replace(/Props$/, '') : null)
  for (const [i, m] of members.entries()) for (const prop of checker.getPropertiesOfType(m)) {
    const decl = prop.valueDeclaration ?? prop.declarations?.[0]
    if (!decl || marker(decl)) continue
    const entry = byName.get(prop.name) ?? { prop, decl, in: [] }
    entry.in.push(i)
    byName.set(prop.name, entry)
  }
  const defaults = defaultsOf(fn)
  // Props every shape has come first, then each shape's own, in the order they're written.
  const entries = [...byName.values()].sort((a, b) => (b.in.length === members.length) - (a.in.length === members.length))
  return entries.map(({ prop, decl, in: inMembers }) => {
    const propType = checker.getTypeOfSymbolAtLocation(prop, decl)
    const written = decl.type ? decl.type.getText().replace(/\s+/g, ' ') : checker.typeToString(propType)
    const partial = inMembers.length < members.length
    const optional = !!(prop.flags & ts.SymbolFlags.Optional) || partial
    const out = { name: prop.name, type: written, required: !optional }
    // Only some shapes have it (Button's target: only as a link); a shape's required prop
    // (Button's href) is what chooses that shape.
    if (partial && shapeOf(decl)) out.only = shapeOf(decl)
    const options = optionsOf(propType, decl.type)
    if (options) out.options = options
    if (defaults[prop.name] != null) out.default = defaults[prop.name]
    const description = docOf(prop)
    if (description) out.description = description
    return out
  })
}

const components = []
for (const file of sourceFiles) {
  const sf = program.getSourceFile(file)
  const folder = file.split('/')[2]
  // Which other components this file is built from (relative imports of component folders).
  const builtFrom = new Set()
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st)) continue
    const spec = st.moduleSpecifier.text
    const m = spec.match(/^\.\.\/([A-Z]\w+)\//)
    if (m && m[1] !== folder) for (const el of st.importClause?.namedBindings?.elements ?? []) if (/^[A-Z]/.test(el.name.text) && !el.isTypeOnly) builtFrom.add(el.name.text)
  }
  for (const st of sf.statements) {
    if (!ts.isFunctionDeclaration(st) || !isExported(st) || !st.name || !/^[A-Z]/.test(st.name.text)) continue
    components.push({
      name: st.name.text,
      folder,
      import: `${file.replace(/\.tsx$/, '')}`,
      description: docOf(checker.getSymbolAtLocation(st.name)),
      props: propsOf(st),
      builtFrom: [...builtFrom].filter((n) => n !== st.name.text).sort(),
    })
  }
}

// ---- the shapes props take (NavigationLink, Listing…) and the fixtures screens can use ----
// A type: its fields (an interface) or its definition (a type alias), from component files
// (other than *Props) and src/data/types.ts.
function typeEntry(st, file) {
  const base = { name: st.name.text, import: file.replace(/\.tsx?$/, ''), description: docOf(checker.getSymbolAtLocation(st.name)) || undefined }
  if (ts.isTypeAliasDeclaration(st)) return { ...base, definition: st.type.getText().replace(/\s+/g, ' ') }
  return { ...base, fields: st.members.filter(ts.isPropertySignature).map((m) => ({ name: m.name.getText(), type: m.type?.getText().replace(/\s+/g, ' '), required: !m.questionToken, description: docOf(checker.getSymbolAtLocation(m.name)) || undefined })) }
}
const types = []
for (const file of [...sourceFiles, 'src/data/types.ts']) {
  for (const st of program.getSourceFile(file).statements) {
    if (!(ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) || !isExported(st) || /Props$/.test(st.name.text)) continue
    types.push(typeEntry(st, file))
  }
}
// Fixtures and helpers in src/data: what each exports and its type.
const data = []
for (const file of dataFiles.filter((f) => !f.endsWith('/types.ts'))) {
  const sf = program.getSourceFile(file)
  const exports = []
  for (const st of sf.statements) {
    if (!isExported(st)) continue
    const decls = ts.isVariableStatement(st) ? st.declarationList.declarations : ts.isFunctionDeclaration(st) && st.name ? [st] : []
    for (const d of decls) exports.push({ name: d.name.getText(), type: checker.typeToString(checker.getTypeAtLocation(d.name), undefined, ts.TypeFormatFlags.NoTruncation) })
  }
  // The file's opening comment says what it's for.
  const lead = sf.getFullText().match(/^(\s*\/\/[^\n]*\n)+/)?.[0].split('\n').map((l) => l.replace(/^\s*\/\/\s?/, '')).join(' ').replace(/\s+/g, ' ').trim()
  if (exports.length) data.push({ file: file.replace(/\.ts$/, ''), about: lead || undefined, exports })
}

// ---- guidance, stories and Figma, by folder ----
function guidanceSections(md) {
  const out = {}
  for (const chunk of md.split(/^## /m).slice(1)) {
    const [title, ...rest] = chunk.split('\n')
    out[title.trim()] = rest.join('\n').trim().split('\n').filter((l) => l.trim()).map((l) => l.replace(/^- /, '').trim())
  }
  return out
}
const guidance = {}, stories = {}
for (const f of folders) {
  const files = await readdir(`${ROOT}/${f}`)
  const g = files.find((x) => x.endsWith('.guidance.md'))
  if (g) guidance[f] = guidanceSections(await readFile(`${ROOT}/${f}/${g}`, 'utf8'))
  stories[f] = []
  for (const s of files.filter((x) => x.endsWith('.stories.tsx'))) {
    const src = await readFile(`${ROOT}/${f}/${s}`, 'utf8')
    const title = src.match(/title:\s*'([^']+)'/)?.[1]
    if (!title) continue
    for (const m of src.matchAll(/^export const (\w+)\s*:\s*Story\b/gm)) stories[f].push({ id: toId(title, storyNameFromExport(m[1])), title })
  }
}
const figma = JSON.parse(await readFile('figma/components.json', 'utf8')).components
// A code file can have several Figma sets (Select: the trigger and its open list).
const figmaByCode = {}
for (const c of figma) (figmaByCode[c.code.replace(/\.tsx$/, '')] ??= []).push(c)
const names = new Set(components.map((c) => c.name))

for (const c of components) {
  const s = stories[c.folder]
  const title = s[0]?.title ?? ''
  // Layer: the shared layout primitives; AcmeCo's own components (stories under "AcmeCo/");
  // parts used only inside other components (no stories of their own); the foundations.
  c.layer = c.folder === 'Layout' ? 'layout' : title.startsWith('AcmeCo/') ? 'acmeco' : s.length ? 'foundation' : 'internal'
  const g = guidance[c.folder] ?? {}
  c.summary = (g.Overview ?? [])[0] ?? c.description
  c.whenToUse = g['When to use'] ?? []
  c.whenNotToUse = g['When not to use'] ?? []
  c.stories = s.map((x) => x.id)
  // Figma: the set(s) drawn from this file. Layout primitives are auto-layout frames there.
  c.figma = (figmaByCode[c.import] ?? []).map((f) => ({ set: f.name, page: f.page, variantProperties: f.axes, properties: f.properties.map((p) => `${p.name} (${p.type.toLowerCase().replace('_', ' ')})`) }))
  // Built from: only the catalogue's own components (not types or React Aria helpers).
  c.builtFrom = c.builtFrom.filter((n) => names.has(n))
}
const order = { layout: 0, foundation: 1, acmeco: 2, internal: 3 }
components.sort((a, b) => order[a.layer] - order[b.layer] || a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))
// The guidance and stories are the folder's; components that share a folder share them.
const catalog = {
  $description: 'Generated by scripts/build-catalog.mjs from the components\' TypeScript, guidance files, stories and figma/components.json. Do not edit by hand: run `npm run catalog`. Screens import from `import` (add .tsx only if your tooling needs it); see docs/BUILDING-SCREENS.md.',
  layers: {
    layout: 'Layout primitives: the only way a screen lays things out (decision 34).',
    foundation: 'The system\'s building blocks (buttons, fields, dialogs…).',
    acmeco: 'AcmeCo\'s own components, built only from the foundations (the boundary check enforces it).',
    internal: 'Parts used inside other components; a screen doesn\'t use them directly.',
  },
  components: components.map(({ name, layer, folder, import: imp, summary, props, whenToUse, whenNotToUse, builtFrom, stories: st, figma: fg }) => ({ name, layer, folder, import: imp, summary, props, whenToUse, whenNotToUse, builtFrom, stories: st, figma: fg })),
  types,
  data,
}

// ---- the readable version ----
const esc = (s) => String(s).replace(/\|/g, '\\|')
const titles = { layout: 'Layout primitives', foundation: 'Foundations', acmeco: 'AcmeCo components', internal: 'Internal parts' }
const md = [`# Component catalogue

*Generated by \`npm run catalog\` from the code (TypeScript, guidance files, stories, \`figma/components.json\`); don't edit by hand. Prototype · AcmeCo is a fictional brand.*

${components.length} components.${existsSync('docs/BUILDING-SCREENS.md') ? ' To build a screen, start with [BUILDING-SCREENS.md](BUILDING-SCREENS.md).' : ''} The same data, for tools: [catalog.json](catalog.json).
`]
for (const layer of Object.keys(titles)) {
  const list = components.filter((c) => c.layer === layer)
  if (!list.length) continue
  md.push(`\n## ${titles[layer]}\n\n${catalog.layers[layer]}\n\n${list.map((c) => `- [${c.name}](#${c.name.toLowerCase()})`).join('\n')}\n`)
  for (const c of list) {
    md.push(`\n### ${c.name}\n\n${c.summary ? c.summary + '\n\n' : ''}\`import { ${c.name} } from '${c.import.replace(/^src\//, '…/')}'\`${c.builtFrom.length ? ` · built from ${c.builtFrom.join(', ')}` : ''}\n`)
    if (c.props.length) md.push(`\n| Prop | Type | Default | Notes |\n|---|---|---|---|\n${c.props.map((p) => `| \`${p.name}\`${p.required ? ' (required)' : ''} | ${p.options ? p.options.map((o) => `\`${o}\``).join(' / ') : `\`${esc(p.type)}\``} | ${p.default ? `\`${esc(p.default)}\`` : ''} | ${p.only ? `*${p.only} only.* ` : ''}${esc(p.description ?? '')} |`).join('\n')}\n`)
    if (c.whenToUse.length) md.push(`\n**When to use**\n\n${c.whenToUse.map((l) => `- ${l}`).join('\n')}\n`)
    if (c.whenNotToUse.length) md.push(`\n**When not to use**\n\n${c.whenNotToUse.map((l) => `- ${l}`).join('\n')}\n`)
    const where = [c.stories.length ? `Storybook: ${c.stories.map((s) => `\`${s}\``).join(', ')}` : '', c.figma.length ? `Figma: ${c.figma.map((f) => `"${f.set}" (page ${f.page}; ${Object.entries(f.variantProperties).map(([k, v]) => `${k}: ${v.join(' / ')}`).join('; ')})`).join(', ')}` : c.layer === 'layout' ? 'Figma: auto-layout frames bound to the space variables (not a component)' : 'Figma: none'].filter(Boolean)
    md.push(`\n${where.join('  \n')}\n`)
  }
}

md.push(`\n## Types\n\nThe shapes that props take. Import them with \`import type\`.\n`)
for (const t of types) {
  md.push(`\n### ${t.name}\n\n\`${t.import.replace(/^src\//, '…/')}\`${t.description ? ` · ${t.description}` : ''}\n`)
  if (t.definition) md.push(`\n\`${esc(t.definition)}\`\n`)
  else if (t.fields.length) md.push(`\n| Field | Type | Notes |\n|---|---|---|\n${t.fields.map((f) => `| \`${f.name}\`${f.required ? '' : ' (optional)'} | \`${esc(f.type)}\` | ${esc(f.description ?? '')} |`).join('\n')}\n`)
}
md.push(`\n## Fixture data and helpers\n\nWhat screens fill components with (\`src/data\`): synthetic listings and brokers, AcmeCo's navigation and footer content, formatters. No real listings, people or logos.\n`)
for (const d of data) md.push(`\n### ${d.file.replace(/^src\//, '')}\n\n${d.about ? d.about + '\n\n' : ''}${d.exports.map((e) => `- \`${e.name}\`: \`${esc(e.type)}\``).join('\n')}\n`)

await writeFile('docs/catalog.json', JSON.stringify(catalog, null, 1) + '\n')
await writeFile('docs/CATALOG.md', md.join(''))
const missingProps = components.filter((c) => c.layer !== 'internal' && !c.props.length).map((c) => c.name)
console.log(`✔ docs/catalog.json and docs/CATALOG.md: ${components.length} components (${Object.keys(titles).map((l) => `${components.filter((c) => c.layer === l).length} ${l}`).join(', ')}), ${types.length} types, ${data.length} data files${missingProps.length ? `; no props: ${missingProps.join(', ')}` : ''}`)
