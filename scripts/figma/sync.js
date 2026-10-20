// Runs INSIDE Figma via the use_figma tool. Never run directly: render it with
//   node scripts/figma/render.mjs <part> <apply|verify>
// which inlines one part of figma/payload.json (as PART) and digest.js.
//
// MODE 'apply'  creates or updates what PART describes, then reports
//               created / changed / unchanged and a digest of Figma's real state.
// MODE 'verify' changes nothing; reports the differences from PART and the digest.
// Errors abort the whole script, and Figma applies nothing (scripts are atomic).
//
// Adapted from the import-tokens-figma skill's apply-tokens.js (two passes,
// match by name), extended to alias across collections and to set scopes,
// descriptions and Web code syntax. See docs/proposals/PHASE-2-FIGMA-VARIABLES.md.

/* __INLINE_DIGEST__ */
/* __INLINE_INPUT__ */

const write = MODE === 'apply'
const report = { part: PART.kind, mode: MODE, created: [], changed: [], unchanged: 0, figmaOnly: [], digest: null }

const allCollections = await figma.variables.getLocalVariableCollectionsAsync()
const collectionByName = Object.fromEntries(allCollections.map((c) => [c.name, c]))
const collectionNameById = Object.fromEntries(allCollections.map((c) => [c.id, c.name]))
const allVariables = await figma.variables.getLocalVariablesAsync()
const varByKey = Object.fromEntries(allVariables.map((v) => [`${collectionNameById[v.variableCollectionId]}/${v.name}`, v]))
const keyOfVar = (v) => `${collectionNameById[v.variableCollectionId]}/${v.name}`
const findVar = (ref) => varByKey[`${ref.collection}/${ref.name}`]

function canonValue(v, modeId) {
  const raw = v.valuesByMode[modeId]
  if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
    const target = allVariables.find((x) => x.id === raw.id)
    return target ? 'alias:' + keyOfVar(target) : 'alias:?' + raw.id
  }
  if (v.resolvedType === 'COLOR') return hex8(raw)
  if (v.resolvedType === 'FLOAT') return num(raw)
  return String(raw)
}
const canonWanted = (t) => t.value && t.value.alias ? `alias:${t.value.alias.collection}/${t.value.alias.name}`
  : t.type === 'COLOR' ? hex8(t.value) : t.type === 'FLOAT' ? num(t.value) : String(t.value)

function toFigmaColor(hex) {
  const h = hex8(hex).slice(1)
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255
  return { r: n(0), g: n(2), b: n(4), a: n(6) }
}

// ---------------------------------------------------------------- variables
if (PART.kind === 'variables') {
  const spec = PART.collection
  let col = collectionByName[spec.name]
  if (!col) {
    if (!write) throw new Error(`Collection ${spec.name} does not exist yet`)
    col = figma.variables.createVariableCollection(spec.name)
    collectionNameById[col.id] = spec.name
  }
  const modeId = col.modes[0].modeId
  if (write && col.modes[0].name !== spec.mode) col.renameMode(modeId, spec.mode)

  // Pass 1: create missing variables, so aliases within this collection resolve.
  for (const t of spec.variables) {
    let v = varByKey[`${spec.name}/${t.name}`]
    if (!v) {
      report.created.push(t.name)
      if (!write) continue
      v = figma.variables.createVariable(t.name, col, t.type)
      varByKey[`${spec.name}/${t.name}`] = v
      allVariables.push(v)
    } else if (v.resolvedType !== t.type) {
      throw new Error(`${t.name} is ${v.resolvedType} in Figma but ${t.type} in the repo; types can't change in place`)
    }
  }
  // Pass 2: set values (literal or alias), scopes, description and code syntax.
  for (const t of spec.variables) {
    const v = varByKey[`${spec.name}/${t.name}`]
    if (!v) continue // verify mode, missing: already reported as created
    const isNew = report.created.includes(t.name)
    const diffs = []
    const wanted = canonWanted(t)
    if (canonValue(v, modeId) !== wanted) {
      diffs.push('value')
      if (write) {
        if (t.value.alias) {
          const target = findVar(t.value.alias)
          if (!target) throw new Error(`${t.name}: alias target ${t.value.alias.collection}/${t.value.alias.name} not found (apply Primitives first)`)
          v.setValueForMode(modeId, figma.variables.createVariableAlias(target))
        } else {
          v.setValueForMode(modeId, t.type === 'COLOR' ? toFigmaColor(t.value) : t.value)
        }
      }
    }
    if (v.scopes.slice().sort().join(',') !== t.scopes.slice().sort().join(',')) { diffs.push('scopes'); if (write) v.scopes = t.scopes }
    if (plainText(v.description) !== t.description) { diffs.push('description'); if (write) v.description = t.description }
    if ((v.codeSyntax.WEB || '') !== t.codeSyntax.WEB) { diffs.push('codeSyntax'); if (write) v.setVariableCodeSyntax('WEB', t.codeSyntax.WEB) }
    if (isNew) continue
    if (diffs.length) report.changed.push({ name: t.name, fields: diffs })
    else report.unchanged++
  }
  const wantedNames = new Set(spec.variables.map((t) => t.name))
  // A chunk holds only part of the collection, so "in Figma but not here" means nothing for it.
  report.figmaOnly = PART.chunk ? [] : allVariables.filter((v) => v.variableCollectionId === col.id && !wantedNames.has(v.name)).map((v) => v.name)
  if (PART.chunk) report.chunk = PART.chunk

  // Digest of Figma's actual state for this collection.
  report.digest = digestOf(allVariables.filter((v) => v.variableCollectionId === col.id).map((v) => variableLine({
    name: v.name, type: v.resolvedType, value: canonValue(v, modeId), scopes: v.scopes,
    codeWeb: v.codeSyntax.WEB || '', description: v.description,
  })))
}

