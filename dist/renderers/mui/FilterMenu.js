import { c as _c } from "react/compiler-runtime";
import { useDialogSize } from './dialogSize.js';
import { useMemo, useState } from 'react';
import { Box, Button, Dialog, Divider, IconButton, Menu, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Select } from './Select.js';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { countFilterValues, filterValuesEqual, summarizeFilterValues, useFilterLabels } from '@kyrobit/datatable';
import { useDataTableContext } from './context.js';
import { SortableList, SortableRow } from './Sortable.js';
import { TrashIcon } from './icons.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function FilterChip(t0) {
  const $ = _c(6);
  const {
    label,
    active,
    onClick
  } = t0;
  let t1;
  if ($[0] !== active) {
    t1 = theme => ({
      border: "none",
      cursor: "pointer",
      px: "14px",
      py: "8px",
      borderRadius: "8px",
      fontFamily: "inherit",
      fontSize: "13px",
      fontWeight: 500,
      bgcolor: active ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.04),
      color: active ? theme.palette.background.paper : theme.palette.text.secondary,
      transition: "background-color 0.15s, color 0.15s",
      "&:hover": {
        bgcolor: active ? alpha(theme.palette.text.primary, 0.85) : alpha(theme.palette.text.primary, 0.08)
      }
    });
    $[0] = active;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== label || $[3] !== onClick || $[4] !== t1) {
    t2 = /*#__PURE__*/_jsx(Box, {
      component: "button",
      type: "button",
      onClick: onClick,
      sx: t1,
      children: label
    });
    $[2] = label;
    $[3] = onClick;
    $[4] = t1;
    $[5] = t2;
  } else {
    t2 = $[5];
  }
  return t2;
}
function ChoiceFilterField(t0) {
  const $ = _c(14);
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
  let t2;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      flexWrap: "wrap",
      gap: 1
    };
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  let t3;
  if ($[3] !== column.options || $[4] !== multi || $[5] !== onChange || $[6] !== value) {
    let t4;
    if ($[8] !== multi || $[9] !== onChange || $[10] !== value) {
      t4 = option => {
        const active = value.includes(option.value);
        return /*#__PURE__*/_jsx(FilterChip, {
          label: option.label,
          active: active,
          onClick: () => {
            if (!multi) {
              return onChange(active ? [] : [option.value]);
            }
            onChange(active ? value.filter(v => v !== option.value) : [...value, option.value]);
          }
        }, option.value);
      };
      $[8] = multi;
      $[9] = onChange;
      $[10] = value;
      $[11] = t4;
    } else {
      t4 = $[11];
    }
    t3 = column.options.map(t4);
    $[3] = column.options;
    $[4] = multi;
    $[5] = onChange;
    $[6] = value;
    $[7] = t3;
  } else {
    t3 = $[7];
  }
  let t4;
  if ($[12] !== t3) {
    t4 = /*#__PURE__*/_jsx(Stack, {
      direction: "row",
      sx: t2,
      children: t3
    });
    $[12] = t3;
    $[13] = t4;
  } else {
    t4 = $[13];
  }
  return t4;
}
function SelectFilterField(t0) {
  const $ = _c(31);
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
  let t4;
  if ($[7] !== source) {
    t4 = typeof source === "function" ? undefined : source.map(_temp);
    $[7] = source;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  const staticOptions = t4;
  let t5;
  if ($[9] !== api || $[10] !== column.field || $[11] !== source) {
    t5 = typeof source === "function" ? async query => {
      const results = await source(query);
      api.rememberFilterLabels(column.field, results);
      return results.map(_temp2);
    } : undefined;
    $[9] = api;
    $[10] = column.field;
    $[11] = source;
    $[12] = t5;
  } else {
    t5 = $[12];
  }
  const search = t5;
  let t6;
  if ($[13] !== column || $[14] !== labelOf || $[15] !== value) {
    let t7;
    if ($[17] !== column || $[18] !== labelOf) {
      t7 = id => ({
        id,
        label: labelOf(column, id)
      });
      $[17] = column;
      $[18] = labelOf;
      $[19] = t7;
    } else {
      t7 = $[19];
    }
    t6 = value.map(t7);
    $[13] = column;
    $[14] = labelOf;
    $[15] = value;
    $[16] = t6;
  } else {
    t6 = $[16];
  }
  const selected = t6;
  let t7;
  if ($[20] !== column.label) {
    t7 = column.label.toLowerCase();
    $[20] = column.label;
    $[21] = t7;
  } else {
    t7 = $[21];
  }
  const t8 = `Select ${t7}`;
  let t9;
  if ($[22] !== search || $[23] !== staticOptions || $[24] !== t8) {
    t9 = {
      options: staticOptions,
      search,
      getOptionLabel: _temp3,
      placeholder: t8
    };
    $[22] = search;
    $[23] = staticOptions;
    $[24] = t8;
    $[25] = t9;
  } else {
    t9 = $[25];
  }
  const shared = t9;
  let t10;
  if ($[26] !== multiple || $[27] !== onChange || $[28] !== selected || $[29] !== shared) {
    t10 = multiple ? /*#__PURE__*/_jsx(Select, {
      ...shared,
      multiple: true,
      value: selected,
      onChange: next => onChange(next.map(_temp4))
    }) : /*#__PURE__*/_jsx(Select, {
      ...shared,
      value: selected[0] ?? null,
      onChange: next_0 => onChange(next_0 ? [next_0.id] : [])
    });
    $[26] = multiple;
    $[27] = onChange;
    $[28] = selected;
    $[29] = shared;
    $[30] = t10;
  } else {
    t10 = $[30];
  }
  return t10;
}
function _temp4(option_2) {
  return option_2.id;
}
function _temp3(option_1) {
  return option_1.label;
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
function toIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fromIsoDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** A single date field: a themed trigger button opening a hand-rolled calendar popover — not `<input type="date">`, whose picker UI is native browser chrome no CSS can restyle. */
function SingleDatePicker(t0) {
  const $ = _c(77);
  const {
    ariaLabel,
    value,
    onChange
  } = t0;
  const [anchor, setAnchor] = useState(null);
  let t1;
  if ($[0] !== value) {
    t1 = fromIsoDate(value);
    $[0] = value;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const selected = t1;
  let t2;
  if ($[2] !== selected) {
    t2 = selected ?? new Date();
    $[2] = selected;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const [viewDate, setViewDate] = useState(t2);
  let t3;
  if ($[4] !== selected) {
    t3 = e => {
      setViewDate(selected ?? new Date());
      setAnchor(e.currentTarget);
    };
    $[4] = selected;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  const open = t3;
  let T0;
  let T1;
  let T2;
  let t10;
  let t11;
  let t12;
  let t13;
  let t14;
  let t15;
  let t4;
  let t5;
  let t6;
  let t7;
  let t8;
  let t9;
  if ($[6] !== anchor || $[7] !== ariaLabel || $[8] !== onChange || $[9] !== open || $[10] !== selected || $[11] !== viewDate) {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const cells = [...Array.from({
      length: firstWeekday
    }, _temp5), ...Array.from({
      length: daysInMonth
    }, (_, i) => new Date(year, month, i + 1))];
    let t16;
    let t17;
    if ($[27] !== selected) {
      t16 = theme => ({
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        textAlign: "left",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        bgcolor: "background.paper",
        px: "12px",
        py: "8.5px",
        fontFamily: "inherit",
        fontSize: "13px",
        color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
        cursor: "pointer",
        "&:hover": {
          borderColor: alpha(theme.palette.text.primary, 0.24)
        }
      });
      t17 = selected ? selected.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : "Select date";
      $[27] = selected;
      $[28] = t16;
      $[29] = t17;
    } else {
      t16 = $[28];
      t17 = $[29];
    }
    let t18;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
      t18 = /*#__PURE__*/_jsx(CalendarTodayRoundedIcon, {
        sx: {
          fontSize: 14,
          color: "text.secondary"
        }
      });
      $[30] = t18;
    } else {
      t18 = $[30];
    }
    if ($[31] !== ariaLabel || $[32] !== open || $[33] !== t16 || $[34] !== t17) {
      t15 = /*#__PURE__*/_jsxs(Box, {
        component: "button",
        type: "button",
        onClick: open,
        "aria-label": ariaLabel,
        sx: t16,
        children: [t17, t18]
      });
      $[31] = ariaLabel;
      $[32] = open;
      $[33] = t16;
      $[34] = t17;
      $[35] = t15;
    } else {
      t15 = $[35];
    }
    T2 = Menu;
    t9 = anchor;
    t10 = Boolean(anchor);
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
      t11 = () => setAnchor(null);
      t12 = {
        vertical: "bottom",
        horizontal: "left"
      };
      t13 = {
        vertical: "top",
        horizontal: "left"
      };
      t14 = {
        paper: {
          sx: {
            borderRadius: "12px",
            mt: 0.5
          }
        }
      };
      $[36] = t11;
      $[37] = t12;
      $[38] = t13;
      $[39] = t14;
    } else {
      t11 = $[36];
      t12 = $[37];
      t13 = $[38];
      t14 = $[39];
    }
    T1 = Box;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
      t6 = {
        p: 1.5,
        width: 260
      };
      $[40] = t6;
    } else {
      t6 = $[40];
    }
    let t19;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
      t19 = {
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1
      };
      $[41] = t19;
    } else {
      t19 = $[41];
    }
    let t20;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
      t20 = /*#__PURE__*/_jsx(ChevronLeftRoundedIcon, {
        sx: {
          fontSize: 18
        }
      });
      $[42] = t20;
    } else {
      t20 = $[42];
    }
    let t21;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
      t21 = {
        fontSize: "13px",
        fontWeight: 600,
        color: "text.primary"
      };
      $[43] = t21;
    } else {
      t21 = $[43];
    }
    let t22;
    if ($[44] !== viewDate) {
      t22 = viewDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
      $[44] = viewDate;
      $[45] = t22;
    } else {
      t22 = $[45];
    }
    let t23;
    if ($[46] !== t22) {
      t23 = /*#__PURE__*/_jsx(Typography, {
        sx: t21,
        children: t22
      });
      $[46] = t22;
      $[47] = t23;
    } else {
      t23 = $[47];
    }
    let t24;
    if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
      t24 = /*#__PURE__*/_jsx(ChevronRightRoundedIcon, {
        sx: {
          fontSize: 18
        }
      });
      $[48] = t24;
    } else {
      t24 = $[48];
    }
    t7 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      sx: t19,
      children: [/*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: () => setViewDate(new Date(year, month - 1, 1)),
        "aria-label": "Previous month",
        children: t20
      }), t23, /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: () => setViewDate(new Date(year, month + 1, 1)),
        "aria-label": "Next month",
        children: t24
      })]
    });
    if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
      t8 = /*#__PURE__*/_jsx(Box, {
        sx: {
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
          mb: 0.5
        },
        children: ["S", "M", "T", "W", "T", "F", "S"].map(_temp6)
      });
      $[49] = t8;
    } else {
      t8 = $[49];
    }
    T0 = Box;
    if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
      t4 = {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "2px"
      };
      $[50] = t4;
    } else {
      t4 = $[50];
    }
    t5 = cells.map((date, i_1) => {
      if (!date) {
        return /*#__PURE__*/_jsx(Box, {}, i_1);
      }
      const isSelected = selected !== null && date.toDateString() === selected.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      return /*#__PURE__*/_jsx(Box, {
        component: "button",
        type: "button",
        onClick: () => {
          onChange(toIsoDate(date));
          setAnchor(null);
        },
        sx: theme_0 => ({
          border: isToday && !isSelected ? "1px solid" : "none",
          borderColor: "divider",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "12px",
          fontWeight: isSelected ? 600 : 500,
          height: 30,
          bgcolor: isSelected ? theme_0.palette.primary.main : "transparent",
          color: isSelected ? theme_0.palette.primary.contrastText : theme_0.palette.text.primary,
          "&:hover": {
            bgcolor: isSelected ? theme_0.palette.primary.main : alpha(theme_0.palette.text.primary, 0.06)
          }
        }),
        children: date.getDate()
      }, i_1);
    });
    $[6] = anchor;
    $[7] = ariaLabel;
    $[8] = onChange;
    $[9] = open;
    $[10] = selected;
    $[11] = viewDate;
    $[12] = T0;
    $[13] = T1;
    $[14] = T2;
    $[15] = t10;
    $[16] = t11;
    $[17] = t12;
    $[18] = t13;
    $[19] = t14;
    $[20] = t15;
    $[21] = t4;
    $[22] = t5;
    $[23] = t6;
    $[24] = t7;
    $[25] = t8;
    $[26] = t9;
  } else {
    T0 = $[12];
    T1 = $[13];
    T2 = $[14];
    t10 = $[15];
    t11 = $[16];
    t12 = $[17];
    t13 = $[18];
    t14 = $[19];
    t15 = $[20];
    t4 = $[21];
    t5 = $[22];
    t6 = $[23];
    t7 = $[24];
    t8 = $[25];
    t9 = $[26];
  }
  let t16;
  if ($[51] !== T0 || $[52] !== t4 || $[53] !== t5) {
    t16 = /*#__PURE__*/_jsx(T0, {
      sx: t4,
      children: t5
    });
    $[51] = T0;
    $[52] = t4;
    $[53] = t5;
    $[54] = t16;
  } else {
    t16 = $[54];
  }
  let t17;
  if ($[55] !== onChange || $[56] !== selected) {
    t17 = selected && /*#__PURE__*/_jsx(Stack, {
      direction: "row",
      sx: {
        justifyContent: "flex-end",
        mt: 1
      },
      children: /*#__PURE__*/_jsx(Box, {
        component: "button",
        type: "button",
        onClick: () => {
          onChange(undefined);
          setAnchor(null);
        },
        sx: {
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "12px",
          fontWeight: 600,
          color: "error.main",
          p: 0
        },
        children: "Clear"
      })
    });
    $[55] = onChange;
    $[56] = selected;
    $[57] = t17;
  } else {
    t17 = $[57];
  }
  let t18;
  if ($[58] !== T1 || $[59] !== t16 || $[60] !== t17 || $[61] !== t6 || $[62] !== t7 || $[63] !== t8) {
    t18 = /*#__PURE__*/_jsxs(T1, {
      sx: t6,
      children: [t7, t8, t16, t17]
    });
    $[58] = T1;
    $[59] = t16;
    $[60] = t17;
    $[61] = t6;
    $[62] = t7;
    $[63] = t8;
    $[64] = t18;
  } else {
    t18 = $[64];
  }
  let t19;
  if ($[65] !== T2 || $[66] !== t10 || $[67] !== t11 || $[68] !== t12 || $[69] !== t13 || $[70] !== t14 || $[71] !== t18 || $[72] !== t9) {
    t19 = /*#__PURE__*/_jsx(T2, {
      anchorEl: t9,
      open: t10,
      onClose: t11,
      anchorOrigin: t12,
      transformOrigin: t13,
      slotProps: t14,
      children: t18
    });
    $[65] = T2;
    $[66] = t10;
    $[67] = t11;
    $[68] = t12;
    $[69] = t13;
    $[70] = t14;
    $[71] = t18;
    $[72] = t9;
    $[73] = t19;
  } else {
    t19 = $[73];
  }
  let t20;
  if ($[74] !== t15 || $[75] !== t19) {
    t20 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t15, t19]
    });
    $[74] = t15;
    $[75] = t19;
    $[76] = t20;
  } else {
    t20 = $[76];
  }
  return t20;
}
function _temp6(d, i_0) {
  return /*#__PURE__*/_jsx(Typography, {
    sx: {
      fontSize: "10px",
      fontWeight: 600,
      color: "text.secondary",
      textAlign: "center"
    },
    children: d
  }, i_0);
}
function _temp5() {
  return null;
}
function DateFilterField(t0) {
  const $ = _c(29);
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
    let t2;
    if ($[2] !== onChange) {
      t2 = next => onChange({
        from: next
      });
      $[2] = onChange;
      $[3] = t2;
    } else {
      t2 = $[3];
    }
    let t3;
    if ($[4] !== column.label || $[5] !== t2 || $[6] !== value.from) {
      t3 = /*#__PURE__*/_jsx(SingleDatePicker, {
        ariaLabel: column.label,
        value: value.from,
        onChange: t2
      });
      $[4] = column.label;
      $[5] = t2;
      $[6] = value.from;
      $[7] = t3;
    } else {
      t3 = $[7];
    }
    return t3;
  }
  let t2;
  if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      flex: 1
    };
    $[8] = t2;
  } else {
    t2 = $[8];
  }
  let t3;
  if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = /*#__PURE__*/_jsx(Typography, {
      sx: {
        fontSize: "11px",
        fontWeight: 600,
        color: "text.secondary",
        mb: 0.5
      },
      children: "From"
    });
    $[9] = t3;
  } else {
    t3 = $[9];
  }
  const t4 = `${column.label} from`;
  let t5;
  if ($[10] !== onChange || $[11] !== value) {
    t5 = next_0 => onChange({
      ...value,
      from: next_0
    });
    $[10] = onChange;
    $[11] = value;
    $[12] = t5;
  } else {
    t5 = $[12];
  }
  let t6;
  if ($[13] !== t4 || $[14] !== t5 || $[15] !== value.from) {
    t6 = /*#__PURE__*/_jsxs(Box, {
      sx: t2,
      children: [t3, /*#__PURE__*/_jsx(SingleDatePicker, {
        ariaLabel: t4,
        value: value.from,
        onChange: t5
      })]
    });
    $[13] = t4;
    $[14] = t5;
    $[15] = value.from;
    $[16] = t6;
  } else {
    t6 = $[16];
  }
  let t7;
  if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {
      flex: 1
    };
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  let t8;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = /*#__PURE__*/_jsx(Typography, {
      sx: {
        fontSize: "11px",
        fontWeight: 600,
        color: "text.secondary",
        mb: 0.5
      },
      children: "To"
    });
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  const t9 = `${column.label} to`;
  let t10;
  if ($[19] !== onChange || $[20] !== value) {
    t10 = next_1 => onChange({
      ...value,
      to: next_1
    });
    $[19] = onChange;
    $[20] = value;
    $[21] = t10;
  } else {
    t10 = $[21];
  }
  let t11;
  if ($[22] !== t10 || $[23] !== t9 || $[24] !== value.to) {
    t11 = /*#__PURE__*/_jsxs(Box, {
      sx: t7,
      children: [t8, /*#__PURE__*/_jsx(SingleDatePicker, {
        ariaLabel: t9,
        value: value.to,
        onChange: t10
      })]
    });
    $[22] = t10;
    $[23] = t9;
    $[24] = value.to;
    $[25] = t11;
  } else {
    t11 = $[25];
  }
  let t12;
  if ($[26] !== t11 || $[27] !== t6) {
    t12 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      children: [t6, t11]
    });
    $[26] = t11;
    $[27] = t6;
    $[28] = t12;
  } else {
    t12 = $[28];
  }
  return t12;
}

