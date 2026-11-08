import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { Badge, IconButton } from '@kyrobit/kyroui';
import { countFilterValues } from '@kyrobit/datatable';
import { useDataTableContext } from './context.js';
import { DataTableFilterMenu } from './FilterMenu.js';
import { FilterIcon } from './icons.js';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export function DataTableFilterButton(t0) {
  const $ = _c(27);
  const {
    filterColumns,
    presets,
    filterRenderers,
    onApply
  } = t0;
  const api = useDataTableContext();
  const [anchor, setAnchor] = useState(null);
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {};
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  const [draft, setDraft] = useState(t1);
  let t2;
  if ($[1] !== api.filters) {
    t2 = api.filters ?? {};
    $[1] = api.filters;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  const filters = t2;
  let t3;
  if ($[3] !== filters) {
    t3 = countFilterValues(filters);
    $[3] = filters;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  let t4;
  if ($[5] !== filters) {
    t4 = e => {
      setDraft(filters);
      setAnchor(e.currentTarget.closest(".search-field") ?? e.currentTarget);
    };
    $[5] = filters;
    $[6] = t4;
  } else {
    t4 = $[6];
  }
  let t5;
  if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = /*#__PURE__*/_jsx(FilterIcon, {
      fontSize: "small"
    });
    $[7] = t5;
  } else {
    t5 = $[7];
  }
  let t6;
  if ($[8] !== t4) {
    t6 = /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      "aria-label": "Filters",
      onClick: t4,
      children: t5
    });
    $[8] = t4;
    $[9] = t6;
  } else {
    t6 = $[9];
  }
  let t7;
  if ($[10] !== t3 || $[11] !== t6) {
    t7 = /*#__PURE__*/_jsx(Badge, {
      badgeContent: t3,
      color: "primary",
      children: t6
    });
    $[10] = t3;
    $[11] = t6;
    $[12] = t7;
  } else {
    t7 = $[12];
  }
  let t8;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = () => setAnchor(null);
    $[13] = t8;
  } else {
    t8 = $[13];
  }
  let t9;
  if ($[14] !== api || $[15] !== onApply) {
    t9 = onApply ?? (next => api.setFilters(next));
    $[14] = api;
    $[15] = onApply;
    $[16] = t9;
  } else {
    t9 = $[16];
  }
  let t10;
  if ($[17] !== anchor || $[18] !== draft || $[19] !== filterColumns || $[20] !== filterRenderers || $[21] !== presets || $[22] !== t9) {
    t10 = /*#__PURE__*/_jsx(DataTableFilterMenu, {
      filterRenderers: filterRenderers,
      anchorEl: anchor,
      onClose: t8,
      filterColumns: filterColumns,
      draft: draft,
      onDraftChange: setDraft,
      onApply: t9,
      presets: presets
    });
    $[17] = anchor;
    $[18] = draft;
    $[19] = filterColumns;
    $[20] = filterRenderers;
    $[21] = presets;
    $[22] = t9;
    $[23] = t10;
  } else {
    t10 = $[23];
  }
  let t11;
  if ($[24] !== t10 || $[25] !== t7) {
    t11 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t7, t10]
    });
    $[24] = t10;
    $[25] = t7;
    $[26] = t11;
  } else {
    t11 = $[26];
  }
  return t11;
}