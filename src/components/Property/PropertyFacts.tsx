import type { Price } from '../../data/types'
import { PropertyPrice } from './PropertyPrice'
import styles from './Property.module.css'

export interface PropertyFactsProps {
  /** Shown first, in the semibold price style (decision 27). */
  price: Price
  /** Short facts in AcmeCo's wording: "Built in 1963", "253 - 8,024 SF". */
  facts: string[]
  /** One or two sentences beside the facts (tiers 1 and 2). */
  description?: string
  /** Where the description goes: `beside` the facts (tier 1) or `below` them (tier 2's narrow column). */
  descriptionPlacement?: 'beside' | 'below'
}

/** The facts list, with the price lifted to the top, and an optional description beside it. */
export function PropertyFacts({ price, facts, description, descriptionPlacement = 'beside' }: PropertyFactsProps) {
  const layout = !description ? '' : descriptionPlacement === 'below' ? styles.factsDescriptionBelow : styles.factsWithDescription
  return (
    // The wrapper is a size container, so a description beside the facts can move below them when space is narrow.
    <div className={styles.factsContainer}>
      <div className={layout ? `${styles.facts} ${layout}` : styles.facts}>
        <ul className={styles.factList}>
          <li><PropertyPrice price={price} /></li>
          {facts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  )
}
