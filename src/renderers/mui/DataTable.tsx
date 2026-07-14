import { useMemo, useState, type ReactElement } from 'react'
import {
  Box, Button, Card, IconButton, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import type { DataTableApi } from '../../state/useDataTable.js'
import type { PresetsApi } from '../../state/usePresets.js'
import type { ChipFilters, ExportFormat, ExportRequest, FilterColumnDef, ResourceAction } from '../../types/index.js'
import { DataTableRoot } from './context.js'
import { DataTableSearchField } from './SearchField.js'
import { DataTableBody } from './Body.js'
import { DataTablePagination } from './Pagination.js'
import { DataTableFilterMenu, ManageViewsDialog, chipFiltersEqual, countChipFilters } from './FilterMenu.js'
import { ActionsIcon, ExportIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js'

export interface DataTableProps<Row, Field extends string = string> {
  api: DataTableApi<Row, Field, ChipFilters>
  /** Enables the views pill bar, save-as-view, and the manage dialog. */
  presets?: PresetsApi<ChipFilters>
  /** Enables the filter popover; each entry renders a chip section. */
  filterColumns?: FilterColumnDef[]
  searchPlaceholder?: string
  searchWidth?: number | string
  createLabel?: string
  onCreate?: () => void
  /** Receives the full query context; POST it to your export endpoint. */
  onExport?: (request: ExportRequest<Field, ChipFilters>) => void | Promise<void>
  /** More than one format turns the Export button into a dropdown. */
  exportFormats?: ExportFormat[]
  onImport?: () => void
  exportTooltip?: string
  importTooltip?: string
  /** Bulk actions offered while rows are selected. Enables the checkbox column. */
  actions?: ResourceAction[]
  selectable?: boolean
  onRowClick?: (row: Row) => void
  rowClass?: (row: Row) => string
  emptyMessage?: string
  stickyHeader?: boolean
  rowsPerPageOptions?: number[]
}

/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export function DataTable<Row, Field extends string = string>({
  api,
  presets,
  filterColumns,
  searchPlaceholder,
  searchWidth,
  createLabel = 'Create',
  onCreate,
  onExport,
  exportFormats = [{ id: 'csv', label: 'CSV' }],
  onImport,
  exportTooltip = 'Export current results',
  importTooltip = 'Import from CSV',
  actions,
  selectable,
  onRowClick,
  rowClass,
  emptyMessage,
  stickyHeader,
  rowsPerPageOptions,
}: DataTableProps<Row, Field>) {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)
  const [filterDraft, setFilterDraft] = useState<ChipFilters>({})
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [groupAnchor, setGroupAnchor] = useState<HTMLElement | null>(null)
  const [actionsAnchor, setActionsAnchor] = useState<HTMLElement | null>(null)
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null)
  const [manageOpen, setManageOpen] = useState(false)

  const filters = api.filters ?? {}
  const filterCount = countChipFilters(filters)
  const withSelection = Boolean(selectable || (actions && actions.length > 0))

  const activePresetId = useMemo(() => {
    if (selectedPresetId && presets) {
      const selected = presets.all.find((p) => p.id === selectedPresetId)
      if (selected && chipFiltersEqual(selected.filters, filters)) return selected.id
    }
    if (countChipFilters(filters) === 0) return 'all'
    return presets?.all.find((p) => chipFiltersEqual(p.filters, filters))?.id ?? null
  }, [presets, selectedPresetId, filters])

  const applyFilters = (next: ChipFilters, presetId?: string) => {
    setSelectedPresetId(presetId ?? null)
    api.setFilters(next)
  }

  const activeGroupLabel = api.groupByColumns?.find((g) => g.field === api.groupBy)?.label

  const runAction = async (action: ResourceAction) => {
    setActionsAnchor(null)
    const count = api.selectedIds.length
    if (action.confirmationMessage && !confirm(action.confirmationMessage(count))) return
    await action.handle(api.selectedIds)
    api.clearSelection()
    if (api.groupBy) api.setGroupBy(api.groupBy)
    api.refetch()
  }

  const runExport = (format: string) => {
    setExportAnchor(null)
    void onExport?.({
      format,
      search: api.search,
      sort: api.sort,
      filters: api.filters,
      groupBy: api.groupBy,
      selectedIds: api.selectedIds,
    })
  }

  return (
    <DataTableRoot api={api}>
      {(presets || onCreate) && (
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
            {presets && (
              <>
                <ToggleButtonGroup
                  exclusive
                  value={activePresetId}
                  onChange={(_, nextId: string | null) => {
                    if (!nextId) return
                    if (nextId === 'all') { applyFilters({}); return }
                    const p = presets.all.find((preset) => preset.id === nextId)
                    if (p) applyFilters(p.filters, p.id)
                  }}
                >
                  <ToggleButton value="all" data-label="All">All</ToggleButton>
                  {presets.all.map((p) => (
                    <ToggleButton key={p.id} value={p.id} data-label={p.name}>{p.name}</ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Tooltip title="Manage views">
                  <IconButton
                    onClick={() => setManageOpen(true)}
                    aria-label="Manage views"
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: '8px',
                      bgcolor: '#F6F7FB',
                      border: '1px solid #E8E8E8',
                      color: '#292D32',
                      '&:hover': { bgcolor: '#EDEFF5' },
                    }}
                  >
                    <SettingIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>
          {onCreate && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
              {createLabel}
            </Button>
          )}
        </Stack>
      )}

      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1, minHeight: 40 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
          <DataTableSearchField
            placeholder={searchPlaceholder}
            width={searchWidth}
            filterCount={filterColumns ? filterCount : 0}
            onOpenFilters={filterColumns ? (anchor) => { setFilterDraft(filters); setFilterAnchor(anchor) } : undefined}
          />
          {api.groupByColumns && api.groupByColumns.length > 0 && (
            <ToolbarBtn
              icon={<GroupIcon />}
              label={activeGroupLabel ? `Group: ${activeGroupLabel}` : 'Group'}
              onClick={(e) => setGroupAnchor(e.currentTarget)}
            />
          )}
          {onExport && (
            <Tooltip title={exportTooltip}>
              <span>
                <ToolbarBtn
                  icon={<ExportIcon />}
                  label="Export"
                  menu={exportFormats.length > 1}
                  onClick={(e) => {
                    if (exportFormats.length > 1) setExportAnchor(e.currentTarget)
                    else runExport(exportFormats[0]?.id ?? 'csv')
                  }}
                />
              </span>
            </Tooltip>
          )}
          {onImport && (
            <Tooltip title={importTooltip}>
              <span>
                <ToolbarBtn icon={<ImportIcon />} label="Import" menu={false} onClick={onImport} />
              </span>
            </Tooltip>
          )}
          {actions && actions.length > 0 && api.selectedIds.length > 0 && (
            <ToolbarBtn
              icon={<ActionsIcon />}
              label={`Actions (${api.selectedIds.length})`}
              onClick={(e) => setActionsAnchor(e.currentTarget)}
            />
          )}
        </Stack>
        <Box sx={{ minHeight: 40, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <DataTablePagination rowsPerPageOptions={rowsPerPageOptions} />
          {api.groupBy && (
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#595959', fontVariantNumeric: 'tabular-nums' }}>
              {api.groups.length} groups · {api.groupsTotal} records
            </Typography>
          )}
        </Box>
      </Stack>

      {actions && actions.length > 0 && (
        <Menu anchorEl={actionsAnchor} open={Boolean(actionsAnchor)} onClose={() => setActionsAnchor(null)}>
          {actions.map((action) => (
            <MenuItem key={action.label} onClick={() => { void runAction(action) }}>
              {action.label}
            </MenuItem>
          ))}
        </Menu>
      )}

      {onExport && exportFormats.length > 1 && (
        <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}>
          {exportFormats.map((format) => (
            <MenuItem key={format.id} onClick={() => runExport(format.id)}>
              {format.label}
            </MenuItem>
          ))}
        </Menu>
      )}

      <Menu anchorEl={groupAnchor} open={Boolean(groupAnchor)} onClose={() => setGroupAnchor(null)}>
        {[{ field: null as Field | null, label: 'None' }, ...(api.groupByColumns ?? [])].map((g) => (
          <MenuItem
            key={g.label}
            selected={api.groupBy === g.field}
            onClick={() => { api.setGroupBy(g.field); setGroupAnchor(null) }}
          >
            {g.label}
          </MenuItem>
        ))}
      </Menu>

      {filterColumns && (
        <DataTableFilterMenu
          anchorEl={filterAnchor}
          onClose={() => setFilterAnchor(null)}
          filterColumns={filterColumns}
          draft={filterDraft}
          onDraftChange={setFilterDraft}
          onApply={applyFilters}
          presets={presets}
        />
      )}

      {presets && filterColumns && (
        <ManageViewsDialog
          open={manageOpen}
          onClose={() => setManageOpen(false)}
          presets={presets}
          filterColumns={filterColumns}
          onApply={(next, presetId) => { applyFilters(next, presetId); setManageOpen(false) }}
        />
      )}

      <Card sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DataTableBody<Row>
          selectable={withSelection}
          emptyMessage={emptyMessage}
          stickyHeader={stickyHeader}
          onRowClick={onRowClick}
          rowClass={rowClass}
        />
      </Card>
    </DataTableRoot>
  )
}

function ToolbarBtn({ icon, label, onClick, menu = true }: {
  icon: ReactElement
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  menu?: boolean
}) {
  return (
    <Button variant="outlined" color="inherit" startIcon={icon} endIcon={menu ? <ExpandMoreRoundedIcon /> : undefined} onClick={onClick}>
      {label}
    </Button>
  )
}

DataTable.Root = DataTableRoot
DataTable.SearchField = DataTableSearchField
DataTable.Body = DataTableBody
DataTable.Pagination = DataTablePagination
