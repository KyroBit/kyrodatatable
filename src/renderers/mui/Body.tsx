import type { ReactNode } from 'react'
import {
  Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { useDataTableContext } from './context.js'

export interface DataTableBodyProps<Row> {
  onRowClick?: (row: Row) => void
  emptyMessage?: string
}

/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody<Row>({ onRowClick, emptyMessage = 'No records found.' }: DataTableBodyProps<Row>) {
  const api = useDataTableContext<Row>()
  const items = api.visibleItems
  const colSpan = api.columns.length + (api.groupBy ? 1 : 0)
  const isEmpty = items.length === 0 && !api.loading && !api.groupsLoading

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {api.groupBy && <TableCell sx={{ width: 40 }} />}
            {api.columns.map((col) => (
              <TableCell key={col.field} align={col.align}>
                {col.sortable === false ? col.headerName : (
                  <TableSortLabel
                    active={api.sort?.field === col.field}
                    direction={api.sort?.field === col.field ? api.sort.direction : 'asc'}
                    onClick={() => api.toggleSort(col.field)}
                  >
                    {col.headerName}
                  </TableSortLabel>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              if (item.type === 'group') {
                return (
                  <TableRow key={`group-${item.group.key}`} hover sx={{ cursor: 'pointer', bgcolor: 'action.hover' }} onClick={() => api.toggleGroup(item.group.key)}>
                    <TableCell sx={{ width: 40 }}>
                      <IconButton size="small">
                        {item.expanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
                      </IconButton>
                    </TableCell>
                    <TableCell colSpan={api.columns.length} sx={{ fontWeight: 600 }}>
                      {item.group.label} <Box component="span" sx={{ color: 'text.secondary' }}>({item.group.count})</Box>
                      {api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && (
                        <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>loading…</Box>
                      )}
                    </TableCell>
                  </TableRow>
                )
              }
              const row = item.row
              return (
                <TableRow key={api.getRowId(row)} hover sx={{ cursor: onRowClick ? 'pointer' : undefined }} onClick={() => onRowClick?.(row)}>
                  {item.type === 'group-row' && <TableCell sx={{ width: 40 }} />}
                  {api.columns.map((col) => (
                    <TableCell key={col.field} align={col.align}>
                      {(col.render ? col.render(row) : (row as Record<string, unknown>)[col.field]) as ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
