import { useRef, useState, type ReactNode } from 'react'
import type { PresetsApi, Preset } from '../../state/usePresets.js'

export interface FavoritesMenuProps<Filters> {
  presets: PresetsApi<Filters>
  activeId: string | null
  currentFilters: Filters
  filterEditor: (value: Filters, onChange: (next: Filters) => void) => ReactNode
  summarize: (filters: Filters) => string
  onApply: (filters: Filters) => void
  label?: string
}

type Mode = { kind: 'list' } | { kind: 'add' } | { kind: 'edit'; id: string }

export function FavoritesMenu<Filters>({
  presets, activeId, currentFilters, filterEditor, summarize, onApply, label = 'Favorites',
}: FavoritesMenuProps<Filters>) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>({ kind: 'list' })
  const rootRef = useRef<HTMLDivElement>(null)

  const close = () => { setOpen(false); setMode({ kind: 'list' }) }

  return (
    <div className="position-relative d-inline-block" ref={rootRef}>
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setOpen((v) => !v)}>
        ★ {label}
      </button>
      {open && (
        <div className="card shadow-sm position-absolute end-0 mt-1" style={{ width: 320, zIndex: 1000 }}>
          <div className="card-header d-flex justify-content-between align-items-center py-2">
            <strong className="small">Favorites</strong>
            {mode.kind === 'list' ? (
              <button type="button" className="btn btn-sm btn-link p-0" onClick={() => setMode({ kind: 'add' })}>+ Add</button>
            ) : (
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setMode({ kind: 'list' })} />
            )}
          </div>

          {mode.kind === 'add' && (
            <PresetForm
              initialFilters={currentFilters}
              filterEditor={filterEditor}
              onCancel={() => setMode({ kind: 'list' })}
              onSubmit={(name, filters) => { presets.create(name, filters); setMode({ kind: 'list' }) }}
            />
          )}

          {mode.kind === 'edit' && (() => {
            const editing = presets.custom.find((p) => p.id === mode.id)
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
              <div className="card-body text-center text-muted small py-4">No favorites saved yet.</div>
            ) : (
              <ul className="list-group list-group-flush" style={{ maxHeight: 300, overflowY: 'auto' }}>
                {presets.all.map((p, i) => (
                  <PresetRow
                    key={p.id}
                    preset={p}
                    isActive={activeId === p.id}
                    summary={summarize(p.filters)}
                    canMoveUp={!p.builtIn && i > presets.builtIn.length}
                    canMoveDown={!p.builtIn && i < presets.all.length - 1}
                    onApply={() => { onApply(p.filters); close() }}
                    onEdit={p.builtIn ? undefined : () => setMode({ kind: 'edit', id: p.id })}
                    onDelete={p.builtIn ? undefined : () => presets.remove(p.id)}
                    onMoveUp={() => presets.reorder(i - presets.builtIn.length, i - presets.builtIn.length - 1)}
                    onMoveDown={() => presets.reorder(i - presets.builtIn.length, i - presets.builtIn.length + 1)}
                  />
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
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
    <li className={`list-group-item d-flex align-items-center gap-1 ${isActive ? 'bg-body-secondary' : ''}`}>
      <button type="button" className="btn btn-link p-0 text-start flex-grow-1 text-decoration-none" onClick={onApply}>
        <div className={`small ${isActive ? 'fw-bold' : 'fw-semibold'}`}>{preset.name}</div>
        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{summary}</div>
      </button>
      {(onEdit || onDelete) && (
        <div className="d-flex gap-1">
          {canMoveUp && <button type="button" className="btn btn-sm btn-link p-0" onClick={onMoveUp}>↑</button>}
          {canMoveDown && <button type="button" className="btn btn-sm btn-link p-0" onClick={onMoveDown}>↓</button>}
          {onEdit && <button type="button" className="btn btn-sm btn-link p-0" onClick={onEdit}>✎</button>}
          {onDelete && <button type="button" className="btn btn-sm btn-link p-0 text-danger" onClick={onDelete}>✕</button>}
        </div>
      )}
    </li>
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
    <div className="card-body">
      <input
        autoFocus
        type="text"
        className="form-control form-control-sm mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit() } }}
      />
      <div className="mb-2">{filterEditor(filters, setFilters)}</div>
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-sm btn-primary" disabled={!name.trim()} onClick={submit}>
          {initialName ? 'Save changes' : 'Add favorite'}
        </button>
      </div>
    </div>
  )
}
