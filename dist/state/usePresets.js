import { useCallback, useEffect, useMemo, useState } from 'react';
function isPreset(p) {
    return Boolean(p) && typeof p.id === 'string';
}
/**
 * Defaults are seeds, not locks: on first load they are materialized into
 * storage, after which every preset — seeded or user-created — is equally
 * editable, deletable, and reorderable. A pre-existing v1 store (a plain
 * array of custom presets) is migrated by prepending the seeds once.
 */
function load(key, defaults) {
    if (typeof window === 'undefined')
        return [...defaults];
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw)
            return [...defaults];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return [...defaults, ...parsed.filter((isPreset))];
        }
        const v2 = parsed;
        if (v2 && v2.v === 2 && Array.isArray(v2.presets)) {
            return v2.presets.filter((isPreset));
        }
        return [...defaults];
    }
    catch {
        return [...defaults];
    }
}
function persist(key, presets) {
    if (typeof window === 'undefined')
        return;
    const stored = { v: 2, presets };
    window.localStorage.setItem(key, JSON.stringify(stored));
}
function newId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 11);
}
/**
 * Named, saveable filter sets ("Favorites") for a list view — separate from
 * useDataTable on purpose, since a filter's shape is entirely yours (a list
 * of statuses, a date range, whatever your fetchRecords call understands).
 * Wire the active preset's filters into your fetchRecords closure yourself.
 */
export function usePresets(storageKey, defaults = []) {
    const key = `kyro-datatable:presets:${storageKey}`;
    const [presets, setPresets] = useState(() => load(key, defaults));
    useEffect(() => { persist(key, presets); }, [key, presets]);
    const builtIn = useMemo(() => presets.filter((p) => p.builtIn), [presets]);
    const custom = useMemo(() => presets.filter((p) => !p.builtIn), [presets]);
    const create = useCallback((name, filters) => {
        const preset = { id: newId(), name, filters };
        setPresets((prev) => [...prev, preset]);
        return preset.id;
    }, []);
    const update = useCallback((id, name, filters) => {
        setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name, filters } : p)));
    }, []);
    const remove = useCallback((id) => {
        setPresets((prev) => prev.filter((p) => p.id !== id));
    }, []);
    const reorder = useCallback((fromIndex, toIndex) => {
        setPresets((prev) => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            if (moved)
                next.splice(toIndex, 0, moved);
            return next;
        });
    }, []);
    return { custom, all: presets, builtIn, create, update, remove, reorder };
}
