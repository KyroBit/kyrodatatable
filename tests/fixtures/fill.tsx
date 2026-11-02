import '@kyrobit/kyroui/styles.css'
import { ThemeProvider } from '@kyrobit/kyroui'
import { createRoot } from 'react-dom/client'
import { useDataTable } from '../../src/index.js'
import { DataTable } from '../../src/renderers/kyroui/index.js'

interface Item {
  id: string
  name: string
}

const params = new URLSearchParams(location.search)
const data: Item[] = Array.from({ length: Number(params.get('rows')) }, (_, index) => ({
  id: String(index + 1),
  name: `Item ${index + 1}`,
}))

function Page() {
  const api = useDataTable<Item, 'name' | 'id'>({
    data,
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
    initialPageSize: Number(params.get('pageSize')),
  })
  return (
    <div style={{ height: '100vh', boxSizing: 'border-box', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <DataTable api={api} infiniteScroll={params.get('mode') === 'infinite'} />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider mode="light">
    <Page />
  </ThemeProvider>,
)
