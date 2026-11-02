import { expect, test } from 'bun:test'
import { act, render, waitFor } from '@testing-library/react'
import { prefetchDataTable, useDataTable, type DataTableApi, type FetchParams, type FetchResult, type SortState } from '../src/index.js'
import { DataTable } from '../src/renderers/kyroui/index.js'

interface Item {
  id: string
  name: string
}

type Field = 'name' | 'id'

const columns = [{ field: 'name' as const, headerName: 'Name' }]

const itemsNamed = (prefix: string): Item[] => [
  { id: `${prefix}-1`, name: `${prefix} one` },
  { id: `${prefix}-2`, name: `${prefix} two` },
]

function deferredServer(rows: Item[]) {
  const calls: FetchParams<Field>[] = []
  const pending: ((result: FetchResult<Item>) => void)[] = []
  return {
    calls,
    fetchRecords: (params: FetchParams<Field>) => {
      calls.push(params)
      return new Promise<FetchResult<Item>>((resolve) => pending.push(resolve))
    },
    resolveAll: (result: FetchResult<Item> = { rows, total: rows.length }) =>
      act(async () => {
        for (const resolve of pending.splice(0)) resolve(result)
      }),
  }
}

let uniqueKey = 0
const freshKey = () => `instant-${++uniqueKey}`

interface Frame {
  rows: string[]
  loading: boolean
}

function Table(props: {
  cacheKey: string
  fetchRecords: (params: FetchParams<Field>) => Promise<FetchResult<Item>>
  initialSort?: SortState<Field>
  initialPageSize?: number
  frames: Frame[]
}) {
  const api = useDataTable<Item, Field>({
    cacheKey: props.cacheKey,
    fetchRecords: props.fetchRecords,
    initialSort: props.initialSort,
    initialPageSize: props.initialPageSize,
    columns,
    getRowId: (row) => row.id,
  })
  props.frames.push({ rows: api.rows.map((row) => row.name), loading: api.loading })
  return <DataTable api={api} />
}

function watchForSkeletons() {
  let seen = false
  const observer = new MutationObserver(() => {
    if (document.querySelector('.KyroTable-skeletonRow')) seen = true
  })
  observer.observe(document.body, { childList: true, subtree: true })
  return {
    seen: () => seen || document.querySelector('.KyroTable-skeletonRow') !== null,
    stop: () => observer.disconnect(),
  }
}

const renderedNames = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('tbody tr[data-row] td')).map((cell) => cell.textContent)

test('a table remounted under the same cacheKey shows its last rows in the first frame, never a skeleton, and refetches once in the background', async () => {
  const cacheKey = freshKey()
  const server = deferredServer(itemsNamed('Cached'))
  const first = render(<Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} frames={[]} />)
  await server.resolveAll()
  await waitFor(() => expect(renderedNames(first.container)).toEqual(['Cached one', 'Cached two']))
  first.unmount()
  expect(server.calls).toHaveLength(1)

  const skeletons = watchForSkeletons()
  const frames: Frame[] = []
  const second = render(<Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} frames={frames} />)

  expect(frames[0]).toEqual({ rows: ['Cached one', 'Cached two'], loading: false })
  expect(renderedNames(second.container)).toEqual(['Cached one', 'Cached two'])
  expect(server.calls).toHaveLength(2)

  await server.resolveAll({ rows: [{ id: 'Cached-1', name: 'Fresh one' }], total: 1 })
  await waitFor(() => expect(renderedNames(second.container)).toEqual(['Fresh one']))
  skeletons.stop()

  expect(skeletons.seen()).toBe(false)
  expect(frames.every((frame) => !frame.loading)).toBe(true)
  expect(server.calls).toHaveLength(2)
})

test('the quiet background refresh keeps the page and the selection the reader had', async () => {
  const cacheKey = freshKey()
  const server = deferredServer(itemsNamed('Kept'))
  const first = render(<Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} frames={[]} />)
  await server.resolveAll()
  first.unmount()

  let api!: DataTableApi<Item, Field>
  function Selecting() {
    api = useDataTable<Item, Field>({ cacheKey, fetchRecords: server.fetchRecords, columns, getRowId: (row) => row.id })
    return <DataTable api={api} selectable />
  }
  const second = render(<Selecting />)
  act(() => api.toggleSelected('Kept-2'))

  await server.resolveAll({ rows: [{ id: 'Kept-1', name: 'Kept one' }, { id: 'Kept-2', name: 'Kept two, renamed' }], total: 2 })
  await waitFor(() => expect(renderedNames(second.container)).toContain('Kept two, renamed'))

  expect(api.selectedIds).toEqual(['Kept-2'])
  expect(api.pagination.page).toBe(1)
})

test('a table mounted while its prefetch is still running waits for that request instead of sending a second', async () => {
  const cacheKey = freshKey()
  const server = deferredServer(itemsNamed('Prefetched'))
  prefetchDataTable({ cacheKey, fetchRecords: server.fetchRecords })

  const frames: Frame[] = []
  const { container } = render(<Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} frames={frames} />)
  expect(frames[0]!.rows).toEqual([])

  await server.resolveAll()
  await waitFor(() => expect(renderedNames(container)).toEqual(['Prefetched one', 'Prefetched two']))
  await new Promise((resolve) => setTimeout(resolve, 20))

  expect(server.calls).toHaveLength(1)
})

