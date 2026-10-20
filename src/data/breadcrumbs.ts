// The breadcrumb trails the screens show (decision 47), in AcmeCo's wording: the space type,
// the state, the city, then the page. Fixture places only (Denver, Colorado).
import type { BreadcrumbItem } from '../components/Breadcrumbs/Breadcrumbs'
import type { Listing } from './types'

const STATES: Record<string, string> = { CO: 'Colorado' }
const stateName = (code: string) => STATES[code] ?? code
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/** A listing's trail: Office Spaces / Colorado / Denver / its address (AcmeCo's property page). */
export function listingTrail(listing: Listing): BreadcrumbItem[] {
  return [
    { label: `${listing.type} Spaces`, href: `#${slug(listing.type)}-spaces` },
    { label: stateName(listing.state), href: `#${slug(stateName(listing.state))}` },
    { label: listing.city, href: `#${slug(listing.city)}` },
    { label: `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}` },
  ]
}

/** A search's trail: AcmeCo / USA / Colorado / the search (the end of AcmeCo's results list). */
export function searchTrail(city: string, state: string, search: string): BreadcrumbItem[] {
  return [
    { label: 'AcmeCo', href: '#home' },
    { label: 'USA', href: '#usa' },
    { label: stateName(state), href: `#${slug(stateName(state))}` },
    { label: `${search} in ${city}, ${state}` },
  ]
}

/** One step back: the page the visitor came from, then this one (a broker's page from a listing). */
export const backTrail = (from: { label: string; href: string }, here: string): BreadcrumbItem[] => [from, { label: here }]
