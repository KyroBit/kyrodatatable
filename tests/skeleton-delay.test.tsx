import { describe, expect, test } from 'bun:test'
import { act, render, waitFor } from '@testing-library/react'
import type { ComponentType } from 'react'
import { useDataTable, type DataTableApi, type FetchParams, type FetchResult } from '../src/index.js'
import { DataTable as KyroDataTable } from '../src/renderers/kyroui/index.js'
import { DataTable as MuiDataTable } from '../src/renderers/mui/index.js'

interface Item {
  id: string
  name: string
}

type Field = 'name' | 'id'
type Api = DataTableApi<Item, Field>
type Renderer = ComponentType<{ api: Api; infiniteScroll?: boolean }>

const renderers: [string, Renderer][] = [
  ['KyroUI', KyroDataTable as Renderer],
  ['MUI', MuiDataTable as Renderer],
]

const pageOf = (page: number): FetchResult<Item> => ({
  rows: Array.from({ length: 2 }, (_, index) => ({ id: `${page}-${index}`, name: `Page ${page} row ${index}` })),
  total: 6,
})

const respondingIn = (ms: number) => (params: FetchParams<Field>) =>
  new Promise<FetchResult<Item>>((resolve) => setTimeout(() => resolve(pageOf(params.page)), ms))

const wait = (ms: number) => act(() => new Promise<void>((resolve) => setTimeout(resolve, ms)))

const skeletonShown = () => document.querySelector('.KyroTable-skeletonRow') !== null
const dataRows = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('tbody tr')).filter((row) => row.textContent?.startsWith('Page'))

function watchForSkeletons() {
  let seen = false
  const observer = new MutationObserver(() => {
    if (skeletonShown()) seen = true
  })
  observer.observe(document.body, { childList: true, subtree: true })
  return { seen: () => seen || skeletonShown(), stop: () => observer.disconnect() }
}

let uniqueKey = 0

for (const [name, DataTable] of renderers) {
  describe(`the ${name} renderer`, () => {
    function mount(fetchRecords: (params: FetchParams<Field>) => Promise<FetchResult<Item>>, cacheKey?: string, infiniteScroll?: boolean) {
      const handle: { api?: Api } = {}
      function Table() {
        const api = useDataTable<Item, Field>({ fetchRecords, cacheKey, columns: [{ field: 'name', headerName: 'Name' }], getRowId: (row) => row.id, initialPageSize: 2 })
        handle.api = api
        return <DataTable api={api} infiniteScroll={infiniteScroll} />
      }
      return { ...render(<Table />), handle }
    }

    test('a response within 100ms goes from an empty body straight to rows, never rendering a skeleton', async () => {
      const skeletons = watchForSkeletons()
      const { container } = mount(respondingIn(100))

      expect(container.querySelector('thead')).not.toBeNull()
      expect(dataRows(container)).toHaveLength(0)
      await waitFor(() => expect(dataRows(container)).toHaveLength(2))
      await wait(100)
      skeletons.stop()

      expect(skeletons.seen()).toBe(false)
    })

    test('a response taking 400ms shows the skeleton from about 150ms until the rows arrive', async () => {
      const { container } = mount(respondingIn(400))

      await wait(100)
      expect(skeletonShown()).toBe(false)
      await wait(100)
      expect(skeletonShown()).toBe(true)
      await waitFor(() => expect(dataRows(container)).toHaveLength(2), { timeout: 1000 })
      expect(skeletonShown()).toBe(false)
    })

    test('a table with a cached result never renders a skeleton', async () => {
      const cacheKey = `skeleton-${++uniqueKey}`
      const first = mount(respondingIn(10), cacheKey)
      await waitFor(() => expect(dataRows(first.container)).toHaveLength(2))
      first.unmount()

      const skeletons = watchForSkeletons()
      const second = mount(respondingIn(400), cacheKey)
      expect(dataRows(second.container)).toHaveLength(2)
      await wait(500)
      skeletons.stop()

      expect(skeletons.seen()).toBe(false)
    })

    test('unmounting before 150ms leaves no timer running', async () => {
      const pending = new Map<unknown, number>()
      const originalSet = globalThis.setTimeout
      const originalClear = globalThis.clearTimeout
      globalThis.setTimeout = ((callback: () => void, ms?: number, ...args: unknown[]) => {
        const id = originalSet(() => {
          pending.delete(id)
          callback()
        }, ms, ...args)
        pending.set(id, ms ?? 0)
        return id
      }) as typeof setTimeout
      globalThis.clearTimeout = ((id: Parameters<typeof clearTimeout>[0]) => {
        pending.delete(id)
        originalClear(id)
      }) as typeof clearTimeout

      try {
        const { unmount } = mount(() => new Promise(() => {}))
        await wait(50)
        unmount()
        expect([...pending.values()].filter((ms) => ms === 150)).toEqual([])
      } finally {
        globalThis.setTimeout = originalSet
        globalThis.clearTimeout = originalClear
      }
    })
  })
}

describe('the KyroUI renderer in infinite mode', () => {
  function mountInfinite(nextPageIn: number) {
    let calls = 0
    const handle: { api?: Api } = {}
    function Table() {
      const api = useDataTable<Item, Field>({
        fetchRecords: (params) => respondingIn(++calls === 1 ? 0 : nextPageIn)(params),
        columns: [{ field: 'name', headerName: 'Name' }],
        getRowId: (row) => row.id,
        initialPageSize: 2,
      })
      handle.api = api
      return <KyroDataTable api={api} infiniteScroll />
    }
    return { ...render(<Table />), handle }
  }

  test('a next page arriving within 100ms never renders its loading row', async () => {
    const { handle } = mountInfinite(100)
    await waitFor(() => expect(handle.api!.rows).toHaveLength(2))
    const skeletons = watchForSkeletons()

    act(() => handle.api!.loadMore())
    await waitFor(() => expect(handle.api!.rows).toHaveLength(4))
    skeletons.stop()

    expect(skeletons.seen()).toBe(false)
  })

  test('a next page taking 400ms shows its loading row from about 150ms until it arrives', async () => {
    const { handle } = mountInfinite(400)
    await waitFor(() => expect(handle.api!.rows).toHaveLength(2))

    act(() => handle.api!.loadMore())
    await wait(100)
    expect(skeletonShown()).toBe(false)
    await wait(100)
    expect(skeletonShown()).toBe(true)
    await waitFor(() => expect(handle.api!.rows).toHaveLength(4), { timeout: 1000 })
    expect(skeletonShown()).toBe(false)
  })
})
