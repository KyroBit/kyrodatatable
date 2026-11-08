import { MenuItem, Select, type SelectChangeEvent } from '@kyrobit/kyroui'
import { useDataTableContext } from './context.js'

export interface DataTableGroupBySelectProps {
  noneLabel?: string
}

export function DataTableGroupBySelect({ noneLabel = 'None' }: DataTableGroupBySelectProps) {
  const api = useDataTableContext()
  const columns = api.groupByColumns
  if (!columns || columns.length === 0) return null
  const labelOf = (field: string) => columns.find((c) => c.field === field)?.label ?? field

  return (
    <Select<string[]>
      multiple
      size="small"
      label="Group by"
      placeholder={noneLabel}
      value={api.groupBy}
      renderValue={(fields) => fields.map(labelOf).join(' › ')}
      onChange={(e: SelectChangeEvent<string[]>) => api.setGroupBy(e.target.value)}
      sx={{ minWidth: 180 }}
    >
      {columns.map((c) => (
        <MenuItem key={c.field} value={c.field}>{c.label}</MenuItem>
      ))}
    </Select>
  )
}
