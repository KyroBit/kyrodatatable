import { c as _c } from "react/compiler-runtime";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Switch, Typography } from '@kyrobit/kyroui';
import { ChevronRightIcon, CloseIcon } from './icons.js';
import { useDataTableContext } from './context.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function SectionLabel(t0) {
  const $ = _c(3);
  const {
    children
  } = t0;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {
      fontSize: "md",
      fontWeight: 600,
      color: "text.secondary",
      mb: "sm"
    };
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  let t2;
  if ($[1] !== children) {
    t2 = /*#__PURE__*/_jsx(Typography, {
      sx: t1,
      children: children
    });
    $[1] = children;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  return t2;
}
function Group(t0) {
  const $ = _c(3);
  const {
    children
  } = t0;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {
      borderRadius: "popup",
      overflow: "hidden",
      bgcolor: "background.surface"
    };
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  let t2;
  if ($[1] !== children) {
    t2 = /*#__PURE__*/_jsx(Box, {
      sx: t1,
      children: children
    });
    $[1] = children;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  return t2;
}
function Row(t0) {
  const $ = _c(16);
  const {
    title,
    description,
    control,
    onClick
  } = t0;
  let t1;
  if ($[0] !== onClick) {
    t1 = theme => ({
      gap: "lg",
      px: "lg",
      py: "md",
      cursor: onClick ? "pointer" : "default",
      "& + &": {
        boxShadow: `inset 0 1px 0 ${theme.vars.palette.divider}`
      },
      "&:hover": onClick ? {
        bgcolor: "background.surfaceHover"
      } : undefined
    });
    $[0] = onClick;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      flex: 1,
      minWidth: 0
    };
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  let t3;
  if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = {
      fontSize: "lg"
    };
    $[3] = t3;
  } else {
    t3 = $[3];
  }
  let t4;
  if ($[4] !== title) {
    t4 = /*#__PURE__*/_jsx(Typography, {
      sx: t3,
      children: title
    });
    $[4] = title;
    $[5] = t4;
  } else {
    t4 = $[5];
  }
  let t5;
  if ($[6] !== description) {
    t5 = description && /*#__PURE__*/_jsx(Typography, {
      sx: {
        fontSize: "md",
        color: "text.secondary"
      },
      children: description
    });
    $[6] = description;
    $[7] = t5;
  } else {
    t5 = $[7];
  }
  let t6;
  if ($[8] !== t4 || $[9] !== t5) {
    t6 = /*#__PURE__*/_jsxs(Box, {
      sx: t2,
      children: [t4, t5]
    });
    $[8] = t4;
    $[9] = t5;
    $[10] = t6;
  } else {
    t6 = $[10];
  }
  let t7;
  if ($[11] !== control || $[12] !== onClick || $[13] !== t1 || $[14] !== t6) {
    t7 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      alignItems: "center",
      onClick: onClick,
      sx: t1,
      children: [t6, control]
    });
    $[11] = control;
    $[12] = onClick;
    $[13] = t1;
    $[14] = t6;
    $[15] = t7;
  } else {
    t7 = $[15];
  }
  return t7;
}
export function DataTableSettingsDialog(t0) {
  const $ = _c(20);
  const {
    open,
    onClose,
    onManageViews
  } = t0;
  const api = useDataTableContext();
  const lastVisible = api.visibleColumns.length === 1;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = /*#__PURE__*/_jsx(Box, {
      component: "span",
      sx: {
        flex: 1
      },
      children: "Settings"
    });
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  let t2;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = /*#__PURE__*/_jsx(CloseIcon, {
      fontSize: "small"
    });
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  let t3;
  if ($[2] !== onClose) {
    t3 = /*#__PURE__*/_jsx(DialogTitle, {
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "lg",
        alignItems: "center",
        children: [t1, /*#__PURE__*/_jsx(IconButton, {
          size: "small",
          onClick: onClose,
          "aria-label": "Close",
          children: t2
        })]
      })
    });
    $[2] = onClose;
    $[3] = t3;
  } else {
    t3 = $[3];
  }
  let t4;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = /*#__PURE__*/_jsx(SectionLabel, {
      children: "Columns"
    });
    $[4] = t4;
  } else {
    t4 = $[4];
  }
  let t5;
  if ($[5] !== api || $[6] !== lastVisible) {
    t5 = api.columns.map(column => {
      const visible = !api.hiddenColumns.includes(column.field);
      return /*#__PURE__*/_jsx(Row, {
        title: column.headerName,
        control: /*#__PURE__*/_jsx(Switch, {
          checked: visible,
          disabled: visible && lastVisible,
          onChange: (_, checked) => api.setColumnHidden(column.field, !checked),
          "aria-label": column.headerName
        })
      }, column.field);
    });
    $[5] = api;
    $[6] = lastVisible;
    $[7] = t5;
  } else {
    t5 = $[7];
  }
  let t6;
  if ($[8] !== t5) {
    t6 = /*#__PURE__*/_jsx(Group, {
      children: t5
    });
    $[8] = t5;
    $[9] = t6;
  } else {
    t6 = $[9];
  }
  let t7;
  if ($[10] !== onManageViews) {
    t7 = onManageViews && /*#__PURE__*/_jsxs(Box, {
      sx: {
        mt: "xl"
      },
      children: [/*#__PURE__*/_jsx(SectionLabel, {
        children: "Views"
      }), /*#__PURE__*/_jsx(Group, {
        children: /*#__PURE__*/_jsx(Row, {
          title: "Manage views",
          description: "Rename, reorder or delete your saved views",
          onClick: onManageViews,
          control: /*#__PURE__*/_jsx(ChevronRightIcon, {
            sx: {
              color: "text.disabled"
            }
          })
        })
      })]
    });
    $[10] = onManageViews;
    $[11] = t7;
  } else {
    t7 = $[11];
  }
  let t8;
  if ($[12] !== t6 || $[13] !== t7) {
    t8 = /*#__PURE__*/_jsxs(DialogContent, {
      children: [t4, t6, t7]
    });
    $[12] = t6;
    $[13] = t7;
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  let t9;
  if ($[15] !== onClose || $[16] !== open || $[17] !== t3 || $[18] !== t8) {
    t9 = /*#__PURE__*/_jsxs(Dialog, {
      open: open,
      onClose: onClose,
      children: [t3, t8]
    });
    $[15] = onClose;
    $[16] = open;
    $[17] = t3;
    $[18] = t8;
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  return t9;
}