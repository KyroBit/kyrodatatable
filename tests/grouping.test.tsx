import { expect, test } from 'bun:test'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useDataTable } from '../src/index.js'

interface Customer {
  id: string
  name: string
  status: 'active' | 'blocked'
}

const customers: Customer[] = [
  { id: '1', name: 'Ada', status: 'active' },
  { id: '2', name: 'Alan', status: 'blocked' },
  { id: '3', name: 'Grace', status: 'active' },
]

test('grouping an in-memory table whose columns are written inline settles instead of refetching forever', async () => {
  let renders = 0
  const { result } = renderHook(() => {
    renders += 1
    if (renders > 200) throw new Error('the table kept re-rendering')
    return useDataTable<Customer, keyof Customer & string>({
      data: customers,
      columns: [
        { field: 'name', headerName: 'Name' },
        { field: 'status', headerName: 'Status' },
      ],
      getRowId: (row) => row.id,
      groupByColumns: [{ field: 'status', label: 'Status' }],
      applyFilters: () => true,
    })
  })

  act(() => result.current.setGroupBy('status'))

  await waitFor(() => expect(result.current.groups.map((group) => group.key).sort()).toEqual(['active', 'blocked']))
  const settled = renders
  await new Promise((resolve) => setTimeout(resolve, 100))
  expect(renders).toBe(settled)
})
