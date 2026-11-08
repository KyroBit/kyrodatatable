import { c as _c } from "react/compiler-runtime";
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { Autocomplete, Box, Button, ChipPicker, DatePicker, DateRangePicker, Divider, FormDialog, IconButton, Link, Popover, Stack, TextField, Tooltip, Typography } from '@kyrobit/kyroui';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { countFilterValues, filterValuesEqual, summarizeFilterValues, useFilterLabels } from '@kyrobit/datatable';
import { useDataTableContext } from './context.js';
import { ArrowBackIcon, CloseIcon, DragIcon, TrashIcon } from './icons.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { useDialogSize } from './dialogSize.js';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
function ChoiceFilterField(t0) {
  const $ = _c(9);
  const {
    column,
    value: raw,
    onChange
  } = t0;
  let t1;
  if ($[0] !== raw) {
    t1 = Array.isArray(raw) ? raw : [];
    $[0] = raw;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const value = t1;
  const multi = column.multi !== false;
  const t2 = multi ? value : value[0] ?? null;
  let t3;
  if ($[2] !== onChange) {
    t3 = next => onChange(next === null ? [] : Array.isArray(next) ? next : [next]);
    $[2] = onChange;
    $[3] = t3;
  } else {
    t3 = $[3];
  }
  let t4;
  if ($[4] !== column.options || $[5] !== multi || $[6] !== t2 || $[7] !== t3) {
    t4 = /*#__PURE__*/_jsx(ChipPicker, {
      options: column.options,
      multiple: multi,
      value: t2,
      onChange: t3
    });
    $[4] = column.options;
    $[5] = multi;
    $[6] = t2;
    $[7] = t3;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  return t4;
}
function SelectFilterField(t0) {
  const $ = _c(44);
  const {
    column,
    value: raw,
    onChange
  } = t0;
  let t1;
  if ($[0] !== raw) {
    t1 = Array.isArray(raw) ? raw : typeof raw === "string" && raw ? [raw] : [];
    $[0] = raw;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const value = t1;
  const multiple = column.multi !== false;
  const source = column.options;
  const api = useDataTableContext();
  let t2;
  if ($[2] !== column) {
    t2 = [column];
    $[2] = column;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== column.field || $[5] !== value) {
    t3 = {
      [column.field]: value
    };
    $[4] = column.field;
    $[5] = value;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  const labelOf = useFilterLabels(api, t2, t3);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  let t4;
  if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = [];
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  const [found, setFound] = useState(t4);
  const [loading, setLoading] = useState(false);
  let t5;
  if ($[8] !== api || $[9] !== column.field) {
    t5 = options => api.rememberFilterLabels(column.field, options);
    $[8] = api;
    $[9] = column.field;
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  const remember = useEffectEvent(t5);
  let t6;
  if ($[11] !== source) {
    t6 = typeof source === "function" ? undefined : source.map(_temp);
    $[11] = source;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  const staticOptions = t6;
  let t7;
  if ($[13] !== open || $[14] !== query || $[15] !== remember || $[16] !== source) {
    t7 = () => {
      if (!open || typeof source !== "function") {
        return;
      }
      let cancelled = false;
      setLoading(true);
      const timer = setTimeout(() => {
        source(query).then(results => {
          if (cancelled) {
            return;
          }
          remember(results);
          setFound(results.map(_temp2));
        }).finally(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });
      }, query ? 300 : 0);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    };
    $[13] = open;
    $[14] = query;
    $[15] = remember;
    $[16] = source;
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  let t8;
  if ($[18] !== open || $[19] !== query || $[20] !== source) {
    t8 = [open, query, source];
    $[18] = open;
    $[19] = query;
    $[20] = source;
    $[21] = t8;
  } else {
    t8 = $[21];
  }
  useEffect(t7, t8);
  let t9;
  if ($[22] !== column || $[23] !== labelOf || $[24] !== value) {
    let t10;
    if ($[26] !== column || $[27] !== labelOf) {
      t10 = id => ({
        id,
        label: labelOf(column, id)
      });
      $[26] = column;
      $[27] = labelOf;
      $[28] = t10;
    } else {
      t10 = $[28];
    }
    t9 = value.map(t10);
    $[22] = column;
    $[23] = labelOf;
    $[24] = value;
    $[25] = t9;
  } else {
    t9 = $[25];
  }
  const selected = t9;
  const t10 = staticOptions ?? found;
  const t11 = multiple ? selected : selected[0] ?? null;
  let t12;
  if ($[29] !== onChange) {
    t12 = (_, next) => onChange(Array.isArray(next) ? next.map(_temp3) : next ? [next.id] : []);
    $[29] = onChange;
    $[30] = t12;
  } else {
    t12 = $[30];
  }
  const t13 = staticOptions ? undefined : _temp6;
  let t14;
  let t15;
  let t16;
  if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = () => setOpen(true);
    t15 = () => {
      setOpen(false);
      setFound([]);
    };
    t16 = (__0, next_0, reason) => setQuery(reason === "input" ? next_0 : "");
    $[31] = t14;
    $[32] = t15;
    $[33] = t16;
  } else {
    t14 = $[31];
    t15 = $[32];
    t16 = $[33];
  }
  let t17;
  if ($[34] !== column.label) {
    t17 = column.label.toLowerCase();
    $[34] = column.label;
    $[35] = t17;
  } else {
    t17 = $[35];
  }
  const t18 = `Select ${t17}`;
  let t19;
  if ($[36] !== loading || $[37] !== multiple || $[38] !== t10 || $[39] !== t11 || $[40] !== t12 || $[41] !== t13 || $[42] !== t18) {
    t19 = /*#__PURE__*/_jsx(Autocomplete, {
      multiple: multiple,
      fullWidth: true,
      options: t10,
      value: t11,
      onChange: t12,
      getOptionLabel: _temp4,
      isOptionEqualToValue: _temp5,
      filterOptions: t13,
      loading: loading,
      onOpen: t14,
      onClose: t15,
      onInputChange: t16,
      placeholder: t18
    });
    $[36] = loading;
    $[37] = multiple;
    $[38] = t10;
    $[39] = t11;
    $[40] = t12;
    $[41] = t13;
    $[42] = t18;
    $[43] = t19;
  } else {
    t19 = $[43];
  }
  return t19;
}
function _temp6(options_0) {
  return options_0;
}
function _temp5(option_3, chosen) {
  return option_3.id === chosen.id;
}
function _temp4(option_2) {
  return option_2.label;
}
function _temp3(option_1) {
  return option_1.id;
}
function _temp2(option_0) {
  return {
    id: option_0.value,
    label: option_0.label
  };
}
function _temp(option) {
  return {
    id: option.value,
    label: option.label
  };
}
function TextFilterField(t0) {
  const $ = _c(10);
  const {
    column,
    value: raw,
    onChange
  } = t0;
  const value = typeof raw === "string" ? raw : "";
  const t1 = column.inputType === "number" ? "number" : "text";
  let t2;
  if ($[0] !== column.label || $[1] !== column.placeholder) {
    t2 = column.placeholder ?? `Enter ${column.label.toLowerCase()}`;
    $[0] = column.label;
    $[1] = column.placeholder;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  let t3;
  if ($[3] !== onChange) {
    t3 = e => onChange(e.target.value);
    $[3] = onChange;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  let t4;
  if ($[5] !== t1 || $[6] !== t2 || $[7] !== t3 || $[8] !== value) {
    t4 = /*#__PURE__*/_jsx(TextField, {
      size: "small",
      fullWidth: true,
      type: t1,
      placeholder: t2,
      value: value,
      onChange: t3
    });
    $[5] = t1;
    $[6] = t2;
    $[7] = t3;
    $[8] = value;
    $[9] = t4;
  } else {
    t4 = $[9];
  }
  return t4;
}
function DateFilterField(t0) {
  const $ = _c(15);
  const {
    column,
    value: raw,
    onChange
  } = t0;
  let t1;
  if ($[0] !== raw) {
    t1 = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    $[0] = raw;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const value = t1;
  if (!column.range) {
    const t2 = value.from ?? null;
    let t3;
    if ($[2] !== onChange) {
      t3 = next => onChange({
        from: next || undefined
      });
      $[2] = onChange;
      $[3] = t3;
    } else {
      t3 = $[3];
    }
    let t4;
    if ($[4] !== t2 || $[5] !== t3) {
      t4 = /*#__PURE__*/_jsx(DatePicker, {
        size: "small",
        fullWidth: true,
        clearable: true,
        locale: "en-US",
        value: t2,
        onChange: t3
      });
      $[4] = t2;
      $[5] = t3;
      $[6] = t4;
    } else {
      t4 = $[6];
    }
    return t4;
  }
  const t2 = value.from ?? null;
  const t3 = value.to ?? null;
  let t4;
  if ($[7] !== t2 || $[8] !== t3) {
    t4 = [t2, t3];
    $[7] = t2;
    $[8] = t3;
    $[9] = t4;
  } else {
    t4 = $[9];
  }
  let t5;
  if ($[10] !== onChange) {
    t5 = t6 => {
      const [from, to] = t6;
      return onChange({
        from: from ?? undefined,
        to: to ?? undefined
      });
    };
    $[10] = onChange;
    $[11] = t5;
  } else {
    t5 = $[11];
  }
  let t6;
  if ($[12] !== t4 || $[13] !== t5) {
    t6 = /*#__PURE__*/_jsx(DateRangePicker, {
      size: "small",
      fullWidth: true,
      clearable: true,
      locale: "en-US",
      value: t4,
      onChange: t5
    });
    $[12] = t4;
    $[13] = t5;
    $[14] = t6;
  } else {
    t6 = $[14];
  }
  return t6;
}
function FilterField(t0) {
  const $ = _c(23);
  const {
    column,
    value,
    onChange,
    renderers
  } = t0;
  const Custom = renderers?.[column.type];
  if (Custom) {
    let t1;
    if ($[0] !== Custom || $[1] !== column || $[2] !== onChange || $[3] !== value) {
      t1 = Custom({
        column,
        value,
        onChange
      });
      $[0] = Custom;
      $[1] = column;
      $[2] = onChange;
      $[3] = value;
      $[4] = t1;
    } else {
      t1 = $[4];
    }
    let t2;
    if ($[5] !== t1) {
      t2 = /*#__PURE__*/_jsx(_Fragment, {
        children: t1
      });
      $[5] = t1;
      $[6] = t2;
    } else {
      t2 = $[6];
    }
    return t2;
  }
  switch (column.type) {
    case "select":
      {
        let t1;
        if ($[7] !== column || $[8] !== onChange || $[9] !== value) {
          t1 = /*#__PURE__*/_jsx(SelectFilterField, {
            column: column,
            value: value,
            onChange: onChange
          });
          $[7] = column;
          $[8] = onChange;
          $[9] = value;
          $[10] = t1;
        } else {
          t1 = $[10];
        }
        return t1;
      }
    case "choice":
      {
        let t1;
        if ($[11] !== column || $[12] !== onChange || $[13] !== value) {
          t1 = /*#__PURE__*/_jsx(ChoiceFilterField, {
            column: column,
            value: value,
            onChange: onChange
          });
          $[11] = column;
          $[12] = onChange;
          $[13] = value;
          $[14] = t1;
        } else {
          t1 = $[14];
        }
        return t1;
      }
    case "text":
      {
        let t1;
        if ($[15] !== column || $[16] !== onChange || $[17] !== value) {
          t1 = /*#__PURE__*/_jsx(TextFilterField, {
            column: column,
            value: value,
            onChange: onChange
          });
          $[15] = column;
          $[16] = onChange;
          $[17] = value;
          $[18] = t1;
        } else {
          t1 = $[18];
        }
        return t1;
      }
    case "date":
      {
        let t1;
        if ($[19] !== column || $[20] !== onChange || $[21] !== value) {
          t1 = /*#__PURE__*/_jsx(DateFilterField, {
            column: column,
            value: value,
            onChange: onChange
          });
          $[19] = column;
          $[20] = onChange;
          $[21] = value;
          $[22] = t1;
        } else {
          t1 = $[22];
        }
        return t1;
      }
  }
}
export function DataTableFilterMenu(t0) {
  const $ = _c(52);
  const {
    anchorEl,
    onClose,
    filterColumns,
    draft,
    onDraftChange,
    onApply,
    presets,
    filterRenderers
  } = t0;
  const [mode, setMode] = useState("filter");
  const [name, setName] = useState("");
  let t1;
  if ($[0] !== draft) {
    t1 = countFilterValues(draft);
    $[0] = draft;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const draftEmpty = t1 === 0;
  let t2;
  if ($[2] !== onClose) {
    t2 = () => {
      setMode("filter");
      setName("");
      onClose();
    };
    $[2] = onClose;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const close = t2;
  let t3;
  if ($[4] !== close || $[5] !== draft || $[6] !== name || $[7] !== onApply || $[8] !== presets) {
    t3 = () => {
      const trimmed = name.trim();
      if (!trimmed || !presets) {
        return;
      }
      const id = presets.create(trimmed, draft);
      onApply(draft, id);
      close();
    };
    $[4] = close;
    $[5] = draft;
    $[6] = name;
    $[7] = onApply;
    $[8] = presets;
    $[9] = t3;
  } else {
    t3 = $[9];
  }
  const saveFilter = t3;
  const t4 = Boolean(anchorEl);
  let t5;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = {
      px: "lg",
      pt: "md",
      pb: "lg"
    };
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  let t6;
  if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      mb: "md"
    };
    $[11] = t6;
  } else {
    t6 = $[11];
  }
  let t7;
  if ($[12] !== mode) {
    t7 = mode === "save" && /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      onClick: () => setMode("filter"),
      "aria-label": "Back",
      children: /*#__PURE__*/_jsx(ArrowBackIcon, {
        fontSize: "small"
      })
    });
    $[12] = mode;
    $[13] = t7;
  } else {
    t7 = $[13];
  }
  let t8;
  if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      fontSize: "h5",
      fontWeight: 600,
      color: "text.primary"
    };
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  const t9 = mode === "save" ? "Save as view" : "Filter";
  let t10;
  if ($[15] !== t9) {
    t10 = /*#__PURE__*/_jsx(Typography, {
      sx: t8,
      children: t9
    });
    $[15] = t9;
    $[16] = t10;
  } else {
    t10 = $[16];
  }
  let t11;
  if ($[17] !== t10 || $[18] !== t7) {
    t11 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: "sm",
      alignItems: "center",
      children: [t7, t10]
    });
    $[17] = t10;
    $[18] = t7;
    $[19] = t11;
  } else {
    t11 = $[19];
  }
  let t12;
  if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = /*#__PURE__*/_jsx(CloseIcon, {
      fontSize: "small"
    });
    $[20] = t12;
  } else {
    t12 = $[20];
  }
  let t13;
  if ($[21] !== close) {
    t13 = /*#__PURE__*/_jsx(IconButton, {
      variant: "tonal",
      size: "small",
      onClick: close,
      "aria-label": "Close filters",
      children: t12
    });
    $[21] = close;
    $[22] = t13;
  } else {
    t13 = $[22];
  }
  let t14;
  if ($[23] !== t11 || $[24] !== t13) {
    t14 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      alignItems: "center",
      justifyContent: "space-between",
      sx: t6,
      children: [t11, t13]
    });
    $[23] = t11;
    $[24] = t13;
    $[25] = t14;
  } else {
    t14 = $[25];
  }
  let t15;
  if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = /*#__PURE__*/_jsx(Divider, {});
    $[26] = t15;
  } else {
    t15 = $[26];
  }
  let t16;
  if ($[27] !== close || $[28] !== draft || $[29] !== draftEmpty || $[30] !== filterColumns || $[31] !== filterRenderers || $[32] !== mode || $[33] !== onApply || $[34] !== onDraftChange || $[35] !== presets) {
    t16 = mode === "filter" && /*#__PURE__*/_jsxs(_Fragment, {
      children: [filterColumns.map(column => /*#__PURE__*/_jsxs(Box, {
        children: [/*#__PURE__*/_jsx(Typography, {
          sx: {
            fontSize: "lg",
            fontWeight: 600,
            color: "text.primary",
            mt: "md",
            mb: "sm"
          },
          children: column.label
        }), /*#__PURE__*/_jsx(FilterField, {
          column: column,
          value: draft[column.field],
          onChange: next => onDraftChange({
            ...draft,
            [column.field]: next
          }),
          renderers: filterRenderers
        })]
      }, column.field)), /*#__PURE__*/_jsx(Divider, {
        sx: {
          mt: "lg"
        }
      }), /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        sx: {
          mt: "md"
        },
        children: [/*#__PURE__*/_jsx(Link, {
          component: "button",
          type: "button",
          onClick: () => {
            onApply({});
            close();
          },
          sx: {
            background: "none",
            border: "none",
            p: 0,
            fontSize: "md",
            fontWeight: 600,
            color: "error.main"
          },
          children: "Clear all"
        }), /*#__PURE__*/_jsxs(Stack, {
          direction: "row",
          spacing: "sm",
          children: [presets && /*#__PURE__*/_jsx(Button, {
            variant: "outlined",
            disabled: draftEmpty,
            onClick: () => setMode("save"),
            children: "Save"
          }), /*#__PURE__*/_jsx(Button, {
            variant: "contained",
            onClick: () => {
              onApply(draft);
              close();
            },
            children: "Apply"
          })]
        })]
      })]
    });
    $[27] = close;
    $[28] = draft;
    $[29] = draftEmpty;
    $[30] = filterColumns;
    $[31] = filterRenderers;
    $[32] = mode;
    $[33] = onApply;
    $[34] = onDraftChange;
    $[35] = presets;
    $[36] = t16;
  } else {
    t16 = $[36];
  }
  let t17;
  if ($[37] !== draft || $[38] !== filterColumns || $[39] !== mode || $[40] !== name || $[41] !== saveFilter) {
    t17 = mode === "save" && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(TextField, {
        autoFocus: true,
        fullWidth: true,
        placeholder: "View name",
        value: name,
        onChange: e => setName(e.target.value),
        inputProps: {
          onKeyDown: e_0 => {
            if (e_0.key === "Enter") {
              e_0.preventDefault();
              saveFilter();
            }
          }
        },
        sx: {
          mt: "lg"
        }
      }), /*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "sm",
          color: "text.secondary",
          mt: "sm"
        },
        children: summarizeFilterValues(draft, filterColumns)
      }), /*#__PURE__*/_jsx(Stack, {
        direction: "row",
        justifyContent: "flex-end",
        sx: {
          mt: "lg"
        },
        children: /*#__PURE__*/_jsx(Button, {
          variant: "contained",
          disabled: !name.trim(),
          onClick: saveFilter,
          children: "Save & apply"
        })
      })]
    });
    $[37] = draft;
    $[38] = filterColumns;
    $[39] = mode;
    $[40] = name;
    $[41] = saveFilter;
    $[42] = t17;
  } else {
    t17 = $[42];
  }
  let t18;
  if ($[43] !== t14 || $[44] !== t16 || $[45] !== t17) {
    t18 = /*#__PURE__*/_jsxs(Box, {
      sx: t5,
      children: [t14, t15, t16, t17]
    });
    $[43] = t14;
    $[44] = t16;
    $[45] = t17;
    $[46] = t18;
  } else {
    t18 = $[46];
  }
  let t19;
  if ($[47] !== anchorEl || $[48] !== close || $[49] !== t18 || $[50] !== t4) {
    t19 = /*#__PURE__*/_jsx(Popover, {
      anchorEl: anchorEl,
      open: t4,
      onClose: close,
      placement: "bottom-end",
      "aria-label": "Filters",
      sx: _temp7,
      children: t18
    });
    $[47] = anchorEl;
    $[48] = close;
    $[49] = t18;
    $[50] = t4;
    $[51] = t19;
  } else {
    t19 = $[51];
  }
  return t19;
}
function _temp7(theme) {
  return {
    width: 400,
    maxWidth: `calc(100vw - 2 * ${theme.spacing("lg")})`
  };
}
export function ManageViewsDialog(t0) {
  const $ = _c(66);
  const {
    open,
    onClose,
    presets,
    filterColumns
  } = t0;
  const size = useDialogSize();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {};
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  const [editFilters, setEditFilters] = useState(t1);
  let t2;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      activationConstraint: {
        distance: 4
      }
    };
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  let t3;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = {
      coordinateGetter: sortableKeyboardCoordinates
    };
    $[2] = t3;
  } else {
    t3 = $[2];
  }
  const sensors = useSensors(useSensor(PointerSensor, t2), useSensor(KeyboardSensor, t3));
  let close;
  let commitEdit;
  let editing;
  let startEdit;
  let t4;
  let t5;
  if ($[3] !== editFilters || $[4] !== editName || $[5] !== editingId || $[6] !== onClose || $[7] !== presets) {
    editing = editingId ? presets.all.find(p => p.id === editingId) : null;
    let t6;
    if ($[14] !== onClose) {
      t6 = () => {
        setEditingId(null);
        onClose();
      };
      $[14] = onClose;
      $[15] = t6;
    } else {
      t6 = $[15];
    }
    close = t6;
    let t7;
    if ($[16] !== presets) {
      t7 = id => {
        const preset = presets.all.find(p_0 => p_0.id === id);
        if (!preset) {
          return;
        }
        setEditName(preset.name);
        setEditFilters(preset.filters);
        setEditingId(id);
      };
      $[16] = presets;
      $[17] = t7;
    } else {
      t7 = $[17];
    }
    startEdit = t7;
    let t8;
    if ($[18] !== editFilters || $[19] !== editName || $[20] !== editingId || $[21] !== presets) {
      t8 = () => {
        const trimmed = editName.trim();
        if (!editingId || !trimmed) {
          return;
        }
        presets.update(editingId, trimmed, editFilters);
        setEditingId(null);
      };
      $[18] = editFilters;
      $[19] = editName;
      $[20] = editingId;
      $[21] = presets;
      $[22] = t8;
    } else {
      t8 = $[22];
    }
    commitEdit = t8;
    t4 = Boolean;
    t5 = editing && (editName.trim() !== editing.name || !filterValuesEqual(editFilters, editing.filters));
    $[3] = editFilters;
    $[4] = editName;
    $[5] = editingId;
    $[6] = onClose;
    $[7] = presets;
    $[8] = close;
    $[9] = commitEdit;
    $[10] = editing;
    $[11] = startEdit;
    $[12] = t4;
    $[13] = t5;
  } else {
    close = $[8];
    commitEdit = $[9];
    editing = $[10];
    startEdit = $[11];
    t4 = $[12];
    t5 = $[13];
  }
  const isEditDirty = t4(t5);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  let t6;
  if ($[23] !== isEditDirty) {
    t6 = () => {
      if (isEditDirty) {
        setConfirmDiscardOpen(true);
        return;
      }
      setEditingId(null);
    };
    $[23] = isEditDirty;
    $[24] = t6;
  } else {
    t6 = $[24];
  }
  const discardEdit = t6;
  let t7;
  if ($[25] !== presets) {
    t7 = t8 => {
      const {
        active,
        over
      } = t8;
      if (!over || active.id === over.id) {
        return;
      }
      const from = presets.all.findIndex(p_1 => p_1.id === active.id);
      const to = presets.all.findIndex(p_2 => p_2.id === over.id);
      if (from !== -1 && to !== -1) {
        presets.reorder(from, to);
      }
    };
    $[25] = presets;
    $[26] = t7;
  } else {
    t7 = $[26];
  }
  const handleDragEnd = t7;
  const t8 = editing ? "Edit view" : "Views";
  let t9;
  if ($[27] !== close || $[28] !== commitEdit || $[29] !== discardEdit || $[30] !== editName || $[31] !== editing) {
    t9 = editing ? {
      onSubmit: commitEdit,
      submitLabel: "Save",
      submitDisabled: !editName.trim(),
      onCancel: discardEdit,
      cancelLabel: "Discard"
    } : {
      actions: /*#__PURE__*/_jsx(Button, {
        variant: "contained",
        onClick: close,
        children: "Done"
      })
    };
    $[27] = close;
    $[28] = commitEdit;
    $[29] = discardEdit;
    $[30] = editName;
    $[31] = editing;
    $[32] = t9;
  } else {
    t9 = $[32];
  }
  let t10;
  if ($[33] !== commitEdit || $[34] !== editFilters || $[35] !== editName || $[36] !== editing || $[37] !== filterColumns || $[38] !== handleDragEnd || $[39] !== presets || $[40] !== sensors || $[41] !== startEdit) {
    t10 = editing ? /*#__PURE__*/_jsxs(Box, {
      children: [/*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "lg",
          fontWeight: 600,
          color: "text.primary",
          mb: "sm"
        },
        children: "Name"
      }), /*#__PURE__*/_jsx(TextField, {
        autoFocus: true,
        fullWidth: true,
        placeholder: "View name",
        value: editName,
        onChange: e => setEditName(e.target.value),
        inputProps: {
          onKeyDown: e_0 => {
            if (e_0.key === "Enter") {
              e_0.preventDefault();
              commitEdit();
            }
          }
        }
      }), filterColumns.map(column => /*#__PURE__*/_jsxs(Box, {
        children: [/*#__PURE__*/_jsx(Typography, {
          sx: {
            fontSize: "lg",
            fontWeight: 600,
            color: "text.primary",
            mt: "lg",
            mb: "sm"
          },
          children: column.label
        }), /*#__PURE__*/_jsx(FilterField, {
          column: column,
          value: editFilters[column.field],
          onChange: next => setEditFilters({
            ...editFilters,
            [column.field]: next
          })
        })]
      }, column.field))]
    }) : /*#__PURE__*/_jsx(Stack, {
      spacing: "xs",
      sx: {
        maxHeight: 380,
        overflowY: "auto"
      },
      children: /*#__PURE__*/_jsx(DndContext, {
        sensors: sensors,
        collisionDetection: closestCenter,
        modifiers: [restrictToVerticalAxis, restrictToParentElement],
        onDragEnd: handleDragEnd,
        children: /*#__PURE__*/_jsx(SortableContext, {
          items: presets.all.map(_temp8),
          strategy: verticalListSortingStrategy,
          children: presets.all.map(p_4 => /*#__PURE__*/_jsxs(SortableViewRow, {
            id: p_4.id,
            onClick: () => startEdit(p_4.id),
            children: [/*#__PURE__*/_jsxs(Box, {
              sx: {
                flex: 1,
                minWidth: 0
              },
              children: [/*#__PURE__*/_jsx(Typography, {
                noWrap: true,
                sx: {
                  fontSize: "lg",
                  fontWeight: 600,
                  color: "text.primary"
                },
                children: p_4.name
              }), /*#__PURE__*/_jsx(Typography, {
                noWrap: true,
                sx: {
                  fontSize: "sm",
                  color: "text.secondary"
                },
                children: summarizeFilterValues(p_4.filters, filterColumns)
              })]
            }), /*#__PURE__*/_jsx(Stack, {
              direction: "row",
              spacing: "xs",
              onClick: _temp9,
              children: /*#__PURE__*/_jsx(Tooltip, {
                title: "Delete",
                children: /*#__PURE__*/_jsx(IconButton, {
                  size: "small",
                  color: "error",
                  "aria-label": `Delete ${p_4.name}`,
                  onClick: () => setPendingDelete(p_4),
                  children: /*#__PURE__*/_jsx(TrashIcon, {
                    fontSize: "small"
                  })
                })
              })
            })]
          }, p_4.id))
        })
      })
    });
    $[33] = commitEdit;
    $[34] = editFilters;
    $[35] = editName;
    $[36] = editing;
    $[37] = filterColumns;
    $[38] = handleDragEnd;
    $[39] = presets;
    $[40] = sensors;
    $[41] = startEdit;
    $[42] = t10;
  } else {
    t10 = $[42];
  }
  let t11;
  if ($[43] !== close || $[44] !== open || $[45] !== size || $[46] !== t10 || $[47] !== t8 || $[48] !== t9) {
    t11 = /*#__PURE__*/_jsx(FormDialog, {
      open: open,
      onClose: close,
      title: t8,
      ...size,
      ...t9,
      children: t10
    });
    $[43] = close;
    $[44] = open;
    $[45] = size;
    $[46] = t10;
    $[47] = t8;
    $[48] = t9;
    $[49] = t11;
  } else {
    t11 = $[49];
  }
  const t12 = Boolean(pendingDelete);
  const t13 = `"${pendingDelete?.name}" will be removed for good.`;
  let t14;
  if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = () => setPendingDelete(null);
    $[50] = t14;
  } else {
    t14 = $[50];
  }
  let t15;
  if ($[51] !== pendingDelete || $[52] !== presets) {
    t15 = () => {
      if (pendingDelete) {
        presets.remove(pendingDelete.id);
      }
      setPendingDelete(null);
    };
    $[51] = pendingDelete;
    $[52] = presets;
    $[53] = t15;
  } else {
    t15 = $[53];
  }
  let t16;
  if ($[54] !== t12 || $[55] !== t13 || $[56] !== t15) {
    t16 = /*#__PURE__*/_jsx(ConfirmDialog, {
      open: t12,
      title: "Delete this view?",
      description: t13,
      confirmLabel: "Delete",
      confirmColor: "error",
      onCancel: t14,
      onConfirm: t15
    });
    $[54] = t12;
    $[55] = t13;
    $[56] = t15;
    $[57] = t16;
  } else {
    t16 = $[57];
  }
  let t17;
  let t18;
  if ($[58] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = () => setConfirmDiscardOpen(false);
    t18 = () => {
      setConfirmDiscardOpen(false);
      setEditingId(null);
    };
    $[58] = t17;
    $[59] = t18;
  } else {
    t17 = $[58];
    t18 = $[59];
  }
  let t19;
  if ($[60] !== confirmDiscardOpen) {
    t19 = /*#__PURE__*/_jsx(ConfirmDialog, {
      open: confirmDiscardOpen,
      title: "Discard your changes?",
      description: "Your edits to this view haven't been saved.",
      confirmLabel: "Discard",
      cancelLabel: "Keep editing",
      confirmColor: "error",
      onCancel: t17,
      onConfirm: t18
    });
    $[60] = confirmDiscardOpen;
    $[61] = t19;
  } else {
    t19 = $[61];
  }
  let t20;
  if ($[62] !== t11 || $[63] !== t16 || $[64] !== t19) {
    t20 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t11, t16, t19]
    });
    $[62] = t11;
    $[63] = t16;
    $[64] = t19;
    $[65] = t20;
  } else {
    t20 = $[65];
  }
  return t20;
}
function _temp9(e_1) {
  return e_1.stopPropagation();
}
function _temp8(p_3) {
  return p_3.id;
}
function SortableViewRow(t0) {
  const $ = _c(30);
  const {
    id,
    children,
    onClick
  } = t0;
  let t1;
  if ($[0] !== id) {
    t1 = {
      id
    };
    $[0] = id;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable(t1);
  let t2;
  if ($[2] !== transform) {
    t2 = CSS.Transform.toString(transform);
    $[2] = transform;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const t3 = isDragging ? 1 : undefined;
  let t4;
  if ($[4] !== t2 || $[5] !== t3 || $[6] !== transition) {
    t4 = {
      transform: t2,
      transition,
      position: "relative",
      zIndex: t3
    };
    $[4] = t2;
    $[5] = t3;
    $[6] = transition;
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  const t5 = isDragging ? "background.surface" : undefined;
  const t6 = isDragging ? 3 : undefined;
  let t7;
  if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {
      bgcolor: "background.surface"
    };
    $[8] = t7;
  } else {
    t7 = $[8];
  }
  let t8;
  if ($[9] !== t5 || $[10] !== t6) {
    t8 = {
      gap: "sm",
      px: "sm",
      py: "md",
      borderRadius: "md",
      cursor: "pointer",
      bgcolor: t5,
      boxShadow: t6,
      "&:hover": t7
    };
    $[9] = t5;
    $[10] = t6;
    $[11] = t8;
  } else {
    t8 = $[11];
  }
  const t9 = isDragging ? "grabbing" : "grab";
  let t10;
  let t11;
  if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = {
      color: "text.disabled"
    };
    t11 = {
      color: "text.secondary"
    };
    $[12] = t10;
    $[13] = t11;
  } else {
    t10 = $[12];
    t11 = $[13];
  }
  let t12;
  if ($[14] !== t9) {
    t12 = {
      display: "flex",
      alignItems: "center",
      cursor: t9,
      touchAction: "none",
      "&": t10,
      "&:hover": t11
    };
    $[14] = t9;
    $[15] = t12;
  } else {
    t12 = $[15];
  }
  let t13;
  if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = /*#__PURE__*/_jsx(DragIcon, {
      fontSize: "small"
    });
    $[16] = t13;
  } else {
    t13 = $[16];
  }
  let t14;
  if ($[17] !== attributes || $[18] !== listeners || $[19] !== t12) {
    t14 = /*#__PURE__*/_jsx(Box, {
      ...attributes,
      ...listeners,
      onClick: _temp0,
      "aria-label": "Drag to reorder",
      sx: t12,
      children: t13
    });
    $[17] = attributes;
    $[18] = listeners;
    $[19] = t12;
    $[20] = t14;
  } else {
    t14 = $[20];
  }
  let t15;
  if ($[21] !== children || $[22] !== onClick || $[23] !== t14 || $[24] !== t8) {
    t15 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      alignItems: "center",
      onClick: onClick,
      sx: t8,
      children: [t14, children]
    });
    $[21] = children;
    $[22] = onClick;
    $[23] = t14;
    $[24] = t8;
    $[25] = t15;
  } else {
    t15 = $[25];
  }
  let t16;
  if ($[26] !== setNodeRef || $[27] !== t15 || $[28] !== t4) {
    t16 = /*#__PURE__*/_jsx("div", {
      ref: setNodeRef,
      style: t4,
      children: t15
    });
    $[26] = setNodeRef;
    $[27] = t15;
    $[28] = t4;
    $[29] = t16;
  } else {
    t16 = $[29];
  }
  return t16;
}
function _temp0(e) {
  return e.stopPropagation();
}