test('a table mounted after its prefetch resolved shows the prefetched rows in the first frame', async () => {
  const cacheKey = freshKey()
  const server = deferredServer(itemsNamed('Ready'))
  prefetchDataTable({ cacheKey, fetchRecords: server.fetchRecords, initialSort: { field: 'name', direction: 'desc' }, initialPageSize: 10 })
  await server.resolveAll()

  const frames: Frame[] = []
  const { container } = render(
    <Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} initialSort={{ field: 'name', direction: 'desc' }} initialPageSize={10} frames={frames} />,
  )

  expect(frames[0]).toEqual({ rows: ['Ready one', 'Ready two'], loading: false })
  expect(renderedNames(container)).toEqual(['Ready one', 'Ready two'])
})

test('a prefetch asks for the same first page that mounting the table would', async () => {
  const cacheKey = freshKey()
  const prefetched = deferredServer([])
  prefetchDataTable({ cacheKey, fetchRecords: prefetched.fetchRecords, initialSort: { field: 'name', direction: 'asc' }, initialPageSize: 50, initialFilters: { status: ['active'] } })

  const mounted = deferredServer([])
  function Filtered() {
    const api = useDataTable<Item, Field>({
      fetchRecords: mounted.fetchRecords,
      initialSort: { field: 'name', direction: 'asc' },
      initialPageSize: 50,
      initialFilters: { status: ['active'] },
      columns,
      getRowId: (row) => row.id,
    })
    return <DataTable api={api} />
  }
  render(<Filtered />)

  expect(prefetched.calls).toEqual(mounted.calls)
})

test('prefetching again while a request runs, or within a second of it finishing, sends nothing', async () => {
  const cacheKey = freshKey()
  const server = deferredServer(itemsNamed('Once'))
  prefetchDataTable({ cacheKey, fetchRecords: server.fetchRecords })
  prefetchDataTable({ cacheKey, fetchRecords: server.fetchRecords })
  expect(server.calls).toHaveLength(1)

  await server.resolveAll()
  prefetchDataTable({ cacheKey, fetchRecords: server.fetchRecords })
  expect(server.calls).toHaveLength(1)

  await new Promise((resolve) => setTimeout(resolve, 1050))
  prefetchDataTable({ cacheKey, fetchRecords: server.fetchRecords })
  expect(server.calls).toHaveLength(2)
})

test('a table under a different cacheKey never shows another table\'s rows', async () => {
  const shared = deferredServer(itemsNamed('Orders'))
  const first = render(<Table cacheKey={freshKey()} fetchRecords={shared.fetchRecords} frames={[]} />)
  await shared.resolveAll()
  first.unmount()

  const other = deferredServer(itemsNamed('Customers'))
  const frames: Frame[] = []
  const { container } = render(<Table cacheKey={freshKey()} fetchRecords={other.fetchRecords} frames={frames} />)

  expect(frames[0]).toEqual({ rows: [], loading: true })
  expect(renderedNames(container)).toEqual([])
  await other.resolveAll()
  await waitFor(() => expect(renderedNames(container)).toEqual(['Customers one', 'Customers two']))
})

test('a table under the same cacheKey but different params never shows rows fetched for other params', async () => {
  const cacheKey = freshKey()
  const server = deferredServer(itemsNamed('Ascending'))
  const first = render(<Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} initialSort={{ field: 'name', direction: 'asc' }} frames={[]} />)
  await server.resolveAll()
  first.unmount()

  const sorted: Frame[] = []
  const bySort = render(<Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} initialSort={{ field: 'name', direction: 'desc' }} frames={sorted} />)
  expect(sorted[0]).toEqual({ rows: [], loading: true })
  bySort.unmount()

  const sized: Frame[] = []
  render(<Table cacheKey={cacheKey} fetchRecords={server.fetchRecords} initialSort={{ field: 'name', direction: 'asc' }} initialPageSize={10} frames={sized} />)
  expect(sized[0]).toEqual({ rows: [], loading: true })
})

test('changing a param to one already cached shows that result at once, and one never cached keeps the current rows while it loads', async () => {
  const cacheKey = freshKey()
  const server = deferredServer(itemsNamed('Page'))
  let api!: DataTableApi<Item, Field>
  function Paged() {
    api = useDataTable<Item, Field>({ cacheKey, fetchRecords: server.fetchRecords, columns, getRowId: (row) => row.id, initialPageSize: 2 })
    return <DataTable api={api} />
  }
  const { container } = render(<Paged />)
  await server.resolveAll({ rows: itemsNamed('First'), total: 4 })

  act(() => api.setPage(2))
  expect(container.querySelector('.KyroTable-skeletonRow')).toBeNull()
  expect(api.loading).toBe(true)
  await server.resolveAll({ rows: itemsNamed('Second'), total: 4 })
  await waitFor(() => expect(renderedNames(container)).toEqual(['Second one', 'Second two']))

  act(() => api.setPage(1))
  expect(renderedNames(container)).toEqual(['First one', 'First two'])
  expect(api.loading).toBe(false)
})
