import { useState, type ReactNode } from 'react'
import { Box, Button, Dialog, Divider, IconButton, Menu, Stack, TextField, Tooltip, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PresetsApi } from '../../state/usePresets.js'
import type { ChipFilters, FilterColumnDef } from '../../types/index.js'
import { EditIcon, TrashIcon } from './icons.js'

export function chipFiltersEqual(a: ChipFilters, b: ChipFilters): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    const av = a[key] ?? []
    const bv = b[key] ?? []
    if (av.length !== bv.length || !av.every((v) => bv.includes(v))) return false
  }
  return true
}

export function summarizeChipFilters(filters: ChipFilters, columns: FilterColumnDef[]): string {
  const parts = columns
    .filter((c) => (filters[c.field] ?? []).length > 0)
    .map((c) => {
      const labels = (filters[c.field] ?? []).map((v) => c.options.find((o) => o.value === v)?.label ?? v)
      return `${c.label}: ${labels.join(', ')}`
    })
  return parts.length ? parts.join(' · ') : 'No filters'
}

export function countChipFilters(filters: ChipFilters): number {
  return Object.values(filters).reduce((n, values) => n + values.length, 0)
}

function StatusChips({ options, value, onChange }: {
  options: FilterColumnDef['options']
  value: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
      {options.map((option) => {
        const on = value.includes(option.value)
        return (
          <Box
            key={option.value}
            component="button"
            type="button"
            onClick={() => onChange(on ? value.filter((v) => v !== option.value) : [...value, option.value])}
            sx={{
              border: 'none',
              cursor: 'pointer',
              px: '14px',
              py: '8px',
              borderRadius: '8px',
              fontFamily: 'inherit',
              fontSize: '13px',
              fontWeight: 500,
              bgcolor: on ? '#292D32' : '#F6F7FB',
              color: on ? '#FFFFFF' : '#595959',
              transition: 'background-color 0.15s, color 0.15s',
              '&:hover': { bgcolor: on ? '#3A3F45' : '#EDEFF5' },
            }}
          >
            {option.label}
          </Box>
        )
      })}
    </Stack>
  )
}

function HeaderIconButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={label}
      sx={{ width: 26, height: 26, bgcolor: '#F6F7FB', color: '#292D32', '&:hover': { bgcolor: '#EDEFF5' } }}
    >
      {children}
    </IconButton>
  )
}

export interface DataTableFilterMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  filterColumns: FilterColumnDef[]
  draft: ChipFilters
  onDraftChange: (next: ChipFilters) => void
  /** `presetId` is set when the apply came from saving a view. */
  onApply: (filters: ChipFilters, presetId?: string) => void
  emptyFilters: ChipFilters
  presets?: PresetsApi<ChipFilters>
}

export function DataTableFilterMenu({
  anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, emptyFilters, presets,
}: DataTableFilterMenuProps) {
  const [mode, setMode] = useState<'filter' | 'save'>('filter')
  const [name, setName] = useState('')

  const draftEmpty = countChipFilters(draft) === 0

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
              <IconButton onClick={() => setMode('filter')} aria-label="Back" sx={{ width: 26, height: 26, ml: -0.5, color: '#292D32' }}>
                <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#292D32' }}>
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
                <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#292D32', mt: 1.75, mb: 1 }}>{column.label}</Typography>
                <StatusChips
                  options={column.options}
                  value={draft[column.field] ?? []}
                  onChange={(next) => onDraftChange({ ...draft, [column.field]: next })}
                />
              </Box>
            ))}
            <Divider sx={{ mt: 2 }} />
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1.75 }}>
              <Box
                component="button"
                type="button"
                onClick={() => { onApply(emptyFilters); close() }}
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
              {summarizeChipFilters(draft, filterColumns)}
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
  presets: PresetsApi<ChipFilters>
  filterColumns: FilterColumnDef[]
  onApply: (filters: ChipFilters, presetId: string) => void
}

export function ManageViewsDialog({ open, onClose, presets, filterColumns, onApply }: ManageViewsDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editFilters, setEditFilters] = useState<ChipFilters>({})

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
              <IconButton onClick={() => setEditingId(null)} aria-label="Back to views" sx={{ width: 28, height: 28, ml: -0.5, color: '#292D32' }}>
                <ArrowBackRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            )}
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#292D32' }}>
              {editing ? 'Edit view' : 'Views'}
            </Typography>
          </Stack>
          <IconButton
            onClick={close}
            aria-label="Close views"
            sx={{ width: 28, height: 28, bgcolor: '#F6F7FB', color: '#292D32', '&:hover': { bgcolor: '#EDEFF5' } }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
        <Divider />

        {editing ? (
          <>
            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#292D32', mt: 2, mb: 1 }}>Name</Typography>
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
                <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#292D32', mt: 2, mb: 1 }}>{column.label}</Typography>
                <StatusChips
                  options={column.options}
                  value={editFilters[column.field] ?? []}
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
                        <Typography noWrap sx={{ fontSize: '14px', fontWeight: 600, color: '#292D32' }}>{p.name}</Typography>
                        <Typography noWrap sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
                          {summarizeChipFilters(p.filters, filterColumns)}
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
      sx={{
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
        bgcolor: isDragging ? '#F6F7FB' : undefined,
        boxShadow: isDragging ? '0px 8px 24px rgba(0,0,0,0.12)' : undefined,
        '&:hover': { bgcolor: '#F6F7FB' },
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
