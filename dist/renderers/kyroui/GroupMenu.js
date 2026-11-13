import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Button, Chip, Divider, IconButton, Popover, Stack, Typography } from '@kyrobit/kyroui';
import { useDataTableContext } from './context.js';
import { SortableList, SortableRow } from './Sortable.js';
import { CloseIcon, ExpandMoreIcon, GroupIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function DataTableGroupPanel(t0) {
  const $ = _c(80);
  const {
    anchor,
    onClose
  } = t0;
  const api = useDataTableContext();
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = [];
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  const [draft, setDraft] = useState(t1);
  const [openedFor, setOpenedFor] = useState(null);
  let T0;
  let T1;
  let changed;
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
  if ($[1] !== anchor || $[2] !== api.groupBy || $[3] !== api.groupByColumns || $[4] !== draft || $[5] !== onClose || $[6] !== openedFor) {
    const columns = api.groupByColumns ?? [];
    const levels = api.groupBy;
    let t13;
    if ($[21] !== draft) {
      t13 = c => !draft.includes(c.field);
      $[21] = draft;
      $[22] = t13;
    } else {
      t13 = $[22];
    }
    const unused = columns.filter(t13);
    const labelOf = field => columns.find(c_0 => c_0.field === field)?.label ?? field;
    let t14;
    if ($[23] !== draft || $[24] !== levels) {
      t14 = draft.length !== levels.length || draft.some((field_0, i) => field_0 !== levels[i]);
      $[23] = draft;
      $[24] = levels;
      $[25] = t14;
    } else {
      t14 = $[25];
    }
    changed = t14;
    if (anchor !== openedFor) {
      setOpenedFor(anchor);
      if (anchor) {
        setDraft(levels);
      }
    }
    T1 = Popover;
    t7 = anchor;
    t8 = Boolean(anchor);
    t9 = onClose;
    t10 = "bottom-start";
    t11 = "Group rows";
    t12 = _temp;
    T0 = Box;
    if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
      t2 = {
        px: "lg",
        pt: "md",
        pb: "lg"
      };
      $[26] = t2;
    } else {
      t2 = $[26];
    }
    let t15;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
      t15 = {
        mb: "md"
      };
      $[27] = t15;
    } else {
      t15 = $[27];
    }
    let t16;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
      t16 = /*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "h5",
          fontWeight: 600,
          color: "text.primary"
        },
        children: "Group"
      });
      $[28] = t16;
    } else {
      t16 = $[28];
    }
    let t17;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
      t17 = /*#__PURE__*/_jsx(CloseIcon, {
        fontSize: "small"
      });
      $[29] = t17;
    } else {
      t17 = $[29];
    }
    if ($[30] !== onClose) {
      t3 = /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        sx: t15,
        children: [t16, /*#__PURE__*/_jsx(IconButton, {
          variant: "tonal",
          size: "small",
          onClick: onClose,
          "aria-label": "Close grouping",
          children: t17
        })]
      });
      $[30] = onClose;
      $[31] = t3;
    } else {
      t3 = $[31];
    }
    if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
      t4 = /*#__PURE__*/_jsx(Divider, {});
      $[32] = t4;
    } else {
      t4 = $[32];
    }
    let t18;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
      t18 = {
        mt: "sm"
      };
      $[33] = t18;
    } else {
      t18 = $[33];
    }
    let t19;
    if ($[34] !== draft.length) {
      t19 = draft.length === 0 && /*#__PURE__*/_jsx(Typography, {
        sx: {
          fontSize: "md",
          color: "text.secondary",
          px: "sm",
          py: "md"
        },
        children: "Not grouped"
      });
      $[34] = draft.length;
      $[35] = t19;
    } else {
      t19 = $[35];
    }
    let t20;
    if ($[36] !== draft) {
      t20 = (from, to) => setDraft(arrayMove(draft, from, to));
      $[36] = draft;
      $[37] = t20;
    } else {
      t20 = $[37];
    }
    let t21;
    if ($[38] !== draft || $[39] !== labelOf) {
      t21 = draft.map(field_1 => /*#__PURE__*/_jsxs(SortableRow, {
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
      $[38] = draft;
      $[39] = labelOf;
      $[40] = t21;
    } else {
      t21 = $[40];
    }
    let t22;
    if ($[41] !== draft || $[42] !== t20 || $[43] !== t21) {
      t22 = /*#__PURE__*/_jsx(SortableList, {
        ids: draft,
        onMove: t20,
        children: t21
      });
      $[41] = draft;
      $[42] = t20;
      $[43] = t21;
      $[44] = t22;
    } else {
      t22 = $[44];
    }
    if ($[45] !== t19 || $[46] !== t22) {
      t5 = /*#__PURE__*/_jsxs(Box, {
        sx: t18,
        children: [t19, t22]
      });
      $[45] = t19;
      $[46] = t22;
      $[47] = t5;
    } else {
      t5 = $[47];
    }
    t6 = unused.length > 0 && /*#__PURE__*/_jsx(Stack, {
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
    $[5] = onClose;
    $[6] = openedFor;
    $[7] = T0;
    $[8] = T1;
    $[9] = changed;
    $[10] = t10;
    $[11] = t11;
    $[12] = t12;
    $[13] = t2;
    $[14] = t3;
    $[15] = t4;
    $[16] = t5;
    $[17] = t6;
    $[18] = t7;
    $[19] = t8;
    $[20] = t9;
  } else {
    T0 = $[7];
    T1 = $[8];
    changed = $[9];
    t10 = $[10];
    t11 = $[11];
    t12 = $[12];
    t2 = $[13];
    t3 = $[14];
    t4 = $[15];
    t5 = $[16];
    t6 = $[17];
    t7 = $[18];
    t8 = $[19];
    t9 = $[20];
  }
  let t13;
  if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = /*#__PURE__*/_jsx(Divider, {
      sx: {
        mt: "md"
      }
    });
    $[48] = t13;
  } else {
    t13 = $[48];
  }
  let t14;
  if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = {
      mt: "md"
    };
    $[49] = t14;
  } else {
    t14 = $[49];
  }
  const t15 = draft.length === 0;
  let t16;
  if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = () => setDraft([]);
    $[50] = t16;
  } else {
    t16 = $[50];
  }
  let t17;
  if ($[51] !== t15) {
    t17 = /*#__PURE__*/_jsx(Button, {
      variant: "text",
      disabled: t15,
      onClick: t16,
      children: "Clear"
    });
    $[51] = t15;
    $[52] = t17;
  } else {
    t17 = $[52];
  }
  const t18 = !changed;
  let t19;
  if ($[53] !== api || $[54] !== draft || $[55] !== onClose) {
    t19 = () => {
      api.setGroupBy(draft);
      onClose();
    };
    $[53] = api;
    $[54] = draft;
    $[55] = onClose;
    $[56] = t19;
  } else {
    t19 = $[56];
  }
  let t20;
  if ($[57] !== t18 || $[58] !== t19) {
    t20 = /*#__PURE__*/_jsx(Button, {
      variant: "contained",
      disabled: t18,
      onClick: t19,
      children: "Apply"
    });
    $[57] = t18;
    $[58] = t19;
    $[59] = t20;
  } else {
    t20 = $[59];
  }
  let t21;
  if ($[60] !== t17 || $[61] !== t20) {
    t21 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      alignItems: "center",
      justifyContent: "space-between",
      sx: t14,
      children: [t17, t20]
    });
    $[60] = t17;
    $[61] = t20;
    $[62] = t21;
  } else {
    t21 = $[62];
  }
  let t22;
  if ($[63] !== T0 || $[64] !== t2 || $[65] !== t21 || $[66] !== t3 || $[67] !== t4 || $[68] !== t5 || $[69] !== t6) {
    t22 = /*#__PURE__*/_jsxs(T0, {
      sx: t2,
      children: [t3, t4, t5, t6, t13, t21]
    });
    $[63] = T0;
    $[64] = t2;
    $[65] = t21;
    $[66] = t3;
    $[67] = t4;
    $[68] = t5;
    $[69] = t6;
    $[70] = t22;
  } else {
    t22 = $[70];
  }
  let t23;
  if ($[71] !== T1 || $[72] !== t10 || $[73] !== t11 || $[74] !== t12 || $[75] !== t22 || $[76] !== t7 || $[77] !== t8 || $[78] !== t9) {
    t23 = /*#__PURE__*/_jsx(T1, {
      anchorEl: t7,
      open: t8,
      onClose: t9,
      placement: t10,
      "aria-label": t11,
      sx: t12,
      children: t22
    });
    $[71] = T1;
    $[72] = t10;
    $[73] = t11;
    $[74] = t12;
    $[75] = t22;
    $[76] = t7;
    $[77] = t8;
    $[78] = t9;
    $[79] = t23;
  } else {
    t23 = $[79];
  }
  return t23;
}
function _temp(theme) {
  return {
    width: 320,
    maxWidth: `calc(100vw - 2 * ${theme.spacing("lg")})`
  };
}
export function DataTableGroupMenu() {
  const $ = _c(18);
  const api = useDataTableContext();
  const [anchor, setAnchor] = useState(null);
  const levels = api.groupBy;
  let t0;
  if ($[0] !== api.groupByColumns) {
    t0 = field => api.groupByColumns?.find(c => c.field === field)?.label ?? field;
    $[0] = api.groupByColumns;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const labelOf = t0;
  let t1;
  if ($[2] !== labelOf || $[3] !== levels[0] || $[4] !== levels.length) {
    t1 = levels.length === 0 ? "Group" : `Group: ${labelOf(levels[0])}${levels.length > 1 ? ` +${levels.length - 1}` : ""}`;
    $[2] = labelOf;
    $[3] = levels[0];
    $[4] = levels.length;
    $[5] = t1;
  } else {
    t1 = $[5];
  }
  const label = t1;
  let t2;
  let t3;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = /*#__PURE__*/_jsx(GroupIcon, {});
    t3 = /*#__PURE__*/_jsx(ExpandMoreIcon, {});
    $[6] = t2;
    $[7] = t3;
  } else {
    t2 = $[6];
    t3 = $[7];
  }
  const t4 = Boolean(anchor);
  let t5;
  if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = e => setAnchor(e.currentTarget);
    $[8] = t5;
  } else {
    t5 = $[8];
  }
  let t6;
  if ($[9] !== label || $[10] !== t4) {
    t6 = /*#__PURE__*/_jsx(Button, {
      variant: "outlined",
      startIcon: t2,
      endIcon: t3,
      "aria-haspopup": "dialog",
      "aria-expanded": t4,
      onClick: t5,
      children: label
    });
    $[9] = label;
    $[10] = t4;
    $[11] = t6;
  } else {
    t6 = $[11];
  }
  let t7;
  if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = () => setAnchor(null);
    $[12] = t7;
  } else {
    t7 = $[12];
  }
  let t8;
  if ($[13] !== anchor) {
    t8 = /*#__PURE__*/_jsx(DataTableGroupPanel, {
      anchor: anchor,
      onClose: t7
    });
    $[13] = anchor;
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  let t9;
  if ($[15] !== t6 || $[16] !== t8) {
    t9 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t6, t8]
    });
    $[15] = t6;
    $[16] = t8;
    $[17] = t9;
  } else {
    t9 = $[17];
  }
  return t9;
}