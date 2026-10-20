// The footer's content, in AcmeCo's order and words (live site, 2026-10-10), for stories
// and screens (the Footer takes it as props). Addresses are placeholders. Marketplace
// sites open in a new tab, as on AcmeCo. Social and app links are neutral placeholders:
// the providers' marks are licensed artwork (decision 35, E).
import type { FooterColumn, FooterSocialLink } from '../components/Footer/Footer'

const link = (label: string, external = false) => ({ label, href: `#${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, external })

export const footerColumns: FooterColumn[] = [
  { title: 'Search', links: ['Properties For Sale', 'Properties For Lease', 'Businesses For Sale', 'Find a Broker'].map((l) => link(l)) },
  { title: 'Products & Services', links: ['Advertise With Us', 'Listing Tools', 'Help'].map((l) => link(l)) },
  { title: 'Marketplace', links: ['AcmeCo Homes', 'AcmeCo Land', 'AcmeCo Offices', 'AcmeCo Rentals', 'AcmeCo Business', 'AcmeCo Studio', 'AcmeCo Global'].map((l) => link(l, true)) },
  { title: 'Resources', links: ['Contact Us', 'Mobile', 'Site Map', 'Guides', 'Commercial Terms'].map((l) => link(l)) },
  { title: 'Company', links: ['About Us', 'Careers', 'Terms of Use', 'Privacy Notice', 'Cookie Policy', 'Exercise Your Rights', 'Licensing', 'Accessibility Commitment'].map((l) => link(l)) },
]

export const footerSocial: FooterSocialLink[] = [
  { name: 'LinkedIn', mark: 'in', href: '#linkedin' },
  { name: 'Facebook', mark: 'f', href: '#facebook' },
  { name: 'Instagram', mark: 'IG', href: '#instagram' },
  { name: 'YouTube', mark: 'YT', href: '#youtube' },
  { name: 'TikTok', mark: 'TT', href: '#tiktok' },
]

export const footerApps = [
  { label: 'Download on the App Store', href: '#app-store', external: true },
  { label: 'Get it on Google Play', href: '#google-play', external: true },
]

// On phones AcmeCo shows one list in place of the columns (a phone recording, 2026-10-11).
export const footerPhoneLinks = ['About Us', 'Careers', 'Contact Us', 'Search', 'Find a Broker', 'Product Overview', 'Mobile', 'Terms of Use', 'Privacy Notice', 'Cookie Policy', 'Exercise Your Rights', 'Licensing'].map((l) => link(l))
