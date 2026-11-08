import { useMemo, useState, type ReactElement, type ReactNode } from 'react'
import {
  Box, Button, Card, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import type {
  DataTableApi, PresetsApi, ExportFormat, ExportRequest, FilterColumnDef, FilterRenderers, FilterValues, ResourceAction,
} from '@kyrobit/datatable'
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable'
import { DataTableRoot } from './context.js'
import { DataTableSearchField } from './SearchField.js'
import { DataTableBody } from './Body.js'
import { DataTablePagination } from './Pagination.js'
import { ManageViewsDialog } from './FilterMenu.js'
import { DataTableFilterButton } from './FilterButton.js'
import { DataTableGroupMenu } from './GroupMenu.js'
import { DataTableSettingsDialog } from './SettingsDialog.js'
import { ConfirmDialog } from './ConfirmDialog.js'
import { ActionsIcon, ExportIcon, ImportIcon, SettingIcon } from './icons.js'

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
  filterRenderers?: FilterRenderers
  onImport?: () => void
  exportTooltip?: string
  importTooltip?: string
  /** Bulk actions offered while rows are selected. Enables the checkbox column. */
  actions?: ResourceAction<Field>[]
  selectable?: boolean
  /** The toolbar's settings button and its dialog. Default `true`; pass `false` where a table
   * has one fixed column set and nothing to configure. */
  settings?: boolean
  onRowClick?: (row: Row) => void
  onRowIntent?: (row: Row) => void
  rowClass?: (row: Row) => string
  /** Shown in place of the table when there are no records at all. */
  emptyMessage?: ReactNode
  /** Shown in place of the table when a search or filter matches nothing. */
  noResultsMessage?: ReactNode
  /** Shown in place of the table when the fetch fails. */
  errorMessage?: ReactNode
  stickyHeader?: boolean
  rowsPerPageOptions?: number[]
}

/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
const withTooltip = (title: string | undefined, child: ReactElement) =>
  title ? (
    <Tooltip title={title}>
      <span>{child}</span>
    </Tooltip>
  ) : (
    child
  )

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
  filterRenderers,
  onImport,
  exportTooltip,
  importTooltip,
  actions,
  selectable,
  settings = true,
  onRowClick,
  onRowIntent,
  rowClass,
  emptyMessage,
  noResultsMessage,
  errorMessage,
  stickyHeader,
  rowsPerPageOptions,
}: DataTableProps<Row, Field>) {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [actionsAnchor, setActionsAnchor] = useState<HTMLElement | null>(null)
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<ResourceAction<Field> | null>(null)

  const filters = api.filters ?? {}
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


  const executeAction = async (action: ResourceAction<Field>) => {
    await action.handle({ selection: api.selection, count: api.selectedCount, search: api.search, filters: api.filters })
    api.clearSelection()
    if (api.groupBy.length > 0) api.setGroupBy(api.groupBy)
    api.refetch()
  }

  const runAction = (action: ResourceAction<Field>) => {
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
      selection: api.selection,
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
            )}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
            {onCreate && (
              <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
                {createLabel}
              </Button>
            )}
            {toolbarEnd}
          </Stack>
        </Stack>
      )}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1, minHeight: 40 }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
          <DataTableSearchField placeholder={searchPlaceholder} width={searchWidth} alwaysOpen />
          {filterColumns && (
            <DataTableFilterButton
              filterColumns={filterColumns}
              presets={presets}
              filterRenderers={filterRenderers}
              onApply={applyFilters}
            />
          )}
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
              <DataTableGroupMenu />
            )}
            {onImport && withTooltip(
              importTooltip,
              <ToolbarBtn icon={<ImportIcon />} label="Import" menu={false} onClick={onImport} />,
            )}
            {onExport && withTooltip(
              exportTooltip,
              <ToolbarBtn
                icon={<ExportIcon />}
                label="Export"
                menu={exportFormats.length > 1}
                onClick={(e) => {
                  if (exportFormats.length > 1) setExportAnchor(e.currentTarget)
                  else runExport(exportFormats[0]?.id ?? 'csv')
                }}
              />,
            )}
            {actions && actions.length > 0 && api.selectedCount > 0 && (
              <ToolbarBtn
                icon={<ActionsIcon />}
                label={`Actions (${api.selectedCount})`}
                onClick={(e) => setActionsAnchor(e.currentTarget)}
              />
            )}
            {settings && (
              <ToolbarBtn
                icon={<SettingIcon />}
                label="Settings"
                menu={false}
                onClick={() => setSettingsOpen(true)}
              />
            )}
          </Stack>
        </Stack>
        <Box sx={{ minHeight: 40, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <DataTablePagination rowsPerPageOptions={rowsPerPageOptions} />
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
          title={pendingAction.confirmationMessage!(api.selectedCount)}
          description={pendingAction.confirmationDescription?.(api.selectedCount)}
          confirmLabel={pendingAction.label}
          confirmColor={pendingAction.confirmColor ?? 'error'}
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

      {presets && filterColumns && (
        <ManageViewsDialog
          open={manageOpen}
          onClose={() => setManageOpen(false)}
          presets={presets}
          filterColumns={filterColumns}
        />
      )}

      {settings && (
        <DataTableSettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onManageViews={
            presets && filterColumns
              ? () => { setSettingsOpen(false); setManageOpen(true) }
              : undefined
          }
        />
      )}

      <Card sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DataTableBody<Row>
          selectable={withSelection}
          emptyMessage={emptyMessage}
          noResultsMessage={noResultsMessage}
          errorMessage={errorMessage}
          stickyHeader={stickyHeader}
          onRowClick={onRowClick}
          onRowIntent={onRowIntent}
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
