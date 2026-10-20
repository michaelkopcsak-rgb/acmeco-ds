// Text formatting shared by the PropertyCard parts, so a price or size reads the
// same everywhere. AcmeCo's own wording where it was captured ("SF Available",
// "Price Upon Request", "Built in 1963").
import type { Listing, Price } from './types'

const usd = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 })}`

/** The visible price, plus a fuller version for screen readers where units are abbreviated. */
export function priceText(price: Price): { visible: string; spoken?: string; muted?: boolean } {
  switch (price.kind) {
    case 'rate':
      return {
        visible: `${usd(price.amount)} /${price.unit}`,
        spoken: `${usd(price.amount)} per square foot per ${price.unit === 'SF/YR' ? 'year' : 'month'}`,
      }
    case 'total':
      return { visible: usd(price.amount) }
    case 'bid':
      return { visible: `Starting bid ${usd(price.startingBid)}` }
    case 'request':
      return { visible: 'Price Upon Request', muted: true }
  }
}

/** "253 - 8,024 SF" or "6,400 SF", as AcmeCo writes ranges. */
export function sizeRange(size: Listing['size']): string {
  return size.min === size.max ? `${size.max.toLocaleString('en-US')} SF` : `${size.min.toLocaleString('en-US')} - ${size.max.toLocaleString('en-US')} SF`
}

/** The header's right-hand line: "8,024 SF Available", or "21,500 SF Flex for Sale". */
export function sizeAvailable(listing: Pick<Listing, 'size' | 'listingType' | 'type'>): string {
  const sf = `${listing.size.max.toLocaleString('en-US')} SF`
  return listing.listingType === 'sale' ? `${sf} ${listing.type} for Sale` : `${sf} Available`
}

export const cityLine = (l: Pick<Listing, 'city' | 'state' | 'zip'>) => `${l.city}, ${l.state} ${l.zip}`
