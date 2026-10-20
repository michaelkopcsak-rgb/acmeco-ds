// Reads the token JSON for the Foundations pages, so the docs can never drift
// from the real tokens: rename or change a token and the page changes with it.
import primitivesJson from '../../tokens/primitives.json'
import semanticJson from '../../tokens/semantic-light.json'
import { flatten, resolve, type TokenTree } from '../lib/contrast'

export const EVIDENCE_LABELS = ['OBSERVED', 'LEGACY-NAMED', 'PROPOSED', 'BENCHMARK-INFORMED', 'REFERENCE-OBSERVED'] as const
export type EvidenceLabel = (typeof EVIDENCE_LABELS)[number]

export interface TokenInfo {
  /** Dotted path, e.g. color.text.default */
  path: string
  /** CSS custom property, e.g. --color-text-default */
  cssVar: string
  /** As written in the JSON: a raw value or a {reference} */
  value: unknown
  /** Followed through every reference to the raw value */
  resolved: unknown
  /** The token it points at, if it's a reference */
  reference?: string
  labels: EvidenceLabel[]
  /** The description with its leading labels removed */
  note: string
}

const primitives = primitivesJson as TokenTree
const semantic = semanticJson as TokenTree
// Component tokens, so the Contrast page can check every variant x state too.
const componentTrees = Object.values(import.meta.glob('../../tokens/components/*.json', { eager: true, import: 'default' })) as TokenTree[]
const all = { ...flatten(primitives), ...flatten(semantic), ...Object.assign({}, ...componentTrees.map((t) => flatten(t))) }

function describe(tree: TokenTree, prefix = '', out: Record<string, string> = {}) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || typeof node !== 'object' || node === null) continue
    const path = prefix ? `${prefix}.${key}` : key
    if ('$value' in node) out[path] = String((node as { $description?: string }).$description ?? '')
    else describe(node as TokenTree, path, out)
  }
  return out
}
const descriptions = { ...describe(primitives), ...describe(semantic) }

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function info(path: string): TokenInfo {
  const value = all[path]
  const ref = typeof value === 'string' ? value.match(/^\{(.+)\}$/) : null
  const description = descriptions[path] ?? ''
  const head = description.split(':')[0]
  const labels = EVIDENCE_LABELS.filter((l) => head.split(', ').includes(l))
  return {
    path,
    cssVar: '--' + path.replaceAll('.', '-'),
    value,
    resolved: resolve(path, all),
    reference: ref?.[1],
    labels,
    note: capitalise(labels.length ? description.slice(head.length + 1).trim() : description),
  }
}

/** Every token whose path starts with the prefix, in file order. */
export function tokensUnder(prefix: string, source: 'primitives' | 'semantic'): TokenInfo[] {
  const keys = Object.keys(flatten(source === 'primitives' ? primitives : semantic))
  return keys.filter((k) => k === prefix || k.startsWith(prefix + '.')).map(info)
}

export const allTokens = all

/** A readable string for any token value (shadows, cubic-béziers, dimensions). */
export function formatValue(v: unknown): string {
  if (Array.isArray(v)) return `cubic-bezier(${v.join(', ')})`
  if (v && typeof v === 'object') {
    const s = v as Record<string, string>
    return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`
  }
  return String(v)
}
