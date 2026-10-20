// SYNTHETIC fixtures. Street names, companies and people are invented; no real
// listings, brokers or photos. Adapted from the audit prototype's fixtures, with
// AcmeCo's listing tiers (1/2/3) and 1-3 brokers per listing added.
import { buildingIllustration } from './illustrations'
import type { Broker, Listing, ListingTier, Price, PropertyType, Space } from './types'

export const brokers: Broker[] = [
  { id: 'b1', name: 'Jordan Ellis', title: 'Senior Vice President', company: 'Summit Ridge Realty', phone: '(303) 555-0142', initials: 'JE', tone: 0, city: 'Denver, CO 80202', propertyTypes: ['Office', 'Coworking', 'Retail'], markets: ['Denver', 'Boulder', 'Aurora'], bio: 'Jordan Ellis leads office leasing for Summit Ridge Realty, representing landlords and tenants across downtown Denver and the Front Range. This bio is synthetic placeholder copy.' },
  { id: 'b2', name: 'Priya Natarajan', title: 'Leasing Director', company: 'Cedar & Pine Commercial', phone: '(303) 555-0187', initials: 'PN', tone: 1, city: 'Denver, CO 80205', propertyTypes: ['Office', 'Retail', 'Medical'], markets: ['Denver', 'Lakewood', 'Englewood'], bio: 'Priya Natarajan directs leasing for Cedar & Pine Commercial, with a focus on creative office and neighbourhood retail. This bio is synthetic placeholder copy.' },
  { id: 'b3', name: 'Marcus Webb', title: 'Principal', company: 'Front Range Partners', phone: '(720) 555-0113', initials: 'MW', tone: 2, city: 'Denver, CO 80216', propertyTypes: ['Industrial', 'Flex'], markets: ['Denver', 'Commerce City', 'Aurora'], bio: 'Marcus Webb is a principal at Front Range Partners, advising owners and occupiers of industrial and flex space along the I-70 and I-25 corridors. This bio is synthetic placeholder copy.' },
  { id: 'b4', name: 'Elena Ruiz', title: 'Associate Broker', company: 'Ironwood Property Group', phone: '(720) 555-0168', initials: 'ER', tone: 3, city: 'Englewood, CO 80111', propertyTypes: ['Office', 'Medical', 'Coworking'], markets: ['Denver Tech Center', 'Greenwood Village', 'Englewood'], bio: 'Elena Ruiz is an associate broker at Ironwood Property Group, working with tenants in the Denver Tech Center and the southeast suburbs. This bio is synthetic placeholder copy.' },
  { id: 'b5', name: 'Sam Okafor', title: 'Managing Director', company: 'Northline Auctions', phone: '(303) 555-0199', initials: 'SO', tone: 4, city: 'Denver, CO 80202', propertyTypes: ['Retail', 'Industrial'], markets: ['Denver', 'Colorado Springs'], bio: 'Sam Okafor manages auctions for Northline Auctions, guiding sellers and bidders through commercial property sales. This bio is synthetic placeholder copy.' },
];

const rate = (amount: number): Price => ({ kind: 'rate', amount, unit: 'SF/YR' });
const space = (name: string, size: number, r: number | null, use: PropertyType, available = 'Now'): Space => ({ name, size, rate: r ? rate(r) : { kind: 'request' }, use, available });

// Seeds keep the audit prototype's shape (featured, brokerId, photoSeed); the export below
// turns them into tiers, broker lists, a company and illustrated photos.
type Seed = Omit<Listing, 'spaces' | 'highlights' | 'description' | 'features' | 'floors' | 'city' | 'state' | 'tier' | 'brokerIds' | 'company' | 'photos'> & {
  featured: boolean
  brokerId: string
  photoSeed: number
} & Partial<Pick<Listing, 'spaces' | 'highlights' | 'features'>>;
const HIGHLIGHTS: Record<PropertyType, string[]> = {
  Office: ['Floor-to-ceiling windows with mountain views', 'On-site fitness center and bike storage', 'Walkable to light rail and restaurants', 'Flexible floor plates from 1,200 SF'],
  Retail: ['High-visibility corner with signage opportunity', 'Strong daytime population and foot traffic', 'Dedicated parking field', 'Co-tenancy with national grocer'],
  Industrial: ['24 ft clear height', 'Four dock-high doors and one drive-in', 'Fenced yard with trailer parking', 'Quick access to I-70 and I-25'],
  Flex: ['Office and warehouse in one footprint', 'Grade-level loading', 'Heavy power available', 'Mezzanine storage'],
  Coworking: ['Move-in ready private offices', 'Meeting rooms bookable by the hour', 'Staffed reception and mail handling', 'All-inclusive monthly membership'],
  Medical: ['Built-out exam rooms and lab', 'Adjacent to regional hospital campus', 'ADA-compliant entries', 'Ample patient parking'],
};
const FEATURES = ['Fitness Center', 'Bicycle Storage', 'Conference Rooms', 'Air Conditioning', 'Wi-Fi', 'Controlled Access', 'Signage', 'Natural Light', 'Reception', 'Kitchen'];

