import { useState, type ReactNode } from 'react'
import type { Photo } from '../../data/types'
import { ChevronLeft, ChevronRight, Heart, Sparkles } from '../../icons'
import { IconButton } from '../IconButton/IconButton'
import styles from './Property.module.css'

export interface PropertyMediaProps {
  photos: Photo[]
  /** The listing's title: names the carousel ("Photos of …") and the save button ("Save …"). */
  title: string
  /** Show previous / next buttons (photos larger than a thumbnail). */
  showCarousel?: boolean
  saved?: boolean
  /** When set, shows the save toggle in the top-right corner. */
  onSaveChange?: (saved: boolean) => void
  /** When set, shows "Ask AcmeCo about …" beside the save toggle: it opens the AI assistant with a question about this listing (a proposal, decision 45). */
  onAsk?: () => void
  /** Badges in the top-left corner ("Office"). */
  labels?: ReactNode
  /** A feature label flush in the bottom-left corner ("Virtual Tour"). */
  feature?: ReactNode
  /** thumb: a small rounded thumbnail (tier 3). */
  variant?: 'photo' | 'thumb'
}

/**
 * A listing's photos: one at a time, with previous / next, the save toggle and
 * labels on top. It fills its container; the card decides the size.
 * Screen readers hear "Photos of …, carousel" and "Photo 2 of 12" when it changes.
 */
export function PropertyMedia({ photos, title, showCarousel = true, saved = false, onSaveChange, onAsk, labels, feature, variant = 'photo' }: PropertyMediaProps) {
  const [index, setIndex] = useState(0)
  const count = photos.length
  const photo = photos[index]
  const step = (by: number) => setIndex((i) => (i + by + count) % count)
  const carousel = showCarousel && count > 1
  return (
    <div
      className={variant === 'thumb' ? `${styles.media} ${styles.thumb}` : styles.media}
      role="group"
      aria-roledescription="carousel"
      aria-label={`Photos of ${title}`}
    >
      {photo && <img className={styles.photo} src={photo.src} alt={photo.alt} />}
      {labels && <div className={styles.mediaLabels}>{labels}</div>}
      {feature && <div className={styles.mediaFeature}>{feature}</div>}
      {(onSaveChange || onAsk) && (
        <span className={styles.mediaSave}>
          {onAsk && <IconButton variant="overlay" size="sm" label={`Ask AcmeCo about ${title}`} icon={<Sparkles />} onPress={onAsk} />}
          {onSaveChange && <IconButton variant="overlay" size="sm" label={`Save ${title}`} icon={<Heart />} isSelected={saved} onChange={onSaveChange} />}
        </span>
      )}
      {carousel && (
        <>
          <span className={styles.mediaPrev}>
            <IconButton variant="overlay" size="sm" label="Previous photo" icon={<ChevronLeft />} onPress={() => step(-1)} />
          </span>
          <span className={styles.mediaNext}>
            <IconButton variant="overlay" size="sm" label="Next photo" icon={<ChevronRight />} onPress={() => step(1)} />
          </span>
          {/* Announced when the photo changes; no visible counter (AcmeCo shows none). */}
          <span className="sr-only" aria-live="polite">Photo {index + 1} of {count}</span>
        </>
      )}
    </div>
  )
}
