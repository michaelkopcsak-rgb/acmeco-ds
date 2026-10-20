// The header menu's links, in AcmeCo's order and words (live site, 2026-10-10), for
// stories and screens. Addresses are placeholders: the prototype has no pages behind them.
import type { SiteMenuLink } from '../components/SiteMenu/SiteMenu'

export const menuLinksBefore: SiteMenuLink[] = [
  { label: 'Explore Marketing Solutions', href: '#marketing-solutions' },
  { label: 'Advertise', href: '#advertise' },
  // Opens AcmeCo's listing manager in a new window, as on the live site.
  { label: 'Marketing Center', href: '#marketing-center', external: true },
]

export const menuSearchLinks: SiteMenuLink[] = [
  { label: 'For Lease', href: '#for-lease' },
  { label: 'For Sale', href: '#for-sale' },
  { label: 'Auctions', href: '#auctions' },
  { label: 'Businesses', href: '#businesses-for-sale' },
  { label: 'Find a Broker', href: '#find-a-broker' },
]

export const menuLinksAfter: SiteMenuLink[] = [
  { label: 'Preferences', href: '#preferences' },
  { label: 'Help Center', href: '#help' },
]
