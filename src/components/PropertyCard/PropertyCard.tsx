import { useId } from 'react'
import { cityLine, priceText, sizeAvailable, sizeRange } from '../../data/format'
import type { Broker, Listing, ListingTier } from '../../data/types'
import { Badge } from '../Badge/Badge'
import { BrokerIdentity } from '../Property/BrokerIdentity'
import { PropertyFacts } from '../Property/PropertyFacts'
import { PropertyHeader } from '../Property/PropertyHeader'
import { PropertyMedia } from '../Property/PropertyMedia'
import styles from './PropertyCard.module.css'
import { ds } from '../ds'

export interface PropertyCardProps {
  listing: Listing
  /** The listing's brokers (AcmeCo's contact-count: up to three are shown), the lead first. */
  brokers: Broker[]
  /** The listing's page. The title is the card's one link, stretched over the whole card (decision 27). */
  href: string
  /** AcmeCo's listing tier sets the layout. Defaults to the listing's own tier. */
  tier?: ListingTier
  /** The title's heading level in the page outline (h3 in a results list under an h2). */
  headingLevel?: 2 | 3 | 4
  saved?: boolean
  /** Shows the save toggle on the photo. */
  onSaveChange?: (saved: boolean) => void
  /** Shows "Ask AcmeCo about …" on the photo, beside Save: the page opens the AI assistant with a question about this listing (a proposal, decision 45). */
  onAsk?: () => void
}

/** Facts after the price, in AcmeCo's wording. Tier 3 has no description, so it lists more. */
function factsFor(listing: Listing, tier: ListingTier): string[] {
  const facts = [`Built in ${listing.builtYear}`, sizeRange(listing.size)]
  if (tier === 3 && listing.spaces.length > 0) {
    facts.push(`${listing.spaces.length} ${listing.spaces.length === 1 ? 'Space' : 'Spaces'} Available`)
  }
  return facts
}

/**
 * A listing in search results: AcmeCo's "card". The tier (1, 2, 3) decides how much
 * it shows, as on AcmeCo. One link (the title) covers the card; the save toggle and
 * photo arrows stay separately usable above it.
 */
export function PropertyCard({ listing, brokers, href, tier = listing.tier, headingLevel = 3, saved, onSaveChange, onAsk }: PropertyCardProps) {
  const titleId = useId()
  const header = (
    <PropertyHeader
      id={titleId}
      title={listing.title}
      href={href}
      address={listing.address}
      sizeText={sizeAvailable(listing)}
      location={cityLine(listing)}
      headingLevel={headingLevel}
      layout={tier === 3 ? 'compact' : 'row'}
      stretchLink
    />
  )
  const media = (
    <PropertyMedia
      photos={listing.photos}
      title={listing.title}
      showCarousel={tier !== 3}
      saved={saved}
      onSaveChange={onSaveChange}
      onAsk={onAsk}
      labels={tier !== 3 ? <Badge>{listing.type}</Badge> : undefined}
      feature={tier !== 3 && listing.virtualTour ? <Badge tone="feature">Virtual Tour</Badge> : undefined}
    />
  )
  const facts = (
    <PropertyFacts
      price={listing.price}
      facts={factsFor(listing, tier)}
      description={tier === 3 ? undefined : listing.description}
      descriptionPlacement={tier === 2 ? 'below' : 'beside'}
    />
  )

  // For the Figma screen generator: the card's set and variant, and what each nested part shows.
  const facts3 = factsFor(listing, tier)
  const brokerText: Record<string, string> = { Company: listing.company }
  brokers.forEach((b, i) => { brokerText[`Broker ${i + 1}`] = b.name; brokerText[`Initials ${i + 1}`] = b.initials })
  const mark = ds({
    set: 'Property card',
    props: { Tier: String(tier), Width: 'Wide' },
    image: listing.id,
    nested: {
      Header: { text: { Title: listing.title, Address: listing.address, Location: cityLine(listing), ...(tier !== 3 ? { Size: sizeAvailable(listing) } : {}) } },
      Facts: { text: { 'Fact 1': facts3[0], 'Fact 2': facts3[1], ...(facts3[2] ? { 'Fact 3': facts3[2] } : {}), ...(tier !== 3 ? { Description: listing.description } : {}) }, bools: { 'Show fact 3': !!facts3[2] } },
      Brokers: { text: brokerText },
      Media: { bools: { 'Show ask': !!onAsk, ...(tier !== 3 ? { 'Show feature': !!listing.virtualTour } : {}) }, props: { Saved: saved ? 'Yes' : 'No' } },
    },
    layers: { Amount: priceText(listing.price).visible, ...(tier !== 3 ? { 'Labels>Label': listing.type } : {}) },
  })

  // The header comes first in the DOM in every tier, so screen readers meet the title
  // first; the grid places the photo first on screen in tier 3.
  return (
    <article className={`${styles.card} ${styles[`tier${tier}`]}`} aria-labelledby={titleId} {...mark}>
      <div className={styles.layout}>
        <div className={styles.header}>{header}</div>
        <div className={styles.media}>{media}</div>
        <div className={styles.body}>
          {facts}
          {tier !== 3 && (
            <BrokerIdentity
              company={listing.company}
              brokers={brokers}
              names={tier === 2 && brokers.length > 1 ? 'hidden' : 'visible'}
              layout={tier === 2 ? 'stacked' : 'row'}
            />
          )}
        </div>
        {tier === 3 && (
          <div className={styles.logo}>
            <BrokerIdentity company={listing.company} brokers={[]} />
          </div>
        )}
      </div>
    </article>
  )
}
