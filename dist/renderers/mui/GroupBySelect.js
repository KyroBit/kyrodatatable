import { c as _c } from "react/compiler-runtime";
import { MenuItem, TextField } from '@mui/material';
import { useDataTableContext } from './context.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Renders nothing if the hook wasn't given `groupByColumns` — there's nothing to group by. */
export function DataTableGroupBySelect(t0) {
  const $ = _c(12);
  const {
    noneLabel: t1
  } = t0;
  const noneLabel = t1 === undefined ? "None" : t1;
  const api = useDataTableContext();
  const columns = api.groupByColumns;
  if (!columns || columns.length === 0) {
    return null;
  }
  const t2 = api.groupBy ?? "";
  let t3;
  if ($[0] !== api) {
    t3 = e => api.setGroupBy(e.target.value || null);
    $[0] = api;
    $[1] = t3;
  } else {
    t3 = $[1];
  }
  let t4;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = {
      minWidth: 180
    };
    $[2] = t4;
  } else {
    t4 = $[2];
  }
  let t5;
  if ($[3] !== noneLabel) {
    t5 = /*#__PURE__*/_jsx(MenuItem, {
      value: "",
      children: noneLabel
    });
    $[3] = noneLabel;
    $[4] = t5;
  } else {
    t5 = $[4];
  }
  let t6;
  if ($[5] !== columns) {
    t6 = columns.map(_temp);
    $[5] = columns;
    $[6] = t6;
  } else {
    t6 = $[6];
  }
  let t7;
  if ($[7] !== t2 || $[8] !== t3 || $[9] !== t5 || $[10] !== t6) {
    t7 = /*#__PURE__*/_jsxs(TextField, {
      size: "small",
      select: true,
      label: "Group by",
      value: t2,
      onChange: t3,
      sx: t4,
      children: [t5, t6]
    });
    $[7] = t2;
    $[8] = t3;
    $[9] = t5;
    $[10] = t6;
    $[11] = t7;
  } else {
    t7 = $[11];
  }
  return t7;
}
function _temp(c) {
  return /*#__PURE__*/_jsx(MenuItem, {
    value: c.field,
    children: c.label
  }, c.field);
}