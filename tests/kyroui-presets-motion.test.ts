import { afterAll, beforeAll, expect, test } from 'bun:test'
import { serveFixture, type FixtureServer } from './support/browser.js'

let fixture: FixtureServer

beforeAll(async () => {
  fixture = await serveFixture('presets')
}, 60_000)

afterAll(() => fixture?.close())

for (const view of ['Active', 'All'] as const) {
  test(`picking the ${view} view slides its pill without the table's re-render holding a frame back`, async () => {
    const page = await fixture.browser.newPage({ viewport: { width: 1280, height: 900 } })
    await page.goto(fixture.url)
    await page.waitForSelector('tbody tr[data-row]')
    if (view === 'All') {
      await page.getByRole('radio', { name: 'Blocked' }).click()
      await page.waitForTimeout(600)
    }
    await page.evaluate(() => {
      const pill = document.querySelector<HTMLElement>('[class*=toggle-button-group-pill]')!
      const record: { time: number; transform: string }[] = []
      Object.assign(window, { record, pressed: 0 })
      addEventListener('pointerdown', (event) => Object.assign(window, { pressed: event.timeStamp }), { capture: true, once: true })
      const tick = (time: number) => {
        record.push({ time, transform: pill.style.transform })
        if (record.length < 60) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    const box = (await page.getByRole('radio', { name: view }).boundingBox())!
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.up()
    await page.waitForTimeout(1000)

    const { frames, pressedAt } = await page.evaluate(() => {
      const { record, pressed } = window as unknown as { record: { time: number; transform: string }[]; pressed: number }
      return { frames: record.filter((frame) => frame.time >= pressed), pressedAt: pressed }
    })
    await page.close()

    const gaps = frames.slice(1).map((frame, index) => frame.time - frames[index]!.time)
    const firstMove = frames.findIndex((frame) => frame.transform !== frames[0]!.transform)
    expect(firstMove).toBeGreaterThan(-1)
    expect(frames[firstMove]!.time - pressedAt).toBeLessThan(50)
    expect(Math.max(...gaps.slice(0, 18))).toBeLessThan(67)
  }, 30_000)
}
