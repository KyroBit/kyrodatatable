import { c as _c } from "react/compiler-runtime";
import { MenuItem, TextField } from '@mui/material';
import { useDataTableContext } from './context.js';
import { jsx as _jsx } from "react/jsx-runtime";
export function DataTableGroupBySelect(t0) {
  const $ = _c(18);
  const {
    noneLabel: t1
  } = t0;
  const noneLabel = t1 === undefined ? "None" : t1;
  const api = useDataTableContext();
  const columns = api.groupByColumns;
  if (!columns || columns.length === 0) {
    return null;
  }
  let t2;
  if ($[0] !== columns) {
    t2 = field => columns.find(c => c.field === field)?.label ?? field;
    $[0] = columns;
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  const labelOf = t2;
  const t3 = api.groupBy;
  let t4;
  if ($[2] !== api) {
    t4 = e => api.setGroupBy(e.target.value);
    $[2] = api;
    $[3] = t4;
  } else {
    t4 = $[3];
  }
  let t5;
  if ($[4] !== labelOf || $[5] !== noneLabel) {
    t5 = {
      multiple: true,
      displayEmpty: true,
      renderValue: fields => fields.length ? fields.map(labelOf).join(" \u203A ") : noneLabel
    };
    $[4] = labelOf;
    $[5] = noneLabel;
    $[6] = t5;
  } else {
    t5 = $[6];
  }
  let t6;
  if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      shrink: true
    };
    $[7] = t6;
  } else {
    t6 = $[7];
  }
  let t7;
  if ($[8] !== t5) {
    t7 = {
      select: t5,
      inputLabel: t6
    };
    $[8] = t5;
    $[9] = t7;
  } else {
    t7 = $[9];
  }
  let t8;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      minWidth: 180
    };
    $[10] = t8;
  } else {
    t8 = $[10];
  }
  let t9;
  if ($[11] !== columns) {
    t9 = columns.map(_temp);
    $[11] = columns;
    $[12] = t9;
  } else {
    t9 = $[12];
  }
  let t10;
  if ($[13] !== api.groupBy || $[14] !== t4 || $[15] !== t7 || $[16] !== t9) {
    t10 = /*#__PURE__*/_jsx(TextField, {
      size: "small",
      select: true,
      label: "Group by",
      value: t3,
      onChange: t4,
      slotProps: t7,
      sx: t8,
      children: t9
    });
    $[13] = api.groupBy;
    $[14] = t4;
    $[15] = t7;
    $[16] = t9;
    $[17] = t10;
  } else {
    t10 = $[17];
  }
  return t10;
}
function _temp(c_0) {
  return /*#__PURE__*/_jsx(MenuItem, {
    value: c_0.field,
    children: c_0.label
  }, c_0.field);
}