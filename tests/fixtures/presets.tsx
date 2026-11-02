import '@kyrobit/kyroui/styles.css'
import { ThemeProvider } from '@kyrobit/kyroui'
import { createRoot } from 'react-dom/client'
import { usePresets, useDataTable, type FilterValues } from '../../src/index.js'
import { DataTable } from '../../src/renderers/kyroui/index.js'

interface Customer {
  id: string
  name: string
  email: string
  country: string
  status: string
  balance: number
  joined: string
  reference: string
}

const statuses = ['active', 'pending', 'blocked']

const data: Customer[] = Array.from({ length: 300 }, (_, index) => ({
  id: String(index + 1),
  name: `Customer ${index + 1}`,
  email: `customer${index + 1}@example.com`,
  country: ['Japan', 'France', 'Pakistan', 'Brazil'][index % 4]!,
  status: statuses[index % 3]!,
  balance: (index * 7919) % 100000,
  joined: `2026-10-${String((index % 28) + 1).padStart(2, '0')}`,
  reference: `C-${String(index + 1).padStart(4, '0')}`,
}))

type Field = keyof Customer & string

function Page() {
  const api = useDataTable<Customer, Field, FilterValues>({
    data,
    columns: (['name', 'email', 'country', 'status', 'balance', 'joined', 'reference'] as const).map((field) => ({
      field,
      headerName: field,
    })),
    getRowId: (row) => row.id,
    initialPageSize: 100,
    applyFilters: (row, filters) => {
      const status = Array.isArray(filters.status) ? filters.status : []
      return status.length === 0 || status.includes(row.status)
    },
  })
  const presets = usePresets<FilterValues>('fixture-presets', [
    { id: 'active', name: 'Active', filters: { status: ['active'] }, builtIn: true },
    { id: 'blocked', name: 'Blocked', filters: { status: ['blocked'] }, builtIn: true },
  ])
  return (
    <div style={{ height: '100vh', boxSizing: 'border-box', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <DataTable api={api} presets={presets} selectable />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider mode="light">
    <Page />
  </ThemeProvider>,
)
