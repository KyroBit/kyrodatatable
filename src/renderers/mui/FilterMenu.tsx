import { useEffect, useState, type ReactNode } from 'react'
import { Box, Button, Dialog, Divider, IconButton, Menu, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { countFilterValues, filterValuesEqual, summarizeFilterValues } from '../../filterValues.js'
import type { PresetsApi } from '../../state/usePresets.js'
import type {
  DateFilterColumnDef, DateRangeValue, FilterColumnDef, FilterOption, FilterValues, SelectFilterColumnDef, TextFilterColumnDef,
} from '../../types/index.js'
import { EditIcon, TrashIcon } from './icons.js'

export { filterValuesEqual, countFilterValues, summarizeFilterValues } from '../../filterValues.js'

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={(theme) => ({
        border: 'none',
        cursor: 'pointer',
        px: '14px',
        py: '8px',
        borderRadius: '8px',
        fontFamily: 'inherit',
        fontSize: '13px',
        fontWeight: 500,
        bgcolor: active ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.04),
        color: active ? theme.palette.background.paper : theme.palette.text.secondary,
        transition: 'background-color 0.15s, color 0.15s',
        '&:hover': { bgcolor: active ? alpha(theme.palette.text.primary, 0.85) : alpha(theme.palette.text.primary, 0.08) },
      })}
    >
      {label}
    </Box>
  )
}

function SelectFilterField({ column, value: raw, onChange }: {
  column: SelectFilterColumnDef
  value: FilterValues[string] | undefined
  onChange: (next: FilterValues[string]) => void
}) {
  const value = Array.isArray(raw) ? raw : []
  const isAsync = typeof column.options === 'function'
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 250)
  const [asyncOptions, setAsyncOptions] = useState<FilterOption[]>([])
  const [loading, setLoading] = useState(false)
  const [labelCache, setLabelCache] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAsync) return
    let cancelled = false
    const load = column.options as (query: string) => Promise<FilterOption[]>
    setLoading(true)
    load(debouncedQuery)
      .then((results) => {
        if (cancelled) return
        setAsyncOptions(results)
        setLabelCache((prev) => {
          const next = { ...prev }
          for (const option of results) next[option.value] = option.label
          return next
        })
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [isAsync, debouncedQuery, column.options])

  const options = isAsync ? asyncOptions : (column.options as FilterOption[])
  const selectedElsewhere = isAsync
    ? value.filter((v) => !options.some((o) => o.value === v)).map((v) => ({ label: labelCache[v] ?? v, value: v }))
    : []
  const visibleOptions = [...selectedElsewhere, ...options]

  return (
    <Box>
      {isAsync && (
        <TextField
          size="small"
          fullWidth
          placeholder={`Search ${column.label.toLowerCase()}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 1 }}
        />
      )}
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1, alignItems: 'center' }}>
        {visibleOptions.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            active={value.includes(option.value)}
            onClick={() => onChange(
              value.includes(option.value) ? value.filter((v) => v !== option.value) : [...value, option.value],
            )}
          />
        ))}
        {isAsync && loading && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Searching…</Typography>
        )}
        {isAsync && !loading && visibleOptions.length === 0 && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>No matches</Typography>
        )}
      </Stack>
    </Box>
  )
}

function TextFilterField({ column, value: raw, onChange }: {
  column: TextFilterColumnDef
  value: FilterValues[string] | undefined
  onChange: (next: FilterValues[string]) => void
}) {
  const value = typeof raw === 'string' ? raw : ''
  return (
    <TextField
      size="small"
      fullWidth
      type={column.inputType === 'number' ? 'number' : 'text'}
      placeholder={column.placeholder ?? `Enter ${column.label.toLowerCase()}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromIsoDate(iso?: string): Date | null {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

/** A single date field: a themed trigger button opening a hand-rolled calendar popover — not `<input type="date">`, whose picker UI is native browser chrome no CSS can restyle. */
function SingleDatePicker({ ariaLabel, value, onChange }: {
  ariaLabel: string
  value?: string
  onChange: (next: string | undefined) => void
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const selected = fromIsoDate(value)
  const [viewDate, setViewDate] = useState<Date>(selected ?? new Date())

  const open = (e: React.MouseEvent<HTMLElement>) => {
    setViewDate(selected ?? new Date())
    setAnchor(e.currentTarget)
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]

  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={open}
        aria-label={ariaLabel}
        sx={(theme) => ({
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          textAlign: 'left',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
          bgcolor: 'background.paper',
          px: '12px',
          py: '8.5px',
          fontFamily: 'inherit',
          fontSize: '13px',
          color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
          cursor: 'pointer',
          '&:hover': { borderColor: alpha(theme.palette.text.primary, 0.24) },
        })}
      >
        {selected ? selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
        <CalendarTodayRoundedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
      </Box>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { borderRadius: '12px', mt: 0.5 } } }}
      >
        <Box sx={{ p: 1.5, width: 260 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <IconButton size="small" onClick={() => setViewDate(new Date(year, month - 1, 1))} aria-label="Previous month">
              <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton size="small" onClick={() => setViewDate(new Date(year, month + 1, 1))} aria-label="Next month">
              <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', mb: 0.5 }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Typography key={i} sx={{ fontSize: '10px', fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>{d}</Typography>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((date, i) => {
              if (!date) return <Box key={i} />
              const isSelected = selected !== null && date.toDateString() === selected.toDateString()
              const isToday = date.toDateString() === today.toDateString()
              return (
                <Box
                  key={i}
                  component="button"
                  type="button"
                  onClick={() => { onChange(toIsoDate(date)); setAnchor(null) }}
                  sx={(theme) => ({
                    border: isToday && !isSelected ? '1px solid' : 'none',
                    borderColor: 'divider',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 500,
                    height: 30,
                    bgcolor: isSelected ? theme.palette.primary.main : 'transparent',
                    color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    '&:hover': { bgcolor: isSelected ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.06) },
                  })}
                >
                  {date.getDate()}
                </Box>
              )
            })}
          </Box>
          {selected && (
            <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1 }}>
              <Box
                component="button"
                type="button"
                onClick={() => { onChange(undefined); setAnchor(null) }}
                sx={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, color: 'error.main', p: 0 }}
              >
                Clear
              </Box>
            </Stack>
          )}
        </Box>
      </Menu>
    </>
  )
}

