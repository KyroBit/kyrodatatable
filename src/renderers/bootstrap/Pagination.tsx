import { useDataTableContext } from './context.js'

/** Hidden automatically while grouped — pagination happens per-group there instead (`api.setGroupPage`). */
export function DataTablePagination() {
  const api = useDataTableContext()
  if (api.groupBy) return null

  const totalPages = Math.max(1, Math.ceil(api.total / api.pagination.pageSize))

  return (
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
  )
}
