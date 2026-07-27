import { useMemo, useState, type ReactElement, type ReactNode } from 'react'
import {
  Box, Button, Card, IconButton, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import type {
  DataTableApi, PresetsApi, ExportFormat, ExportRequest, FilterColumnDef, FilterValues, ResourceAction,
} from '@kyrobit/datatable'
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable'
import { DataTableRoot } from './context.js'
import { DataTableSearchField } from './SearchField.js'
import { DataTableBody } from './Body.js'
import { DataTablePagination } from './Pagination.js'
import { DataTableFilterMenu, ManageViewsDialog } from './FilterMenu.js'
import { ConfirmDialog } from './ConfirmDialog.js'
import { ActionsIcon, ExportIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js'

export interface DataTableProps<Row, Field extends string = string> {
  api: DataTableApi<Row, Field, FilterValues>
  /** Enables the views pill bar, save-as-view, and the manage dialog. */
  presets?: PresetsApi<FilterValues>
  /** Enables the filter popover; each entry renders a chip section. */
  filterColumns?: FilterColumnDef[]
  searchPlaceholder?: string
  searchWidth?: number | string
  createLabel?: string
  onCreate?: () => void
  /** Rendered at the trailing end of the views-pill row, alongside the built-in Create
   * button if `onCreate` is also given. An escape hatch for whatever a consumer needs there
   * that this component has no opinion on (a different button, a breakpoint-swapped Fab,
   * more than one action, etc.) — DataTable itself doesn't inspect or care what it is. */
  toolbarEnd?: ReactNode
  /** Receives the full query context; POST it to your export endpoint. */
  onExport?: (request: ExportRequest<Field, FilterValues>) => void | Promise<void>
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
  toolbarEnd,
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
  const [filterDraft, setFilterDraft] = useState<FilterValues>({})
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [groupAnchor, setGroupAnchor] = useState<HTMLElement | null>(null)
  const [actionsAnchor, setActionsAnchor] = useState<HTMLElement | null>(null)
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<ResourceAction | null>(null)

  const filters = api.filters ?? {}
  const filterCount = countFilterValues(filters)
  const withSelection = Boolean(selectable || (actions && actions.length > 0))

  const activePresetId = useMemo(() => {
    if (selectedPresetId && presets) {
      const selected = presets.all.find((p) => p.id === selectedPresetId)
      if (selected && filterValuesEqual(selected.filters, filters)) return selected.id
    }
    if (countFilterValues(filters) === 0) return 'all'
    return presets?.all.find((p) => filterValuesEqual(p.filters, filters))?.id ?? null
  }, [presets, selectedPresetId, filters])

  const applyFilters = (next: FilterValues, presetId?: string) => {
    setSelectedPresetId(presetId ?? null)
    api.setFilters(next)
  }

  const activeGroupLabel = api.groupByColumns?.find((g) => g.field === api.groupBy)?.label

  const executeAction = async (action: ResourceAction) => {
    await action.handle(api.selectedIds)
    api.clearSelection()
    if (api.groupBy) api.setGroupBy(api.groupBy)
    api.refetch()
  }

  const runAction = (action: ResourceAction) => {
    setActionsAnchor(null)
    if (action.confirmationMessage) { setPendingAction(action); return }
    void executeAction(action)
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
      {(presets || onCreate || toolbarEnd) && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0, flexWrap: 'wrap' }}>
            {presets && presets.all.length > 0 && (
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
                  <IconButton color="inherit" size="large" onClick={() => setManageOpen(true)} aria-label="Manage views">
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
          {toolbarEnd}
        </Stack>
      )}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1, minHeight: 40 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
          <DataTableSearchField
            placeholder={searchPlaceholder}
            width={searchWidth}
            filterCount={filterColumns ? filterCount : 0}
            onOpenFilters={filterColumns ? (anchor) => { setFilterDraft(filters); setFilterAnchor(anchor) } : undefined}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              minWidth: 0,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
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
        </Stack>
        <Box sx={{ minHeight: 40, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <DataTablePagination rowsPerPageOptions={rowsPerPageOptions} />
          {api.groupBy && (
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
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

      {pendingAction && (
        <ConfirmDialog
          open
          title={pendingAction.confirmationMessage!(api.selectedIds.length)}
          confirmLabel={pendingAction.label}
          confirmColor="error"
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            const action = pendingAction
            setPendingAction(null)
            void executeAction(action)
          }}
        />
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
