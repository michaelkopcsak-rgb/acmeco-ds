import type { ReactNode } from 'react'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'subtle' | 'auction' | 'feature'

export interface BadgeProps {
  /** Short label text, as written (no forced capitals, except the feature tone). */
  children: ReactNode
  /**
   * neutral: translucent white pill over photos ("Office"). subtle: grey pill on white surfaces.
   * auction: navy pill. feature: the square dark blue label attached to a photo corner ("Virtual Tour").
   */
  tone?: BadgeTone
}

/** A label, not a control: it isn't focusable or clickable. Its text is read as part of the content around it. */
export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