// ---------------------------------------------------------------- styles
if (PART.kind === 'styles') {
  const textStyles = await figma.getLocalTextStylesAsync()
  const effectStyles = await figma.getLocalEffectStylesAsync()
  const refName = (id) => { const v = allVariables.find((x) => x.id === id); return v ? keyOfVar(v) : '' }

  for (const s of PART.textStyles) {
    let st = textStyles.find((x) => x.name === s.name)
    const isNew = !st
    if (isNew) { report.created.push('text/' + s.name); if (!write) continue; st = figma.createTextStyle(); st.name = s.name }
    const diffs = []
    await figma.loadFontAsync({ family: s.fontFamily, style: s.fontStyle })
    if (st.fontName.family !== s.fontFamily || st.fontName.style !== s.fontStyle) { diffs.push('font'); if (write) st.fontName = { family: s.fontFamily, style: s.fontStyle } }
    if (num(st.fontSize) !== num(s.fontSize)) { diffs.push('fontSize'); if (write) st.fontSize = s.fontSize }
    if (st.lineHeight.unit !== 'PIXELS' || num(st.lineHeight.value) !== num(s.lineHeight)) { diffs.push('lineHeight'); if (write) st.lineHeight = { unit: 'PIXELS', value: s.lineHeight } }
    if (plainText(st.description) !== s.description) { diffs.push('description'); if (write) st.description = s.description }
    for (const field of ['fontFamily', 'fontSize', 'lineHeight', 'fontWeight']) {
      const want = `${s.bind[field].collection}/${s.bind[field].name}`
      const have = st.boundVariables && st.boundVariables[field] ? refName(st.boundVariables[field].id) : ''
      if (have !== want) {
        diffs.push('bind:' + field)
        if (write) {
          const target = findVar(s.bind[field])
          if (!target) throw new Error(`Text style ${s.name}: variable ${want} not found`)
          st.setBoundVariable(field, target)
        }
      }
    }
    if (isNew) continue
    if (diffs.length) report.changed.push({ name: 'text/' + s.name, fields: diffs }); else report.unchanged++
  }

  const effectsEqual = (a, b) => effectStyleLine({ name: '', description: '', effects: a }) === effectStyleLine({ name: '', description: '', effects: b })
  for (const s of PART.effectStyles) {
    let st = effectStyles.find((x) => x.name === s.name)
    const isNew = !st
    if (isNew) { report.created.push('effect/' + s.name); if (!write) continue; st = figma.createEffectStyle(); st.name = s.name }
    const diffs = []
    if (!effectsEqual(st.effects, s.effects)) {
      diffs.push('effects')
      if (write) st.effects = s.effects.map((e) => ({ type: e.type, color: e.color, offset: e.offset, radius: e.radius, spread: e.spread, visible: true, blendMode: 'NORMAL' }))
    }
    if (plainText(st.description) !== s.description) { diffs.push('description'); if (write) st.description = s.description }
    if (isNew) continue
    if (diffs.length) report.changed.push({ name: 'effect/' + s.name, fields: diffs }); else report.unchanged++
  }

  // Digest of Figma's actual styles (only the ones the payload names, plus any extras reported).
  const tsNow = await figma.getLocalTextStylesAsync()
  const esNow = await figma.getLocalEffectStylesAsync()
  const wantedText = new Set(PART.textStyles.map((s) => s.name))
  const wantedEffect = new Set(PART.effectStyles.map((s) => s.name))
  report.figmaOnly = [...tsNow.filter((s) => !wantedText.has(s.name)).map((s) => 'text/' + s.name), ...esNow.filter((s) => !wantedEffect.has(s.name)).map((s) => 'effect/' + s.name)]
  const bindOf = (st, f) => (st.boundVariables && st.boundVariables[f] ? refName(st.boundVariables[f].id) : '')
  report.digest = digestOf([
    ...tsNow.map((st) => 'T' + textStyleLine({
      name: st.name, fontFamily: st.fontName.family, fontStyle: st.fontName.style, fontSize: st.fontSize,
      lineHeight: st.lineHeight.unit === 'PIXELS' ? st.lineHeight.value : -1, description: st.description,
      bind: { fontFamily: bindOf(st, 'fontFamily'), fontSize: bindOf(st, 'fontSize'), lineHeight: bindOf(st, 'lineHeight'), fontWeight: bindOf(st, 'fontWeight') },
    })),
    ...esNow.map((st) => 'E' + effectStyleLine({ name: st.name, description: st.description, effects: st.effects.filter((e) => e.type === 'DROP_SHADOW') })),
  ])
}

