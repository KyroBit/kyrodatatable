import { expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { useDataTable } from '../src/index.js'
import { DataTable } from '../src/renderers/mui/index.js'

interface Item {
  id: string
  name: string
}

test('the MUI toolbar shows Import, then Export, then Settings', () => {
  function Everything() {
    const api = useDataTable<Item, 'name' | 'id'>({
      data: [{ id: '1', name: 'One' }],
      columns: [{ field: 'name', headerName: 'Name' }],
      getRowId: (row) => row.id,
    })
    return <DataTable api={api} onImport={() => {}} onExport={() => {}} />
  }
  render(<Everything />)

  const order = ['Import', 'Export', 'Settings'].map((name) => screen.getByRole('button', { name: new RegExp(`^${name}`) }))
  const positions = order.map((button) => Array.from(document.querySelectorAll('button')).indexOf(button as HTMLButtonElement))

  expect(positions).toEqual([...positions].sort((a, b) => a - b))
})
