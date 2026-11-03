import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { serveFixture, type FixtureServer } from './support/browser.js'

let fixture: FixtureServer

beforeAll(async () => {
  fixture = await serveFixture('selection')
}, 60_000)

afterAll(() => fixture?.close())

async function selectionWidths(query: string, viewport: number, rows: string) {
  const page = await fixture.browser.newPage({ viewport: { width: viewport, height: 800 } })
  await page.goto(`${fixture.url}?${query}`)
  await page.waitForSelector(rows)
  await page.waitForTimeout(500)
  const measure = () =>
    page.evaluate(() =>
      Array.from(document.querySelectorAll('table tr')).map((row) => Math.round(row.children[0]!.getBoundingClientRect().width * 10) / 10),
    )
  const first = await measure()
  await page.setViewportSize({ width: viewport - 300, height: 800 })
  await page.waitForTimeout(300)
  const narrower = await measure()
  await page.close()
  return [...first, ...narrower]
}

const themed = { kyroui: 48, mui: 52 }

for (const renderer of ['kyroui', 'mui'] as const) {
  describe(`the ${renderer} renderer's selection column`, () => {
    for (const widths of ['auto', 'explicit'] as const)
      test(`is its theme's checkbox cell width (${themed[renderer]}px) in every header and body cell with ${widths} column widths, before and after a resize`, async () => {
        const cells = await selectionWidths(`renderer=${renderer}&widths=${widths}`, 1100, 'tbody tr td input[type=checkbox], tbody tr td [role=checkbox]')

        expect(cells.length).toBeGreaterThan(10)
        expect(new Set(cells)).toEqual(new Set([themed[renderer]]))
      }, 30_000)

    test(`is its theme's checkbox cell width (${themed[renderer]}px) on the loading skeleton rows`, async () => {
      const cells = await selectionWidths(`renderer=${renderer}&loading=1`, 1100, '.KyroTable-skeletonRow')

      expect(cells.length).toBeGreaterThan(3)
      expect(new Set(cells)).toEqual(new Set([themed[renderer]]))
    }, 30_000)
  })
}
