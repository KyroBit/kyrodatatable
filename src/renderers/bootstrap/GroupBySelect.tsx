import { useDataTableContext } from './context.js'

export interface DataTableGroupBySelectProps {
  noneLabel?: string
}

export function DataTableGroupBySelect({ noneLabel = 'No grouping' }: DataTableGroupBySelectProps) {
  const api = useDataTableContext()
  const columns = api.groupByColumns
  if (!columns || columns.length === 0) return null

  return (
    <select
      className="form-select form-select-sm"
      style={{ maxWidth: 200 }}
      value={api.groupBy ?? ''}
      onChange={(e) => api.setGroupBy((e.target.value || null) as never)}
    >
      <option value="">{noneLabel}</option>
      {columns.map((c) => (
        <option key={c.field} value={c.field}>{c.label}</option>
      ))}
    </select>
  )
}
