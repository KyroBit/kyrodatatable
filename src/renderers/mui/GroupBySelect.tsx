import { MenuItem, TextField } from '@mui/material'
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
    <TextField
      size="small"
      select
      label="Group by"
      value={api.groupBy}
      onChange={(e) => api.setGroupBy(e.target.value as unknown as string[])}
      slotProps={{
        select: {
          multiple: true,
          displayEmpty: true,
          renderValue: (fields) => ((fields as string[]).length ? (fields as string[]).map(labelOf).join(' › ') : noneLabel),
        },
        inputLabel: { shrink: true },
      }}
      sx={{ minWidth: 180 }}
    >
      {columns.map((c) => (
        <MenuItem key={c.field} value={c.field}>{c.label}</MenuItem>
      ))}
    </TextField>
  )
}
