import { useCallback, useEffect, useMemo, useState } from 'react';
function load(key) {
    if (typeof window === 'undefined')
        return [];
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((p) => p && typeof p.id === 'string');
    }
    catch {
        return [];
    }
}
function persist(key, presets) {
    if (typeof window === 'undefined')
        return;
    window.localStorage.setItem(key, JSON.stringify(presets));
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
export function usePresets(storageKey, builtIn = []) {
    const key = `kyro-datatable:presets:${storageKey}`;
    const [custom, setCustom] = useState(() => load(key));
    useEffect(() => { persist(key, custom); }, [key, custom]);
    const all = useMemo(() => [...builtIn, ...custom], [builtIn, custom]);
    const create = useCallback((name, filters) => {
        const preset = { id: newId(), name, filters };
        setCustom((prev) => [...prev, preset]);
        return preset.id;
    }, []);
    const update = useCallback((id, name, filters) => {
        setCustom((prev) => prev.map((p) => (p.id === id ? { ...p, name, filters } : p)));
    }, []);
    const remove = useCallback((id) => {
        setCustom((prev) => prev.filter((p) => p.id !== id));
    }, []);
    const reorder = useCallback((fromIndex, toIndex) => {
        setCustom((prev) => {
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            if (moved)
                next.splice(toIndex, 0, moved);
            return next;
        });
    }, []);
    return { custom, all, builtIn, create, update, remove, reorder };
}
