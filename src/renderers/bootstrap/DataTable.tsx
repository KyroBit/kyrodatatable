import { Fragment, type ReactNode } from 'react'
import type { DataTableApi } from '../../state/useDataTable.js'
import type { ColumnDef, DataTableConfig } from '../../types/index.js'

export interface DataTableProps<Row, Field extends string = string> {
  api: DataTableApi<Row, Field>
  columns: ColumnDef<Row, Field>[]
  groupByColumns?: DataTableConfig<Row, Field>['groupByColumns']
  getRowId: (row: Row) => string
  onRowClick?: (row: Row) => void
  searchPlaceholder?: string
  emptyMessage?: string
}

function SortArrow<Field extends string>({ api, field }: { api: DataTableApi<unknown, Field>; field: Field }) {
  if (api.sort?.field !== field) return <span className="text-muted ms-1">↕</span>
  return <span className="ms-1">{api.sort.direction === 'asc' ? '↑' : '↓'}</span>
}

export function DataTable<Row, Field extends string = string>({
  api, columns, groupByColumns, getRowId, onRowClick,
  searchPlaceholder = 'Search…', emptyMessage = 'No records found.',
}: DataTableProps<Row, Field>) {
  const colSpan = columns.length + (groupByColumns?.length ? 1 : 0)
  const totalPages = Math.max(1, Math.ceil(api.total / api.pagination.pageSize))

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex gap-2 flex-wrap align-items-center">
        <input
          type="text"
          className="form-control form-control-sm"
          style={{ maxWidth: 260 }}
          placeholder={searchPlaceholder}
          value={api.search}
          onChange={(e) => api.setSearch(e.target.value)}
        />
        {groupByColumns && groupByColumns.length > 0 && (
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: 200 }}
            value={api.groupBy ?? ''}
            onChange={(e) => api.setGroupBy((e.target.value || null) as Field | null)}
          >
            <option value="">No grouping</option>
            {groupByColumns.map((g) => (
              <option key={g.field} value={g.field}>{g.label}</option>
            ))}
          </select>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              {api.groupBy && <th style={{ width: 40 }} />}
              {columns.map((col) => (
                <th
                  key={col.field}
                  className={col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : undefined}
                  role={col.sortable === false ? undefined : 'button'}
                  onClick={col.sortable === false ? undefined : () => api.toggleSort(col.field)}
                >
                  {col.headerName}
                  {col.sortable !== false && <SortArrow api={api as DataTableApi<unknown, Field>} field={col.field} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {api.groupBy ? (
              api.groups.length === 0 && !api.groupsLoading ? (
                <tr><td colSpan={colSpan} className="text-center text-muted py-4">{emptyMessage}</td></tr>
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
              <tr><td colSpan={colSpan} className="text-center text-muted py-4">{emptyMessage}</td></tr>
            ) : (
              api.rows.map((row) => (
                <tr key={getRowId(row)} style={onRowClick ? { cursor: 'pointer' } : undefined} onClick={() => onRowClick?.(row)}>
                  {columns.map((col) => (
                    <td key={col.field} className={col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : undefined}>
                      {(col.render ? col.render(row) : (row as Record<string, unknown>)[col.field]) as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!api.groupBy && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={api.pagination.pageSize}
            onChange={(e) => api.setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${api.pagination.page <= 1 ? 'disabled' : ''}`}>
                <button type="button" className="page-link" onClick={() => api.setPage(api.pagination.page - 1)}>Previous</button>
              </li>
              <li className="page-item disabled"><span className="page-link">Page {api.pagination.page} of {totalPages}</span></li>
              <li className={`page-item ${api.pagination.page >= totalPages ? 'disabled' : ''}`}>
                <button type="button" className="page-link" onClick={() => api.setPage(api.pagination.page + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
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
      <tr className="table-light" style={{ cursor: 'pointer' }} onClick={() => api.toggleGroup(group.key)}>
        <td style={{ width: 40 }}>{open ? '▼' : '▶'}</td>
        <td colSpan={columns.length} className="fw-semibold">
          {group.label} <span className="text-muted fw-normal">({group.count})</span>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={colSpan} className="p-0 border-0">
            <table className="table table-sm mb-0">
              <tbody>
                {loading && rows.length === 0 ? (
                  <tr><td colSpan={columns.length} className="text-center text-muted py-3">Loading…</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr key={getRowId(row)} style={onRowClick ? { cursor: 'pointer' } : undefined} onClick={() => onRowClick?.(row)}>
                      {columns.map((col) => (
                        <td key={col.field} className={col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : undefined}>
                          {(col.render ? col.render(row) : (row as Record<string, unknown>)[col.field]) as ReactNode}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
