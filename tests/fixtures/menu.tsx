import '@kyrobit/kyroui/styles.css'
import { ThemeProvider } from '@kyrobit/kyroui'
import { createRoot } from 'react-dom/client'
import { useDataTable } from '../../src/index.js'
import { DataTable } from '../../src/renderers/kyroui/index.js'

const data = [{ id: '1', name: 'One' }]

function Page() {
  const api = useDataTable<{ id: string; name: string }, 'name' | 'id'>({
    data,
    columns: [{ field: 'name', headerName: 'Name' }],
    getRowId: (row) => row.id,
  })
  const formats = new URLSearchParams(location.search).get('formats') === 'one'
    ? [{ id: 'csv', label: 'CSV' }]
    : [{ id: 'csv', label: 'CSV' }, { id: 'xlsx', label: 'Excel' }]
  return (
    <div style={{ height: '100vh', padding: 16, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <DataTable api={api} onImport={() => {}} onExport={() => {}} exportFormats={formats} />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider mode="light">
    <Page />
  </ThemeProvider>,
)
