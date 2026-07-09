import type { ReactNode } from 'react'
import { useDataTableContext } from './context.js'

export interface DataTableBodyProps<Row> {
  onRowClick?: (row: Row) => void
  emptyMessage?: string
}

function SortArrow({ active, direction }: { active: boolean; direction?: 'asc' | 'desc' }) {
  if (!active) return <span className="text-muted ms-1">↕</span>
  return <span className="ms-1">{direction === 'asc' ? '↑' : '↓'}</span>
}

/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody<Row>({ onRowClick, emptyMessage = 'No records found.' }: DataTableBodyProps<Row>) {
  const api = useDataTableContext<Row>()
  const items = api.visibleItems
  const colSpan = api.columns.length + (api.groupBy ? 1 : 0)
  const isEmpty = items.length === 0 && !api.loading && !api.groupsLoading

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {api.groupBy && <th style={{ width: 40 }} />}
            {api.columns.map((col) => (
              <th
                key={col.field}
                className={col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : undefined}
                role={col.sortable === false ? undefined : 'button'}
                onClick={col.sortable === false ? undefined : () => api.toggleSort(col.field)}
              >
                {col.headerName}
                {col.sortable !== false && <SortArrow active={api.sort?.field === col.field} direction={api.sort?.direction} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr><td colSpan={colSpan} className="text-center text-muted py-4">{emptyMessage}</td></tr>
          ) : (
            items.map((item) => {
              if (item.type === 'group') {
                return (
                  <tr key={`group-${item.group.key}`} className="table-light" style={{ cursor: 'pointer' }} onClick={() => api.toggleGroup(item.group.key)}>
                    <td style={{ width: 40 }}>{item.expanded ? '▼' : '▶'}</td>
                    <td colSpan={api.columns.length} className="fw-semibold">
                      {item.group.label} <span className="text-muted fw-normal">({item.group.count})</span>
                      {api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && (
                        <span className="text-muted ms-1">loading…</span>
                      )}
                    </td>
                  </tr>
                )
              }
              const row = item.row
              return (
                <tr key={api.getRowId(row)} style={onRowClick ? { cursor: 'pointer' } : undefined} onClick={() => onRowClick?.(row)}>
                  {item.type === 'group-row' && <td style={{ width: 40 }} />}
                  {api.columns.map((col) => (
                    <td key={col.field} className={col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : undefined}>
                      {(col.render ? col.render(row) : (row as Record<string, unknown>)[col.field]) as ReactNode}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
