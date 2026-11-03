import { afterAll, beforeAll, expect, test } from 'bun:test'
import { serveFixture, type FixtureServer } from './support/browser.js'

let fixture: FixtureServer

beforeAll(async () => {
  fixture = await serveFixture('menu')
}, 60_000)

afterAll(() => fixture?.close())

for (const formats of ['one', 'several'] as const)
  test(`the More menu draws Import, Export and Settings icons at one size and colour with ${formats} export format${formats === 'one' ? '' : 's'}`, async () => {
    const page = await fixture.browser.newPage({ viewport: { width: 1000, height: 700 } })
    await page.goto(`${fixture.url}?formats=${formats}`)
    await page.waitForTimeout(500)
    const more = (await page.getByRole('button', { name: 'More' }).boundingBox())!
    await page.mouse.click(more.x + more.width / 2, more.y + more.height / 2)
    await page.waitForTimeout(900)
    const icons = await page.evaluate(() =>
      ['Import', 'Export', 'Settings'].map((label) => {
        const item = Array.from(document.querySelectorAll('[role^=menuitem]')).find((entry) => entry.textContent?.startsWith(label))!
        const svg = item.querySelector('svg')!
        const box = svg.getBoundingClientRect()
        return { label, width: box.width, height: box.height, color: getComputedStyle(svg).color }
      }),
    )
    await page.close()

    expect(new Set(icons.map((icon) => `${icon.width}x${icon.height} ${icon.color}`)).size).toBe(1)
    expect(icons[0]!.width).toBe(16)
  }, 30_000)
