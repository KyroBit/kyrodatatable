import { c as _c } from "react/compiler-runtime";
import { forwardRef, useEffect, useEffectEvent, useRef, useState } from 'react';
import { Box, Button, Chip, CircularProgress, FormHelperText, IconButton, InputAdornment, InputLabel, List, ListItemButton, ListItemText, OutlinedInput, Popover, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { SearchIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PANEL_GAP = 8;
const SCREEN_MARGIN = 16;
const PANEL_MAX_HEIGHT = 320;
const PANEL_MIN_HEIGHT = 140;
const SEARCH_BLOCK = 64;
function measurePlacement(trigger) {
  if (!trigger) return {
    below: true,
    maxHeight: PANEL_MAX_HEIGHT
  };
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - PANEL_GAP - SCREEN_MARGIN;
  const spaceAbove = rect.top - PANEL_GAP - SCREEN_MARGIN;
  const below = spaceBelow >= PANEL_MAX_HEIGHT || spaceBelow >= spaceAbove;
  const available = below ? spaceBelow : spaceAbove;
  return {
    below,
    maxHeight: Math.max(PANEL_MIN_HEIGHT, Math.min(PANEL_MAX_HEIGHT, available))
  };
}
const SelectTrigger = /*#__PURE__*/forwardRef(function SelectTrigger(t0, ref) {
  const $ = _c(37);
  let aria;
  let dense;
  let disabled;
  let endAdornment;
  let error;
  let inputRef;
  let onOpen;
  let placeholder;
  let startAdornment;
  let t1;
  let value;
  let wrap;
  if ($[0] !== t0) {
    ({
      value,
      placeholder,
      error,
      disabled,
      startAdornment,
      endAdornment,
      onOpen,
      dense,
      wrap,
      inputRef,
      ...aria
    } = t0);
    t1 = event => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      onOpen();
    };
    $[0] = t0;
    $[1] = aria;
    $[2] = dense;
    $[3] = disabled;
    $[4] = endAdornment;
    $[5] = error;
    $[6] = inputRef;
    $[7] = onOpen;
    $[8] = placeholder;
    $[9] = startAdornment;
    $[10] = t1;
    $[11] = value;
    $[12] = wrap;
  } else {
    aria = $[1];
    dense = $[2];
    disabled = $[3];
    endAdornment = $[4];
    error = $[5];
    inputRef = $[6];
    onOpen = $[7];
    placeholder = $[8];
    startAdornment = $[9];
    t1 = $[10];
    value = $[11];
    wrap = $[12];
  }
  const handleKeyDown = t1;
  const t2 = dense ? "dense-field" : undefined;
  const t3 = disabled ? undefined : onOpen;
  const t4 = disabled ? undefined : handleKeyDown;
  const t5 = disabled ? "default" : "pointer";
  let t6;
  if ($[13] !== t5) {
    t6 = {
      cursor: t5,
      caretColor: "transparent"
    };
    $[13] = t5;
    $[14] = t6;
  } else {
    t6 = $[14];
  }
  let t7;
  if ($[15] !== aria || $[16] !== t6) {
    t7 = {
      role: "button",
      ...aria,
      style: t6
    };
    $[15] = aria;
    $[16] = t6;
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  const t8 = disabled ? "default" : "pointer";
  let t9;
  if ($[18] !== wrap) {
    t9 = wrap && {
      height: "auto",
      alignItems: "center",
      "& .MuiOutlinedInput-input": {
        flex: "0 0 0px",
        width: 0,
        minWidth: 0,
        p: 0,
        height: 0
      }
    };
    $[18] = wrap;
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  let t10;
  if ($[20] !== t8 || $[21] !== t9) {
    t10 = {
      cursor: t8,
      userSelect: "none",
      ...t9
    };
    $[20] = t8;
    $[21] = t9;
    $[22] = t10;
  } else {
    t10 = $[22];
  }
  let t11;
  if ($[23] !== disabled || $[24] !== endAdornment || $[25] !== error || $[26] !== inputRef || $[27] !== placeholder || $[28] !== ref || $[29] !== startAdornment || $[30] !== t10 || $[31] !== t2 || $[32] !== t3 || $[33] !== t4 || $[34] !== t7 || $[35] !== value) {
    t11 = /*#__PURE__*/_jsx(OutlinedInput, {
      ref: ref,
      inputRef: inputRef,
      className: t2,
      fullWidth: true,
      readOnly: true,
      error: error,
      disabled: disabled,
      value: value,
      placeholder: placeholder,
      startAdornment: startAdornment,
      endAdornment: endAdornment,
      onClick: t3,
      onKeyDown: t4,
      inputProps: t7,
      sx: t10
    });
    $[23] = disabled;
    $[24] = endAdornment;
    $[25] = error;
    $[26] = inputRef;
    $[27] = placeholder;
    $[28] = ref;
    $[29] = startAdornment;
    $[30] = t10;
    $[31] = t2;
    $[32] = t3;
    $[33] = t4;
    $[34] = t7;
    $[35] = value;
    $[36] = t11;
  } else {
    t11 = $[36];
  }
  return t11;
});
export function Select(props) {
  const $ = _c(158);
  const {
    onBlur,
    inputRef,
    options: staticOptions,
    search,
    fetchPage,
    getOptionLabel,
    getOptionSubLabel,
    getOptionIcon,
    label,
    placeholder: t0,
    required,
    error,
    helperText,
    debounceMs: t1,
    hideSearch: t2,
    dense: t3,
    onCreate,
    createLabel: t4,
    sx,
    loading: t5,
    disabled: t6,
    emptyText: t7,
    searchPlaceholder: t8
  } = props;
  const placeholder = t0 === undefined ? "Select\u2026" : t0;
  const debounceMs = t1 === undefined ? 300 : t1;
  const hideSearch = t2 === undefined ? false : t2;
  const dense = t3 === undefined ? false : t3;
  const createLabel = t4 === undefined ? "Add" : t4;
  const loading = t5 === undefined ? false : t5;
  const disabled = t6 === undefined ? false : t6;
  const emptyText = t7 === undefined ? "No results found." : t7;
  const searchPlaceholder = t8 === undefined ? "Search\u2026" : t8;
  const multiple = props.multiple === true;
  let t9;
  if ($[0] !== props.multiple || $[1] !== props.value) {
    t9 = props.multiple ? props.value ?? [] : props.value ? [props.value] : [];
    $[0] = props.multiple;
    $[1] = props.value;
    $[2] = t9;
  } else {
    t9 = $[2];
  }
  const selected = t9;
  let t10;
  if ($[3] !== props) {
    t10 = next => {
      if (props.multiple) {
        props.onChange(next);
      } else {
        props.onChange(next[0] ?? null);
      }
    };
    $[3] = props;
    $[4] = t10;
  } else {
    t10 = $[4];
  }
  const emit = t10;
  const isPaged = typeof fetchPage === "function";
  const isAsync = typeof search === "function" || isPaged;
  const showSearch = !hideSearch;
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  let t11;
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = {
      below: true,
      maxHeight: PANEL_MAX_HEIGHT
    };
    $[5] = t11;
  } else {
    t11 = $[5];
  }
  const [placement, setPlacement] = useState(t11);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  let t12;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = [];
    $[6] = t12;
  } else {
    t12 = $[6];
  }
  const [asyncOptions, setAsyncOptions] = useState(t12);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const listRef = useRef(null);
  const inFlight = useRef(false);
  const pageRef = useRef(1);
  const requestToken = useRef(0);
  const open = Boolean(anchorEl);
  let t13;
  let t14;
  if ($[7] !== debounceMs || $[8] !== isAsync || $[9] !== query) {
    t13 = () => {
      if (!isAsync) {
        return;
      }
      const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
      return () => clearTimeout(timer);
    };
    t14 = [query, debounceMs, isAsync];
    $[7] = debounceMs;
    $[8] = isAsync;
    $[9] = query;
    $[10] = t13;
    $[11] = t14;
  } else {
    t13 = $[10];
    t14 = $[11];
  }
  useEffect(t13, t14);
  let t15;
  if ($[12] !== search) {
    t15 = text => search?.(text);
    $[12] = search;
    $[13] = t15;
  } else {
    t15 = $[13];
  }
  const runSearch = useEffectEvent(t15);
  let t16;
  if ($[14] !== debouncedQuery || $[15] !== open || $[16] !== runSearch) {
    t16 = () => {
      if (!open) {
        return;
      }
      const pending = runSearch(debouncedQuery);
      if (!pending) {
        return;
      }
      let cancelled = false;
      setSearchLoading(true);
      pending.then(results => {
        if (!cancelled) {
          setAsyncOptions(results);
        }
      }).finally(() => {
        if (!cancelled) {
          setSearchLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    };
    $[14] = debouncedQuery;
    $[15] = open;
    $[16] = runSearch;
    $[17] = t16;
  } else {
    t16 = $[17];
  }
  let t17;
  if ($[18] !== debouncedQuery || $[19] !== open) {
    t17 = [debouncedQuery, open];
    $[18] = debouncedQuery;
    $[19] = open;
    $[20] = t17;
  } else {
    t17 = $[20];
  }
  useEffect(t16, t17);
  let t18;
  let t19;
  if ($[21] !== debouncedQuery || $[22] !== fetchPage || $[23] !== open) {
    t18 = () => {
      if (!open || !fetchPage) {
        return;
      }
      let cancelled_0 = false;
      const token = requestToken.current = requestToken.current + 1;
      pageRef.current = 1;
      setSearchLoading(true);
      fetchPage({
        query: debouncedQuery,
        page: 1
      }).then(result => {
        if (cancelled_0 || token !== requestToken.current) {
          return;
        }
        setAsyncOptions(result.rows);
        setHasMore(result.hasMore);
        listRef.current?.scrollTo({
          top: 0
        });
      }).finally(() => {
        if (!cancelled_0) {
          setSearchLoading(false);
        }
      });
      return () => {
        cancelled_0 = true;
      };
    };
    t19 = [debouncedQuery, open, fetchPage];
    $[21] = debouncedQuery;
    $[22] = fetchPage;
    $[23] = open;
    $[24] = t18;
    $[25] = t19;
  } else {
    t18 = $[24];
    t19 = $[25];
  }
  useEffect(t18, t19);
  let t20;
  if ($[26] !== debouncedQuery || $[27] !== fetchPage || $[28] !== hasMore) {
    t20 = () => {
      if (!fetchPage || inFlight.current || !hasMore) {
        return;
      }
      const next_0 = pageRef.current + 1;
      const token_0 = requestToken.current;
      inFlight.current = true;
      setLoadingMore(true);
      fetchPage({
        query: debouncedQuery,
        page: next_0
      }).then(result_0 => {
        if (token_0 !== requestToken.current) {
          return;
        }
        pageRef.current = next_0;
        setAsyncOptions(prev => {
          const seen = new Set(prev.map(_temp));
          return [...prev, ...result_0.rows.filter(option_0 => !seen.has(option_0.id))];
        });
        setHasMore(result_0.hasMore);
      }).finally(() => {
        inFlight.current = false;
        setLoadingMore(false);
      });
    };
    $[26] = debouncedQuery;
    $[27] = fetchPage;
    $[28] = hasMore;
    $[29] = t20;
  } else {
    t20 = $[29];
  }
  const loadMore = t20;
  let t21;
  if ($[30] !== isPaged || $[31] !== loadMore) {
    t21 = event => {
      if (!isPaged) {
        return;
      }
      const el = event.currentTarget;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 48) {
        loadMore();
      }
    };
    $[30] = isPaged;
    $[31] = loadMore;
    $[32] = t21;
  } else {
    t21 = $[32];
  }
  const handleListScroll = t21;
  let t22;
  if ($[33] !== asyncOptions || $[34] !== getOptionLabel || $[35] !== isAsync || $[36] !== query || $[37] !== staticOptions) {
    t22 = isAsync ? asyncOptions : (staticOptions ?? []).filter(option_1 => getOptionLabel(option_1).toLowerCase().includes(query.trim().toLowerCase()));
    $[33] = asyncOptions;
    $[34] = getOptionLabel;
    $[35] = isAsync;
    $[36] = query;
    $[37] = staticOptions;
    $[38] = t22;
  } else {
    t22 = $[38];
  }
  const options = t22;
  let t23;
  if ($[39] !== isAsync) {
    t23 = () => {
      setQuery("");
      if (isAsync) {
        setAsyncOptions([]);
        setSearchLoading(true);
      }
      setPlacement(measurePlacement(triggerRef.current));
      setAnchorEl(triggerRef.current);
    };
    $[39] = isAsync;
    $[40] = t23;
  } else {
    t23 = $[40];
  }
  const handleOpen = t23;
  let t24;
  if ($[41] !== isAsync || $[42] !== onBlur) {
    t24 = () => {
      setAnchorEl(null);
      if (isAsync) {
        setAsyncOptions([]);
      }
      onBlur?.();
    };
    $[41] = isAsync;
    $[42] = onBlur;
    $[43] = t24;
  } else {
    t24 = $[43];
  }
  const handleClose = t24;
  let t25;
  if ($[44] !== emit || $[45] !== handleClose || $[46] !== multiple || $[47] !== selected) {
    t25 = option_2 => {
      if (!multiple) {
        emit([option_2]);
        handleClose();
        return;
      }
      const already = selected.some(item => item.id === option_2.id);
      emit(already ? selected.filter(item_0 => item_0.id !== option_2.id) : [...selected, option_2]);
    };
    $[44] = emit;
    $[45] = handleClose;
    $[46] = multiple;
    $[47] = selected;
    $[48] = t25;
  } else {
    t25 = $[48];
  }
  const handleSelect = t25;
  let t26;
  if ($[49] !== emit || $[50] !== handleClose || $[51] !== multiple || $[52] !== onCreate || $[53] !== query || $[54] !== selected) {
    t26 = async () => {
      if (!onCreate) {
        return;
      }
      const typed = query.trim();
      handleClose();
      const created = await onCreate(typed);
      if (created) {
        emit(multiple ? [...selected, created] : [created]);
      }
    };
    $[49] = emit;
    $[50] = handleClose;
    $[51] = multiple;
    $[52] = onCreate;
    $[53] = query;
    $[54] = selected;
    $[55] = t26;
  } else {
    t26 = $[55];
  }
  const handleCreate = t26;
  const showClear = !required && selected.length > 0;
  const isLoading = searchLoading || loading;
  let t27;
  if ($[56] !== error || $[57] !== label || $[58] !== required) {
    t27 = label && /*#__PURE__*/_jsx(InputLabel, {
      error: error,
      required: required,
      children: label
    });
    $[56] = error;
    $[57] = label;
    $[58] = required;
    $[59] = t27;
  } else {
    t27 = $[59];
  }
  let t28;
  if ($[60] !== getOptionLabel || $[61] !== multiple || $[62] !== selected[0]) {
    t28 = multiple ? "" : selected[0] ? getOptionLabel(selected[0]) : "";
    $[60] = getOptionLabel;
    $[61] = multiple;
    $[62] = selected[0];
    $[63] = t28;
  } else {
    t28 = $[63];
  }
  const t29 = selected.length ? "" : placeholder;
  const t30 = multiple && selected.length > 0;
  let t31;
  if ($[64] !== disabled || $[65] !== emit || $[66] !== getOptionIcon || $[67] !== getOptionLabel || $[68] !== multiple || $[69] !== selected) {
    t31 = multiple && selected.length ? /*#__PURE__*/_jsx(Box, {
      sx: {
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        py: 0.75,
        mr: 0.5,
        flex: "1 1 auto",
        minWidth: 0
      },
      children: selected.map(option_3 => /*#__PURE__*/_jsx(Chip, {
        size: "small",
        label: getOptionLabel(option_3),
        onMouseDown: _temp2,
        onDelete: disabled ? undefined : () => emit(selected.filter(item_1 => item_1.id !== option_3.id)),
        sx: {
          maxWidth: "100%"
        }
      }, option_3.id))
    }) : selected[0] && getOptionIcon ? /*#__PURE__*/_jsx(InputAdornment, {
      position: "start",
      sx: {
        mr: 1.25
      },
      children: getOptionIcon(selected[0])
    }) : undefined;
    $[64] = disabled;
    $[65] = emit;
    $[66] = getOptionIcon;
    $[67] = getOptionLabel;
    $[68] = multiple;
    $[69] = selected;
    $[70] = t31;
  } else {
    t31 = $[70];
  }
  let t32;
  if ($[71] !== emit || $[72] !== showClear) {
    t32 = showClear && /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      tabIndex: -1,
      "aria-label": "Clear",
      onClick: event_1 => {
        event_1.stopPropagation();
        emit([]);
      },
      sx: {
        p: "2px",
        mr: "2px"
      },
      children: /*#__PURE__*/_jsx(CloseRoundedIcon, {
        sx: {
          fontSize: 16,
          color: "text.secondary"
        }
      })
    });
    $[71] = emit;
    $[72] = showClear;
    $[73] = t32;
  } else {
    t32 = $[73];
  }
  const t33 = open ? "rotate(180deg)" : "none";
  let t34;
  if ($[74] !== t33) {
    t34 = /*#__PURE__*/_jsx(ExpandMoreRoundedIcon, {
      sx: {
        fontSize: 20,
        color: "text.secondary",
        transform: t33,
        transition: "transform 0.15s ease"
      }
    });
    $[74] = t33;
    $[75] = t34;
  } else {
    t34 = $[75];
  }
  let t35;
  if ($[76] !== t32 || $[77] !== t34) {
    t35 = /*#__PURE__*/_jsxs(InputAdornment, {
      position: "end",
      children: [t32, t34]
    });
    $[76] = t32;
    $[77] = t34;
    $[78] = t35;
  } else {
    t35 = $[78];
  }
  let t36;
  if ($[79] !== dense || $[80] !== disabled || $[81] !== error || $[82] !== handleOpen || $[83] !== inputRef || $[84] !== open || $[85] !== t28 || $[86] !== t29 || $[87] !== t30 || $[88] !== t31 || $[89] !== t35) {
    t36 = /*#__PURE__*/_jsx(SelectTrigger, {
      ref: triggerRef,
      inputRef: inputRef,
      value: t28,
      placeholder: t29,
      error: error,
      dense: dense,
      disabled: disabled,
      onOpen: handleOpen,
      "aria-haspopup": "listbox",
      "aria-expanded": open,
      wrap: t30,
      startAdornment: t31,
      endAdornment: t35
    });
    $[79] = dense;
    $[80] = disabled;
    $[81] = error;
    $[82] = handleOpen;
    $[83] = inputRef;
    $[84] = open;
    $[85] = t28;
    $[86] = t29;
    $[87] = t30;
    $[88] = t31;
    $[89] = t35;
    $[90] = t36;
  } else {
    t36 = $[90];
  }
  let t37;
  if ($[91] !== error || $[92] !== helperText) {
    t37 = helperText && /*#__PURE__*/_jsx(FormHelperText, {
      error: error,
      children: helperText
    });
    $[91] = error;
    $[92] = helperText;
    $[93] = t37;
  } else {
    t37 = $[93];
  }
  let t38;
  if ($[94] !== handleClose) {
    t38 = event_2 => {
      if (event_2.key === "Tab") {
        handleClose();
      }
    };
    $[94] = handleClose;
    $[95] = t38;
  } else {
    t38 = $[95];
  }
  const t39 = placement.below ? "bottom" : "top";
  let t40;
  if ($[96] !== t39) {
    t40 = {
      vertical: t39,
      horizontal: "left"
    };
    $[96] = t39;
    $[97] = t40;
  } else {
    t40 = $[97];
  }
  const t41 = placement.below ? "top" : "bottom";
  let t42;
  if ($[98] !== t41) {
    t42 = {
      vertical: t41,
      horizontal: "left"
    };
    $[98] = t41;
    $[99] = t42;
  } else {
    t42 = $[99];
  }
  let t43;
  if ($[100] === Symbol.for("react.memo_cache_sentinel")) {
    t43 = {
      enter: 180,
      exit: 120
    };
    $[100] = t43;
  } else {
    t43 = $[100];
  }
  let t44;
  if ($[101] !== showSearch) {
    t44 = {
      easing: "cubic-bezier(0.05, 0.7, 0.1, 1)",
      onEntered: () => {
        if (showSearch) {
          searchInputRef.current?.focus();
        }
      }
    };
    $[101] = showSearch;
    $[102] = t44;
  } else {
    t44 = $[102];
  }
  let t45;
  if ($[103] !== placement.below) {
    t45 = {
      sx: theme => ({
        mt: placement.below ? 1 : 0,
        mb: placement.below ? 0 : 1,
        width: "auto",
        minWidth: Math.min(triggerRef.current?.offsetWidth ?? 400, 400),
        maxWidth: Math.min(triggerRef.current?.offsetWidth ?? 560, 560),
        borderRadius: `${theme.shape.borderRadius}px`,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 8px 24px rgba(0,0,0,0.08)"
      })
    };
    $[103] = placement.below;
    $[104] = t45;
  } else {
    t45 = $[104];
  }
  let t46;
  if ($[105] !== t44 || $[106] !== t45) {
    t46 = {
      transition: t44,
      paper: t45
    };
    $[105] = t44;
    $[106] = t45;
    $[107] = t46;
  } else {
    t46 = $[107];
  }
  let t47;
  if ($[108] !== createLabel || $[109] !== handleCreate || $[110] !== onCreate || $[111] !== query || $[112] !== searchPlaceholder || $[113] !== showSearch) {
    t47 = showSearch && /*#__PURE__*/_jsxs(Box, {
      sx: {
        p: 1.5,
        pb: 1,
        display: "flex",
        gap: 1,
        alignItems: "center"
      },
      children: [/*#__PURE__*/_jsx(TextField, {
        inputRef: searchInputRef,
        fullWidth: true,
        placeholder: searchPlaceholder,
        value: query,
        onChange: event_3 => setQuery(event_3.target.value),
        slotProps: {
          input: {
            className: "search-field",
            startAdornment: /*#__PURE__*/_jsx(InputAdornment, {
              position: "start",
              sx: {
                mr: "11px"
              },
              children: /*#__PURE__*/_jsx(SearchIcon, {
                sx: {
                  fontSize: 20,
                  color: "text.secondary"
                }
              })
            })
          }
        },
        sx: _temp3
      }), onCreate && /*#__PURE__*/_jsx(Button, {
        size: "small",
        variant: "contained",
        startIcon: /*#__PURE__*/_jsx(AddRoundedIcon, {
          sx: {
            fontSize: 17
          }
        }),
        onClick: handleCreate,
        sx: {
          flexShrink: 0,
          height: _temp4,
          whiteSpace: "nowrap"
        },
        children: createLabel
      })]
    });
    $[108] = createLabel;
    $[109] = handleCreate;
    $[110] = onCreate;
    $[111] = query;
    $[112] = searchPlaceholder;
    $[113] = showSearch;
    $[114] = t47;
  } else {
    t47 = $[114];
  }
  const t48 = placement.maxHeight - (showSearch ? SEARCH_BLOCK : 0);
  const t49 = showSearch ? 0.5 : 1;
  let t50;
  if ($[115] !== t48 || $[116] !== t49) {
    t50 = {
      maxHeight: t48,
      overflowY: "auto",
      p: 1,
      pt: t49
    };
    $[115] = t48;
    $[116] = t49;
    $[117] = t50;
  } else {
    t50 = $[117];
  }
  let t51;
  if ($[118] !== isLoading) {
    t51 = isLoading && /*#__PURE__*/_jsx(Box, {
      sx: {
        display: "flex",
        justifyContent: "center",
        py: 3
      },
      children: /*#__PURE__*/_jsx(CircularProgress, {
        size: 22
      })
    });
    $[118] = isLoading;
    $[119] = t51;
  } else {
    t51 = $[119];
  }
  let t52;
  if ($[120] !== isLoading || $[121] !== loadingMore) {
    t52 = loadingMore && !isLoading && /*#__PURE__*/_jsx(Box, {
      sx: {
        display: "flex",
        justifyContent: "center",
        py: 1.5
      },
      children: /*#__PURE__*/_jsx(CircularProgress, {
        size: 18
      })
    });
    $[120] = isLoading;
    $[121] = loadingMore;
    $[122] = t52;
  } else {
    t52 = $[122];
  }
  let t53;
  if ($[123] !== emptyText || $[124] !== isLoading || $[125] !== options) {
    t53 = !isLoading && options.length === 0 && /*#__PURE__*/_jsx(Box, {
      sx: {
        px: 1.5,
        py: 2
      },
      children: /*#__PURE__*/_jsx(Typography, {
        variant: "body2",
        color: "textSecondary",
        children: emptyText
      })
    });
    $[123] = emptyText;
    $[124] = isLoading;
    $[125] = options;
    $[126] = t53;
  } else {
    t53 = $[126];
  }
  let t54;
  if ($[127] !== getOptionIcon || $[128] !== getOptionLabel || $[129] !== getOptionSubLabel || $[130] !== handleSelect || $[131] !== isLoading || $[132] !== options || $[133] !== selected) {
    t54 = !isLoading && options.map(option_4 => {
      const isSelected = selected.some(item_2 => item_2.id === option_4.id);
      return /*#__PURE__*/_jsxs(ListItemButton, {
        selected: isSelected,
        onClick: () => handleSelect(option_4),
        sx: _temp5,
        children: [getOptionIcon && /*#__PURE__*/_jsx(Box, {
          sx: {
            display: "flex",
            alignItems: "center",
            mr: 1.25
          },
          children: getOptionIcon(option_4)
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: getOptionLabel(option_4),
          secondary: getOptionSubLabel?.(option_4),
          slotProps: {
            primary: {
              sx: {
                fontSize: "0.875rem"
              }
            },
            secondary: {
              sx: {
                fontSize: "0.75rem"
              }
            }
          }
        }), isSelected && /*#__PURE__*/_jsx(CheckRoundedIcon, {
          sx: {
            fontSize: 18,
            color: "primary.main",
            flexShrink: 0
          }
        })]
      }, option_4.id);
    });
    $[127] = getOptionIcon;
    $[128] = getOptionLabel;
    $[129] = getOptionSubLabel;
    $[130] = handleSelect;
    $[131] = isLoading;
    $[132] = options;
    $[133] = selected;
    $[134] = t54;
  } else {
    t54 = $[134];
  }
  let t55;
  if ($[135] !== handleListScroll || $[136] !== t50 || $[137] !== t51 || $[138] !== t52 || $[139] !== t53 || $[140] !== t54) {
    t55 = /*#__PURE__*/_jsxs(List, {
      ref: listRef,
      onScroll: handleListScroll,
      sx: t50,
      children: [t51, t52, t53, t54]
    });
    $[135] = handleListScroll;
    $[136] = t50;
    $[137] = t51;
    $[138] = t52;
    $[139] = t53;
    $[140] = t54;
    $[141] = t55;
  } else {
    t55 = $[141];
  }
  let t56;
  if ($[142] !== anchorEl || $[143] !== handleClose || $[144] !== open || $[145] !== t38 || $[146] !== t40 || $[147] !== t42 || $[148] !== t46 || $[149] !== t47 || $[150] !== t55) {
    t56 = /*#__PURE__*/_jsxs(Popover, {
      open: open,
      anchorEl: anchorEl,
      onClose: handleClose,
      onKeyDown: t38,
      anchorOrigin: t40,
      transformOrigin: t42,
      disableRestoreFocus: true,
      transitionDuration: t43,
      slotProps: t46,
      children: [t47, t55]
    });
    $[142] = anchorEl;
    $[143] = handleClose;
    $[144] = open;
    $[145] = t38;
    $[146] = t40;
    $[147] = t42;
    $[148] = t46;
    $[149] = t47;
    $[150] = t55;
    $[151] = t56;
  } else {
    t56 = $[151];
  }
  let t57;
  if ($[152] !== sx || $[153] !== t27 || $[154] !== t36 || $[155] !== t37 || $[156] !== t56) {
    t57 = /*#__PURE__*/_jsxs(Box, {
      sx: sx,
      children: [t27, t36, t37, t56]
    });
    $[152] = sx;
    $[153] = t27;
    $[154] = t36;
    $[155] = t37;
    $[156] = t56;
    $[157] = t57;
  } else {
    t57 = $[157];
  }
  return t57;
}
function _temp5(theme_2) {
  return {
    borderRadius: `${theme_2.shape.borderRadius}px`,
    width: "auto",
    px: 1.5,
    py: 1,
    mb: 0.25,
    "&:active": {
      transform: "none"
    },
    "&.Mui-selected": {
      bgcolor: alpha(theme_2.palette.text.primary, 0.06),
      "&:hover": {
        bgcolor: alpha(theme_2.palette.text.primary, 0.1)
      }
    }
  };
}
function _temp4(theme_1) {
  return theme_1.spacing(5);
}
function _temp3(theme_0) {
  return {
    "& .MuiOutlinedInput-root.Mui-focused": {
      borderColor: theme_0.palette.divider,
      boxShadow: "none"
    }
  };
}
function _temp2(event_0) {
  return event_0.stopPropagation();
}
function _temp(option) {
  return option.id;
}