function DateFilterField({ column, value: raw, onChange }: {
  column: DateFilterColumnDef
  value: FilterValues[string] | undefined
  onChange: (next: FilterValues[string]) => void
}) {
  const value: DateRangeValue = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}

  if (!column.range) {
    return (
      <SingleDatePicker
        ariaLabel={column.label}
        value={value.from}
        onChange={(next) => onChange({ from: next })}
      />
    )
  }

  return (
    <Stack direction="row" spacing={1}>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>From</Typography>
        <SingleDatePicker
          ariaLabel={`${column.label} from`}
          value={value.from}
          onChange={(next) => onChange({ ...value, from: next })}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>To</Typography>
        <SingleDatePicker
          ariaLabel={`${column.label} to`}
          value={value.to}
          onChange={(next) => onChange({ ...value, to: next })}
        />
      </Box>
    </Stack>
  )
}

/**
 * Strategy dispatcher: picks the field renderer by `column.type` and hands it
 * the raw slice of `FilterValues` — each renderer narrows its own value and
 * owns its own markup and state (e.g. the async search box). Add a new filter
 * type by adding a variant to `FilterColumnDef` and a case here; nothing else
 * in the popover or the manage-views dialog needs to change.
 */
function FilterField({ column, value, onChange }: {
  column: FilterColumnDef
  value: FilterValues[string] | undefined
  onChange: (next: FilterValues[string]) => void
}) {
  switch (column.type) {
    case 'select': return <SelectFilterField column={column} value={value} onChange={onChange} />
    case 'text': return <TextFilterField column={column} value={value} onChange={onChange} />
    case 'date': return <DateFilterField column={column} value={value} onChange={onChange} />
  }
}

function HeaderIconButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={(theme) => ({
        width: 26,
        height: 26,
        bgcolor: alpha(theme.palette.text.primary, 0.04),
        color: theme.palette.text.primary,
        '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
      })}
    >
      {children}
    </IconButton>
  )
}

export interface DataTableFilterMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  filterColumns: FilterColumnDef[]
  draft: FilterValues
  onDraftChange: (next: FilterValues) => void
  /** `presetId` is set when the apply came from saving a view. */
  onApply: (filters: FilterValues, presetId?: string) => void
  presets?: PresetsApi<FilterValues>
}

export function DataTableFilterMenu({
  anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, presets,
}: DataTableFilterMenuProps) {
  const [mode, setMode] = useState<'filter' | 'save'>('filter')
  const [name, setName] = useState('')

  const draftEmpty = countFilterValues(draft) === 0

  const close = () => {
    setMode('filter')
    setName('')
    onClose()
  }

  const saveFilter = () => {
    const trimmed = name.trim()
    if (!trimmed || !presets) return
    const id = presets.create(trimmed, draft)
    onApply(draft, id)
    close()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={close}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { width: 300, mt: 1, borderRadius: '14px' } } }}
    >
      <Box sx={{ px: 2, pt: 1.25, pb: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {mode === 'save' && (
              <IconButton onClick={() => setMode('filter')} aria-label="Back" sx={{ width: 26, height: 26, ml: -0.5, color: 'text.primary' }}>
                <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'text.primary' }}>
              {mode === 'save' ? 'Save as view' : 'Filter'}
            </Typography>
          </Stack>
          <HeaderIconButton onClick={close} label="Close filters">
            <CloseRoundedIcon sx={{ fontSize: 15 }} />
          </HeaderIconButton>
        </Stack>
        <Divider />

        {mode === 'filter' && (
          <>
            {filterColumns.map((column) => (
              <Box key={column.field}>
                <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: 'text.primary', mt: 1.75, mb: 1 }}>{column.label}</Typography>
                <FilterField
                  column={column}
                  value={draft[column.field]}
                  onChange={(next) => onDraftChange({ ...draft, [column.field]: next })}
                />
              </Box>
            ))}
            <Divider sx={{ mt: 2 }} />
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1.75 }}>
              <Box
                component="button"
                type="button"
                onClick={() => { onApply({}); close() }}
                sx={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  p: 0,
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'error.main',
                  textDecoration: 'underline',
                  '&:hover': { color: 'error.dark' },
                }}
              >
                Clear all
              </Box>
              <Stack direction="row" spacing={1}>
                {presets && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled={draftEmpty}
                    onClick={() => setMode('save')}
                    sx={{ height: 36, minHeight: 36, px: '16px', fontSize: '13px', borderRadius: '8px' }}
                  >
                    Save
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => { onApply(draft); close() }}
                  sx={{ height: 36, minHeight: 36, px: '20px', fontSize: '13px' }}
                >
                  Apply
                </Button>
              </Stack>
            </Stack>
          </>
        )}

        {mode === 'save' && (
          <>
            <TextField
              autoFocus
              fullWidth
              placeholder="View name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveFilter() } }}
              sx={{ mt: 2 }}
            />
            <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 1 }}>
              {summarizeFilterValues(draft, filterColumns)}
            </Typography>
            <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                disabled={!name.trim()}
                onClick={saveFilter}
                sx={{ height: 36, minHeight: 36, px: '20px', fontSize: '13px' }}
              >
                Save & apply
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Menu>
  )
}

export interface ManageViewsDialogProps {
  open: boolean
  onClose: () => void
  presets: PresetsApi<FilterValues>
  filterColumns: FilterColumnDef[]
  onApply: (filters: FilterValues, presetId: string) => void
}

