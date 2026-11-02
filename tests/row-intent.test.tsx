import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { ComponentType } from 'react'
import { useDataTable, type DataTableApi } from '../src/index.js'
import { DataTable as KyroDataTable } from '../src/renderers/kyroui/index.js'
import { DataTable as MuiDataTable } from '../src/renderers/mui/index.js'

interface Item {
  id: string
  name: string
}

const items: Item[] = [
  { id: '1', name: 'First' },
  { id: '2', name: 'Second' },
]

type Renderer = ComponentType<{ api: DataTableApi<Item, 'name' | 'id'>; onRowIntent?: (row: Item) => void }>

const renderers: [string, Renderer][] = [
  ['KyroUI', KyroDataTable as Renderer],
  ['MUI', MuiDataTable as Renderer],
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

for (const [name, DataTable] of renderers) {
  describe(`the ${name} renderer's onRowIntent`, () => {
    async function mountTable() {
      const onRowIntent = mock((_row: Item) => {})
      function Table() {
        const api = useDataTable<Item, 'name' | 'id'>({ data: items, columns: [{ field: 'name', headerName: 'Name' }], getRowId: (row) => row.id })
        return <DataTable api={api} onRowIntent={onRowIntent} />
      }
      const { container } = render(<Table />)
      await waitFor(() => expect(container.querySelectorAll('tbody tr td').length).toBeGreaterThan(1))
      const row = (label: string) =>
        Array.from(container.querySelectorAll<HTMLElement>('tbody tr')).find((tr) => tr.textContent === label)!
      return { onRowIntent, row }
    }

    test('fires once, with the row, after the pointer rests on it for 80ms', async () => {
      const { onRowIntent, row } = await mountTable()

      fireEvent.pointerEnter(row('Second'))
      await wait(150)

      expect(onRowIntent).toHaveBeenCalledTimes(1)
      expect(onRowIntent.mock.calls[0]![0]).toEqual(items[1]!)
    })

    test('does not fire when the pointer passes over a row in 30ms', async () => {
      const { onRowIntent, row } = await mountTable()

      fireEvent.pointerEnter(row('First'))
      await wait(30)
      fireEvent.pointerLeave(row('First'))
      await wait(120)

      expect(onRowIntent).not.toHaveBeenCalled()
    })

    test('fires once when the row takes keyboard focus', async () => {
      const { onRowIntent, row } = await mountTable()

      row('First').focus()

      expect(document.activeElement).toBe(row('First'))
      expect(onRowIntent).toHaveBeenCalledTimes(1)
      expect(onRowIntent.mock.calls[0]![0]).toEqual(items[0]!)
    })
  })
}
