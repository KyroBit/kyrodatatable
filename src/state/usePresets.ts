import { useCallback, useEffect, useMemo, useState } from 'react'

export interface Preset<Filters> {
  id: string
  name: string
  filters: Filters
  builtIn?: boolean
}

export interface PresetsApi<Filters> {
  custom: Preset<Filters>[]
  all: Preset<Filters>[]
  builtIn: Preset<Filters>[]
  create: (name: string, filters: Filters) => string
  update: (id: string, name: string, filters: Filters) => void
  remove: (id: string) => void
  reorder: (fromIndex: number, toIndex: number) => void
}

function load<Filters>(key: string): Preset<Filters>[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Preset<Filters>[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((p) => p && typeof p.id === 'string')
  } catch {
    return []
  }
}

function persist<Filters>(key: string, presets: Preset<Filters>[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(presets))
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
export function usePresets<Filters>(
  storageKey: string,
  builtIn: Preset<Filters>[] = [],
): PresetsApi<Filters> {
  const key = `kyro-datatable:presets:${storageKey}`
  const [custom, setCustom] = useState<Preset<Filters>[]>(() => load<Filters>(key))

  useEffect(() => { persist(key, custom) }, [key, custom])

  const all = useMemo<Preset<Filters>[]>(() => [...builtIn, ...custom], [builtIn, custom])

  const create = useCallback((name: string, filters: Filters) => {
    const preset: Preset<Filters> = { id: newId(), name, filters }
    setCustom((prev) => [...prev, preset])
    return preset.id
  }, [])

  const update = useCallback((id: string, name: string, filters: Filters) => {
    setCustom((prev) => prev.map((p) => (p.id === id ? { ...p, name, filters } : p)))
  }, [])

  const remove = useCallback((id: string) => {
    setCustom((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setCustom((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      if (moved) next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  return { custom, all, builtIn, create, update, remove, reorder }
}
