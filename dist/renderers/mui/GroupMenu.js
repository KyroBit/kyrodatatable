import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Button, Chip, Divider, IconButton, Popover, Stack, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useDataTableContext } from './context.js';
import { SortableList, SortableRow } from './Sortable.js';
import { GroupIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function DataTableGroupMenu() {
  const $ = _c(96);
  const api = useDataTableContext();
  const [anchor, setAnchor] = useState(null);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = [];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const [draft, setDraft] = useState(t0);
  let T0;
  let T1;
  let changed;
  let t1;
  let t10;
  let t11;
  let t12;
  let t2;
  let t3;
  let t4;
  let t5;
  let t6;
  let t7;
  let t8;
  let t9;
  if ($[1] !== anchor || $[2] !== api.groupBy || $[3] !== api.groupByColumns || $[4] !== draft) {
    const columns = api.groupByColumns ?? [];
    const levels = api.groupBy;
    let t13;
    if ($[20] !== draft) {
      t13 = c => !draft.includes(c.field);
      $[20] = draft;
      $[21] = t13;
    } else {
      t13 = $[21];
    }
    const unused = columns.filter(t13);
    const labelOf = field => columns.find(c_0 => c_0.field === field)?.label ?? field;
    let t14;
    if ($[22] !== draft || $[23] !== levels) {
      t14 = draft.length !== levels.length || draft.some((field_0, i) => field_0 !== levels[i]);
      $[22] = draft;
      $[23] = levels;
      $[24] = t14;
    } else {
      t14 = $[24];
    }
    changed = t14;
    let t15;
    if ($[25] !== labelOf || $[26] !== levels[0] || $[27] !== levels.length) {
      t15 = levels.length === 0 ? "Group" : `Group: ${labelOf(levels[0])}${levels.length > 1 ? ` +${levels.length - 1}` : ""}`;
      $[25] = labelOf;
      $[26] = levels[0];
      $[27] = levels.length;
      $[28] = t15;
    } else {
      t15 = $[28];
    }
    const label = t15;
    let t16;
    let t17;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
      t16 = /*#__PURE__*/_jsx(GroupIcon, {});
      t17 = /*#__PURE__*/_jsx(ExpandMoreRoundedIcon, {});
      $[29] = t16;
      $[30] = t17;
    } else {
      t16 = $[29];
      t17 = $[30];
    }
    const t18 = Boolean(anchor);
    let t19;
    if ($[31] !== levels) {
      t19 = e => {
        setDraft(levels);
        setAnchor(e.currentTarget);
      };
      $[31] = levels;
      $[32] = t19;
    } else {
      t19 = $[32];
    }
    if ($[33] !== label || $[34] !== t18 || $[35] !== t19) {
      t12 = /*#__PURE__*/_jsx(Button, {
        variant: "outlined",
        color: "inherit",
        startIcon: t16,
        endIcon: t17,
        "aria-haspopup": "dialog",
        "aria-expanded": t18,
        onClick: t19,
        children: label
      });
      $[33] = label;
      $[34] = t18;
      $[35] = t19;
      $[36] = t12;
    } else {
      t12 = $[36];
    }
    T1 = Popover;
    t6 = anchor;
    t7 = Boolean(anchor);
    if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
      t8 = () => setAnchor(null);
      t9 = {
        vertical: "bottom",
        horizontal: "left"
      };
      t10 = {
        vertical: "top",
        horizontal: "left"
      };
      $[37] = t10;
      $[38] = t8;
      $[39] = t9;
    } else {
      t10 = $[37];
      t8 = $[38];
      t9 = $[39];
    }
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
      t11 = {
        paper: {
          "aria-label": "Group rows",
          role: "dialog",
          sx: {
            width: 320,
            maxWidth: "calc(100vw - 32px)",
            mt: 1
          }
        }
      };
      $[40] = t11;
    } else {
      t11 = $[40];
    }
    T0 = Box;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
      t1 = {
        px: 2.5,
        pt: 1.5,
        pb: 2
      };
      $[41] = t1;
    } else {
      t1 = $[41];
    }
    let t20;
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
      t20 = {
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1.5
      };
      $[42] = t20;
    } else {
      t20 = $[42];
    }
    let t21;
    if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
      t21 = /*#__PURE__*/_jsx(Typography, {
        variant: "h6",
        sx: {
          fontSize: 16,
          fontWeight: 600
        },
        children: "Group"
      });
      $[43] = t21;
    } else {
      t21 = $[43];
    }
    let t22;
    if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
      t22 = () => setAnchor(null);
      $[44] = t22;
    } else {
      t22 = $[44];
    }
    if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
      t2 = /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        sx: t20,
        children: [t21, /*#__PURE__*/_jsx(IconButton, {
          size: "small",
          onClick: t22,
          "aria-label": "Close grouping",
          children: /*#__PURE__*/_jsx(CloseRoundedIcon, {
            fontSize: "small"
          })
        })]
      });
      t3 = /*#__PURE__*/_jsx(Divider, {});
      $[45] = t2;
      $[46] = t3;
    } else {
      t2 = $[45];
      t3 = $[46];
    }
    let t23;
    if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
      t23 = {
        mt: 1
      };
      $[47] = t23;
    } else {
      t23 = $[47];
    }
    let t24;
    if ($[48] !== draft.length) {
      t24 = draft.length === 0 && /*#__PURE__*/_jsx(Typography, {
        variant: "body2",
        color: "text.secondary",
        sx: {
          px: 1,
          py: 1.5
        },
        children: "Not grouped"
      });
      $[48] = draft.length;
      $[49] = t24;
    } else {
      t24 = $[49];
    }
    let t25;
    if ($[50] !== draft) {
      t25 = (from, to) => setDraft(arrayMove(draft, from, to));
      $[50] = draft;
      $[51] = t25;
    } else {
      t25 = $[51];
    }
    let t26;
    if ($[52] !== draft || $[53] !== labelOf) {
      t26 = draft.map(field_1 => /*#__PURE__*/_jsxs(SortableRow, {
        id: field_1,
        children: [/*#__PURE__*/_jsx(Typography, {
          noWrap: true,
          sx: {
            flex: 1,
            fontSize: 14,
            fontWeight: 500
          },
          children: labelOf(field_1)
        }), /*#__PURE__*/_jsx(IconButton, {
          size: "small",
          onClick: () => setDraft(draft.filter(f => f !== field_1)),
          "aria-label": `Remove ${labelOf(field_1)}`,
          children: /*#__PURE__*/_jsx(CloseRoundedIcon, {
            fontSize: "small"
          })
        })]
      }, field_1));
      $[52] = draft;
      $[53] = labelOf;
      $[54] = t26;
    } else {
      t26 = $[54];
    }
    let t27;
    if ($[55] !== draft || $[56] !== t25 || $[57] !== t26) {
      t27 = /*#__PURE__*/_jsx(SortableList, {
        ids: draft,
        onMove: t25,
        children: t26
      });
      $[55] = draft;
      $[56] = t25;
      $[57] = t26;
      $[58] = t27;
    } else {
      t27 = $[58];
    }
    if ($[59] !== t24 || $[60] !== t27) {
      t4 = /*#__PURE__*/_jsxs(Box, {
        sx: t23,
        children: [t24, t27]
      });
      $[59] = t24;
      $[60] = t27;
      $[61] = t4;
    } else {
      t4 = $[61];
    }
    t5 = unused.length > 0 && /*#__PURE__*/_jsx(Stack, {
      direction: "row",
      role: "group",
      "aria-label": "Add a level",
      sx: {
        flexWrap: "wrap",
        gap: 0.75,
        mt: 1
      },
      children: unused.map(c_1 => /*#__PURE__*/_jsx(Chip, {
        label: c_1.label,
        onClick: () => setDraft([...draft, c_1.field]),
        sx: {
          borderRadius: 1,
          fontWeight: 500,
          bgcolor: "action.hover",
          "&:hover": {
            bgcolor: "action.selected"
          }
        }
      }, c_1.field))
    });
    $[1] = anchor;
    $[2] = api.groupBy;
    $[3] = api.groupByColumns;
    $[4] = draft;
    $[5] = T0;
    $[6] = T1;
    $[7] = changed;
    $[8] = t1;
    $[9] = t10;
    $[10] = t11;
    $[11] = t12;
    $[12] = t2;
    $[13] = t3;
    $[14] = t4;
    $[15] = t5;
    $[16] = t6;
    $[17] = t7;
    $[18] = t8;
    $[19] = t9;
  } else {
    T0 = $[5];
    T1 = $[6];
    changed = $[7];
    t1 = $[8];
    t10 = $[9];
    t11 = $[10];
    t12 = $[11];
    t2 = $[12];
    t3 = $[13];
    t4 = $[14];
    t5 = $[15];
    t6 = $[16];
    t7 = $[17];
    t8 = $[18];
    t9 = $[19];
  }
  let t13;
  if ($[62] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = /*#__PURE__*/_jsx(Divider, {
      sx: {
        mt: 2
      }
    });
    $[62] = t13;
  } else {
    t13 = $[62];
  }
  let t14;
  if ($[63] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = {
      alignItems: "center",
      justifyContent: "space-between",
      mt: 2
    };
    $[63] = t14;
  } else {
    t14 = $[63];
  }
  const t15 = draft.length === 0;
  let t16;
  if ($[64] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = () => setDraft([]);
    $[64] = t16;
  } else {
    t16 = $[64];
  }
  let t17;
  if ($[65] !== t15) {
    t17 = /*#__PURE__*/_jsx(Button, {
      color: "inherit",
      disabled: t15,
      onClick: t16,
      children: "Clear"
    });
    $[65] = t15;
    $[66] = t17;
  } else {
    t17 = $[66];
  }
  const t18 = !changed;
  let t19;
  if ($[67] !== api || $[68] !== draft) {
    t19 = () => {
      api.setGroupBy(draft);
      setAnchor(null);
    };
    $[67] = api;
    $[68] = draft;
    $[69] = t19;
  } else {
    t19 = $[69];
  }
  let t20;
  if ($[70] !== t18 || $[71] !== t19) {
    t20 = /*#__PURE__*/_jsx(Button, {
      variant: "contained",
      disabled: t18,
      onClick: t19,
      children: "Apply"
    });
    $[70] = t18;
    $[71] = t19;
    $[72] = t20;
  } else {
    t20 = $[72];
  }
  let t21;
  if ($[73] !== t17 || $[74] !== t20) {
    t21 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      sx: t14,
      children: [t17, t20]
    });
    $[73] = t17;
    $[74] = t20;
    $[75] = t21;
  } else {
    t21 = $[75];
  }
  let t22;
  if ($[76] !== T0 || $[77] !== t1 || $[78] !== t2 || $[79] !== t21 || $[80] !== t3 || $[81] !== t4 || $[82] !== t5) {
    t22 = /*#__PURE__*/_jsxs(T0, {
      sx: t1,
      children: [t2, t3, t4, t5, t13, t21]
    });
    $[76] = T0;
    $[77] = t1;
    $[78] = t2;
    $[79] = t21;
    $[80] = t3;
    $[81] = t4;
    $[82] = t5;
    $[83] = t22;
  } else {
    t22 = $[83];
  }
  let t23;
  if ($[84] !== T1 || $[85] !== t10 || $[86] !== t11 || $[87] !== t22 || $[88] !== t6 || $[89] !== t7 || $[90] !== t8 || $[91] !== t9) {
    t23 = /*#__PURE__*/_jsx(T1, {
      anchorEl: t6,
      open: t7,
      onClose: t8,
      anchorOrigin: t9,
      transformOrigin: t10,
      slotProps: t11,
      children: t22
    });
    $[84] = T1;
    $[85] = t10;
    $[86] = t11;
    $[87] = t22;
    $[88] = t6;
    $[89] = t7;
    $[90] = t8;
    $[91] = t9;
    $[92] = t23;
  } else {
    t23 = $[92];
  }
  let t24;
  if ($[93] !== t12 || $[94] !== t23) {
    t24 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t12, t23]
    });
    $[93] = t12;
    $[94] = t23;
    $[95] = t24;
  } else {
    t24 = $[95];
  }
  return t24;
}