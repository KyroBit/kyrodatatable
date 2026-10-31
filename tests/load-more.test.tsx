import { expect, test } from 'bun:test'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useDataTable } from '../src/index.js'

interface Item {
  id: string
  name: string
}

const items: Item[] = Array.from({ length: 25 }, (_, index) => ({
  id: String(index + 1),
  name: `Item ${String(index + 1).padStart(2, '0')}`,
}))

const columns = [{ field: 'name' as const, headerName: 'Name' }]

const useItems = () =>
  useDataTable<Item, 'name' | 'id'>({
    data: items,
    columns,
    getRowId: (row) => row.id,
    initialPageSize: 10,
    initialSort: { field: 'name', direction: 'asc' },
  })

test('loadMore appends the next page to the rows already shown, until there are none left', async () => {
  const { result } = renderHook(useItems)
  await waitFor(() => expect(result.current.rows).toHaveLength(10))
  expect(result.current.hasMore).toBe(true)

  act(() => result.current.loadMore())
  await waitFor(() => expect(result.current.rows).toHaveLength(20))
  expect(result.current.rows[10].name).toBe('Item 11')

  act(() => result.current.loadMore())
  await waitFor(() => expect(result.current.rows).toHaveLength(25))
  expect(result.current.hasMore).toBe(false)
  expect(result.current.loadingMore).toBe(false)
})

test('a new search after loading more starts again from the first page', async () => {
  const { result } = renderHook(useItems)
  await waitFor(() => expect(result.current.rows).toHaveLength(10))
  act(() => result.current.loadMore())
  await waitFor(() => expect(result.current.rows).toHaveLength(20))

  act(() => result.current.setSearch('Item 2'))

  await waitFor(() => expect(result.current.rows.map((row) => row.name)).toEqual(
    ['Item 20', 'Item 21', 'Item 22', 'Item 23', 'Item 24', 'Item 25'],
  ))
  expect(result.current.hasMore).toBe(false)
})
