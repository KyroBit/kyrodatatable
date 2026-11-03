import { useEffect, useEffectEvent, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Autocomplete, Box, Button, ChipPicker, DatePicker, Divider, FormDialog, IconButton, Link, Popover, Stack, TextField, Tooltip, Typography,
} from '@kyrobit/kyroui'
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { countFilterValues, filterValuesEqual, summarizeFilterValues } from '@kyrobit/datatable'
import type {
  Preset, PresetsApi, ChoiceFilterColumnDef, FilterRenderers, FilterFieldProps, DateFilterColumnDef, DateRangeValue, FilterColumnDef, FilterOption, FilterValues, SelectFilterColumnDef, TextFilterColumnDef,
} from '@kyrobit/datatable'
import { ArrowBackIcon, CloseIcon, DragIcon, TrashIcon } from './icons.js'
import { ConfirmDialog } from './ConfirmDialog.js'
import { useDialogSize } from './dialogSize.js'

function ChoiceFilterField({ column, value: raw, onChange }: FilterFieldProps<ChoiceFilterColumnDef>) {
  const value = Array.isArray(raw) ? raw : []
  const multi = column.multi !== false

  return (
    <ChipPicker
      options={column.options}
      multiple={multi}
      value={multi ? value : value[0] ?? null}
      onChange={(next) => onChange(next === null ? [] : Array.isArray(next) ? next : [next])}
    />
  )
}

const optionLabels = new WeakMap<object, Map<string, string>>()

function labelsFor(source: object) {
  let cache = optionLabels.get(source)
  if (!cache) {
    cache = new Map()
    optionLabels.set(source, cache)
  }
  return cache
}

function SelectFilterField({ column, value: raw, onChange }: FilterFieldProps<SelectFilterColumnDef>) {
  const value = Array.isArray(raw) ? raw : typeof raw === 'string' && raw ? [raw] : []
  const multiple = column.multi !== false
  const source = column.options
  const cache = labelsFor(source)
  const [, redraw] = useState(0)
  const resolved = useRef(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [found, setFound] = useState<{ id: string; label: string }[]>([])
  const [loading, setLoading] = useState(false)

  const remember = useEffectEvent((options: FilterOption[]) => {
    let changed = false
    for (const option of options) {
      if (cache.get(option.value) === option.label) continue
      cache.set(option.value, option.label)
      changed = true
    }
    if (changed) redraw((tick) => tick + 1)
  })

  const staticOptions = useMemo(
    () => (typeof source === 'function' ? undefined : source.map((option) => ({ id: option.value, label: option.label }))),
    [source],
  )

  useEffect(() => {
    if (!open || typeof source !== 'function') return
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      void source(query)
        .then((results) => {
          if (cancelled) return
          remember(results)
          setFound(results.map((option) => ({ id: option.value, label: option.label })))
        })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, query ? 300 : 0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [open, query, source])

  const unresolved = value.filter((id) => !cache.has(id)).join(',')

  useEffect(() => {
    if (typeof source !== 'function' || !unresolved || resolved.current) return
    resolved.current = true
    void source('').then(remember)
  }, [source, unresolved])

  const selected = value.map((id) => ({
    id,
    label: cache.get(id) ?? staticOptions?.find((option) => option.id === id)?.label ?? id,
  }))

  return (
    <Autocomplete
      multiple={multiple}
      fullWidth
      options={staticOptions ?? found}
      value={multiple ? selected : selected[0] ?? null}
      onChange={(_, next) => onChange(Array.isArray(next) ? next.map((option) => option.id) : next ? [next.id] : [])}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, chosen) => option.id === chosen.id}
      filterOptions={staticOptions ? undefined : (options) => options}
      loading={loading}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false)
        setFound([])
      }}
      onInputChange={(_, next, reason) => setQuery(reason === 'input' ? next : '')}
      placeholder={`Select ${column.label.toLowerCase()}`}
    />
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

