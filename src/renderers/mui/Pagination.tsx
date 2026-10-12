import { TablePagination } from '@mui/material'
import { useDataTableContext } from './context.js'

export interface DataTablePaginationProps {
  /** Page-size choices. Empty (the default) hides the rows-per-page select entirely. */
  rowsPerPageOptions?: number[]
}

/** Invisible while there is nothing to page through, keeping its space so the toolbar does not shift when rows arrive. Hidden while grouped — pagination happens per-group there instead (`api.setGroupPage`). */
export function DataTablePagination({ rowsPerPageOptions = [] }: DataTablePaginationProps) {
  const api = useDataTableContext()
  if (api.groupBy) return null

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={rowsPerPageOptions}
      count={api.total}
      page={api.pagination.page - 1}
      rowsPerPage={api.pagination.pageSize}
      onPageChange={(_, page) => api.setPage(page + 1)}
      onRowsPerPageChange={(e) => api.setPageSize(Number(e.target.value))}
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
      sx={{ visibility: api.total === 0 ? 'hidden' : undefined }}
    />
  )
}
