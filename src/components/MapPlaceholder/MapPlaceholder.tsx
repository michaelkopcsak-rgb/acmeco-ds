import type { CSSProperties } from 'react'
import { Badge } from '../Badge/Badge'
import styles from './MapPlaceholder.module.css'
import { ds } from '../ds'

export interface MapPin {
  id: string
  /** Position across the map, 0 (left) to 1 (right). */
  x: number
  /** Position down the map, 0 (top) to 1 (bottom). */
  y: number
}

export interface MapPlaceholderProps {
  /** What the map would show, read by screen readers ("Map of 8 listings in Denver (placeholder)"). */
  label: string
  /** The listings' pins (fixture listings carry a map position). */
  pins: MapPin[]
  /** The drawing to show (screens pass mapIllustration() from src/data/illustrations). */
  image?: string
}

/**
 * A stand-in where a screen shows a map: a drawn map with the listings as dark blue pins and a
 * visible "Map placeholder" label (decision 39). It doesn't pan, zoom or link: there's no
 * live map provider in the prototype. Beside a list on wide screens it fills the window's
 * height and stays put while the list scrolls; below 1024px it's a band above the list.
 */
export function MapPlaceholder({ label, pins, image }: MapPlaceholderProps) {
  const style = image ? ({ backgroundImage: `url("${image}")` } as CSSProperties) : undefined
  return (
    <div className={styles.map} style={style} role="img" aria-label={label} {...ds({ set: 'Map placeholder', props: { Drawing: image ? 'Yes' : 'No' }, ...(image ? { image: 'm03' } : {}) })}>
      {pins.map((p) => (
        <span key={p.id} {...ds({ set: 'Map pin', props: { Variant: 'Default' }, overlay: true })} className={styles.pin} style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` } as CSSProperties} />
      ))}
      <span className={styles.label}><Badge tone="neutral">Map placeholder</Badge></span>
    </div>
  )
}