function DateFilterField({ column, value: raw, onChange }: {
  column: DateFilterColumnDef
  value: FilterValues[string] | undefined
  onChange: (next: FilterValues[string]) => void
}) {
  const value: DateRangeValue = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}

  if (!column.range) {
    return (
      <DatePicker
        size="small"
        fullWidth
        clearable
        locale="en-US"
        value={value.from ?? null}
        onChange={(next) => onChange({ from: next || undefined })}
      />
    )
  }

  return (
    <Stack direction="row" spacing="sm">
      <DatePicker
        size="small"
        fullWidth
        clearable
        locale="en-US"
        label="From"
        value={value.from ?? null}
        onChange={(next) => onChange({ ...value, from: next || undefined })}
      />
      <DatePicker
        size="small"
        fullWidth
        clearable
        locale="en-US"
        label="To"
        value={value.to ?? null}
        onChange={(next) => onChange({ ...value, to: next || undefined })}
      />
    </Stack>
  )
}

function FilterField({ column, value, onChange, renderers }: {
  column: FilterColumnDef
  value: FilterValues[string] | undefined
  onChange: (next: FilterValues[string]) => void
  renderers?: FilterRenderers
}) {
  const Custom = renderers?.[column.type]
  if (Custom) return <>{Custom({ column, value, onChange } as never)}</>

  switch (column.type) {
    case 'select': return <SelectFilterField column={column} value={value} onChange={onChange} />
    case 'choice': return <ChoiceFilterField column={column} value={value} onChange={onChange} />
    case 'text': return <TextFilterField column={column} value={value} onChange={onChange} />
    case 'date': return <DateFilterField column={column} value={value} onChange={onChange} />
  }
}

export interface DataTableFilterMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  filterColumns: FilterColumnDef[]
  draft: FilterValues
  onDraftChange: (next: FilterValues) => void
  onApply: (filters: FilterValues, presetId?: string) => void
  presets?: PresetsApi<FilterValues>
  filterRenderers?: FilterRenderers
}

export function DataTableFilterMenu({
  anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, presets, filterRenderers,
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
    // A Popover, not KyroUI's Menu: Menu's typeahead calls preventDefault on printable keys, so the fields inside could not be typed into.
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={close}
      placement="bottom-end"
      aria-label="Filters"
      sx={(theme) => ({ width: 400, maxWidth: `calc(100vw - 2 * ${theme.spacing('lg')})` })}
    >
      <Box sx={{ px: 'lg', pt: 'md', pb: 'lg' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 'md' }}>
          <Stack direction="row" spacing="sm" alignItems="center">
            {mode === 'save' && (
              <IconButton size="small" onClick={() => setMode('filter')} aria-label="Back">
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Typography sx={{ fontSize: 'h5', fontWeight: 600, color: 'text.primary' }}>
              {mode === 'save' ? 'Save as view' : 'Filter'}
            </Typography>
          </Stack>
          <IconButton variant="tonal" size="small" onClick={close} aria-label="Close filters">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />

        {mode === 'filter' && (
          <>
            {filterColumns.map((column) => (
              <Box key={column.field}>
                <Typography sx={{ fontSize: 'lg', fontWeight: 600, color: 'text.primary', mt: 'md', mb: 'sm' }}>{column.label}</Typography>
                <FilterField
                  column={column}
                  value={draft[column.field]}
                  onChange={(next) => onDraftChange({ ...draft, [column.field]: next })}
                  renderers={filterRenderers}
                />
              </Box>
            ))}
            <Divider sx={{ mt: 'lg' }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 'md' }}>
              <Link
                component="button"
                type="button"
                onClick={() => { onApply({}); close() }}
                sx={{ background: 'none', border: 'none', p: 0, fontSize: 'md', fontWeight: 600, color: 'error.main' }}
              >
                Clear all
              </Link>
              <Stack direction="row" spacing="sm">
                {presets && (
                  <Button variant="outlined" disabled={draftEmpty} onClick={() => setMode('save')}>
                    Save
                  </Button>
                )}
                <Button variant="contained" onClick={() => { onApply(draft); close() }}>
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
              inputProps={{ onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); saveFilter() } } }}
              sx={{ mt: 'lg' }}
            />
            <Typography sx={{ fontSize: 'sm', color: 'text.secondary', mt: 'sm' }}>
              {summarizeFilterValues(draft, filterColumns)}
            </Typography>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 'lg' }}>
              <Button variant="contained" disabled={!name.trim()} onClick={saveFilter}>
                Save & apply
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Popover>
  )
}

