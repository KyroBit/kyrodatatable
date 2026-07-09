import { TablePagination } from '@mui/material'
import { useDataTableContext } from './context.js'

/** Hidden automatically while grouped — pagination happens per-group there instead (`api.setGroupPage`). */
export function DataTablePagination() {
  const api = useDataTableContext()
  if (api.groupBy) return null

  return (
    <TablePagination
      component="div"
      count={api.total}
      page={api.pagination.page - 1}
      rowsPerPage={api.pagination.pageSize}
      onPageChange={(_, page) => api.setPage(page + 1)}
      onRowsPerPageChange={(e) => api.setPageSize(Number(e.target.value))}
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
    />
  )
}
