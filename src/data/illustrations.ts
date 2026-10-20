// Illustrative placeholder photos: simple drawings of buildings under a sky,
// generated from a seed, so stories and pages never use real photography.
// Returned as SVG data URLs, so components receive ordinary image URLs exactly
// as they would with real photos. Adapted from the audit prototype's PropertyImage.
//
// These colours are illustration content, not UI, so they aren't design tokens.

const SKIES: [string, string][] = [['#cfe3f5', '#eef5fb'], ['#f6dcc3', '#fbefe2'], ['#d9e7dc', '#f1f6f2'], ['#e3dcf3', '#f4f1fa']]
const BUILDINGS = ['#8d99a6', '#b7a58f', '#6f7f8f', '#a39a92', '#7d8a7c', '#9aa3b5']
const WINDOW = '#e8eef4'

export function buildingIllustration(seed: number): string {
  const sky = SKIES[seed % SKIES.length]
  const blocks = Array.from({ length: 4 }, (_, i) => ({
    x: 4 + i * 25 + ((seed * (i + 3)) % 7),
    w: 18 + ((seed + i * 7) % 9),
    h: 24 + ((seed * (i + 2)) % 30),
    c: BUILDINGS[(seed + i) % BUILDINGS.length],
  }))
  const windows = blocks.flatMap((b) =>
    Array.from({ length: Math.floor(b.h / 8) }, (_, row) =>
      Array.from({ length: Math.floor(b.w / 6) }, (_, col) =>
        `<rect x="${b.x + 2 + col * 6}" y="${62 - b.h + 3 + row * 8}" width="3" height="4" fill="${WINDOW}" opacity=".7"/>`,
      ).join(''),
    ),
  )
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 66" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="s" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
<rect width="100" height="66" fill="url(#s)"/>
${blocks.map((b) => `<rect x="${b.x}" y="${62 - b.h}" width="${b.w}" height="${b.h}" fill="${b.c}"/>`).join('')}
${windows.join('')}
<rect y="62" width="100" height="4" fill="#9aa59a"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// An illustrative placeholder map: land, a river, parks and a street grid, generated from a
// seed, for screens that would show a map (decision 39). There is no live map provider in
// the prototype, and map tiles are licensed artwork, so this stands in. Illustration
// content, not UI, so not design tokens.
const LAND = '#eef0ea', WATER = '#c9dcec', PARK = '#d6e5cc', ROAD = '#ffffff', ROAD_EDGE = '#d9dcd5', HIGHWAY = '#f3e3b5'

export function mapIllustration(seed = 1): string {
  const r = (i: number, span: number) => ((seed * 9301 + i * 49297) % 233280) / 233280 * span
  const streets = [
    ...Array.from({ length: 9 }, (_, i) => `M${8 + i * 11 + r(i, 3)} 0 L${6 + i * 11 + r(i + 20, 4)} 100`),
    ...Array.from({ length: 9 }, (_, i) => `M0 ${8 + i * 11 + r(i + 40, 3)} L100 ${6 + i * 11 + r(i + 60, 4)}`),
  ]
  const parks = Array.from({ length: 4 }, (_, i) => `<rect x="${10 + r(i + 80, 70)}" y="${10 + r(i + 90, 70)}" width="${6 + r(i + 100, 8)}" height="${5 + r(i + 110, 7)}" rx="1.5" fill="${PARK}"/>`)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
<rect width="100" height="100" fill="${LAND}"/>
${parks.join('')}
<path d="M-5 ${30 + r(1, 10)} C 25 ${20 + r(2, 15)}, 40 ${55 + r(3, 10)}, 60 ${45 + r(4, 10)} S 90 ${70 + r(5, 10)}, 105 ${60 + r(6, 10)}" stroke="${WATER}" stroke-width="5" fill="none"/>
<g stroke="${ROAD_EDGE}" stroke-width="1.6" fill="none">${streets.map((d) => `<path d="${d}"/>`).join('')}</g>
<g stroke="${ROAD}" stroke-width="1" fill="none">${streets.map((d) => `<path d="${d}"/>`).join('')}</g>
<path d="M0 ${70 + r(7, 8)} L100 ${25 + r(8, 8)}" stroke="${HIGHWAY}" stroke-width="2.4" fill="none"/>
<path d="M${40 + r(9, 10)} 0 L${55 + r(10, 10)} 100" stroke="${HIGHWAY}" stroke-width="2.4" fill="none"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
