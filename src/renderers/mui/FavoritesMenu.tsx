import { useState, type ReactNode } from 'react'
import {
  Box, Button, Divider, IconButton, Popover, Stack, TextField, Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import type { PresetsApi, Preset } from '../../state/usePresets.js'

export interface FavoritesMenuProps<Filters> {
  presets: PresetsApi<Filters>
  activeId: string | null
  currentFilters: Filters
  filterEditor: (value: Filters, onChange: (next: Filters) => void) => ReactNode
  summarize: (filters: Filters) => string
  onApply: (filters: Filters) => void
  label?: string
  /** Override the button's leading icon (defaults to a star). */
  icon?: ReactNode
  /** Trailing icon for the button (e.g. a chevron). */
  endIcon?: ReactNode
}

type Mode = { kind: 'list' } | { kind: 'add' } | { kind: 'edit'; id: string }

export function FavoritesMenu<Filters>({
  presets, activeId, currentFilters, filterEditor, summarize, onApply, label = 'Favorites', icon, endIcon,
}: FavoritesMenuProps<Filters>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [mode, setMode] = useState<Mode>({ kind: 'list' })
  const open = Boolean(anchorEl)

  const close = () => { setAnchorEl(null); setMode({ kind: 'list' }) }

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={icon ?? <StarBorderRoundedIcon />}
        endIcon={endIcon}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {label}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 340, mt: 1, borderRadius: 2, overflow: 'hidden' } } }}
      >
        <Stack>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>Favorites</Typography>
            {mode.kind === 'list' ? (
              <Button size="small" color="primary" startIcon={<AddRoundedIcon />} onClick={() => setMode({ kind: 'add' })}>
                Add
              </Button>
            ) : (
              <IconButton size="small" onClick={() => setMode({ kind: 'list' })} sx={{ color: 'text.secondary' }}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
          <Divider />

          {mode.kind === 'add' && (
            <PresetForm
              initialFilters={currentFilters}
              filterEditor={filterEditor}
              onCancel={() => setMode({ kind: 'list' })}
              onSubmit={(name, filters) => { presets.create(name, filters); setMode({ kind: 'list' }) }}
            />
          )}

          {mode.kind === 'edit' && (() => {
            const editing = presets.all.find((p) => p.id === mode.id)
            if (!editing) return null
            return (
              <PresetForm
                initialName={editing.name}
                initialFilters={editing.filters}
                filterEditor={filterEditor}
                onCancel={() => setMode({ kind: 'list' })}
                onSubmit={(name, filters) => { presets.update(editing.id, name, filters); setMode({ kind: 'list' }) }}
              />
            )
          })()}

          {mode.kind === 'list' && (
            presets.all.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No favorites saved yet.</Typography>
                <Typography variant="caption" color="text.disabled">Click "Add" to save the current filters.</Typography>
              </Box>
            ) : (
              <Box sx={{ maxHeight: 340, overflowY: 'auto', p: 1 }}>
                <Stack spacing={0.5}>
                  {presets.all.map((p, i) => (
                    <PresetRow
                      key={p.id}
                      preset={p}
                      isActive={activeId === p.id}
                      summary={summarize(p.filters)}
                      canMoveUp={i > 0}
                      canMoveDown={i < presets.all.length - 1}
                      onApply={() => { onApply(p.filters); close() }}
                      onEdit={() => setMode({ kind: 'edit', id: p.id })}
                      onDelete={() => presets.remove(p.id)}
                      onMoveUp={() => presets.reorder(i, i - 1)}
                      onMoveDown={() => presets.reorder(i, i + 1)}
                    />
                  ))}
                </Stack>
              </Box>
            )
          )}
        </Stack>
      </Popover>
    </>
  )
}

function PresetRow<Filters>({
  preset, isActive, summary, canMoveUp, canMoveDown, onApply, onEdit, onDelete, onMoveUp, onMoveDown,
}: {
  preset: Preset<Filters>
  isActive: boolean
  summary: string
  canMoveUp: boolean
  canMoveDown: boolean
  onApply: () => void
  onEdit?: () => void
  onDelete?: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex', alignItems: 'center', gap: 0.5, pl: 1.25, pr: 1, py: 0.5, borderRadius: 1.5,
        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
        '&:hover': { bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.text.primary, 0.04) },
      })}
    >
      <Box
        component="button"
        type="button"
        onClick={onApply}
        sx={{ flex: 1, minWidth: 0, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', py: 0.5, fontFamily: 'inherit', color: 'inherit' }}
      >
        <Typography variant="subtitle2" noWrap sx={{ color: isActive ? 'primary.main' : 'text.primary', fontWeight: isActive ? 700 : 600 }}>{preset.name}</Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>{summary}</Typography>
      </Box>
      {(onEdit || onDelete) && (
        <>
          {canMoveUp && <IconButton size="small" onClick={onMoveUp} sx={{ color: 'text.secondary' }}><ArrowUpwardRoundedIcon sx={{ fontSize: 14 }} /></IconButton>}
          {canMoveDown && <IconButton size="small" onClick={onMoveDown} sx={{ color: 'text.secondary' }}><ArrowDownwardRoundedIcon sx={{ fontSize: 14 }} /></IconButton>}
          {onEdit && <IconButton size="small" onClick={onEdit} sx={{ color: 'text.secondary' }}><EditRoundedIcon sx={{ fontSize: 16 }} /></IconButton>}
          {onDelete && <IconButton size="small" onClick={onDelete} sx={{ color: 'error.main' }}><DeleteRoundedIcon sx={{ fontSize: 16 }} /></IconButton>}
        </>
      )}
    </Box>
  )
}

function PresetForm<Filters>({
  initialName = '', initialFilters, filterEditor, onCancel, onSubmit,
}: {
  initialName?: string
  initialFilters: Filters
  filterEditor: (value: Filters, onChange: (next: Filters) => void) => ReactNode
  onCancel: () => void
  onSubmit: (name: string, filters: Filters) => void
}) {
  const [name, setName] = useState(initialName)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const submit = () => { const t = name.trim(); if (t) onSubmit(t, filters) }

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={1.75}>
        <TextField
          autoFocus
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit() } }}
          required
        />
        {filterEditor(filters, setFilters)}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={submit} disabled={!name.trim()}>
            {initialName ? 'Save changes' : 'Add favorite'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