export interface ManageViewsDialogProps {
  open: boolean
  onClose: () => void
  presets: PresetsApi<FilterValues>
  filterColumns: FilterColumnDef[]
}

export function ManageViewsDialog({ open, onClose, presets, filterColumns }: ManageViewsDialogProps) {
  const size = useDialogSize()
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

  const isEditDirty = Boolean(
    editing && (editName.trim() !== editing.name || !filterValuesEqual(editFilters, editing.filters)),
  )
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Preset<FilterValues> | null>(null)

  const discardEdit = () => {
    if (isEditDirty) { setConfirmDiscardOpen(true); return }
    setEditingId(null)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = presets.all.findIndex((p) => p.id === active.id)
    const to = presets.all.findIndex((p) => p.id === over.id)
    if (from !== -1 && to !== -1) presets.reorder(from, to)
  }

  return (
    <>
      <FormDialog
        open={open}
        onClose={close}
        title={editing ? 'Edit view' : 'Views'}
        {...size}
        {...(editing
          ? { onSubmit: commitEdit, submitLabel: 'Save', submitDisabled: !editName.trim(), onCancel: discardEdit, cancelLabel: 'Discard' }
          : { actions: <Button variant="contained" onClick={close}>Done</Button> })}
      >
        {editing ? (
          <Box>
            <Typography sx={{ fontSize: 'lg', fontWeight: 600, color: 'text.primary', mb: 'sm' }}>Name</Typography>
            <TextField
              autoFocus
              fullWidth
              placeholder="View name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              inputProps={{ onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); commitEdit() } } }}
            />
            {filterColumns.map((column) => (
              <Box key={column.field}>
                <Typography sx={{ fontSize: 'lg', fontWeight: 600, color: 'text.primary', mt: 'lg', mb: 'sm' }}>{column.label}</Typography>
                <FilterField
                  column={column}
                  value={editFilters[column.field]}
                  onChange={(next) => setEditFilters({ ...editFilters, [column.field]: next })}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Stack spacing="xs" sx={{ maxHeight: 380, overflowY: 'auto' }}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={presets.all.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  {presets.all.map((p) => (
                    <SortableViewRow key={p.id} id={p.id} onClick={() => startEdit(p.id)}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography noWrap sx={{ fontSize: 'lg', fontWeight: 600, color: 'text.primary' }}>{p.name}</Typography>
                        <Typography noWrap sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                          {summarizeFilterValues(p.filters, filterColumns)}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing="xs" onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" aria-label={`Delete ${p.name}`} onClick={() => setPendingDelete(p)}>
                            <TrashIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </SortableViewRow>
                  ))}
                </SortableContext>
              </DndContext>
          </Stack>
        )}
      </FormDialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this view?"
        description={`"${pendingDelete?.name}" will be removed for good.`}
        confirmLabel="Delete"
        confirmColor="error"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) presets.remove(pendingDelete.id)
          setPendingDelete(null)
        }}
      />

      <ConfirmDialog
        open={confirmDiscardOpen}
        title="Discard your changes?"
        description="Your edits to this view haven't been saved."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        confirmColor="error"
        onCancel={() => setConfirmDiscardOpen(false)}
        onConfirm={() => { setConfirmDiscardOpen(false); setEditingId(null) }}
      />
    </>
  )
}

function SortableViewRow({ id, children, onClick }: { id: string; children: ReactNode; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    // KyroUI's Box and Stack do not take a ref, so dnd-kit's node is this plain div.
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        onClick={onClick}
        sx={{
          gap: 'sm',
          px: 'sm',
          py: 'md',
          borderRadius: 'md',
          cursor: 'pointer',
          bgcolor: isDragging ? 'background.surface' : undefined,
          boxShadow: isDragging ? 3 : undefined,
          '&:hover': { bgcolor: 'background.surface' },
        }}
      >
        <Box
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            // Top-level sx is inline style, which a :hover rule cannot override, so the resting colour sits in a rule too.
            '&': { color: 'text.disabled' },
            '&:hover': { color: 'text.secondary' },
          }}
        >
          <DragIcon fontSize="small" />
        </Box>
        {children}
      </Stack>
    </div>
  )
}
