import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FilterValues } from '../types/index.js'

export interface Preset<Filters = FilterValues> {
  id: string
  name: string
  filters: Filters
  builtIn?: boolean
}

export interface PresetsApi<Filters = FilterValues> {
  custom: Preset<Filters>[]
  all: Preset<Filters>[]
  builtIn: Preset<Filters>[]
  create: (name: string, filters: Filters) => string
  update: (id: string, name: string, filters: Filters) => void
  remove: (id: string) => void
  /** Indices into `all`. */
  reorder: (fromIndex: number, toIndex: number) => void
}

interface StoredV2<Filters> {
  v: 2
  presets: Preset<Filters>[]
}

function isPreset<Filters>(p: unknown): p is Preset<Filters> {
  return Boolean(p) && typeof (p as Preset<Filters>).id === 'string'
}

/**
 * Defaults are seeds, not locks: on first load they are materialized into
 * storage, after which every preset — seeded or user-created — is equally
 * editable, deletable, and reorderable. A pre-existing v1 store (a plain
 * array of custom presets) is migrated by prepending the seeds once.
 */
function load<Filters>(key: string, defaults: Preset<Filters>[]): Preset<Filters>[] {
  if (typeof window === 'undefined') return [...defaults]
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return [...defaults]
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) {
      return [...defaults, ...parsed.filter(isPreset<Filters>)]
    }
    const v2 = parsed as StoredV2<Filters>
    if (v2 && v2.v === 2 && Array.isArray(v2.presets)) {
      return v2.presets.filter(isPreset<Filters>)
    }
    return [...defaults]
  } catch {
    return [...defaults]
  }
}

function persist<Filters>(key: string, presets: Preset<Filters>[]) {
  if (typeof window === 'undefined') return
  const stored: StoredV2<Filters> = { v: 2, presets }
  window.localStorage.setItem(key, JSON.stringify(stored))
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2, 11)
}

/**
 * Named, saveable filter sets ("Favorites") for a list view — separate from
 * useDataTable on purpose, since a filter's shape is entirely yours (a list
 * of statuses, a date range, whatever your fetchRecords call understands).
 * Wire the active preset's filters into your fetchRecords closure yourself.
 */
export function usePresets<Filters = FilterValues>(
  storageKey: string,
  defaults: Preset<Filters>[] = [],
): PresetsApi<Filters> {
  const key = `kyro-datatable:presets:${storageKey}`
  const [presets, setPresets] = useState<Preset<Filters>[]>(() => load<Filters>(key, defaults))

  useEffect(() => { persist(key, presets) }, [key, presets])

  const builtIn = useMemo(() => presets.filter((p) => p.builtIn), [presets])
  const custom = useMemo(() => presets.filter((p) => !p.builtIn), [presets])

  const create = useCallback((name: string, filters: Filters) => {
    const preset: Preset<Filters> = { id: newId(), name, filters }
    setPresets((prev) => [...prev, preset])
    return preset.id
  }, [])

  const update = useCallback((id: string, name: string, filters: Filters) => {
    setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name, filters } : p)))
  }, [])

  const remove = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setPresets((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      if (moved) next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  return { custom, all: presets, builtIn, create, update, remove, reorder }
}
