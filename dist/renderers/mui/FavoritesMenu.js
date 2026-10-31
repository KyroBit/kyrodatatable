import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { Box, Button, Divider, IconButton, Popover, Stack, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export function FavoritesMenu(t0) {
  const $ = _c(45);
  const {
    presets,
    activeId,
    currentFilters,
    filterEditor,
    summarize,
    onApply,
    label: t1,
    icon,
    endIcon
  } = t0;
  const label = t1 === undefined ? "Favorites" : t1;
  const [anchorEl, setAnchorEl] = useState(null);
  let t2;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      kind: "list"
    };
    $[0] = t2;
  } else {
    t2 = $[0];
  }
  const [mode, setMode] = useState(t2);
  const open = Boolean(anchorEl);
  let t3;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = () => {
      setAnchorEl(null);
      setMode({
        kind: "list"
      });
    };
    $[1] = t3;
  } else {
    t3 = $[1];
  }
  const close = t3;
  let t4;
  if ($[2] !== icon) {
    t4 = icon ?? /*#__PURE__*/_jsx(StarBorderRoundedIcon, {});
    $[2] = icon;
    $[3] = t4;
  } else {
    t4 = $[3];
  }
  let t5;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = e => setAnchorEl(e.currentTarget);
    $[4] = t5;
  } else {
    t5 = $[4];
  }
  let t6;
  if ($[5] !== endIcon || $[6] !== label || $[7] !== t4) {
    t6 = /*#__PURE__*/_jsx(Button, {
      variant: "outlined",
      color: "inherit",
      startIcon: t4,
      endIcon: endIcon,
      onClick: t5,
      children: label
    });
    $[5] = endIcon;
    $[6] = label;
    $[7] = t4;
    $[8] = t6;
  } else {
    t6 = $[8];
  }
  let t7;
  let t8;
  let t9;
  if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {
      vertical: "bottom",
      horizontal: "right"
    };
    t8 = {
      vertical: "top",
      horizontal: "right"
    };
    t9 = {
      paper: {
        sx: {
          width: 340,
          mt: 1,
          borderRadius: 2,
          overflow: "hidden"
        }
      }
    };
    $[9] = t7;
    $[10] = t8;
    $[11] = t9;
  } else {
    t7 = $[9];
    t8 = $[10];
    t9 = $[11];
  }
  let t10;
  if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = {
      alignItems: "center",
      justifyContent: "space-between",
      px: 2,
      pt: 1.5,
      pb: 1
    };
    $[12] = t10;
  } else {
    t10 = $[12];
  }
  let t11;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = /*#__PURE__*/_jsx(Typography, {
      sx: {
        fontSize: "1rem",
        fontWeight: 700
      },
      children: "Favorites"
    });
    $[13] = t11;
  } else {
    t11 = $[13];
  }
  let t12;
  if ($[14] !== mode.kind) {
    t12 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      sx: t10,
      children: [t11, mode.kind === "list" ? /*#__PURE__*/_jsx(Button, {
        size: "small",
        color: "primary",
        startIcon: /*#__PURE__*/_jsx(AddRoundedIcon, {}),
        onClick: () => setMode({
          kind: "add"
        }),
        children: "Add"
      }) : /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: () => setMode({
          kind: "list"
        }),
        sx: {
          color: "text.secondary"
        },
        children: /*#__PURE__*/_jsx(CloseRoundedIcon, {
          fontSize: "small"
        })
      })]
    });
    $[14] = mode.kind;
    $[15] = t12;
  } else {
    t12 = $[15];
  }
  let t13;
  if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = /*#__PURE__*/_jsx(Divider, {});
    $[16] = t13;
  } else {
    t13 = $[16];
  }
  let t14;
  if ($[17] !== currentFilters || $[18] !== filterEditor || $[19] !== mode.kind || $[20] !== presets) {
    t14 = mode.kind === "add" && /*#__PURE__*/_jsx(PresetForm, {
      initialFilters: currentFilters,
      filterEditor: filterEditor,
      onCancel: () => setMode({
        kind: "list"
      }),
      onSubmit: (name, filters) => {
        presets.create(name, filters);
        setMode({
          kind: "list"
        });
      }
    });
    $[17] = currentFilters;
    $[18] = filterEditor;
    $[19] = mode.kind;
    $[20] = presets;
    $[21] = t14;
  } else {
    t14 = $[21];
  }
  let t15;
  if ($[22] !== filterEditor || $[23] !== mode.id || $[24] !== mode.kind || $[25] !== presets) {
    t15 = mode.kind === "edit" && (() => {
      const editing = presets.all.find(p => p.id === mode.id);
      if (!editing) {
        return null;
      }
      return /*#__PURE__*/_jsx(PresetForm, {
        initialName: editing.name,
        initialFilters: editing.filters,
        filterEditor: filterEditor,
        onCancel: () => setMode({
          kind: "list"
        }),
        onSubmit: (name_0, filters_0) => {
          presets.update(editing.id, name_0, filters_0);
          setMode({
            kind: "list"
          });
        }
      });
    })();
    $[22] = filterEditor;
    $[23] = mode.id;
    $[24] = mode.kind;
    $[25] = presets;
    $[26] = t15;
  } else {
    t15 = $[26];
  }
  let t16;
  if ($[27] !== activeId || $[28] !== mode.kind || $[29] !== onApply || $[30] !== presets || $[31] !== summarize) {
    t16 = mode.kind === "list" && (presets.all.length === 0 ? /*#__PURE__*/_jsxs(Box, {
      sx: {
        p: 3,
        textAlign: "center"
      },
      children: [/*#__PURE__*/_jsx(Typography, {
        variant: "body2",
        color: "text.secondary",
        children: "No favorites saved yet."
      }), /*#__PURE__*/_jsx(Typography, {
        variant: "caption",
        color: "text.disabled",
        children: "Click \"Add\" to save the current filters."
      })]
    }) : /*#__PURE__*/_jsx(Box, {
      sx: {
        maxHeight: 340,
        overflowY: "auto",
        p: 1
      },
      children: /*#__PURE__*/_jsx(Stack, {
        spacing: 0.5,
        children: presets.all.map((p_0, i) => /*#__PURE__*/_jsx(PresetRow, {
          preset: p_0,
          isActive: activeId === p_0.id,
          summary: summarize(p_0.filters),
          canMoveUp: i > 0,
          canMoveDown: i < presets.all.length - 1,
          onApply: () => {
            onApply(p_0.filters);
            close();
          },
          onEdit: () => setMode({
            kind: "edit",
            id: p_0.id
          }),
          onDelete: () => presets.remove(p_0.id),
          onMoveUp: () => presets.reorder(i, i - 1),
          onMoveDown: () => presets.reorder(i, i + 1)
        }, p_0.id))
      })
    }));
    $[27] = activeId;
    $[28] = mode.kind;
    $[29] = onApply;
    $[30] = presets;
    $[31] = summarize;
    $[32] = t16;
  } else {
    t16 = $[32];
  }
  let t17;
  if ($[33] !== t12 || $[34] !== t14 || $[35] !== t15 || $[36] !== t16) {
    t17 = /*#__PURE__*/_jsxs(Stack, {
      children: [t12, t13, t14, t15, t16]
    });
    $[33] = t12;
    $[34] = t14;
    $[35] = t15;
    $[36] = t16;
    $[37] = t17;
  } else {
    t17 = $[37];
  }
  let t18;
  if ($[38] !== anchorEl || $[39] !== open || $[40] !== t17) {
    t18 = /*#__PURE__*/_jsx(Popover, {
      open: open,
      anchorEl: anchorEl,
      onClose: close,
      anchorOrigin: t7,
      transformOrigin: t8,
      slotProps: t9,
      children: t17
    });
    $[38] = anchorEl;
    $[39] = open;
    $[40] = t17;
    $[41] = t18;
  } else {
    t18 = $[41];
  }
  let t19;
  if ($[42] !== t18 || $[43] !== t6) {
    t19 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t6, t18]
    });
    $[42] = t18;
    $[43] = t6;
    $[44] = t19;
  } else {
    t19 = $[44];
  }
  return t19;
}
function PresetRow(t0) {
  const $ = _c(27);
  const {
    preset,
    isActive,
    summary,
    canMoveUp,
    canMoveDown,
    onApply,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown
  } = t0;
  let t1;
  if ($[0] !== isActive) {
    t1 = theme => ({
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      pl: 1.25,
      pr: 1,
      py: 0.5,
      borderRadius: 1.5,
      bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : "transparent",
      "&:hover": {
        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.text.primary, 0.04)
      }
    });
    $[0] = isActive;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      flex: 1,
      minWidth: 0,
      background: "none",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      py: 0.5,
      fontFamily: "inherit",
      color: "inherit"
    };
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  const t3 = isActive ? "primary.main" : "text.primary";
  const t4 = isActive ? 700 : 600;
  let t5;
  if ($[3] !== t3 || $[4] !== t4) {
    t5 = {
      color: t3,
      fontWeight: t4
    };
    $[3] = t3;
    $[4] = t4;
    $[5] = t5;
  } else {
    t5 = $[5];
  }
  let t6;
  if ($[6] !== preset.name || $[7] !== t5) {
    t6 = /*#__PURE__*/_jsx(Typography, {
      variant: "subtitle2",
      noWrap: true,
      sx: t5,
      children: preset.name
    });
    $[6] = preset.name;
    $[7] = t5;
    $[8] = t6;
  } else {
    t6 = $[8];
  }
  let t7;
  if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {
      display: "block"
    };
    $[9] = t7;
  } else {
    t7 = $[9];
  }
  let t8;
  if ($[10] !== summary) {
    t8 = /*#__PURE__*/_jsx(Typography, {
      variant: "caption",
      color: "text.secondary",
      noWrap: true,
      sx: t7,
      children: summary
    });
    $[10] = summary;
    $[11] = t8;
  } else {
    t8 = $[11];
  }
  let t9;
  if ($[12] !== onApply || $[13] !== t6 || $[14] !== t8) {
    t9 = /*#__PURE__*/_jsxs(Box, {
      component: "button",
      type: "button",
      onClick: onApply,
      sx: t2,
      children: [t6, t8]
    });
    $[12] = onApply;
    $[13] = t6;
    $[14] = t8;
    $[15] = t9;
  } else {
    t9 = $[15];
  }
  let t10;
  if ($[16] !== canMoveDown || $[17] !== canMoveUp || $[18] !== onDelete || $[19] !== onEdit || $[20] !== onMoveDown || $[21] !== onMoveUp) {
    t10 = (onEdit || onDelete) && /*#__PURE__*/_jsxs(_Fragment, {
      children: [canMoveUp && /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: onMoveUp,
        sx: {
          color: "text.secondary"
        },
        children: /*#__PURE__*/_jsx(ArrowUpwardRoundedIcon, {
          sx: {
            fontSize: 14
          }
        })
      }), canMoveDown && /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: onMoveDown,
        sx: {
          color: "text.secondary"
        },
        children: /*#__PURE__*/_jsx(ArrowDownwardRoundedIcon, {
          sx: {
            fontSize: 14
          }
        })
      }), onEdit && /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: onEdit,
        sx: {
          color: "text.secondary"
        },
        children: /*#__PURE__*/_jsx(EditRoundedIcon, {
          sx: {
            fontSize: 16
          }
        })
      }), onDelete && /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: onDelete,
        sx: {
          color: "error.main"
        },
        children: /*#__PURE__*/_jsx(DeleteRoundedIcon, {
          sx: {
            fontSize: 16
          }
        })
      })]
    });
    $[16] = canMoveDown;
    $[17] = canMoveUp;
    $[18] = onDelete;
    $[19] = onEdit;
    $[20] = onMoveDown;
    $[21] = onMoveUp;
    $[22] = t10;
  } else {
    t10 = $[22];
  }
  let t11;
  if ($[23] !== t1 || $[24] !== t10 || $[25] !== t9) {
    t11 = /*#__PURE__*/_jsxs(Box, {
      sx: t1,
      children: [t9, t10]
    });
    $[23] = t1;
    $[24] = t10;
    $[25] = t9;
    $[26] = t11;
  } else {
    t11 = $[26];
  }
  return t11;
}
function PresetForm(t0) {
  const $ = _c(31);
  const {
    initialName: t1,
    initialFilters,
    filterEditor,
    onCancel,
    onSubmit
  } = t0;
  const initialName = t1 === undefined ? "" : t1;
  const [name, setName] = useState(initialName);
  const [filters, setFilters] = useState(initialFilters);
  let t2;
  if ($[0] !== filters || $[1] !== name || $[2] !== onSubmit) {
    t2 = () => {
      const t = name.trim();
      if (t) {
        onSubmit(t, filters);
      }
    };
    $[0] = filters;
    $[1] = name;
    $[2] = onSubmit;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const submit = t2;
  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = {
      p: 2
    };
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  let t4;
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = e => setName(e.target.value);
    $[5] = t4;
  } else {
    t4 = $[5];
  }
  let t5;
  if ($[6] !== submit) {
    t5 = e_0 => {
      if (e_0.key === "Enter") {
        e_0.preventDefault();
        submit();
      }
    };
    $[6] = submit;
    $[7] = t5;
  } else {
    t5 = $[7];
  }
  let t6;
  if ($[8] !== name || $[9] !== t5) {
    t6 = /*#__PURE__*/_jsx(TextField, {
      autoFocus: true,
      label: "Name",
      value: name,
      onChange: t4,
      onKeyDown: t5,
      required: true
    });
    $[8] = name;
    $[9] = t5;
    $[10] = t6;
  } else {
    t6 = $[10];
  }
  let t7;
  if ($[11] !== filterEditor || $[12] !== filters) {
    t7 = filterEditor(filters, setFilters);
    $[11] = filterEditor;
    $[12] = filters;
    $[13] = t7;
  } else {
    t7 = $[13];
  }
  let t8;
  if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      justifyContent: "flex-end"
    };
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  let t9;
  if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = {
      color: "text.secondary"
    };
    $[15] = t9;
  } else {
    t9 = $[15];
  }
  let t10;
  if ($[16] !== onCancel) {
    t10 = /*#__PURE__*/_jsx(Button, {
      onClick: onCancel,
      sx: t9,
      children: "Cancel"
    });
    $[16] = onCancel;
    $[17] = t10;
  } else {
    t10 = $[17];
  }
  let t11;
  if ($[18] !== name) {
    t11 = name.trim();
    $[18] = name;
    $[19] = t11;
  } else {
    t11 = $[19];
  }
  const t12 = !t11;
  const t13 = initialName ? "Save changes" : "Add favorite";
  let t14;
  if ($[20] !== submit || $[21] !== t12 || $[22] !== t13) {
    t14 = /*#__PURE__*/_jsx(Button, {
      variant: "contained",
      onClick: submit,
      disabled: t12,
      children: t13
    });
    $[20] = submit;
    $[21] = t12;
    $[22] = t13;
    $[23] = t14;
  } else {
    t14 = $[23];
  }
  let t15;
  if ($[24] !== t10 || $[25] !== t14) {
    t15 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t8,
      children: [t10, t14]
    });
    $[24] = t10;
    $[25] = t14;
    $[26] = t15;
  } else {
    t15 = $[26];
  }
  let t16;
  if ($[27] !== t15 || $[28] !== t6 || $[29] !== t7) {
    t16 = /*#__PURE__*/_jsx(Box, {
      sx: t3,
      children: /*#__PURE__*/_jsxs(Stack, {
        spacing: 1.75,
        children: [t6, t7, t15]
      })
    });
    $[27] = t15;
    $[28] = t6;
    $[29] = t7;
    $[30] = t16;
  } else {
    t16 = $[30];
  }
  return t16;
}