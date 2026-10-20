// Domain model. SYNTHETIC data only: shapes follow what the audit observed on
// AcmeCo's public pages (property types, price units, listing tiers, broker
// contacts), never real AcmeCo data. Adapted from the audit prototype.

export type ListingType = 'lease' | 'sale' | 'auction'
export type PropertyType = 'Office' | 'Retail' | 'Industrial' | 'Flex' | 'Coworking' | 'Medical'

/**
 * AcmeCo's listing tiers (its own card classes: tier1, tier2, tier3).
 * 1: full-width photo; 2: photo beside the details; 3: compact, no description or broker photos.
 */
export type ListingTier = 1 | 2 | 3

export type Price =
  | { kind: 'rate'; amount: number; unit: 'SF/YR' | 'SF/MO' }
  | { kind: 'total'; amount: number }
  | { kind: 'request' }
  | { kind: 'bid'; startingBid: number }

export interface Space {
  name: string
  size: number
  rate: Price
  use: PropertyType
  available: string
}

export interface Broker {
  id: string
  name: string
  title: string
  company: string
  phone: string
  initials: string
  /** Picks one of a few illustrative avatar tints. */
  tone: number
  /** For a broker's profile page (SYNTHETIC): where they work, the property types and markets they cover, a short bio. */
  city?: string
  propertyTypes?: PropertyType[]
  markets?: string[]
  bio?: string
}

export interface Photo {
  src: string
  alt: string
}

export interface Listing {
  id: string
  title: string
  address: string
  city: string
  state: string
  zip: string
  type: PropertyType
  listingType: ListingType
  tier: ListingTier
  price: Price
  size: { min: number; max: number }
  builtYear: number
  floors: number
  highlights: string[]
  description: string
  features: string[]
  spaces: Space[]
  virtualTour: boolean
  auctionDate?: string
  /** 1 to 3 brokers (AcmeCo's contact-count-1/2/3); the first is the lead. */
  brokerIds: string[]
  /** The listing company, shown as its logo. */
  company: string
  photos: Photo[]
  /** Position on an illustrative map, 0..1 (for later). */
  map: { x: number; y: number }
  listedDaysAgo: number
}
