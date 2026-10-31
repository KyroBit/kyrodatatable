import { c as _c } from "react/compiler-runtime";
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
  if (typeof window === 'undefined') return [...defaults];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [...defaults];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return [...defaults, ...parsed.filter(isPreset)];
    }
    const v2 = parsed;
    if (v2 && v2.v === 2 && Array.isArray(v2.presets)) {
      return v2.presets.filter(isPreset);
    }
    return [...defaults];
  } catch {
    return [...defaults];
  }
}
function persist(key, presets) {
  if (typeof window === 'undefined') return;
  const stored = {
    v: 2,
    presets
  };
  window.localStorage.setItem(key, JSON.stringify(stored));
}
function newId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Named, saveable filter sets ("Favorites") for a list view — separate from
 * useDataTable on purpose, since a filter's shape is entirely yours (a list
 * of statuses, a date range, whatever your fetchRecords call understands).
 * Wire the active preset's filters into your fetchRecords closure yourself.
 */
export function usePresets(storageKey, t0) {
  const $ = _c(21);
  let t1;
  if ($[0] !== t0) {
    t1 = t0 === undefined ? [] : t0;
    $[0] = t0;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const defaults = t1;
  const key = `kyro-datatable:presets:${storageKey}`;
  let t2;
  if ($[2] !== defaults || $[3] !== key) {
    t2 = () => load(key, defaults);
    $[2] = defaults;
    $[3] = key;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  const [presets, setPresets] = useState(t2);
  let t3;
  let t4;
  if ($[5] !== key || $[6] !== presets) {
    t3 = () => {
      persist(key, presets);
    };
    t4 = [key, presets];
    $[5] = key;
    $[6] = presets;
    $[7] = t3;
    $[8] = t4;
  } else {
    t3 = $[7];
    t4 = $[8];
  }
  useEffect(t3, t4);
  let t5;
  if ($[9] !== presets) {
    t5 = presets.filter(_temp);
    $[9] = presets;
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  const builtIn = t5;
  let t6;
  if ($[11] !== presets) {
    t6 = presets.filter(_temp2);
    $[11] = presets;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  const custom = t6;
  let t7;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = (name, filters) => {
      const preset = {
        id: newId(),
        name,
        filters
      };
      setPresets(prev => [...prev, preset]);
      return preset.id;
    };
    $[13] = t7;
  } else {
    t7 = $[13];
  }
  const create = t7;
  let t8;
  if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = (id, name_0, filters_0) => {
      setPresets(prev_0 => prev_0.map(p_1 => p_1.id === id ? {
        ...p_1,
        name: name_0,
        filters: filters_0
      } : p_1));
    };
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  const update = t8;
  let t9;
  if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = id_0 => {
      setPresets(prev_1 => prev_1.filter(p_2 => p_2.id !== id_0));
    };
    $[15] = t9;
  } else {
    t9 = $[15];
  }
  const remove = t9;
  let t10;
  if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = (fromIndex, toIndex) => {
      setPresets(prev_2 => {
        const next = [...prev_2];
        const [moved] = next.splice(fromIndex, 1);
        if (moved) {
          next.splice(toIndex, 0, moved);
        }
        return next;
      });
    };
    $[16] = t10;
  } else {
    t10 = $[16];
  }
  const reorder = t10;
  let t11;
  if ($[17] !== builtIn || $[18] !== custom || $[19] !== presets) {
    t11 = {
      custom,
      all: presets,
      builtIn,
      create,
      update,
      remove,
      reorder
    };
    $[17] = builtIn;
    $[18] = custom;
    $[19] = presets;
    $[20] = t11;
  } else {
    t11 = $[20];
  }
  return t11;
}
function _temp2(p_0) {
  return !p_0.builtIn;
}
function _temp(p) {
  return p.builtIn;
}