export function ManageViewsDialog({ open, onClose, presets, filterColumns, onApply }: ManageViewsDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editFilters, setEditFilters] = useState<FilterValues>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const editing = editingId ? presets.all.find((p) => p.id === editingId) : null

  const close = () => {
    setEditingId(null)
    onClose()
  }

  const startEdit = (id: string) => {
    const preset = presets.all.find((p) => p.id === id)
    if (!preset) return
    setEditName(preset.name)
    setEditFilters(preset.filters)
    setEditingId(id)
  }

  const commitEdit = () => {
    const trimmed = editName.trim()
    if (!editingId || !trimmed) return
    presets.update(editingId, trimmed, editFilters)
    setEditingId(null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = presets.all.findIndex((p) => p.id === active.id)
    const to = presets.all.findIndex((p) => p.id === over.id)
    if (from !== -1 && to !== -1) presets.reorder(from, to)
  }

  return (
    <Dialog open={open} onClose={close} slotProps={{ paper: { sx: { width: 480, maxWidth: '92vw', borderRadius: '16px' } } }}>
      <Box sx={{ px: 3, pt: 2, pb: 2.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {editing && (
              <IconButton onClick={() => setEditingId(null)} aria-label="Back to views" sx={{ width: 28, height: 28, ml: -0.5, color: 'text.primary' }}>
                <ArrowBackRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            )}
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'text.primary' }}>
              {editing ? 'Edit view' : 'Views'}
            </Typography>
          </Stack>
          <IconButton
            onClick={close}
            aria-label="Close views"
            sx={(theme) => ({
              width: 28,
              height: 28,
              bgcolor: alpha(theme.palette.text.primary, 0.04),
              color: theme.palette.text.primary,
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
            })}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
        <Divider />

        {editing ? (
          <>
            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: 'text.primary', mt: 2, mb: 1 }}>Name</Typography>
            <TextField
              autoFocus
              fullWidth
              placeholder="View name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitEdit() } }}
            />
            {filterColumns.map((column) => (
              <Box key={column.field}>
                <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: 'text.primary', mt: 2, mb: 1 }}>{column.label}</Typography>
                <FilterField
                  column={column}
                  value={editFilters[column.field]}
                  onChange={(next) => setEditFilters({ ...editFilters, [column.field]: next })}
                />
              </Box>
            ))}
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setEditingId(null)}
                sx={{ height: 36, minHeight: 36, px: '16px', fontSize: '13px', borderRadius: '8px' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!editName.trim()}
                onClick={commitEdit}
                sx={{ height: 36, minHeight: 36, px: '20px', fontSize: '13px' }}
              >
                Save changes
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Stack spacing={0.25} sx={{ mt: 1.5, maxHeight: 380, overflowY: 'auto' }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={presets.all.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  {presets.all.map((p) => (
                    <SortableViewRow key={p.id} id={p.id} onClick={() => { onApply(p.filters, p.id); close() }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>{p.name}</Typography>
                        <Typography noWrap sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
                          {summarizeFilterValues(p.filters, filterColumns)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={0.25} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="Edit">
                          <IconButton size="small" aria-label={`Edit ${p.name}`} onClick={() => startEdit(p.id)} sx={{ color: 'text.secondary' }}>
                            <EditIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" aria-label={`Delete ${p.name}`} onClick={() => presets.remove(p.id)} sx={{ color: 'error.main' }}>
                            <TrashIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </SortableViewRow>
                  ))}
                </SortableContext>
              </DndContext>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={close} sx={{ height: 36, minHeight: 36, px: '24px', fontSize: '13px' }}>
                Done
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Dialog>
  )
}

function SortableViewRow({ id, children, onClick }: { id: string; children: ReactNode; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      onClick={onClick}
      sx={(theme) => ({
        alignItems: 'center',
        gap: 1,
        pl: 1,
        pr: 1,
        py: 1.25,
        borderRadius: '8px',
        cursor: 'pointer',
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        zIndex: isDragging ? 1 : undefined,
        bgcolor: isDragging ? alpha(theme.palette.text.primary, 0.04) : undefined,
        boxShadow: isDragging ? '0px 8px 24px rgba(0,0,0,0.12)' : undefined,
        '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.04) },
      })}
    >
      <Box
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag to reorder"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.disabled',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          '&:hover': { color: 'text.secondary' },
        }}
      >
        <DragIndicatorIcon sx={{ fontSize: 18 }} />
      </Box>
      {children}
    </Stack>
  )
}
