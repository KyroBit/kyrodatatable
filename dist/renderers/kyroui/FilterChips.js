import { c as _c } from "react/compiler-runtime";
import { Chip, Stack } from '@kyrobit/kyroui';
import { asDateRange, asSelectValues, asTextValue, useFilterLabels } from '@kyrobit/datatable';
import { useDataTableContext } from './context.js';
import { jsx as _jsx } from "react/jsx-runtime";
export function DataTableFilterChips(t0) {
  const $ = _c(16);
  const {
    filterColumns
  } = t0;
  const api = useDataTableContext();
  let t1;
  if ($[0] !== api.filters) {
    t1 = api.filters ?? {};
    $[0] = api.filters;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const filters = t1;
  const labelOf = useFilterLabels(api, filterColumns, filters);
  let t2;
  if ($[2] !== api || $[3] !== filters) {
    t2 = (field, next) => {
      const rest = Object.fromEntries(Object.entries(filters).filter(t3 => {
        const [key] = t3;
        return key !== field;
      }));
      api.setFilters(next === undefined ? rest : {
        ...rest,
        [field]: next
      });
    };
    $[2] = api;
    $[3] = filters;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  const replace = t2;
  let t3;
  let t4;
  if ($[5] !== filterColumns || $[6] !== filters || $[7] !== labelOf || $[8] !== replace) {
    t4 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let t5;
      if ($[11] !== filters || $[12] !== labelOf || $[13] !== replace) {
        t5 = column => {
          const value = filters[column.field];
          if (column.type === "select" || column.type === "choice") {
            const values = asSelectValues(value);
            return values.map(selected => ({
              key: `${column.field}:${selected}`,
              label: labelOf(column, selected),
              remove: () => replace(column.field, values.filter(other => other !== selected))
            }));
          }
          if (column.type === "date") {
            const {
              from,
              to
            } = asDateRange(value);
            if (!from && !to) {
              return [];
            }
            return [{
              key: column.field,
              label: `${column.label}: ${from && to ? `${from} – ${to}` : from || to}`,
              remove: () => replace(column.field)
            }];
          }
          const text = asTextValue(value);
          return text ? [{
            key: column.field,
            label: `${column.label}: ${text}`,
            remove: () => replace(column.field)
          }] : [];
        };
        $[11] = filters;
        $[12] = labelOf;
        $[13] = replace;
        $[14] = t5;
      } else {
        t5 = $[14];
      }
      const chips = filterColumns.flatMap(t5);
      if (chips.length === 0) {
        t4 = null;
        break bb0;
      }
      let t6;
      if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = {
          flexWrap: "wrap",
          gap: "sm"
        };
        $[15] = t6;
      } else {
        t6 = $[15];
      }
      t3 = /*#__PURE__*/_jsx(Stack, {
        direction: "row",
        sx: t6,
        children: chips.map(_temp)
      });
    }
    $[5] = filterColumns;
    $[6] = filters;
    $[7] = labelOf;
    $[8] = replace;
    $[9] = t3;
    $[10] = t4;
  } else {
    t3 = $[9];
    t4 = $[10];
  }
  if (t4 !== Symbol.for("react.early_return_sentinel")) {
    return t4;
  }
  return t3;
}
function _temp(chip) {
  return /*#__PURE__*/_jsx(Chip, {
    label: chip.label,
    onDelete: chip.remove
  }, chip.key);
}