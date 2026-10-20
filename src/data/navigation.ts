// Site navigation content for stories and screens (not for components: they take it as props).
import type { NavigationLink } from '../components/NavigationBar/NavigationBar'

// AcmeCo's header search links, in order and in its words (audit F32 / F33). The addresses
// are placeholders: the prototype has no real pages behind them.
export const searchLinks: NavigationLink[] = [
  { label: 'For Lease', href: '#for-lease' },
  { label: 'For Sale', href: '#for-sale' },
  { label: 'Auctions', href: '#auctions' },
  { label: 'Businesses For Sale', href: '#businesses-for-sale' },
]
