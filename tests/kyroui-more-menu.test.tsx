import { expect, test } from 'bun:test'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useDataTable } from '../src/index.js'
import { DataTable } from '../src/renderers/kyroui/index.js'

interface Item {
  id: string
  name: string
}

function Table({ onImport }: { onImport: () => void }) {
  const api = useDataTable<Item, 'name' | 'id'>({
    data: [{ id: '1', name: 'One' }],
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
  })
  return <DataTable api={api} onImport={onImport} />
}

const more = () => screen.getByRole('button', { name: 'More', hidden: true })

test('the More button opens its menu from itself and reports it is open', async () => {
  render(<Table onImport={() => {}} />)

  expect(more().getAttribute('aria-haspopup')).toBe('menu')
  expect(more().getAttribute('aria-expanded')).toBe('false')

  fireEvent.click(more())

  expect(await screen.findByRole('menu', { name: 'More' })).toBeDefined()
  expect(more().getAttribute('aria-expanded')).toBe('true')
})

test('choosing Import from the More menu closes it and starts the import', async () => {
  const imports: number[] = []
  render(<Table onImport={() => imports.push(1)} />)

  fireEvent.click(more())
  fireEvent.click(await screen.findByRole('menuitem', { name: /Import/ }))

  expect(imports).toEqual([1])
  await waitFor(() => expect(more().getAttribute('aria-expanded')).toBe('false'))
})