const seeds: Seed[] = [
  { id: 'l01', title: 'Larkspur Commons', address: '1840 Larkspur Ave', zip: '80202', type: 'Office', listingType: 'lease', price: rate(28.5), size: { min: 1850, max: 12400 }, builtYear: 2008, virtualTour: true, featured: true, brokerId: 'b1', map: { x: .48, y: .42 }, photoSeed: 3, listedDaysAgo: 4 },
  { id: 'l02', title: 'The Foundry Lofts', address: '2525 Quarry St', zip: '80205', type: 'Office', listingType: 'lease', price: rate(32), size: { min: 2200, max: 6800 }, builtYear: 1924, virtualTour: false, featured: true, brokerId: 'b2', map: { x: .55, y: .35 }, photoSeed: 7, listedDaysAgo: 12 },
  { id: 'l03', title: 'Cherry Creek Plaza', address: '410 Aspen Row', zip: '80206', type: 'Retail', listingType: 'lease', price: rate(38), size: { min: 1100, max: 3400 }, builtYear: 1996, virtualTour: true, featured: false, brokerId: 'b2', map: { x: .62, y: .58 }, photoSeed: 11, listedDaysAgo: 3 },
  { id: 'l04', title: 'Platte River Logistics Center', address: '5900 Rail Spur Dr', zip: '80216', type: 'Industrial', listingType: 'lease', price: rate(11.25), size: { min: 18000, max: 64000 }, builtYear: 2019, virtualTour: false, featured: false, brokerId: 'b3', map: { x: .41, y: .18 }, photoSeed: 2, listedDaysAgo: 30 },
  { id: 'l05', title: 'Union Station Suites', address: '1701 Wynkoop Way', zip: '80202', type: 'Coworking', listingType: 'lease', price: { kind: 'request' }, size: { min: 80, max: 5200 }, builtYear: 2014, virtualTour: true, featured: true, brokerId: 'b4', map: { x: .44, y: .38 }, photoSeed: 5, listedDaysAgo: 8 },
  { id: 'l06', title: 'Highlands Medical Pavilion', address: '3300 Tejon Ct', zip: '80211', type: 'Medical', listingType: 'lease', price: rate(29.75), size: { min: 2400, max: 9100 }, builtYear: 2011, virtualTour: false, featured: false, brokerId: 'b1', map: { x: .33, y: .36 }, photoSeed: 9, listedDaysAgo: 21 },
  { id: 'l07', title: 'Santa Fe Arts Building', address: '820 Kalamath St', zip: '80204', type: 'Flex', listingType: 'lease', price: rate(18), size: { min: 3200, max: 11000 }, builtYear: 1962, virtualTour: true, featured: false, brokerId: 'b3', map: { x: .43, y: .6 }, photoSeed: 13, listedDaysAgo: 15 },
  { id: 'l08', title: 'Glendale Office Tower', address: '4600 Cherry Creek Blvd', zip: '80246', type: 'Office', listingType: 'lease', price: rate(26), size: { min: 1500, max: 22000 }, builtYear: 1984, virtualTour: false, featured: false, brokerId: 'b4', map: { x: .7, y: .64 }, photoSeed: 17, listedDaysAgo: 40 },
  { id: 'l09', title: 'Five Points Corner', address: '2700 Welton St', zip: '80205', type: 'Retail', listingType: 'sale', price: { kind: 'total', amount: 1850000 }, size: { min: 6400, max: 6400 }, builtYear: 1931, virtualTour: false, featured: false, brokerId: 'b2', map: { x: .57, y: .3 }, photoSeed: 19, listedDaysAgo: 6 },
  { id: 'l10', title: 'Lowry Business Park — Bldg C', address: '7800 E Hangar Dr', zip: '80230', type: 'Flex', listingType: 'sale', price: { kind: 'total', amount: 4200000 }, size: { min: 21500, max: 21500 }, builtYear: 2001, virtualTour: true, featured: true, brokerId: 'b3', map: { x: .82, y: .44 }, photoSeed: 23, listedDaysAgo: 9 },
  { id: 'l11', title: 'Baker District Mixed-Use', address: '45 Broadway Terrace', zip: '80203', type: 'Retail', listingType: 'auction', price: { kind: 'bid', startingBid: 950000 }, size: { min: 8900, max: 8900 }, builtYear: 1948, virtualTour: false, featured: false, auctionDate: 'Oct 19, 2026', brokerId: 'b5', map: { x: .47, y: .66 }, photoSeed: 29, listedDaysAgo: 2 },
  { id: 'l12', title: 'Commerce City Distribution', address: '6200 Industry Loop', zip: '80022', type: 'Industrial', listingType: 'auction', price: { kind: 'bid', startingBid: 3100000 }, size: { min: 52000, max: 52000 }, builtYear: 1999, virtualTour: false, featured: false, auctionDate: 'Nov 2, 2026', brokerId: 'b5', map: { x: .6, y: .1 }, photoSeed: 31, listedDaysAgo: 5 },
  { id: 'l13', title: 'RiNo Creative Offices', address: '3501 Blake Lane', zip: '80205', type: 'Office', listingType: 'lease', price: rate(34), size: { min: 900, max: 4800 }, builtYear: 2017, virtualTour: true, featured: false, brokerId: 'b1', map: { x: .58, y: .25 }, photoSeed: 37, listedDaysAgo: 1 },
  { id: 'l14', title: 'Speer Professional Building', address: '1200 Speer Pkwy', zip: '80204', type: 'Medical', listingType: 'sale', price: { kind: 'request' }, size: { min: 14200, max: 14200 }, builtYear: 1990, virtualTour: false, featured: false, brokerId: 'b4', map: { x: .4, y: .5 }, photoSeed: 41, listedDaysAgo: 18 },
  { id: 'l15', title: 'Capitol Hill Studio Offices', address: '980 Logan Row', zip: '80203', type: 'Office', listingType: 'lease', price: rate(24.5), size: { min: 650, max: 3100 }, builtYear: 1956, virtualTour: false, featured: false, brokerId: 'b2', map: { x: .53, y: .54 }, photoSeed: 43, listedDaysAgo: 27 },
  { id: 'l16', title: 'Stapleton Flex Yards', address: '8400 Prairie Gate Rd', zip: '80238', type: 'Flex', listingType: 'lease', price: rate(15.5), size: { min: 5000, max: 30000 }, builtYear: 2016, virtualTour: false, featured: false, brokerId: 'b3', map: { x: .78, y: .28 }, photoSeed: 47, listedDaysAgo: 11 },
  { id: 'l17', title: 'Golden Triangle Coworking', address: '1155 Bannock Pl', zip: '80204', type: 'Coworking', listingType: 'lease', price: rate(42), size: { min: 120, max: 2600 }, builtYear: 2020, virtualTour: true, featured: false, brokerId: 'b4', map: { x: .45, y: .52 }, photoSeed: 53, listedDaysAgo: 7 },
  { id: 'l18', title: 'Tech Center Office Campus', address: '7600 Orchard Crest', zip: '80111', type: 'Office', listingType: 'lease', price: rate(27), size: { min: 3000, max: 48000 }, builtYear: 2003, virtualTour: true, featured: true, brokerId: 'b1', map: { x: .74, y: .86 }, photoSeed: 59, listedDaysAgo: 14 },
];

