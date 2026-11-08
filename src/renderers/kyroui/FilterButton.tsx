import { useState } from 'react'
import { Badge, IconButton } from '@kyrobit/kyroui'
import type { FilterColumnDef, FilterRenderers, FilterValues, PresetsApi } from '@kyrobit/datatable'
import { countFilterValues } from '@kyrobit/datatable'
import { useDataTableContext } from './context.js'
import { DataTableFilterMenu } from './FilterMenu.js'
import { FilterIcon } from './icons.js'

export interface DataTableFilterButtonProps {
  filterColumns: FilterColumnDef[]
  presets?: PresetsApi<FilterValues>
  filterRenderers?: FilterRenderers
  onApply?: (filters: FilterValues, presetId?: string) => void
}

export function DataTableFilterButton({ filterColumns, presets, filterRenderers, onApply }: DataTableFilterButtonProps) {
  const api = useDataTableContext<unknown, string, FilterValues>()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [draft, setDraft] = useState<FilterValues>({})
  const filters = api.filters ?? {}

  return (
    <>
      <Badge badgeContent={countFilterValues(filters)} color="primary">
        <IconButton
          size="small"
          aria-label="Filters"
          onClick={(e) => {
            setDraft(filters)
            setAnchor(e.currentTarget.closest<HTMLElement>('.search-field') ?? e.currentTarget)
          }}
        >
          <FilterIcon fontSize="small" />
        </IconButton>
      </Badge>
      <DataTableFilterMenu
        filterRenderers={filterRenderers}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        filterColumns={filterColumns}
        draft={draft}
        onDraftChange={setDraft}
        onApply={onApply ?? ((next) => api.setFilters(next))}
        presets={presets}
      />
    </>
  )
}
