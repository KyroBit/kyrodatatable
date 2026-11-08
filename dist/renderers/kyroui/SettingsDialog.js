import { c as _c } from "react/compiler-runtime";
import { Box, FormDialog, Stack, Switch, Typography } from '@kyrobit/kyroui';
import { ChevronRightIcon } from './icons.js';
import { useDataTableContext } from './context.js';
import { useDialogSize } from './dialogSize.js';
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
      bgcolor: "grey.50"
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
        bgcolor: "action.hover"
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
  const $ = _c(16);
  const {
    open,
    onClose,
    onManageViews
  } = t0;
  const api = useDataTableContext();
  const lastVisible = api.visibleColumns.length === 1;
  const size = useDialogSize();
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = /*#__PURE__*/_jsx(SectionLabel, {
      children: "Columns"
    });
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  let t2;
  if ($[1] !== api || $[2] !== lastVisible) {
    t2 = api.columns.map(column => {
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
    $[1] = api;
    $[2] = lastVisible;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== t2) {
    t3 = /*#__PURE__*/_jsx(Group, {
      children: t2
    });
    $[4] = t2;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  let t4;
  if ($[6] !== onManageViews) {
    t4 = onManageViews && /*#__PURE__*/_jsxs(Box, {
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
    $[6] = onManageViews;
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  let t5;
  if ($[8] !== t3 || $[9] !== t4) {
    t5 = /*#__PURE__*/_jsxs(Box, {
      children: [t1, t3, t4]
    });
    $[8] = t3;
    $[9] = t4;
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  let t6;
  if ($[11] !== onClose || $[12] !== open || $[13] !== size || $[14] !== t5) {
    t6 = /*#__PURE__*/_jsx(FormDialog, {
      open: open,
      onClose: onClose,
      title: "Settings",
      ...size,
      children: t5
    });
    $[11] = onClose;
    $[12] = open;
    $[13] = size;
    $[14] = t5;
    $[15] = t6;
  } else {
    t6 = $[15];
  }
  return t6;
}