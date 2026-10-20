// Label / value facts for FactList (decision 47), from a listing's fixture data. The labels
// are AcmeCo's; values come only from fields the fixtures have (no subtype or parking yet).
// Prices carry spoken units, as PropertyPrice does.
import type { Fact } from '../components/FactList/FactList'
import { priceText, sizeRange } from './format'
import type { Listing, Space } from './types'

const sf = (n: number) => `${n.toLocaleString('en-US')} SF`

/** A listing's Property Facts. `listedOn` is the formatted date it came on the market. */
export function propertyFacts(listing: Listing, listedOn: string): Fact[] {
  return [
    { label: 'Total Space', value: sizeRange(listing.size) },
    { label: 'Property Type', value: listing.type },
    { label: 'Year Built', value: String(listing.builtYear) },
    { label: 'Floors', value: String(listing.floors) },
    { label: 'Date on Market', value: listedOn },
  ]
}

/** One space's facts, for its card on phones. */
export function spaceFacts(space: Space): Fact[] {
  const rate = priceText(space.rate)
  return [
    { label: 'Size', value: sf(space.size) },
    { label: 'Rental Rate', value: rate.spoken ? <><span aria-hidden="true">{rate.visible}</span><span className="sr-only">{rate.spoken}</span></> : rate.visible },
    { label: 'Space Use', value: space.use },
    { label: 'Availability', value: space.available },
  ]
}

/** The spaces table's columns, as AcmeCo heads them (Details holds each row's button). */
export const spaceColumns = [
  { id: 'space', label: 'Space', isRowHeader: true },
  { id: 'size', label: 'Size' },
  { id: 'rate', label: 'Rental Rate' },
  { id: 'use', label: 'Space Use' },
  { id: 'available', label: 'Available' },
  { id: 'details', label: 'Details', hideLabel: true },
]

/** One space's cells for the spaces table (all but Details, which the screen supplies). */
export function spaceCells(space: Space) {
  const facts = Object.fromEntries(spaceFacts(space).map((f) => [f.label, f.value]))
  return { space: space.name, size: facts['Size'], rate: facts['Rental Rate'], use: space.use, available: space.available }
}
