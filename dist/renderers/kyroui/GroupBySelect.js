import { c as _c } from "react/compiler-runtime";
import { MenuItem, Select } from '@kyrobit/kyroui';
import { useDataTableContext } from './context.js';
import { jsx as _jsx } from "react/jsx-runtime";
export function DataTableGroupBySelect(t0) {
  const $ = _c(15);
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
  if ($[2] !== labelOf) {
    t4 = fields => fields.map(labelOf).join(" \u203A ");
    $[2] = labelOf;
    $[3] = t4;
  } else {
    t4 = $[3];
  }
  let t5;
  if ($[4] !== api) {
    t5 = e => api.setGroupBy(e.target.value);
    $[4] = api;
    $[5] = t5;
  } else {
    t5 = $[5];
  }
  let t6;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      minWidth: 180
    };
    $[6] = t6;
  } else {
    t6 = $[6];
  }
  let t7;
  if ($[7] !== columns) {
    t7 = columns.map(_temp);
    $[7] = columns;
    $[8] = t7;
  } else {
    t7 = $[8];
  }
  let t8;
  if ($[9] !== api.groupBy || $[10] !== noneLabel || $[11] !== t4 || $[12] !== t5 || $[13] !== t7) {
    t8 = /*#__PURE__*/_jsx(Select, {
      multiple: true,
      size: "small",
      label: "Group by",
      placeholder: noneLabel,
      value: t3,
      renderValue: t4,
      onChange: t5,
      sx: t6,
      children: t7
    });
    $[9] = api.groupBy;
    $[10] = noneLabel;
    $[11] = t4;
    $[12] = t5;
    $[13] = t7;
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  return t8;
}
function _temp(c_0) {
  return /*#__PURE__*/_jsx(MenuItem, {
    value: c_0.field,
    children: c_0.label
  }, c_0.field);
}