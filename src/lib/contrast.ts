// Contrast maths and token resolution, shared by scripts/check-contrast.mjs (CI)
// and the Storybook Contrast page, so both always report the same numbers.
// Plain TypeScript with no dependencies; Node runs it directly (type stripping).

export type TokenTree = { [key: string]: unknown }
export interface ContrastPair {
  fg: string
  bg: string
  min: number
  kind: 'text' | 'ui' | 'exempt'
  /** For a translucent background: what sits behind it (e.g. a black photo). */
  backdrop?: string
  note?: string
}
export interface ContrastResult extends ContrastPair {
  fgHex: string
  bgHex: string
  ratio: number
  pass: boolean
}

type Rgba = { r: number; g: number; b: number; a: number }

/** Flattens a DTCG tree to { 'color.text.default': '{color.gray.900}', … }. */
export function flatten(tree: TokenTree, prefix = '', out: Record<string, unknown> = {}) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || typeof node !== 'object' || node === null) continue
    const path = prefix ? `${prefix}.${key}` : key
    if ('$value' in node) out[path] = (node as { $value: unknown }).$value
    else flatten(node as TokenTree, path, out)
  }
  return out
}

/** Follows {references} until it reaches a raw value. */
export function resolve(path: string, tokens: Record<string, unknown>, seen: string[] = []): unknown {
  if (seen.includes(path)) throw new Error(`Circular reference: ${[...seen, path].join(' → ')}`)
  if (!(path in tokens)) throw new Error(`Unknown token: ${path}`)
  const value = tokens[path]
  const ref = typeof value === 'string' && value.match(/^\{(.+)\}$/)
  return ref ? resolve(ref[1], tokens, [...seen, path]) : value
}

export function parseHex(hex: string): Rgba {
  const m = hex.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i)
  if (!m) throw new Error(`Not a #rrggbb(aa) colour: ${hex}`)
  const n = (i: number) => parseInt(m[1].slice(i, i + 2), 16)
  return { r: n(0), g: n(2), b: n(4), a: m[2] ? parseInt(m[2], 16) / 255 : 1 }
}

const toHex = ({ r, g, b }: Rgba) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

/** Paints a (possibly translucent) colour over an opaque one. */
export function composite(top: Rgba, under: Rgba): Rgba {
  const mix = (t: number, u: number) => t * top.a + u * (1 - top.a)
  return { r: mix(top.r, under.r), g: mix(top.g, under.g), b: mix(top.b, under.b), a: 1 }
}

function luminance({ r, g, b }: Rgba) {
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG 2.x contrast ratio between two opaque colours. */
export function ratio(a: Rgba, b: Rgba) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Resolves one pair to hex and measures it. Translucent colours are
 *  composited: background over its backdrop (default white), then foreground over that. */
export function checkPair(pair: ContrastPair, tokens: Record<string, unknown>): ContrastResult {
  const backdrop = parseHex(pair.backdrop ?? '#ffffff')
  const bg = composite(parseHex(String(resolve(pair.bg, tokens))), backdrop)
  const fg = composite(parseHex(String(resolve(pair.fg, tokens))), bg)
  const r = Math.floor(ratio(fg, bg) * 100) / 100 // round down: never report a pass that isn't one
  return { ...pair, fgHex: toHex(fg), bgHex: toHex(bg), ratio: r, pass: r >= pair.min }
}
