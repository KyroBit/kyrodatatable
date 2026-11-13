import { startTransition, useEffect, useLayoutEffect, useMemo, useOptimistic, useState, type ReactNode } from 'react'
import {
  Badge, Box, Button, Card, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Submenu, ToggleButton,
  ToggleButtonGroup, Typography, useTheme,
} from '@kyrobit/kyroui'
import type {
  DataTableApi, PresetsApi, ExportFormat, ExportRequest, FilterColumnDef, FilterRenderers, FilterValues, ResourceAction,
} from '@kyrobit/datatable'
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable'
import { DataTableRoot, type DrillTrail, type SelectMode, type Trail } from './context.js'
import { DataTableSearchField } from './SearchField.js'
import { DataTableBody } from './Body.js'
import { DataTablePagination } from './Pagination.js'
import { ManageViewsDialog } from './FilterMenu.js'
import { DataTableFilterButton } from './FilterButton.js'
import { DataTableGroupMenu, DataTableGroupPanel } from './GroupMenu.js'
import { DataTableSettingsDialog } from './SettingsDialog.js'
import { ConfirmDialog } from './ConfirmDialog.js'
import { ActionsIcon, CloseIcon, ExportIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js'

export interface DataTableProps<Row, Field extends string = string> {
  api: DataTableApi<Row, Field, FilterValues>
  /** Enables the views pill bar, save-as-view, and the manage dialog. */
  presets?: PresetsApi<FilterValues>
  /** Enables the filter popover; each entry renders a chip section. */
  filterColumns?: FilterColumnDef[]
  searchPlaceholder?: string
  searchWidth?: number | string
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
  groupsPerPageOptions?: number[]
  /** Loads the next page as the end of the table scrolls into view, in place of page controls. */
  infiniteScroll?: boolean
  restoreScroll?: boolean
  renderListItem?: (row: Row) => ReactNode
  listVariant?: 'plain' | 'cards'
  variant?: 'auto' | 'list'
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
  groupsPerPageOptions,
  infiniteScroll,
  restoreScroll,
  renderListItem,
  listVariant,
  variant,
}: DataTableProps<Row, Field>) {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<ResourceAction<Field> | null>(null)
  const [toolbar, setToolbar] = useState<HTMLElement | null>(null)
  const [compact, setCompact] = useState(false)
  const [groupAnchor, setGroupAnchor] = useState<HTMLElement | null>(null)
  const selectMode: SelectMode = useState(false)
  const [selectModeOn, setSelectModeOn] = selectMode
  const drill: DrillTrail = useState<Trail>({ key: '', ids: [] })
  const compactBelow = useTheme().breakpoints.values.sm

  useLayoutEffect(() => {
    if (!toolbar) return
    setCompact(toolbar.clientWidth < compactBelow)
    const observer = new ResizeObserver(([entry]) => setCompact(entry!.contentRect.width < compactBelow))
    observer.observe(toolbar)
    return () => observer.disconnect()
  }, [toolbar, compactBelow])

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
    setSelectModeOn(false)
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

  const groupable = Boolean(api.groupByColumns && api.groupByColumns.length > 0)
  const hasActions = Boolean(actions && actions.length > 0)
  const selecting = compact && selectModeOn
  const listed = renderListItem !== undefined && (variant === 'list' || compact)
  const drilledIn = listed && drill[0].key === api.groupBy.join('|') && drill[0].ids.length > 0

  const views = presets && presets.all.length > 0 && (
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
  )

  const search = (
    <DataTableSearchField
      placeholder={searchPlaceholder}
      width={compact ? '100%' : searchWidth}
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
  )

  const actionItems = actions?.map((action) => (
    <MenuItem key={action.label} onClick={() => runAction(action)}>
      {action.label}
    </MenuItem>
  ))

  const moreItems = [
    onImport && (
      <MenuItem key="import" onClick={onImport}>
        <ListItemIcon><ImportIcon /></ListItemIcon>
        <ListItemText primary="Import" secondary={importTooltip} />
      </MenuItem>
    ),
    onExport && exportFormats.length > 1 && (
      <Submenu key="export" label="Export" icon={<ExportIcon />}>
        {exportFormats.map((format) => (
          <MenuItem key={format.id} onClick={() => runExport(format.id)}>
            {format.label}
          </MenuItem>
        ))}
      </Submenu>
    ),
    onExport && exportFormats.length === 1 && (
      <MenuItem key="export" onClick={() => runExport(exportFormats[0]!.id)}>
        <ListItemIcon><ExportIcon /></ListItemIcon>
        <ListItemText primary="Export" secondary={exportTooltip} />
      </MenuItem>
    ),
    settings && !listed && (
      <MenuItem key="settings" onClick={() => setSettingsOpen(true)}>
        <ListItemIcon><SettingIcon /></ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>
    ),
    settings && listed && presets && filterColumns && (
      <MenuItem key="views" onClick={() => setManageOpen(true)}>
        <ListItemIcon><SettingIcon /></ListItemIcon>
        <ListItemText primary="Manage views" />
      </MenuItem>
    ),
  ]

  return (
    <DataTableRoot api={api} selectMode={selectMode} drill={drill}>
      {compact ? (
        <>
          <Stack ref={setToolbar} direction="row" spacing="sm" sx={{ alignItems: 'center' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>{search}</Box>
            {groupable && (
              <Badge badgeContent={api.groupBy.length} color="primary">
                <IconButton
                  variant="outlined"
                  aria-label="Group"
                  aria-haspopup="dialog"
                  aria-expanded={Boolean(groupAnchor)}
                  onClick={(event) => setGroupAnchor(event.currentTarget)}
                >
                  <GroupIcon />
                </IconButton>
              </Badge>
            )}
            {!selecting && moreItems.some(Boolean) && (
              <Menu aria-label="More" variant="outlined" placement="bottom-end">
                {moreItems}
              </Menu>
            )}
          </Stack>
          {selecting ? (
            <Stack
              direction="row"
              spacing="sm"
              sx={(theme) => ({ alignItems: 'center', minHeight: theme.vars.size.row })}
            >
              <IconButton
                aria-label="Clear selection"
                onClick={() => {
                  api.clearSelection()
                  setSelectModeOn(false)
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ flex: 1, fontWeight: 600, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                {api.selectedCount} selected
              </Typography>
              <Button variant="text" onClick={() => api.toggleSelectAll()}>
                {api.allSelected ? 'Deselect all' : 'Select all'}
              </Button>
              {hasActions && <Menu aria-label="Actions" placement="bottom-end">{actionItems}</Menu>}
            </Stack>
          ) : views && (
            <Box sx={{ overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
              <Box sx={{ display: 'inline-flex' }}>{views}</Box>
            </Box>
          )}
        </>
      ) : (
        <>
          {(presets || toolbarEnd) && (
            <Stack
              sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 'md' }}
            >
              <Stack direction="row" spacing="sm" sx={{ alignItems: 'center', minWidth: 0, flexWrap: 'wrap' }}>
                {views}
              </Stack>
              <Stack direction="row" spacing="sm" sx={{ alignItems: 'center', flexShrink: 0 }}>
                {toolbarEnd}
              </Stack>
            </Stack>
          )}

          <Stack
            ref={setToolbar}
            sx={(theme) => ({ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 'sm', minHeight: theme.vars.size.row })}
          >
            <Stack direction="row" spacing="sm" sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
              {search}
              {groupable && <DataTableGroupMenu />}
              {hasActions && api.selectedCount > 0 && (
                <Menu label={`Actions (${api.selectedCount})`} startIcon={<ActionsIcon />}>
                  {actionItems}
                </Menu>
              )}
              {moreItems.some(Boolean) && (
                <Menu aria-label="More" variant="outlined" placement="bottom-start">
                  {moreItems}
                </Menu>
              )}
            </Stack>
          </Stack>
        </>
      )}

      {groupable && <DataTableGroupPanel anchor={groupAnchor} onClose={() => setGroupAnchor(null)} />}

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

      <Card
        sx={{
          p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, position: 'relative',
          ...(compact && { overflow: 'clip', flex: 'none' }),
          ...(compact && renderListItem && { overflow: 'visible', border: 'none', borderRadius: 0, bgcolor: 'transparent', boxShadow: 'none' }),
        }}
      >
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
          restoreScroll={restoreScroll}
          renderListItem={renderListItem}
          listVariant={listVariant}
          variant={variant}
          pageScroll={compact}
        />
      </Card>
      {(!infiniteScroll || api.groupBy.length > 0) && !drilledIn && (
      <Box data-table-footer="" sx={(theme) => ({ minHeight: theme.vars.size.row, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' })}>
        {!infiniteScroll && (
          <DataTablePagination
            rowsPerPageOptions={compact ? [] : rowsPerPageOptions}
            groupsPerPageOptions={compact ? [] : groupsPerPageOptions}
          />
        )}
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
