import { MenuItem, TextField } from '@mui/material'
import { useDataTableContext } from './context.js'

export interface DataTableGroupBySelectProps {
  noneLabel?: string
}

/** Renders nothing if the hook wasn't given `groupByColumns` — there's nothing to group by. */
export function DataTableGroupBySelect({ noneLabel = 'None' }: DataTableGroupBySelectProps) {
  const api = useDataTableContext()
  const columns = api.groupByColumns
  if (!columns || columns.length === 0) return null

  return (
    <TextField
      size="small"
      select
      label="Group by"
      value={api.groupBy ?? ''}
      onChange={(e) => api.setGroupBy((e.target.value || null) as never)}
      sx={{ minWidth: 180 }}
    >
      <MenuItem value="">{noneLabel}</MenuItem>
      {columns.map((c) => (
        <MenuItem key={c.field} value={c.field}>{c.label}</MenuItem>
      ))}
    </TextField>
  )
}
