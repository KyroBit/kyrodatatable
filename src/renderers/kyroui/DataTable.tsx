import { startTransition, useEffect, useMemo, useOptimistic, useState, type ReactNode } from 'react'
import {
  Box, Button, Card, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Submenu, ToggleButton, ToggleButtonGroup, Typography,
} from '@kyrobit/kyroui'
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
import { ActionsIcon, AddIcon, ExportIcon, ImportIcon, SettingIcon } from './icons.js'

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
  /** Loads the next page as the end of the table scrolls into view, in place of page controls. */
  infiniteScroll?: boolean
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
  infiniteScroll,
}: DataTableProps<Row, Field>) {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<ResourceAction<Field> | null>(null)

  const { page } = api.pagination
  const { setPage } = api
  useEffect(() => {
    if (infiniteScroll && page !== 1) setPage(1)
  }, [infiniteScroll, page, setPage])

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

  const [shownPresetId, showPreset] = useOptimistic(activePresetId)

  const applyFilters = (next: FilterValues, presetId?: string) => {
    setSelectedPresetId(presetId ?? null)
    api.setFilters(next)
  }

  const pickPreset = (presetId: string, next: FilterValues) =>
    startTransition(() => {
      showPreset(presetId)
      applyFilters(next, presetId === 'all' ? undefined : presetId)
    })


  const executeAction = async (action: ResourceAction<Field>) => {
    await action.handle({ selection: api.selection, count: api.selectedCount, search: api.search, filters: api.filters })
    api.clearSelection()
    if (api.groupBy.length > 0) api.setGroupBy(api.groupBy)
    api.refetch()
  }

  const runAction = (action: ResourceAction<Field>) => {
    if (action.confirmationMessage) { setPendingAction(action); return }
    void executeAction(action)
  }

  const runExport = (format: string) => {
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
          sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 'md' }}
        >
          <Stack direction="row" spacing="sm" sx={{ alignItems: 'center', minWidth: 0, flexWrap: 'wrap' }}>
            {presets && presets.all.length > 0 && (
              <ToggleButtonGroup
                exclusive
                value={shownPresetId}
                onChange={(_, nextId: string | null) => {
                  if (!nextId) return
                  if (nextId === 'all') { pickPreset('all', {}); return }
                  const p = presets.all.find((preset) => preset.id === nextId)
                  if (p) pickPreset(p.id, p.filters)
                }}
              >
                <ToggleButton value="all" data-label="All">All</ToggleButton>
                {presets.all.map((p) => (
                  <ToggleButton key={p.id} value={p.id} data-label={p.name}>{p.name}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          </Stack>
          <Stack direction="row" spacing="sm" sx={{ alignItems: 'center', flexShrink: 0 }}>
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
        sx={(theme) => ({ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 'sm', minHeight: theme.vars.size.row })}
      >
        <Stack direction="row" spacing="sm" sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
          <DataTableSearchField
            placeholder={searchPlaceholder}
            width={searchWidth}
            alwaysOpen
            endAdornment={filterColumns && (
              <DataTableFilterButton
                filterColumns={filterColumns}
                presets={presets}
                filterRenderers={filterRenderers}
                onApply={applyFilters}
              />
            )}
          />
          {api.groupByColumns && api.groupByColumns.length > 0 && (
            <DataTableGroupMenu />
          )}
          {actions && actions.length > 0 && api.selectedCount > 0 && (
            <Menu label={`Actions (${api.selectedCount})`} startIcon={<ActionsIcon />}>
              {actions.map((action) => (
                <MenuItem key={action.label} onClick={() => runAction(action)}>
                  {action.label}
                </MenuItem>
              ))}
            </Menu>
          )}
          {(onExport || onImport || settings) && (
            <Menu aria-label="More" variant="outlined" placement="bottom-start">
              {onImport && (
                <MenuItem onClick={onImport}>
                  <ListItemIcon><ImportIcon /></ListItemIcon>
                  <ListItemText primary="Import" secondary={importTooltip} />
                </MenuItem>
              )}
              {onExport && exportFormats.length > 1 && (
                <Submenu label="Export" icon={<ExportIcon />}>
                  {exportFormats.map((format) => (
                    <MenuItem key={format.id} onClick={() => runExport(format.id)}>
                      {format.label}
                    </MenuItem>
                  ))}
                </Submenu>
              )}
              {onExport && exportFormats.length === 1 && (
                <MenuItem onClick={() => runExport(exportFormats[0]!.id)}>
                  <ListItemIcon><ExportIcon /></ListItemIcon>
                  <ListItemText primary="Export" secondary={exportTooltip} />
                </MenuItem>
              )}
              {settings && (
                <MenuItem onClick={() => setSettingsOpen(true)}>
                  <ListItemIcon><SettingIcon /></ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>
              )}
            </Menu>
          )}
        </Stack>
      </Stack>

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

      <Card sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }}>
        <DataTableBody<Row>
          selectable={withSelection}
          emptyMessage={emptyMessage}
          noResultsMessage={noResultsMessage}
          errorMessage={errorMessage}
          stickyHeader={stickyHeader}
          onRowClick={onRowClick}
          onRowIntent={onRowIntent}
          rowClass={rowClass}
          infiniteScroll={infiniteScroll}
        />
      </Card>
      {(!infiniteScroll || api.groupBy.length > 0) && (
      <Box data-table-footer="" sx={(theme) => ({ minHeight: theme.vars.size.row, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' })}>
        {!infiniteScroll && <DataTablePagination rowsPerPageOptions={rowsPerPageOptions} />}
        {infiniteScroll && (
          <Typography sx={{ fontSize: 'md', fontWeight: 500, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            {api.groupsTotal} groups · {api.total} records
          </Typography>
        )}
      </Box>
      )}
    </DataTableRoot>
  )
}

DataTable.Root = DataTableRoot
DataTable.SearchField = DataTableSearchField
DataTable.Body = DataTableBody
DataTable.Pagination = DataTablePagination
