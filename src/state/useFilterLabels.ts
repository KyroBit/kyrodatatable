import { useEffect, useRef } from 'react'
import { asSelectValues } from '../filterValues.js'
import type { FilterColumnDef, FilterValues } from '../types/index.js'
import type { DataTableApi } from './useDataTable.js'

type LabelSource = Pick<DataTableApi<unknown, string, FilterValues>, 'filterLabel' | 'rememberFilterLabels'>

export function useFilterLabels(api: LabelSource, columns: FilterColumnDef[], filters: FilterValues) {
  const asked = useRef(new Set<string>())
  const unresolved = columns.filter(
    (column) =>
      column.type === 'select' &&
      typeof column.options === 'function' &&
      asSelectValues(filters[column.field]).some((value) => api.filterLabel(column.field, value) === undefined),
  )
  const pending = unresolved.map((column) => column.field).join(',')

  useEffect(() => {
    for (const column of unresolved) {
      if (column.type !== 'select' || typeof column.options !== 'function' || asked.current.has(column.field)) continue
      asked.current.add(column.field)
      void column.options('').then((options) => api.rememberFilterLabels(column.field, options))
    }
  }, [pending])

  return (column: FilterColumnDef, value: string) =>
    api.filterLabel(column.field, value) ??
    ((column.type === 'select' || column.type === 'choice') && Array.isArray(column.options)
      ? column.options.find((option) => option.value === value)?.label
      : undefined) ??
    value
}