// ---------------------------------------------------------------- pages
// Generated pages: the "Motion and Fluid Layout tokens" reference (decision 15)
// and a verification sheet whose swatches and samples are bound to the variables
// and styles. Each run replaces the generated frame, so the pages always match
// the payload. Every colour on them is bound to a variable (none hard-coded).
if (PART.kind === 'pages') {
  if (!write) throw new Error('pages are generated, not verified: run in apply mode')
  await figma.loadFontAsync({ family: 'Outfit', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Outfit', style: 'SemiBold' })
  const textStyles = await figma.getLocalTextStylesAsync()
  const effectStyles = await figma.getLocalEffectStylesAsync()
  const styleId = (name) => { const st = textStyles.find((x) => x.name === name); if (!st) throw new Error('missing text style ' + name); return st.id }
  const semantic = (name) => { const v = varByKey['Semantic/' + name]; if (!v) throw new Error('missing variable Semantic/' + name); return v }
  // Resolve an alias chain to its colour, used as the paint's stored fallback
  // (a lesson from an earlier build: without it the canvas may show the placeholder colour).
  function resolvedColor(v) {
    let cur = v
    for (let i = 0; i < 10; i++) {
      const col = allCollections.find((c) => c.id === cur.variableCollectionId)
      const raw = cur.valuesByMode[col.modes[0].modeId]
      if (raw && raw.type === 'VARIABLE_ALIAS') cur = allVariables.find((x) => x.id === raw.id)
      else return raw
    }
    throw new Error('alias chain too deep: ' + v.name)
  }
  function boundPaint(v) {
    const c = resolvedColor(v)
    const paint = { type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a === undefined ? 1 : c.a }
    return figma.variables.setBoundVariableForPaint(paint, 'color', v)
  }
  async function text(chars, style, colourVar, width) {
    const t = figma.createText()
    t.characters = chars
    await t.setTextStyleIdAsync(styleId(style))
    t.fills = [boundPaint(semantic(colourVar))]
    if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height) }
    return t
  }
  async function freshPage(name) {
    let page = figma.root.children.find((p) => p.name === name)
    if (!page) { page = figma.createPage(); page.name = name }
    await page.loadAsync()
    for (const n of page.children.filter((n) => n.name.startsWith('Generated:'))) n.remove()
    return page
  }
  function frame(name, dir, gap, pad) {
    const f = figma.createAutoLayout(dir, { name, itemSpacing: gap, paddingTop: pad, paddingBottom: pad, paddingLeft: pad, paddingRight: pad })
    f.fills = [boundPaint(semantic('color/surface/default'))]
    return f
  }
  const created = []

  // Reference page
  {
    const page = await freshPage(PART.referencePage.name)
    const root = frame('Generated: ' + PART.referencePage.name, 'VERTICAL', 24, 64)
    root.x = 100; root.y = 100
    page.appendChild(root)
    root.appendChild(await text('Prototype · AcmeCo is a fictional brand', 'label', 'color/text/default'))
    root.appendChild(await text(PART.referencePage.name, 'heading-1', 'color/text/default'))
    root.appendChild(await text(PART.referencePage.intro, 'body', 'color/text/subtle', 880))
    for (const r of PART.referencePage.rows) {
      const row = figma.createAutoLayout('VERTICAL', { name: r.token, itemSpacing: 4 })
      row.fills = []
      root.appendChild(row)
      row.appendChild(await text(r.token + '   ' + r.value, 'heading-3', 'color/text/default'))
      row.appendChild(await text(r.cssVar, 'body-small', 'color/text/subtle'))
      row.appendChild(await text(r.description, 'body-small', 'color/text/default', 880))
    }
    created.push(root.id)
  }

  // Verification sheet
  {
    const page = await freshPage(PART.sheetPage)
    const root = frame('Generated: ' + PART.sheetPage, 'VERTICAL', 40, 64)
    root.x = 100; root.y = 100
    page.appendChild(root)
    root.appendChild(await text('Prototype · AcmeCo is a fictional brand', 'label', 'color/text/default'))
    root.appendChild(await text('Foundations: verification sheet', 'heading-1', 'color/text/default'))
    root.appendChild(await text('Generated from figma/payload.json. Every swatch, sample and label is bound to a variable or style, so a wrong binding shows up here.', 'body', 'color/text/subtle', 880))

    root.appendChild(await text('Semantic colours', 'heading-2', 'color/text/default'))
    const grid = figma.createAutoLayout('HORIZONTAL', { name: 'Swatches', itemSpacing: 16 })
    grid.layoutWrap = 'WRAP'
    grid.counterAxisSpacing = 24
    grid.fills = []
    root.appendChild(grid)
    grid.layoutSizingHorizontal = 'FIXED'
    grid.resize(1136, grid.height)
    for (const name of PART.colours) {
      // No '/' in frame names: in Figma that means a component (lint-design-figma flags it).
      const cell = figma.createAutoLayout('VERTICAL', { name: 'swatch: ' + name.replace('color/', '').replaceAll('/', '.'), itemSpacing: 8 })
      cell.fills = []
      grid.appendChild(cell)
      const sw = figma.createRectangle()
      sw.name = 'swatch'
      sw.resize(128, 56)
      sw.cornerRadius = 4
      sw.fills = [boundPaint(semantic(name))]
      sw.strokes = [boundPaint(semantic('color/border/default'))]
      sw.strokeWeight = 1
      cell.appendChild(sw)
      cell.appendChild(await text(name.replace('color/', ''), 'caption', 'color/text/subtle', 128))
    }

    root.appendChild(await text('Text styles', 'heading-2', 'color/text/default'))
    for (const name of PART.textStyles) root.appendChild(await text(name + ': Office space for lease in Chicago, IL', name, 'color/text/default'))

    root.appendChild(await text('Elevation', 'heading-2', 'color/text/default'))
    const shadows = figma.createAutoLayout('HORIZONTAL', { name: 'Shadows', itemSpacing: 32, paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 })
    shadows.fills = []
    root.appendChild(shadows)
    for (const st of effectStyles) {
      const card = frame('example: ' + st.name.replaceAll('/', '.'), 'VERTICAL', 4, 16)
      card.cornerRadius = 8
      shadows.appendChild(card)
      await card.setEffectStyleIdAsync(st.id)
      card.appendChild(await text(st.name, 'label', 'color/text/default'))
    }
    created.push(root.id)
  }

  // The Cover's status and contents are written by figma-cover.js (render-components.mjs cover).
  report.created = created
  report.pages = figma.root.children.map((p) => p.name)
}

return report
