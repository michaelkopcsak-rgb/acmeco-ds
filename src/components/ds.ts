import { isValidElement, type ReactNode } from 'react'
import { icons } from '../icons'

// Markers for the Figma screen generator (phase 6d, decision 34): each component tags its
// rendered root with the Figma library set and variant it looks like, and the text it shows,
// so scripts/figma/screen-spec.mjs can turn a rendered page into library instances. They
// change nothing on the page (data attributes only).

export interface DsMark {
  /** The Figma component set ("Filter button"). */
  set: string
  /** Its variant ({ Kind: 'Set', State: 'Default' }). */
  props: Record<string, string>
  /** The set's TEXT properties ({ Label: 'Save Search' }). */
  text?: Record<string, string>
  /** Its BOOLEAN properties ({ 'Show icon': true }). */
  bools?: Record<string, boolean>
  /** Text layers to rewrite, by layer name ({ Value: 'For Lease' }), or a path through named layers ({ 'Labels>Label': 'Office' }). */
  layers?: Record<string, string>
  /** Nested instances, by layer name: their own text, booleans and variant props. */
  nested?: Record<string, { text?: Record<string, string>; bools?: Record<string, boolean>; props?: Record<string, string> }>
  /** INSTANCE_SWAP icon properties ({ Icon: 'check' }). */
  icons?: Record<string, string>
  /** A placeholder picture by id (figma/images), for the instance's image fill. */
  image?: string
  /** An icon drawn before the instance (a Link with an icon: Figma's Link has none). */
  before?: string
  /** Placed even inside another instance (a map's pins over the map). */
  overlay?: boolean
}

export const ds = (mark: DsMark) => ({ 'data-ds': JSON.stringify(mark) })

/** Text in a type style: the Figma text style and colour variable. */
export const dsText = (style: string, color: string) => ({ 'data-ds-text': JSON.stringify({ style, color }) })

/** A strip or column background: its fill variable, and a line under it. */
export const dsFrame = (fill: string, divider?: boolean) => ({ 'data-ds-frame': JSON.stringify({ fill, divider: !!divider }) })

/** The registry name of an icon element (<Map />), for icon properties. */
export function iconName(node: ReactNode): string | undefined {
  if (!isValidElement(node)) return undefined
  return Object.entries(icons).find(([, c]) => c === node.type)?.[0]
}

/** Plain text of simple children ("Save Search"); undefined for anything richer. */
export const plain = (node: ReactNode): string | undefined => (typeof node === 'string' || typeof node === 'number' ? String(node) : undefined)
