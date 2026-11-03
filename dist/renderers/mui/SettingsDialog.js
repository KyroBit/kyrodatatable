import { c as _c } from "react/compiler-runtime";
import { useDialogSize } from './dialogSize.js';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Switch, Typography, alpha } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
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
      fontSize: "13px",
      fontWeight: 600,
      color: "text.secondary",
      mb: 1
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
  const $ = _c(2);
  const {
    children
  } = t0;
  let t1;
  if ($[0] !== children) {
    t1 = /*#__PURE__*/_jsx(Box, {
      sx: _temp,
      children: children
    });
    $[0] = children;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}
function _temp(theme) {
  return {
    borderRadius: "12px",
    overflow: "hidden",
    bgcolor: alpha(theme.palette.text.primary, 0.03)
  };
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
      alignItems: "center",
      gap: 2,
      px: 2,
      py: 1.5,
      cursor: onClick ? "pointer" : "default",
      "& + &": {
        boxShadow: `inset 0 1px 0 ${theme.palette.divider}`
      },
      "&:hover": onClick ? {
        bgcolor: alpha(theme.palette.text.primary, 0.04)
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
      fontSize: "14px"
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
        fontSize: "13px",
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

/**
 * Everything about how this table is presented, in one place: which columns show,
 * and the saved views when the table has them.
 */
export function DataTableSettingsDialog(t0) {
  const $ = _c(23);
  const {
    open,
    onClose,
    onManageViews,
    DialogProps
  } = t0;
  const api = useDataTableContext();
  const lastVisible = api.visibleColumns.length === 1;
  const size = useDialogSize();
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {
      alignItems: "center"
    };
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  let t2;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = /*#__PURE__*/_jsx(Box, {
      component: "span",
      sx: {
        flex: 1
      },
      children: "Settings"
    });
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  let t3;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = /*#__PURE__*/_jsx(CloseRoundedIcon, {
      fontSize: "small"
    });
    $[2] = t3;
  } else {
    t3 = $[2];
  }
  let t4;
  if ($[3] !== onClose) {
    t4 = /*#__PURE__*/_jsx(DialogTitle, {
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: 2,
        sx: t1,
        children: [t2, /*#__PURE__*/_jsx(IconButton, {
          size: "small",
          edge: "end",
          onClick: onClose,
          "aria-label": "Close",
          children: t3
        })]
      })
    });
    $[3] = onClose;
    $[4] = t4;
  } else {
    t4 = $[4];
  }
  let t5;
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = /*#__PURE__*/_jsx(SectionLabel, {
      children: "Columns"
    });
    $[5] = t5;
  } else {
    t5 = $[5];
  }
  let t6;
  if ($[6] !== api || $[7] !== lastVisible) {
    t6 = api.columns.map(column => {
      const visible = !api.hiddenColumns.includes(column.field);
      return /*#__PURE__*/_jsx(Row, {
        title: column.headerName,
        control: /*#__PURE__*/_jsx(Switch, {
          checked: visible,
          disabled: visible && lastVisible,
          onChange: event => api.setColumnHidden(column.field, !event.target.checked),
          slotProps: {
            input: {
              "aria-label": column.headerName
            }
          }
        })
      }, column.field);
    });
    $[6] = api;
    $[7] = lastVisible;
    $[8] = t6;
  } else {
    t6 = $[8];
  }
  let t7;
  if ($[9] !== t6) {
    t7 = /*#__PURE__*/_jsx(Group, {
      children: t6
    });
    $[9] = t6;
    $[10] = t7;
  } else {
    t7 = $[10];
  }
  let t8;
  if ($[11] !== onManageViews) {
    t8 = onManageViews && /*#__PURE__*/_jsxs(Box, {
      sx: {
        mt: 3
      },
      children: [/*#__PURE__*/_jsx(SectionLabel, {
        children: "Views"
      }), /*#__PURE__*/_jsx(Group, {
        children: /*#__PURE__*/_jsx(Row, {
          title: "Manage views",
          description: "Rename, reorder or delete your saved views",
          onClick: onManageViews,
          control: /*#__PURE__*/_jsx(ChevronRightRoundedIcon, {
            sx: {
              color: "text.disabled"
            }
          })
        })
      })]
    });
    $[11] = onManageViews;
    $[12] = t8;
  } else {
    t8 = $[12];
  }
  let t9;
  if ($[13] !== t7 || $[14] !== t8) {
    t9 = /*#__PURE__*/_jsxs(DialogContent, {
      children: [t5, t7, t8]
    });
    $[13] = t7;
    $[14] = t8;
    $[15] = t9;
  } else {
    t9 = $[15];
  }
  let t10;
  if ($[16] !== DialogProps || $[17] !== onClose || $[18] !== open || $[19] !== size || $[20] !== t4 || $[21] !== t9) {
    t10 = /*#__PURE__*/_jsxs(Dialog, {
      open: open,
      onClose: onClose,
      ...size,
      ...DialogProps,
      children: [t4, t9]
    });
    $[16] = DialogProps;
    $[17] = onClose;
    $[18] = open;
    $[19] = size;
    $[20] = t4;
    $[21] = t9;
    $[22] = t10;
  } else {
    t10 = $[22];
  }
  return t10;
}