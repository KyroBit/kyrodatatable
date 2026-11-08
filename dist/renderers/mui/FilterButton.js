import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { Badge, Button } from '@mui/material';
import { countFilterValues } from '@kyrobit/datatable';
import { useDataTableContext } from './context.js';
import { DataTableFilterMenu } from './FilterMenu.js';
import { FilterIcon } from './icons.js';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export function DataTableFilterButton(t0) {
  const $ = _c(25);
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
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = /*#__PURE__*/_jsx(FilterIcon, {});
    $[5] = t4;
  } else {
    t4 = $[5];
  }
  let t5;
  if ($[6] !== filters) {
    t5 = /*#__PURE__*/_jsx(Button, {
      variant: "outlined",
      color: "inherit",
      startIcon: t4,
      onClick: e => {
        setDraft(filters);
        setAnchor(e.currentTarget);
      },
      children: "Filters"
    });
    $[6] = filters;
    $[7] = t5;
  } else {
    t5 = $[7];
  }
  let t6;
  if ($[8] !== t3 || $[9] !== t5) {
    t6 = /*#__PURE__*/_jsx(Badge, {
      badgeContent: t3,
      color: "primary",
      children: t5
    });
    $[8] = t3;
    $[9] = t5;
    $[10] = t6;
  } else {
    t6 = $[10];
  }
  let t7;
  if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = () => setAnchor(null);
    $[11] = t7;
  } else {
    t7 = $[11];
  }
  let t8;
  if ($[12] !== api || $[13] !== onApply) {
    t8 = onApply ?? (next => api.setFilters(next));
    $[12] = api;
    $[13] = onApply;
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  let t9;
  if ($[15] !== anchor || $[16] !== draft || $[17] !== filterColumns || $[18] !== filterRenderers || $[19] !== presets || $[20] !== t8) {
    t9 = /*#__PURE__*/_jsx(DataTableFilterMenu, {
      filterRenderers: filterRenderers,
      anchorEl: anchor,
      onClose: t7,
      filterColumns: filterColumns,
      draft: draft,
      onDraftChange: setDraft,
      onApply: t8,
      presets: presets
    });
    $[15] = anchor;
    $[16] = draft;
    $[17] = filterColumns;
    $[18] = filterRenderers;
    $[19] = presets;
    $[20] = t8;
    $[21] = t9;
  } else {
    t9 = $[21];
  }
  let t10;
  if ($[22] !== t6 || $[23] !== t9) {
    t10 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t6, t9]
    });
    $[22] = t6;
    $[23] = t9;
    $[24] = t10;
  } else {
    t10 = $[24];
  }
  return t10;
}