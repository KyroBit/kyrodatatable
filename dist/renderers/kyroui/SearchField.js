import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@kyrobit/kyroui';
import { useDataTableContext } from './context.js';
import { CloseIcon, SearchIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Search bound to `api.search`. Collapsed to its icon until asked for, so a toolbar
 * spends its width on the table rather than on an empty box.
 */
export function DataTableSearchField(t0) {
  const $ = _c(35);
  const {
    placeholder: t1,
    width,
    alwaysOpen,
    endAdornment
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
        fontSize: "medium"
      });
      $[1] = t3;
    } else {
      t3 = $[1];
    }
    let t4;
    if ($[2] !== placeholder) {
      t4 = /*#__PURE__*/_jsx(IconButton, {
        className: "search-toggle",
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
  if ($[9] !== width) {
    t3 = width ?? {
      xs: "100%",
      sm: 280
    };
    $[9] = width;
    $[10] = t3;
  } else {
    t3 = $[10];
  }
  let t4;
  if ($[11] !== t3) {
    t4 = {
      width: t3
    };
    $[11] = t3;
    $[12] = t4;
  } else {
    t4 = $[12];
  }
  const t5 = !alwaysOpen;
  let t6;
  if ($[13] !== api) {
    t6 = e => api.setSearch(e.target.value);
    $[13] = api;
    $[14] = t6;
  } else {
    t6 = $[14];
  }
  let t7;
  if ($[15] !== api.search) {
    t7 = () => !api.search && setOpen(false);
    $[15] = api.search;
    $[16] = t7;
  } else {
    t7 = $[16];
  }
  let t8;
  if ($[17] !== collapse) {
    t8 = {
      onKeyDown: e_0 => e_0.key === "Escape" && collapse()
    };
    $[17] = collapse;
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  let t9;
  if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = /*#__PURE__*/_jsx(InputAdornment, {
      position: "start",
      children: /*#__PURE__*/_jsx(SearchIcon, {
        fontSize: "medium",
        sx: {
          color: "text.secondary"
        }
      })
    });
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  let t10;
  if ($[20] !== api.search || $[21] !== collapse || $[22] !== endAdornment) {
    t10 = api.search || endAdornment ? /*#__PURE__*/_jsxs(InputAdornment, {
      position: "end",
      children: [api.search ? /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: collapse,
        "aria-label": "Clear search",
        children: /*#__PURE__*/_jsx(CloseIcon, {
          fontSize: "small"
        })
      }) : null, endAdornment]
    }) : undefined;
    $[20] = api.search;
    $[21] = collapse;
    $[22] = endAdornment;
    $[23] = t10;
  } else {
    t10 = $[23];
  }
  let t11;
  if ($[24] !== api.search || $[25] !== placeholder || $[26] !== t10 || $[27] !== t5 || $[28] !== t6 || $[29] !== t7 || $[30] !== t8) {
    t11 = /*#__PURE__*/_jsx(TextField, {
      size: "small",
      fullWidth: true,
      autoFocus: t5,
      placeholder: placeholder,
      value: api.search,
      onChange: t6,
      onBlur: t7,
      inputProps: t8,
      className: "search-field",
      startAdornment: t9,
      endAdornment: t10
    });
    $[24] = api.search;
    $[25] = placeholder;
    $[26] = t10;
    $[27] = t5;
    $[28] = t6;
    $[29] = t7;
    $[30] = t8;
    $[31] = t11;
  } else {
    t11 = $[31];
  }
  let t12;
  if ($[32] !== t11 || $[33] !== t4) {
    t12 = /*#__PURE__*/_jsx(Box, {
      sx: t4,
      children: t11
    });
    $[32] = t11;
    $[33] = t4;
    $[34] = t12;
  } else {
    t12 = $[34];
  }
  return t12;
}