/**
 * Strategy dispatcher: picks the field renderer by `column.type` and hands it
 * the raw slice of `FilterValues` — each renderer narrows its own value and
 * owns its own markup and state (e.g. the async search box). Add a new filter
 * type by adding a variant to `FilterColumnDef` and a case here; nothing else
 * in the popover or the manage-views dialog needs to change.
 */
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
function HeaderIconButton(t0) {
  const $ = _c(4);
  const {
    onClick,
    label,
    children
  } = t0;
  let t1;
  if ($[0] !== children || $[1] !== label || $[2] !== onClick) {
    t1 = /*#__PURE__*/_jsx(IconButton, {
      onClick: onClick,
      "aria-label": label,
      sx: _temp7,
      children: children
    });
    $[0] = children;
    $[1] = label;
    $[2] = onClick;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  return t1;
}
function _temp7(theme) {
  return {
    width: 26,
    height: 26,
    bgcolor: alpha(theme.palette.text.primary, 0.04),
    color: theme.palette.text.primary,
    "&:hover": {
      bgcolor: alpha(theme.palette.text.primary, 0.08)
    }
  };
}
export function DataTableFilterMenu(t0) {
  const $ = _c(56);
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
  let t6;
  let t7;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = {
      vertical: "bottom",
      horizontal: "right"
    };
    t6 = {
      vertical: "top",
      horizontal: "right"
    };
    t7 = {
      paper: {
        sx: {
          width: 400,
          maxWidth: "calc(100vw - 32px)",
          mt: 1
        }
      }
    };
    $[10] = t5;
    $[11] = t6;
    $[12] = t7;
  } else {
    t5 = $[10];
    t6 = $[11];
    t7 = $[12];
  }
  let t8;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      px: 2,
      pt: 1.25,
      pb: 2
    };
    $[13] = t8;
  } else {
    t8 = $[13];
  }
  let t9;
  if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = {
      alignItems: "center",
      justifyContent: "space-between",
      mb: 1.25
    };
    $[14] = t9;
  } else {
    t9 = $[14];
  }
  let t10;
  if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = {
      alignItems: "center"
    };
    $[15] = t10;
  } else {
    t10 = $[15];
  }
  let t11;
  if ($[16] !== mode) {
    t11 = mode === "save" && /*#__PURE__*/_jsx(IconButton, {
      onClick: () => setMode("filter"),
      "aria-label": "Back",
      sx: {
        width: 26,
        height: 26,
        ml: -0.5,
        color: "text.primary"
      },
      children: /*#__PURE__*/_jsx(ArrowBackRoundedIcon, {
        sx: {
          fontSize: 16
        }
      })
    });
    $[16] = mode;
    $[17] = t11;
  } else {
    t11 = $[17];
  }
  let t12;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = {
      fontSize: "16px",
      fontWeight: 600,
      color: "text.primary"
    };
    $[18] = t12;
  } else {
    t12 = $[18];
  }
  const t13 = mode === "save" ? "Save as view" : "Filter";
  let t14;
  if ($[19] !== t13) {
    t14 = /*#__PURE__*/_jsx(Typography, {
      sx: t12,
      children: t13
    });
    $[19] = t13;
    $[20] = t14;
  } else {
    t14 = $[20];
  }
  let t15;
  if ($[21] !== t11 || $[22] !== t14) {
    t15 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t10,
      children: [t11, t14]
    });
    $[21] = t11;
    $[22] = t14;
    $[23] = t15;
  } else {
    t15 = $[23];
  }
  let t16;
  if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = /*#__PURE__*/_jsx(CloseRoundedIcon, {
      sx: {
        fontSize: 15
      }
    });
    $[24] = t16;
  } else {
    t16 = $[24];
  }
  let t17;
  if ($[25] !== close) {
    t17 = /*#__PURE__*/_jsx(HeaderIconButton, {
      onClick: close,
      label: "Close filters",
      children: t16
    });
    $[25] = close;
    $[26] = t17;
  } else {
    t17 = $[26];
  }
  let t18;
  if ($[27] !== t15 || $[28] !== t17) {
    t18 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      sx: t9,
      children: [t15, t17]
    });
    $[27] = t15;
    $[28] = t17;
    $[29] = t18;
  } else {
    t18 = $[29];
  }
  let t19;
  if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = /*#__PURE__*/_jsx(Divider, {});
    $[30] = t19;
  } else {
    t19 = $[30];
  }
  let t20;
  if ($[31] !== close || $[32] !== draft || $[33] !== draftEmpty || $[34] !== filterColumns || $[35] !== filterRenderers || $[36] !== mode || $[37] !== onApply || $[38] !== onDraftChange || $[39] !== presets) {
    t20 = mode === "filter" && /*#__PURE__*/_jsxs(_Fragment, {
      children: [filterColumns.map(column => /*#__PURE__*/_jsxs(Box, {
        children: [/*#__PURE__*/_jsx(Typography, {
          sx: {
            fontSize: "13.5px",
            fontWeight: 600,
            color: "text.primary",
            mt: 1.75,
            mb: 1
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
          mt: 2
        }
      }), /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        sx: {
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1.75
        },
        children: [/*#__PURE__*/_jsx(Box, {
          component: "button",
          type: "button",
          onClick: () => {
            onApply({});
            close();
          },
          sx: {
            background: "none",
            border: "none",
            cursor: "pointer",
            p: 0,
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: 600,
            color: "error.main",
            textDecoration: "underline",
            "&:hover": {
              color: "error.dark"
            }
          },
          children: "Clear all"
        }), /*#__PURE__*/_jsxs(Stack, {
          direction: "row",
          spacing: 1,
          children: [presets && /*#__PURE__*/_jsx(Button, {
            variant: "outlined",
            color: "inherit",
            disabled: draftEmpty,
            onClick: () => setMode("save"),
            sx: {
              height: 36,
              minHeight: 36,
              px: "16px",
              fontSize: "13px"
            },
            children: "Save"
          }), /*#__PURE__*/_jsx(Button, {
            variant: "contained",
            onClick: () => {
              onApply(draft);
              close();
            },
            sx: {
              height: 36,
              minHeight: 36,
              px: "20px",
              fontSize: "13px"
            },
            children: "Apply"
          })]
        })]
      })]
    });
    $[31] = close;
    $[32] = draft;
    $[33] = draftEmpty;
    $[34] = filterColumns;
    $[35] = filterRenderers;
    $[36] = mode;
    $[37] = onApply;
    $[38] = onDraftChange;
    $[39] = presets;
    $[40] = t20;
  } else {
    t20 = $[40];
  }
  let t21;
  if ($[41] !== draft || $[42] !== filterColumns || $[43] !== mode || $[44] !== name || $[45] !== saveFilter) {
    t21 = mode === "save" && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(TextField, {
        autoFocus: true,
        fullWidth: true,
        placeholder: "View name",
        value: name,
        onChange: e => setName(e.target.value),
        onKeyDown: e_0 => {
          if (e_0.key === "Enter") {
            e_0.preventDefault();
            saveFilter();
          }
        },
        sx: {
          mt: 2
        }
      }), /*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "12px",
          color: "text.secondary",
          mt: 1
        },
        children: summarizeFilterValues(draft, filterColumns)
      }), /*#__PURE__*/_jsx(Stack, {
        direction: "row",
        sx: {
          justifyContent: "flex-end",
          mt: 2
        },
        children: /*#__PURE__*/_jsx(Button, {
          variant: "contained",
          disabled: !name.trim(),
          onClick: saveFilter,
          sx: {
            height: 36,
            minHeight: 36,
            px: "20px",
            fontSize: "13px"
          },
          children: "Save & apply"
        })
      })]
    });
    $[41] = draft;
    $[42] = filterColumns;
    $[43] = mode;
    $[44] = name;
    $[45] = saveFilter;
    $[46] = t21;
  } else {
    t21 = $[46];
  }
  let t22;
  if ($[47] !== t18 || $[48] !== t20 || $[49] !== t21) {
    t22 = /*#__PURE__*/_jsxs(Box, {
      sx: t8,
      children: [t18, t19, t20, t21]
    });
    $[47] = t18;
    $[48] = t20;
    $[49] = t21;
    $[50] = t22;
  } else {
    t22 = $[50];
  }
  let t23;
  if ($[51] !== anchorEl || $[52] !== close || $[53] !== t22 || $[54] !== t4) {
    t23 = /*#__PURE__*/_jsx(Menu, {
      anchorEl: anchorEl,
      open: t4,
      onClose: close,
      anchorOrigin: t5,
      transformOrigin: t6,
      slotProps: t7,
      children: t22
    });
    $[51] = anchorEl;
    $[52] = close;
    $[53] = t22;
    $[54] = t4;
    $[55] = t23;
  } else {
    t23 = $[55];
  }
  return t23;
}
export function ManageViewsDialog(t0) {
  const $ = _c(68);
  const {
    open,
    onClose,
    presets,
    filterColumns,
    DialogProps
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
  let close;
  let commitEdit;
  let editing;
  let startEdit;
  let t2;
  let t3;
  if ($[1] !== editFilters || $[2] !== editName || $[3] !== editingId || $[4] !== onClose || $[5] !== presets) {
    editing = editingId ? presets.all.find(p => p.id === editingId) : null;
    let t4;
    if ($[12] !== onClose) {
      t4 = () => {
        setEditingId(null);
        onClose();
      };
      $[12] = onClose;
      $[13] = t4;
    } else {
      t4 = $[13];
    }
    close = t4;
    let t5;
    if ($[14] !== presets) {
      t5 = id => {
        const preset = presets.all.find(p_0 => p_0.id === id);
        if (!preset) {
          return;
        }
        setEditName(preset.name);
        setEditFilters(preset.filters);
        setEditingId(id);
      };
      $[14] = presets;
      $[15] = t5;
    } else {
      t5 = $[15];
    }
    startEdit = t5;
    let t6;
    if ($[16] !== editFilters || $[17] !== editName || $[18] !== editingId || $[19] !== presets) {
      t6 = () => {
        const trimmed = editName.trim();
        if (!editingId || !trimmed) {
          return;
        }
        presets.update(editingId, trimmed, editFilters);
        setEditingId(null);
      };
      $[16] = editFilters;
      $[17] = editName;
      $[18] = editingId;
      $[19] = presets;
      $[20] = t6;
    } else {
      t6 = $[20];
    }
    commitEdit = t6;
    t2 = Boolean;
    t3 = editing && (editName.trim() !== editing.name || !filterValuesEqual(editFilters, editing.filters));
    $[1] = editFilters;
    $[2] = editName;
    $[3] = editingId;
    $[4] = onClose;
    $[5] = presets;
    $[6] = close;
    $[7] = commitEdit;
    $[8] = editing;
    $[9] = startEdit;
    $[10] = t2;
    $[11] = t3;
  } else {
    close = $[6];
    commitEdit = $[7];
    editing = $[8];
    startEdit = $[9];
    t2 = $[10];
    t3 = $[11];
  }
  const isEditDirty = t2(t3);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  let t4;
  if ($[21] !== isEditDirty) {
    t4 = () => {
      if (isEditDirty) {
        setConfirmDiscardOpen(true);
        return;
      }
      setEditingId(null);
    };
    $[21] = isEditDirty;
    $[22] = t4;
  } else {
    t4 = $[22];
  }
  const discardEdit = t4;
  let t5;
  if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = {
      px: 3,
      pt: 2,
      pb: 2.5
    };
    $[23] = t5;
  } else {
    t5 = $[23];
  }
  let t6;
  if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      alignItems: "center",
      justifyContent: "space-between",
      mb: 1.5
    };
    $[24] = t6;
  } else {
    t6 = $[24];
  }
  let t7;
  if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {
      fontSize: "18px",
      fontWeight: 600,
      color: "text.primary"
    };
    $[25] = t7;
  } else {
    t7 = $[25];
  }
  const t8 = editing ? "Edit view" : "Views";
  let t9;
  if ($[26] !== t8) {
    t9 = /*#__PURE__*/_jsx(Typography, {
      sx: t7,
      children: t8
    });
    $[26] = t8;
    $[27] = t9;
  } else {
    t9 = $[27];
  }
  let t10;
  if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = /*#__PURE__*/_jsx(CloseRoundedIcon, {
      sx: {
        fontSize: 16
      }
    });
    $[28] = t10;
  } else {
    t10 = $[28];
  }
  let t11;
  if ($[29] !== close) {
    t11 = /*#__PURE__*/_jsx(IconButton, {
      onClick: close,
      "aria-label": "Close views",
      sx: _temp8,
      children: t10
    });
    $[29] = close;
    $[30] = t11;
  } else {
    t11 = $[30];
  }
  let t12;
  if ($[31] !== t11 || $[32] !== t9) {
    t12 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      sx: t6,
      children: [t9, t11]
    });
    $[31] = t11;
    $[32] = t9;
    $[33] = t12;
  } else {
    t12 = $[33];
  }
  let t13;
  if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = /*#__PURE__*/_jsx(Divider, {});
    $[34] = t13;
  } else {
    t13 = $[34];
  }
  let t14;
  if ($[35] !== close || $[36] !== commitEdit || $[37] !== discardEdit || $[38] !== editFilters || $[39] !== editName || $[40] !== editing || $[41] !== filterColumns || $[42] !== presets || $[43] !== startEdit) {
    t14 = editing ? /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "13.5px",
          fontWeight: 600,
          color: "text.primary",
          mt: 2,
          mb: 1
        },
        children: "Name"
      }), /*#__PURE__*/_jsx(TextField, {
        autoFocus: true,
        fullWidth: true,
        placeholder: "View name",
        value: editName,
        onChange: e => setEditName(e.target.value),
        onKeyDown: e_0 => {
          if (e_0.key === "Enter") {
            e_0.preventDefault();
            commitEdit();
          }
        }
      }), filterColumns.map(column => /*#__PURE__*/_jsxs(Box, {
        children: [/*#__PURE__*/_jsx(Typography, {
          sx: {
            fontSize: "13.5px",
            fontWeight: 600,
            color: "text.primary",
            mt: 2,
            mb: 1
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
      }, column.field)), /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: 1,
        sx: {
          justifyContent: "flex-end",
          mt: 3
        },
        children: [/*#__PURE__*/_jsx(Button, {
          variant: "outlined",
          color: "inherit",
          onClick: discardEdit,
          sx: {
            height: 36,
            minHeight: 36,
            px: "16px",
            fontSize: "13px"
          },
          children: "Discard"
        }), /*#__PURE__*/_jsx(Button, {
          variant: "contained",
          disabled: !editName.trim(),
          onClick: commitEdit,
          sx: {
            height: 36,
            minHeight: 36,
            px: "20px",
            fontSize: "13px"
          },
          children: "Save"
        })]
      })]
    }) : /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(Stack, {
        spacing: 0.25,
        sx: {
          mt: 1.5,
          maxHeight: 380,
          overflowY: "auto"
        },
        children: /*#__PURE__*/_jsx(SortableList, {
          ids: presets.all.map(_temp9),
          onMove: presets.reorder,
          children: presets.all.map(p_2 => /*#__PURE__*/_jsxs(SortableRow, {
            id: p_2.id,
            onClick: () => startEdit(p_2.id),
            children: [/*#__PURE__*/_jsxs(Box, {
              sx: {
                flex: 1,
                minWidth: 0
              },
              children: [/*#__PURE__*/_jsx(Typography, {
                noWrap: true,
                sx: {
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "text.primary"
                },
                children: p_2.name
              }), /*#__PURE__*/_jsx(Typography, {
                noWrap: true,
                sx: {
                  fontSize: "12.5px",
                  color: "text.secondary"
                },
                children: summarizeFilterValues(p_2.filters, filterColumns)
              })]
            }), /*#__PURE__*/_jsx(Stack, {
              direction: "row",
              spacing: 0.25,
              onClick: _temp0,
              children: /*#__PURE__*/_jsx(Tooltip, {
                title: "Delete",
                children: /*#__PURE__*/_jsx(IconButton, {
                  size: "small",
                  "aria-label": `Delete ${p_2.name}`,
                  onClick: () => setPendingDelete(p_2),
                  sx: {
                    color: "error.main"
                  },
                  children: /*#__PURE__*/_jsx(TrashIcon, {
                    sx: {
                      fontSize: 15
                    }
                  })
                })
              })
            })]
          }, p_2.id))
        })
      }), /*#__PURE__*/_jsx(Stack, {
        direction: "row",
        sx: {
          justifyContent: "flex-end",
          mt: 2
        },
        children: /*#__PURE__*/_jsx(Button, {
          variant: "contained",
          onClick: close,
          sx: {
            height: 36,
            minHeight: 36,
            px: "24px",
            fontSize: "13px"
          },
          children: "Done"
        })
      })]
    });
    $[35] = close;
    $[36] = commitEdit;
    $[37] = discardEdit;
    $[38] = editFilters;
    $[39] = editName;
    $[40] = editing;
    $[41] = filterColumns;
    $[42] = presets;
    $[43] = startEdit;
    $[44] = t14;
  } else {
    t14 = $[44];
  }
  let t15;
  if ($[45] !== t12 || $[46] !== t14) {
    t15 = /*#__PURE__*/_jsxs(Box, {
      sx: t5,
      children: [t12, t13, t14]
    });
    $[45] = t12;
    $[46] = t14;
    $[47] = t15;
  } else {
    t15 = $[47];
  }
  const t16 = Boolean(pendingDelete);
  const t17 = `"${pendingDelete?.name}" will be removed for good.`;
  let t18;
  if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
    t18 = () => setPendingDelete(null);
    $[48] = t18;
  } else {
    t18 = $[48];
  }
  let t19;
  if ($[49] !== pendingDelete || $[50] !== presets) {
    t19 = () => {
      if (pendingDelete) {
        presets.remove(pendingDelete.id);
      }
      setPendingDelete(null);
    };
    $[49] = pendingDelete;
    $[50] = presets;
    $[51] = t19;
  } else {
    t19 = $[51];
  }
  let t20;
  if ($[52] !== t16 || $[53] !== t17 || $[54] !== t19) {
    t20 = /*#__PURE__*/_jsx(ConfirmDialog, {
      open: t16,
      title: "Delete this view?",
      description: t17,
      confirmLabel: "Delete",
      confirmColor: "error",
      onCancel: t18,
      onConfirm: t19
    });
    $[52] = t16;
    $[53] = t17;
    $[54] = t19;
    $[55] = t20;
  } else {
    t20 = $[55];
  }
  let t21;
  let t22;
  if ($[56] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = () => setConfirmDiscardOpen(false);
    t22 = () => {
      setConfirmDiscardOpen(false);
      setEditingId(null);
    };
    $[56] = t21;
    $[57] = t22;
  } else {
    t21 = $[56];
    t22 = $[57];
  }
  let t23;
  if ($[58] !== confirmDiscardOpen) {
    t23 = /*#__PURE__*/_jsx(ConfirmDialog, {
      open: confirmDiscardOpen,
      title: "Discard your changes?",
      description: "Your edits to this view haven't been saved.",
      confirmLabel: "Discard",
      cancelLabel: "Keep editing",
      confirmColor: "error",
      onCancel: t21,
      onConfirm: t22
    });
    $[58] = confirmDiscardOpen;
    $[59] = t23;
  } else {
    t23 = $[59];
  }
  let t24;
  if ($[60] !== DialogProps || $[61] !== close || $[62] !== open || $[63] !== size || $[64] !== t15 || $[65] !== t20 || $[66] !== t23) {
    t24 = /*#__PURE__*/_jsxs(Dialog, {
      open: open,
      onClose: close,
      ...size,
      ...DialogProps,
      children: [t15, t20, t23]
    });
    $[60] = DialogProps;
    $[61] = close;
    $[62] = open;
    $[63] = size;
    $[64] = t15;
    $[65] = t20;
    $[66] = t23;
    $[67] = t24;
  } else {
    t24 = $[67];
  }
  return t24;
}
function _temp0(e_1) {
  return e_1.stopPropagation();
}
function _temp9(p_1) {
  return p_1.id;
}
function _temp8(theme) {
  return {
    width: 28,
    height: 28,
    bgcolor: alpha(theme.palette.text.primary, 0.04),
    color: theme.palette.text.primary,
    "&:hover": {
      bgcolor: alpha(theme.palette.text.primary, 0.08)
    }
  };
}