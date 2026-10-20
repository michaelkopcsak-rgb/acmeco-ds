// Renders the listings' placeholder photos (src/data/illustrations.ts, the same drawings
// the code shows) and the sign-in promo's first picture to PNG for Figma image fills, and writes figma/images/manifest.json
// with each image's hash (Figma names an image by the SHA-1 of its bytes), so specs can
// refer to a photo by listing id.
//
//   npx tsx scripts/figma/build-images.mjs   (tsx: the fixtures import without file extensions)
import { createHash } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { listings } from '../../src/data/fixtures.ts'
import { buildingIllustration, mapIllustration } from '../../src/data/illustrations.ts'

// The listings the Figma pages show: the component pages' tiers 1, 2, 3 (l01, l03, l15) and
// the search results screens' office listings for lease (phase 6d); the sign-in promo's
// first slide (SignInDialog's story uses buildingIllustration(3)) at twice its 272 x 248
// size; and the results map's drawing (mapIllustration(3)), large enough to fill the map.
const LISTINGS = ['l01', 'l02', 'l03', 'l05', 'l08', 'l13', 'l15', 'l17', 'l18']
const IMAGES = [
  ...LISTINGS.map((id) => { const l = listings.find((x) => x.id === id); return { id, title: l.title, src: l.photos[0].src, w: 600, h: 396 } }),
  { id: 's01', title: 'Sign-in promo, slide 1', src: buildingIllustration(3), w: 544, h: 496 },
  { id: 'm03', title: 'Results map drawing', src: mapIllustration(3), w: 1600, h: 1200 },
]
const browser = await chromium.launch()
const page = await browser.newPage()
const manifest = {}
for (const { id, title, src, w, h } of IMAGES) {
  await page.setViewportSize({ width: w, height: h })
  await page.setContent(`<body style="margin:0"><img src="${src}" style="display:block;width:${w}px;height:${h}px;object-fit:cover"></body>`)
  await page.waitForLoadState('load')
  const png = await page.screenshot({ type: 'png' })
  await writeFile(`figma/images/${id}.png`, png)
  manifest[id] = { title, hash: createHash('sha1').update(png).digest('hex'), bytes: png.length }
}
await browser.close()
await writeFile('figma/images/manifest.json', JSON.stringify({ $description: 'Placeholder photos for Figma image fills, rendered from src/data/illustrations.ts by scripts/figma/build-images.mjs. hash = SHA-1 of the PNG, which is how Figma names an image.', images: manifest }, null, 1) + '\n')
console.log(manifest)
