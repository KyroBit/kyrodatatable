import { c as _c } from "react/compiler-runtime";
import { useEffect, useRef } from 'react';
import { asSelectValues } from '../filterValues.js';
export function useFilterLabels(api, columns, filters) {
  const $ = _c(16);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = new Set();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const asked = useRef(t0);
  let t1;
  let unresolved;
  if ($[1] !== api || $[2] !== columns || $[3] !== filters) {
    let t2;
    if ($[6] !== api || $[7] !== filters) {
      t2 = column => column.type === "select" && typeof column.options === "function" && asSelectValues(filters[column.field]).some(value => api.filterLabel(column.field, value) === undefined);
      $[6] = api;
      $[7] = filters;
      $[8] = t2;
    } else {
      t2 = $[8];
    }
    unresolved = columns.filter(t2);
    t1 = unresolved.map(_temp).join(",");
    $[1] = api;
    $[2] = columns;
    $[3] = filters;
    $[4] = t1;
    $[5] = unresolved;
  } else {
    t1 = $[4];
    unresolved = $[5];
  }
  const pending = t1;
  let t2;
  if ($[9] !== api || $[10] !== unresolved) {
    t2 = () => {
      for (const column_1 of unresolved) {
        if (column_1.type !== "select" || typeof column_1.options !== "function" || asked.current.has(column_1.field)) {
          continue;
        }
        asked.current.add(column_1.field);
        column_1.options("").then(options => api.rememberFilterLabels(column_1.field, options));
      }
    };
    $[9] = api;
    $[10] = unresolved;
    $[11] = t2;
  } else {
    t2 = $[11];
  }
  let t3;
  if ($[12] !== pending) {
    t3 = [pending];
    $[12] = pending;
    $[13] = t3;
  } else {
    t3 = $[13];
  }
  useEffect(t2, t3);
  let t4;
  if ($[14] !== api) {
    t4 = (column_2, value_0) => api.filterLabel(column_2.field, value_0) ?? ((column_2.type === "select" || column_2.type === "choice") && Array.isArray(column_2.options) ? column_2.options.find(option => option.value === value_0)?.label : undefined) ?? value_0;
    $[14] = api;
    $[15] = t4;
  } else {
    t4 = $[15];
  }
  return t4;
}
function _temp(column_0) {
  return column_0.field;
}