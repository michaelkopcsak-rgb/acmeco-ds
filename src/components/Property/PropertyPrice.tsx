import { priceText } from '../../data/format'
import type { Price } from '../../data/types'
import styles from './Property.module.css'

export interface PropertyPriceProps {
  price: Price
  /** compact: the first fact on a card. prominent: the property detail page. */
  size?: 'compact' | 'prominent'
}

/** A listing's price. "Price Upon Request" is shown in grey so real prices stand out; abbreviated units are spelled out for screen readers. */
export function PropertyPrice({ price, size = 'compact' }: PropertyPriceProps) {
  const { visible, spoken, muted } = priceText(price)
  const className = [styles.price, size === 'prominent' && styles.priceProminent, muted && styles.priceMuted].filter(Boolean).join(' ')
  return (
    <span className={className}>
      {spoken ? (
        <>
          <span aria-hidden="true">{visible}</span>
          <span className="sr-only">{spoken}</span>
        </>
      ) : (
        visible
      )}
    </span>
  )
}
