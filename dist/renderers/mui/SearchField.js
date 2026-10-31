import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { Box, ClickAwayListener, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDataTableContext } from './context.js';
import { SearchIcon } from './icons.js';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Search bound to `api.search`. Collapsed to its icon until asked for, so a toolbar
 * spends its width on the table rather than on an empty box.
 */
export function DataTableSearchField(t0) {
  const $ = _c(39);
  const {
    placeholder: t1,
    width,
    alwaysOpen
  } = t0;
  const placeholder = t1 === undefined ? "Search" : t1;
  const api = useDataTableContext();
  const [open, setOpen] = useState(false);
  const expanded = alwaysOpen || open || Boolean(api.search);
  if (!expanded) {
    let t2;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
      t2 = () => setOpen(true);
      $[0] = t2;
    } else {
      t2 = $[0];
    }
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
      t3 = /*#__PURE__*/_jsx(SearchIcon, {
        sx: {
          fontSize: 20
        }
      });
      $[1] = t3;
    } else {
      t3 = $[1];
    }
    let t4;
    if ($[2] !== placeholder) {
      t4 = /*#__PURE__*/_jsx(IconButton, {
        className: "search-toggle",
        color: "inherit",
        size: "large",
        onClick: t2,
        "aria-label": placeholder,
        children: t3
      });
      $[2] = placeholder;
      $[3] = t4;
    } else {
      t4 = $[3];
    }
    let t5;
    if ($[4] !== placeholder || $[5] !== t4) {
      t5 = /*#__PURE__*/_jsx(Tooltip, {
        title: placeholder,
        children: t4
      });
      $[4] = placeholder;
      $[5] = t4;
      $[6] = t5;
    } else {
      t5 = $[6];
    }
    return t5;
  }
  let t2;
  if ($[7] !== api) {
    t2 = () => {
      api.setSearch("");
      setOpen(false);
    };
    $[7] = api;
    $[8] = t2;
  } else {
    t2 = $[8];
  }
  const collapse = t2;
  let t3;
  if ($[9] !== api.search) {
    t3 = () => !api.search && setOpen(false);
    $[9] = api.search;
    $[10] = t3;
  } else {
    t3 = $[10];
  }
  let t4;
  if ($[11] !== width) {
    t4 = width ?? {
      xs: "100%",
      sm: 280
    };
    $[11] = width;
    $[12] = t4;
  } else {
    t4 = $[12];
  }
  let t5;
  if ($[13] !== t4) {
    t5 = {
      width: t4
    };
    $[13] = t4;
    $[14] = t5;
  } else {
    t5 = $[14];
  }
  const t6 = !alwaysOpen;
  let t7;
  if ($[15] !== api) {
    t7 = e => api.setSearch(e.target.value);
    $[15] = api;
    $[16] = t7;
  } else {
    t7 = $[16];
  }
  let t8;
  if ($[17] !== collapse) {
    t8 = e_0 => e_0.key === "Escape" && collapse();
    $[17] = collapse;
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  let t9;
  if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = {
      mr: "11px"
    };
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  let t10;
  if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = /*#__PURE__*/_jsx(InputAdornment, {
      position: "start",
      sx: t9,
      children: /*#__PURE__*/_jsx(SearchIcon, {
        sx: {
          fontSize: 20,
          color: "text.secondary"
        }
      })
    });
    $[20] = t10;
  } else {
    t10 = $[20];
  }
  let t11;
  if ($[21] !== api.search || $[22] !== collapse) {
    t11 = api.search ? /*#__PURE__*/_jsx(InputAdornment, {
      position: "end",
      children: /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: collapse,
        "aria-label": "Clear search",
        children: /*#__PURE__*/_jsx(CloseRoundedIcon, {
          sx: {
            fontSize: 18
          }
        })
      })
    }) : undefined;
    $[21] = api.search;
    $[22] = collapse;
    $[23] = t11;
  } else {
    t11 = $[23];
  }
  let t12;
  if ($[24] !== t11) {
    t12 = {
      input: {
        className: "search-field",
        startAdornment: t10,
        endAdornment: t11
      }
    };
    $[24] = t11;
    $[25] = t12;
  } else {
    t12 = $[25];
  }
  let t13;
  if ($[26] !== api.search || $[27] !== placeholder || $[28] !== t12 || $[29] !== t6 || $[30] !== t7 || $[31] !== t8) {
    t13 = /*#__PURE__*/_jsx(TextField, {
      size: "small",
      fullWidth: true,
      autoFocus: t6,
      placeholder: placeholder,
      value: api.search,
      onChange: t7,
      onKeyDown: t8,
      slotProps: t12
    });
    $[26] = api.search;
    $[27] = placeholder;
    $[28] = t12;
    $[29] = t6;
    $[30] = t7;
    $[31] = t8;
    $[32] = t13;
  } else {
    t13 = $[32];
  }
  let t14;
  if ($[33] !== t13 || $[34] !== t5) {
    t14 = /*#__PURE__*/_jsx(Box, {
      sx: t5,
      children: t13
    });
    $[33] = t13;
    $[34] = t5;
    $[35] = t14;
  } else {
    t14 = $[35];
  }
  let t15;
  if ($[36] !== t14 || $[37] !== t3) {
    t15 = /*#__PURE__*/_jsx(ClickAwayListener, {
      onClickAway: t3,
      children: t14
    });
    $[36] = t14;
    $[37] = t3;
    $[38] = t15;
  } else {
    t15 = $[38];
  }
  return t15;
}