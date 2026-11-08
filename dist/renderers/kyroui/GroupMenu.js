import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Button, Chip, Divider, IconButton, Popover, Stack, Typography } from '@kyrobit/kyroui';
import { useDataTableContext } from './context.js';
import { SortableList, SortableRow } from './Sortable.js';
import { CloseIcon, ExpandMoreIcon, GroupIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function DataTableGroupMenu() {
  const $ = _c(93);
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
      t17 = /*#__PURE__*/_jsx(ExpandMoreIcon, {});
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
      $[37] = t8;
    } else {
      t8 = $[37];
    }
    t9 = "bottom-start";
    t10 = "Group rows";
    t11 = _temp;
    T0 = Box;
    if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
      t1 = {
        px: "lg",
        pt: "md",
        pb: "lg"
      };
      $[38] = t1;
    } else {
      t1 = $[38];
    }
    let t20;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
      t20 = {
        mb: "md"
      };
      $[39] = t20;
    } else {
      t20 = $[39];
    }
    let t21;
    if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
      t21 = /*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "h5",
          fontWeight: 600,
          color: "text.primary"
        },
        children: "Group"
      });
      $[40] = t21;
    } else {
      t21 = $[40];
    }
    let t22;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
      t22 = () => setAnchor(null);
      $[41] = t22;
    } else {
      t22 = $[41];
    }
    if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
      t2 = /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        sx: t20,
        children: [t21, /*#__PURE__*/_jsx(IconButton, {
          variant: "tonal",
          size: "small",
          onClick: t22,
          "aria-label": "Close grouping",
          children: /*#__PURE__*/_jsx(CloseIcon, {
            fontSize: "small"
          })
        })]
      });
      t3 = /*#__PURE__*/_jsx(Divider, {});
      $[42] = t2;
      $[43] = t3;
    } else {
      t2 = $[42];
      t3 = $[43];
    }
    let t23;
    if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
      t23 = {
        mt: "sm"
      };
      $[44] = t23;
    } else {
      t23 = $[44];
    }
    let t24;
    if ($[45] !== draft.length) {
      t24 = draft.length === 0 && /*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "md",
          color: "text.secondary",
          px: "sm",
          py: "md"
        },
        children: "Not grouped"
      });
      $[45] = draft.length;
      $[46] = t24;
    } else {
      t24 = $[46];
    }
    let t25;
    if ($[47] !== draft) {
      t25 = (from, to) => setDraft(arrayMove(draft, from, to));
      $[47] = draft;
      $[48] = t25;
    } else {
      t25 = $[48];
    }
    let t26;
    if ($[49] !== draft || $[50] !== labelOf) {
      t26 = draft.map(field_1 => /*#__PURE__*/_jsxs(SortableRow, {
        id: field_1,
        children: [/*#__PURE__*/_jsx(Typography, {
          noWrap: true,
          sx: {
            flex: 1,
            fontSize: "lg",
            fontWeight: 500,
            color: "text.primary"
          },
          children: labelOf(field_1)
        }), /*#__PURE__*/_jsx(IconButton, {
          size: "small",
          onClick: () => setDraft(draft.filter(f => f !== field_1)),
          "aria-label": `Remove ${labelOf(field_1)}`,
          children: /*#__PURE__*/_jsx(CloseIcon, {
            fontSize: "small"
          })
        })]
      }, field_1));
      $[49] = draft;
      $[50] = labelOf;
      $[51] = t26;
    } else {
      t26 = $[51];
    }
    let t27;
    if ($[52] !== draft || $[53] !== t25 || $[54] !== t26) {
      t27 = /*#__PURE__*/_jsx(SortableList, {
        ids: draft,
        onMove: t25,
        children: t26
      });
      $[52] = draft;
      $[53] = t25;
      $[54] = t26;
      $[55] = t27;
    } else {
      t27 = $[55];
    }
    if ($[56] !== t24 || $[57] !== t27) {
      t4 = /*#__PURE__*/_jsxs(Box, {
        sx: t23,
        children: [t24, t27]
      });
      $[56] = t24;
      $[57] = t27;
      $[58] = t4;
    } else {
      t4 = $[58];
    }
    t5 = unused.length > 0 && /*#__PURE__*/_jsx(Stack, {
      direction: "row",
      role: "group",
      "aria-label": "Add a level",
      sx: {
        flexWrap: "wrap",
        gap: "xs",
        mt: "sm"
      },
      children: unused.map(c_1 => /*#__PURE__*/_jsx(Chip, {
        label: c_1.label,
        onClick: () => setDraft([...draft, c_1.field]),
        sx: {
          borderRadius: "sm",
          fontSize: "md",
          "&": {
            bgcolor: "action.hover"
          },
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
  if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = /*#__PURE__*/_jsx(Divider, {
      sx: {
        mt: "md"
      }
    });
    $[59] = t13;
  } else {
    t13 = $[59];
  }
  let t14;
  if ($[60] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = {
      mt: "md"
    };
    $[60] = t14;
  } else {
    t14 = $[60];
  }
  const t15 = draft.length === 0;
  let t16;
  if ($[61] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = () => setDraft([]);
    $[61] = t16;
  } else {
    t16 = $[61];
  }
  let t17;
  if ($[62] !== t15) {
    t17 = /*#__PURE__*/_jsx(Button, {
      variant: "text",
      disabled: t15,
      onClick: t16,
      children: "Clear"
    });
    $[62] = t15;
    $[63] = t17;
  } else {
    t17 = $[63];
  }
  const t18 = !changed;
  let t19;
  if ($[64] !== api || $[65] !== draft) {
    t19 = () => {
      api.setGroupBy(draft);
      setAnchor(null);
    };
    $[64] = api;
    $[65] = draft;
    $[66] = t19;
  } else {
    t19 = $[66];
  }
  let t20;
  if ($[67] !== t18 || $[68] !== t19) {
    t20 = /*#__PURE__*/_jsx(Button, {
      variant: "contained",
      disabled: t18,
      onClick: t19,
      children: "Apply"
    });
    $[67] = t18;
    $[68] = t19;
    $[69] = t20;
  } else {
    t20 = $[69];
  }
  let t21;
  if ($[70] !== t17 || $[71] !== t20) {
    t21 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      alignItems: "center",
      justifyContent: "space-between",
      sx: t14,
      children: [t17, t20]
    });
    $[70] = t17;
    $[71] = t20;
    $[72] = t21;
  } else {
    t21 = $[72];
  }
  let t22;
  if ($[73] !== T0 || $[74] !== t1 || $[75] !== t2 || $[76] !== t21 || $[77] !== t3 || $[78] !== t4 || $[79] !== t5) {
    t22 = /*#__PURE__*/_jsxs(T0, {
      sx: t1,
      children: [t2, t3, t4, t5, t13, t21]
    });
    $[73] = T0;
    $[74] = t1;
    $[75] = t2;
    $[76] = t21;
    $[77] = t3;
    $[78] = t4;
    $[79] = t5;
    $[80] = t22;
  } else {
    t22 = $[80];
  }
  let t23;
  if ($[81] !== T1 || $[82] !== t10 || $[83] !== t11 || $[84] !== t22 || $[85] !== t6 || $[86] !== t7 || $[87] !== t8 || $[88] !== t9) {
    t23 = /*#__PURE__*/_jsx(T1, {
      anchorEl: t6,
      open: t7,
      onClose: t8,
      placement: t9,
      "aria-label": t10,
      sx: t11,
      children: t22
    });
    $[81] = T1;
    $[82] = t10;
    $[83] = t11;
    $[84] = t22;
    $[85] = t6;
    $[86] = t7;
    $[87] = t8;
    $[88] = t9;
    $[89] = t23;
  } else {
    t23 = $[89];
  }
  let t24;
  if ($[90] !== t12 || $[91] !== t23) {
    t24 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t12, t23]
    });
    $[90] = t12;
    $[91] = t23;
    $[92] = t24;
  } else {
    t24 = $[92];
  }
  return t24;
}
function _temp(theme) {
  return {
    width: 320,
    maxWidth: `calc(100vw - 2 * ${theme.spacing("lg")})`
  };
}