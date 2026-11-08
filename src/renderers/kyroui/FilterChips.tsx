import { Chip, Stack } from '@kyrobit/kyroui'
import type { FilterColumnDef, FilterValues } from '@kyrobit/datatable'
import { asDateRange, asSelectValues, asTextValue, useFilterLabels } from '@kyrobit/datatable'
import { useDataTableContext } from './context.js'

export interface DataTableFilterChipsProps {
  filterColumns: FilterColumnDef[]
}

export function DataTableFilterChips({ filterColumns }: DataTableFilterChipsProps) {
  const api = useDataTableContext<unknown, string, FilterValues>()
  const filters = api.filters ?? {}
  const labelOf = useFilterLabels(api, filterColumns, filters)

  const replace = (field: string, next?: FilterValues[string]) => {
    const rest: FilterValues = Object.fromEntries(Object.entries(filters).filter(([key]) => key !== field))
    api.setFilters(next === undefined ? rest : { ...rest, [field]: next })
  }

  const chips = filterColumns.flatMap((column) => {
    const value = filters[column.field]
    if (column.type === 'select' || column.type === 'choice') {
      const values = asSelectValues(value)
      return values.map((selected) => ({
        key: `${column.field}:${selected}`,
        label: labelOf(column, selected),
        remove: () => replace(column.field, values.filter((other) => other !== selected)),
      }))
    }
    if (column.type === 'date') {
      const { from, to } = asDateRange(value)
      if (!from && !to) return []
      return [{ key: column.field, label: `${column.label}: ${from && to ? `${from} – ${to}` : (from || to)}`, remove: () => replace(column.field) }]
    }
    const text = asTextValue(value)
    return text ? [{ key: column.field, label: `${column.label}: ${text}`, remove: () => replace(column.field) }] : []
  })

  if (chips.length === 0) return null
  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 'sm' }}>
      {chips.map((chip) => <Chip key={chip.key} label={chip.label} onDelete={chip.remove} />)}
    </Stack>
  )
}
