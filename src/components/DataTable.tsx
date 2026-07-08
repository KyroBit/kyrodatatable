import { Fragment, type ReactNode } from 'react'
import {
  Box, Collapse, IconButton, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, TableSortLabel,
  TextField, Typography,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import type { DataTableApi } from '../state/useDataTable.js'
import type { ColumnDef, DataTableConfig } from '../types/index.js'

export interface DataTableProps<Row, Field extends string = string> {
  api: DataTableApi<Row, Field>
  columns: ColumnDef<Row, Field>[]
  groupByColumns?: DataTableConfig<Row, Field>['groupByColumns']
  getRowId: (row: Row) => string
  onRowClick?: (row: Row) => void
  searchPlaceholder?: string
  emptyMessage?: string
}

export function DataTable<Row, Field extends string = string>({
  api, columns, groupByColumns, getRowId, onRowClick,
  searchPlaceholder = 'Search…', emptyMessage = 'No records found.',
}: DataTableProps<Row, Field>) {
  const colSpan = columns.length + (groupByColumns?.length ? 1 : 0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={api.search}
          onChange={(e) => api.setSearch(e.target.value)}
          sx={{ minWidth: 240 }}
        />
        {groupByColumns && groupByColumns.length > 0 && (
          <TextField
            size="small"
            select
            label="Group by"
            value={api.groupBy ?? ''}
            onChange={(e) => api.setGroupBy((e.target.value || null) as Field | null)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">None</MenuItem>
            {groupByColumns.map((g) => (
              <MenuItem key={g.field} value={g.field}>{g.label}</MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {api.groupBy && <TableCell sx={{ width: 40 }} />}
              {columns.map((col) => (
                <TableCell key={col.field} align={col.align}>
                  {col.sortable === false ? (
                    col.headerName
                  ) : (
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
            {api.groupBy ? (
              api.groups.length === 0 && !api.groupsLoading ? (
                <TableRow><TableCell colSpan={colSpan}><Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>{emptyMessage}</Typography></TableCell></TableRow>
              ) : (
                api.groups.map((group) => (
                  <GroupRows
                    key={group.key}
                    group={group}
                    api={api}
                    columns={columns}
                    colSpan={colSpan}
                    getRowId={getRowId}
                    onRowClick={onRowClick}
                  />
                ))
              )
            ) : api.rows.length === 0 && !api.loading ? (
              <TableRow><TableCell colSpan={colSpan}><Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>{emptyMessage}</Typography></TableCell></TableRow>
            ) : (
              api.rows.map((row) => (
                <TableRow key={getRowId(row)} hover sx={{ cursor: onRowClick ? 'pointer' : undefined }} onClick={() => onRowClick?.(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.field} align={col.align}>
                      {(col.render ? col.render(row) : (row as Record<string, unknown>)[col.field]) as ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!api.groupBy && (
        <TablePagination
          component="div"
          count={api.total}
          page={api.pagination.page - 1}
          rowsPerPage={api.pagination.pageSize}
          onPageChange={(_, page) => api.setPage(page + 1)}
          onRowsPerPageChange={(e) => api.setPageSize(Number(e.target.value))}
        />
      )}
    </Box>
  )
}

function GroupRows<Row, Field extends string>({
  group, api, columns, colSpan, getRowId, onRowClick,
}: {
  group: { key: string; label: string; count: number }
  api: DataTableApi<Row, Field>
  columns: ColumnDef<Row, Field>[]
  colSpan: number
  getRowId: (row: Row) => string
  onRowClick?: (row: Row) => void
}) {
  const open = api.isGroupExpanded(group.key)
  const rows = api.groupRows(group.key)
  const loading = api.groupLoading(group.key)

  return (
    <Fragment>
      <TableRow hover sx={{ cursor: 'pointer', bgcolor: 'action.hover' }} onClick={() => api.toggleGroup(group.key)}>
        <TableCell sx={{ width: 40 }}>
          <IconButton size="small">
            {open ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={columns.length} sx={{ fontWeight: 600 }}>
          {group.label} <Typography component="span" color="text.secondary">({group.count})</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={colSpan} sx={{ p: 0, border: open ? undefined : 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableBody>
                {loading && rows.length === 0 ? (
                  <TableRow><TableCell colSpan={columns.length}><Typography sx={{ py: 2, textAlign: 'center' }} color="text.secondary">Loading…</Typography></TableCell></TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={getRowId(row)} hover sx={{ cursor: onRowClick ? 'pointer' : undefined }} onClick={() => onRowClick?.(row)}>
                      {columns.map((col) => (
                        <TableCell key={col.field} align={col.align}>
                          {(col.render ? col.render(row) : (row as Record<string, unknown>)[col.field]) as ReactNode}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