const DESCRIBE = (s: Seed) => `${s.title} offers ${s.size.min === s.size.max ? s.size.min.toLocaleString() : `${s.size.min.toLocaleString()}–${s.size.max.toLocaleString()}`} SF of ${s.type.toLowerCase()} space in ${s.zip === '80111' ? 'the Denver Tech Center' : 'central Denver'}. Built in ${s.builtYear}, the property has been well maintained and positions occupiers close to transit, dining and major arterials. This description is synthetic placeholder copy.`

// Featured listings are tier 1; the last few are tier 3 (basic); the rest tier 2,
// matching the mix on AcmeCo's results page (1 tier 1, 12 tier 2, 6 tier 3).
const tierOf = (s: Seed, i: number): ListingTier => (s.featured ? 1 : i >= seeds.length - 5 ? 3 : 2)

export const listings: Listing[] = seeds.map((s, i) => {
  const tier = tierOf(s, i)
  const lead = brokers.findIndex((b) => b.id === s.brokerId)
  // Tier 1 shows 3 brokers; tier 2 shows 1 to 3; tier 3 shows none (AcmeCo's contact-count).
  const contactCount = tier === 1 ? 3 : tier === 2 ? 1 + (i % 3) : 1
  const brokerIds = Array.from({ length: contactCount }, (_, k) => brokers[(lead + k) % brokers.length].id)
  const photoCount = 6 + (i % 7)
  const { featured: _featured, brokerId: _brokerId, photoSeed, ...rest } = s
  return {
    ...rest,
    tier,
    city: 'Denver',
    state: 'CO',
    floors: 1 + ((photoSeed * 7) % 9),
    brokerIds,
    company: brokers[lead].company,
    photos: Array.from({ length: photoCount }, (_, f) => ({
      src: buildingIllustration(photoSeed + f * 5),
      alt: `Illustration of ${s.title}, photo ${f + 1} of ${photoCount} (placeholder, not a real photo)`,
    })),
    highlights: s.highlights ?? HIGHLIGHTS[s.type],
    features: s.features ?? FEATURES.filter((_, k) => (k + i) % 3 !== 0),
    description: DESCRIBE(s),
    spaces: s.spaces ?? (s.listingType === 'lease'
      ? Array.from({ length: 2 + (i % 4) }, (_, k) => space(`Floor ${k + 2}, Suite ${200 + k * 50}`, Math.round(s.size.min + (s.size.max - s.size.min) * (k / 4)), s.price.kind === 'rate' ? s.price.amount + (k % 2) : null, s.type, k === 0 ? 'Now' : `${30 * k} days`))
      : []),
  }
})

export const brokerById = (id: string): Broker => {
  const broker = brokers.find((b) => b.id === id)
  if (!broker) throw new Error(`Unknown broker ${id}`)
  return broker
}
